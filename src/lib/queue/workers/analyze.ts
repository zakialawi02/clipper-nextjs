import path from "node:path";
import { Worker } from "bullmq";
import { prisma } from "@/lib/prisma";
import { runAIChat } from "@/lib/ai/provider";
import { CLIP_DETECTION_PROMPT } from "@/lib/ai/prompts";
import { connection } from "../connection";
import { renderQueue, type AnalyzeJobData } from "../index";

type ClipResult = {
  startTime: number;
  endTime: number;
  score: number;
  reason: string;
  title: string;
  hookSuggestion: string;
};

type AIResponse = {
  summary: string;
  hashtags: string[];
  clips: ClipResult[];
};

export function createAnalyzeWorker() {
  const worker = new Worker<AnalyzeJobData>(
    "analyze",
    async (job) => {
      const { projectId, videoPath, transcript } = job.data;

      await job.updateProgress(0);
      await prisma.project.update({
        where: { id: projectId },
        data: { status: "analyzing", progress: 10, errorMessage: null },
      });

      const project = await prisma.project.findUniqueOrThrow({
        where: { id: projectId },
        select: { duration: true },
      });

      const duration = project.duration ?? 300;
      await job.updateProgress(20);

      const prompt = CLIP_DETECTION_PROMPT(transcript, duration);
      const raw = await runAIChat(prompt);

      let result: AIResponse;
      try {
        result = JSON.parse(raw) as AIResponse;
      } catch {
        const cleaned = raw.replace(/```json\s?/g, "").replace(/```/g, "");
        result = JSON.parse(cleaned) as AIResponse;
      }

      await job.updateProgress(50);

      await prisma.analysis.create({
        data: {
          projectId,
          summary: result.summary,
          hashtags: result.hashtags,
          raw: result as unknown as object,
        },
      });

      await job.updateProgress(60);

      const sortedClips = (result.clips ?? [])
        .filter((c) => c.startTime >= 0 && c.endTime > c.startTime)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

      for (let i = 0; i < sortedClips.length; i++) {
        const clipResult = sortedClips[i];
        const clip = await prisma.clip.create({
          data: {
            projectId,
            title: clipResult.title || `Clip ${i + 1}`,
            startTime: clipResult.startTime,
            endTime: clipResult.endTime,
            duration: clipResult.endTime - clipResult.startTime,
            score: clipResult.score,
            reason: clipResult.reason,
            hookSuggestion: clipResult.hookSuggestion,
            status: "pending",
          },
        });

        await renderQueue.add(
          `render-${clip.id}`,
          {
            projectId,
            clipId: clip.id,
            videoPath,
            startTime: clipResult.startTime,
            endTime: clipResult.endTime,
          },
          { priority: 10 - i },
        );

        await job.updateProgress(60 + Math.round((30 * (i + 1)) / sortedClips.length));
      }

      await job.updateProgress(100);
      await prisma.project.update({
        where: { id: projectId },
        data: { status: "analyzing", progress: 100 },
      });
    },
    {
      connection,
      concurrency: 2,
      lockDuration: 10 * 60_000,
    },
  );

  worker.on("failed", async (job, err) => {
    if (!job) return;
    await prisma.project.update({
      where: { id: job.data.projectId },
      data: { status: "failed", progress: 0, errorMessage: err.message },
    });
  });

  return worker;
}
