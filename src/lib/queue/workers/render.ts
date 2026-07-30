import path from "node:path";
import { Worker } from "bullmq";
import { prisma } from "@/lib/prisma";
import { FFmpegUtils } from "@/lib/utils/ffmpeg";
import { connection } from "../connection";
import { uploadQueue, type RenderJobData } from "../index";

export function createRenderWorker() {
  const worker = new Worker<RenderJobData>(
    "render",
    async (job) => {
      const { projectId, clipId, videoPath, startTime, endTime } = job.data;

      await job.updateProgress(0);

      await prisma.clip.update({
        where: { id: clipId },
        data: { status: "rendering" },
      });

      const project = await prisma.project.findUniqueOrThrow({
        where: { id: projectId },
        select: { status: true },
      });

      if (project.status === "pending" || project.status === "transcribing") {
        await prisma.project.update({
          where: { id: projectId },
          data: { status: "rendering", progress: 10, errorMessage: null },
        });
      }

      const tempDir = await FFmpegUtils.getTempDir();
      const clipDuration = endTime - startTime;
      const clipPath = path.join(tempDir, `${clipId}_clip.mp4`);
      const thumbPath = path.join(tempDir, `${clipId}_thumb.jpg`);

      await job.updateProgress(15);

      await FFmpegUtils.renderClip(videoPath, startTime, clipDuration, clipPath);
      await job.updateProgress(70);

      await FFmpegUtils.generateThumbnail(clipPath, thumbPath);
      await job.updateProgress(90);

      await prisma.clip.update({
        where: { id: clipId },
        data: {
          duration: clipDuration,
          status: "rendered",
        },
      });

      await job.updateProgress(100);

      await uploadQueue.add(
        `upload-${clipId}`,
        {
          projectId,
          clipId,
          outputPath: clipPath,
          thumbnailPath: thumbPath,
        },
        { priority: 5 },
      );
    },
    {
      connection,
      concurrency: 2,
      lockDuration: 15 * 60_000,
    },
  );

  worker.on("failed", async (job, err) => {
    if (!job) return;
    try {
      await prisma.clip.update({
        where: { id: job.data.clipId },
        data: { status: "failed" },
      });
      await prisma.project.update({
        where: { id: job.data.projectId },
        data: { status: "failed", progress: 0, errorMessage: err.message },
      });
    } catch {
      // Project or clip may have been deleted — safe to ignore
    }
  });

  return worker;
}
