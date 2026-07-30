import { promises as fs } from "node:fs";
import path from "node:path";
import { Worker } from "bullmq";
import { prisma } from "@/lib/prisma";
import { downloadYouTubeSubtitles, parseSrt } from "@/lib/utils/ytdlp";
import { FFmpegUtils } from "@/lib/utils/ffmpeg";
import { analyzeQueue, type TranscribeJobData } from "../index";
import { connection } from "../connection";

export function createTranscribeWorker() {
  const worker = new Worker<TranscribeJobData>(
    "transcribe",
    async (job) => {
      const { projectId, videoPath, audioPath } = job.data;

      await job.updateProgress(0);
      await prisma.project.update({
        where: { id: projectId },
        data: { status: "transcribing", progress: 10, errorMessage: null },
      });

      // Get the YouTube URL from the project
      const project = await prisma.project.findUniqueOrThrow({
        where: { id: projectId },
        select: { youtubeUrl: true },
      });

      await job.updateProgress(20);

      const tempDir = "/tmp/ai-clipper";
      const subOutputPath = path.join(tempDir, `${projectId}`);

      // Download subtitles from YouTube
      const srtPath = await downloadYouTubeSubtitles(project.youtubeUrl, subOutputPath);

      await job.updateProgress(50);

      if (!srtPath) {
        throw new Error("No subtitles available for this video. Try a different video.");
      }

      // Detect language from filename: outputPath.ll.srt
      const langMatch = srtPath.match(/\.([a-z]{2}(?:-[a-zA-Z]+)?)\.srt$/);
      const detectedLang = langMatch?.[1] ?? "en";

      const srtContent = await fs.readFile(srtPath, "utf-8");
      const { segments, raw } = parseSrt(srtContent);

      await job.updateProgress(70);

      await prisma.transcript.upsert({
        where: { projectId },
        create: {
          projectId,
          language: detectedLang,
          segments: segments,
          raw,
        },
        update: {
          language: detectedLang,
          segments: segments,
          raw,
        },
      });

      // Cleanup temp files
      await fs.unlink(audioPath).catch(() => undefined);
      await fs.unlink(srtPath).catch(() => undefined);

      await job.updateProgress(100);
      await prisma.project.update({
        where: { id: projectId },
        data: { status: "transcribing", progress: 100 },
      });

      await analyzeQueue.add(
        `analyze-${projectId}`,
        { projectId, videoPath, transcript: raw },
        { priority: 8 },
      );
    },
    {
      connection,
      concurrency: 5,
      lockDuration: 5 * 60_000,
    },
  );

  worker.on("failed", async (job, err) => {
    if (!job) return;
    try {
      await prisma.project.update({
        where: { id: job.data.projectId },
        data: { status: "failed", progress: 0, errorMessage: err.message },
      });
    } catch {
      // Project may have been deleted
    }
  });

  return worker;
}
