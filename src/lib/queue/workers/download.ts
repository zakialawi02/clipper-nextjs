import path from "node:path";
import { Worker } from "bullmq";
import { prisma } from "@/lib/prisma";
import { connection } from "../connection";
import { transcribeQueue, type DownloadJobData } from "../index";
import { FFmpegUtils, findProjectVideoFile } from "@/lib/utils/ffmpeg";
import { downloadYouTubeVideo, getYouTubeMetadata } from "@/lib/utils/ytdlp";

export function createDownloadWorker() {
  const worker = new Worker<DownloadJobData>(
    "download",
    async (job) => {
      const { projectId, youtubeUrl } = job.data;
      const tempDir = await FFmpegUtils.getTempDir();

      await job.updateProgress(0);
      await prisma.project.update({
        where: { id: projectId },
        data: { status: "downloading", progress: 10, errorMessage: null },
      });

      const metadata = await getYouTubeMetadata(youtubeUrl);

      await prisma.project.update({
        where: { id: projectId },
        data: {
          title: metadata.title,
          thumbnailUrl: metadata.thumbnail,
          duration: metadata.duration,
          channelName: metadata.channel ?? metadata.uploader,
          progress: 25,
        },
      });
      await job.updateProgress(25);

      const outputTemplate = path.join(tempDir, `${projectId}_%(id)s.%(ext)s`);
      await downloadYouTubeVideo(youtubeUrl, outputTemplate);

      const videoPath = await findProjectVideoFile(projectId);

      await prisma.project.update({
        where: { id: projectId },
        data: { progress: 70 },
      });
      await job.updateProgress(70);

      const audioPath = path.join(tempDir, `${projectId}_audio.wav`);
      await FFmpegUtils.extractAudio(videoPath, audioPath);

      await job.updateProgress(100);

      await prisma.project.update({
        where: { id: projectId },
        data: { status: "downloading", progress: 100 },
      });

      await transcribeQueue.add(
        `transcribe-${projectId}`,
        { projectId, videoPath, audioPath },
        { priority: 10 },
      );
    },
    {
      connection,
      concurrency: 3,
      lockDuration: 15 * 60_000,
    },
  );

  worker.on("failed", async (job, err) => {
    if (!job) return;

    try {
      await prisma.project.update({
        where: { id: job.data.projectId },
        data: {
          status: "failed",
          progress: 0,
          errorMessage: err.message,
        },
      });
    } catch {
      // Project may have been deleted — safe to ignore
    }
  });

  return worker;
}
