import { execFile } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";
import { Worker } from "bullmq";
import { prisma } from "@/lib/prisma";
import { analyzeQueue, type TranscribeJobData } from "../index";
import { connection } from "../connection";

const execFileAsync = promisify(execFile);

type TranscriptData = {
  language?: string;
  language_probability?: number;
  segments: Array<{
    start: number;
    end: number;
    text: string;
    confidence: number;
  }>;
  raw: string;
};

export function createTranscribeWorker() {
  const worker = new Worker<TranscribeJobData>(
    "transcribe",
    async (job) => {
      const { projectId, videoPath, audioPath } = job.data;
      const outputPath = path.join("/tmp/ai-clipper", `${projectId}_transcript.json`);
      const scriptPath = path.join(process.cwd(), "src/lib/utils/faster_whisper_transcribe.py");

      await job.updateProgress(0);
      await prisma.project.update({
        where: { id: projectId },
        data: { status: "transcribing", progress: 10, errorMessage: null },
      });

      await job.updateProgress(25);

      await execFileAsync(
        "python3",
        [
          scriptPath,
          "--audio",
          audioPath,
          "--output",
          outputPath,
          "--model",
          process.env.WHISPER_MODEL ?? "large-v3",
          "--device",
          process.env.WHISPER_DEVICE ?? "cpu",
          "--compute-type",
          process.env.WHISPER_COMPUTE_TYPE ?? "int8",
        ],
        {
          timeout: 20 * 60_000,
          maxBuffer: 50 * 1024 * 1024,
        },
      );

      await job.updateProgress(70);

      const transcriptData = JSON.parse(await fs.readFile(outputPath, "utf-8")) as TranscriptData;

      await prisma.transcript.upsert({
        where: { projectId },
        create: {
          projectId,
          language: transcriptData.language,
          segments: transcriptData.segments,
          raw: transcriptData.raw,
        },
        update: {
          language: transcriptData.language,
          segments: transcriptData.segments,
          raw: transcriptData.raw,
        },
      });

      await fs.unlink(audioPath).catch(() => undefined);
      await fs.unlink(outputPath).catch(() => undefined);

      await job.updateProgress(100);
      await prisma.project.update({
        where: { id: projectId },
        data: { status: "transcribing", progress: 100 },
      });

      await analyzeQueue.add(
        `analyze-${projectId}`,
        { projectId, videoPath, transcript: transcriptData.raw },
        { priority: 8 },
      );
    },
    {
      connection,
      concurrency: 2,
      lockDuration: 20 * 60_000,
    },
  );

  worker.on("failed", async (job, err) => {
    if (!job) return;

    await prisma.project.update({
      where: { id: job.data.projectId },
      data: {
        status: "failed",
        progress: 0,
        errorMessage: err.message,
      },
    });
  });

  return worker;
}
