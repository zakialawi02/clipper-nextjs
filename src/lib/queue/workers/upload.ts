import { promises as fs } from "node:fs";
import { Worker } from "bullmq";
import { prisma } from "@/lib/prisma";
import { R2Storage } from "@/lib/storage/r2";
import { connection } from "../connection";
import type { UploadJobData } from "../index";

export function createUploadWorker() {
  const worker = new Worker<UploadJobData>(
    "upload",
    async (job) => {
      const { projectId, clipId, outputPath, thumbnailPath } = job.data;

      await job.updateProgress(0);

      await prisma.clip.update({
        where: { id: clipId },
        data: { status: "uploading" },
      });

      const project = await prisma.project.findUniqueOrThrow({
        where: { id: projectId },
        select: { status: true },
      });

      if (project.status === "rendering" || project.status === "analyzing") {
        await prisma.project.update({
          where: { id: projectId },
          data: { status: "uploading", progress: 10, errorMessage: null },
        });
      }
      await job.updateProgress(10);

      const clipKey = `projects/${projectId}/clips/${clipId}/clip.mp4`;
      const thumbKey = `projects/${projectId}/clips/${clipId}/thumb.jpg`;

      const [clipBuffer, thumbBuffer] = await Promise.all([
        fs.readFile(outputPath),
        fs.readFile(thumbnailPath),
      ]);
      await job.updateProgress(30);

      await Promise.all([
        R2Storage.upload(clipKey, clipBuffer, "video/mp4"),
        R2Storage.upload(thumbKey, thumbBuffer, "image/jpeg"),
      ]);
      await job.updateProgress(70);

      const signedUrl = await R2Storage.getSignedUrl(clipKey, 86400);
      const thumbUrl = await R2Storage.getSignedUrl(thumbKey, 86400);
      await job.updateProgress(85);

      await prisma.clip.update({
        where: { id: clipId },
        data: {
          storageUrl: signedUrl,
          thumbnailUrl: thumbUrl,
          status: "ready",
        },
      });
      await job.updateProgress(95);

      await Promise.all([
        fs.unlink(outputPath).catch(() => undefined),
        fs.unlink(thumbnailPath).catch(() => undefined),
      ]);

      const totalClips = await prisma.clip.count({ where: { projectId } });
      const readyClips = await prisma.clip.count({
        where: { projectId, status: "ready" },
      });

      if (readyClips >= totalClips && totalClips > 0) {
        await prisma.project.update({
          where: { id: projectId },
          data: { status: "completed", progress: 100 },
        });
      } else {
        await prisma.project.update({
          where: { id: projectId },
          data: { progress: Math.round((readyClips / totalClips) * 100) },
        });
      }

      await job.updateProgress(100);
    },
    {
      connection,
      concurrency: 4,
      lockDuration: 10 * 60_000,
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
