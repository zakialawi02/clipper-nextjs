import { promises as fs } from "node:fs";
import path from "node:path";
import ffmpeg from "fluent-ffmpeg";

const TEMP_DIR = "/tmp/ai-clipper";

export async function ensureTempDir() {
  await fs.mkdir(TEMP_DIR, { recursive: true });
  return TEMP_DIR;
}

export async function findProjectVideoFile(projectId: string) {
  const tempDir = await ensureTempDir();
  const files = await fs.readdir(tempDir);
  const candidates = files
    .filter((file) => file.startsWith(`${projectId}_`))
    .filter((file) => !file.endsWith("_audio.wav"))
    .filter((file) => !file.endsWith("_transcript.json"));

  if (candidates.length === 0) {
    throw new Error(`No downloaded video file found for project ${projectId}`);
  }

  const withStats = await Promise.all(
    candidates.map(async (file) => {
      const filePath = path.join(tempDir, file);
      const stat = await fs.stat(filePath);
      return { filePath, mtimeMs: stat.mtimeMs };
    }),
  );

  return withStats.sort((a, b) => b.mtimeMs - a.mtimeMs)[0].filePath;
}

export const FFmpegUtils = {
  getTempDir: ensureTempDir,

  extractAudio(videoPath: string, outputPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .noVideo()
        .audioCodec("pcm_s16le")
        .audioFrequency(16000)
        .audioChannels(1)
        .output(outputPath)
        .on("end", () => resolve(outputPath))
        .on("error", reject)
        .run();
    });
  },

  renderClip(videoPath: string, startTime: number, duration: number, outputPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .setStartTime(startTime)
        .duration(duration)
        .videoFilter("crop=ih*9/16:ih,scale=1080:1920")
        .videoCodec("libx264")
        .audioCodec("aac")
        .audioBitrate("128k")
        .outputOptions(["-preset fast", "-crf 23"])
        .output(outputPath)
        .on("end", () => resolve(outputPath))
        .on("error", reject)
        .run();
    });
  },

  generateThumbnail(videoPath: string, outputPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .seekInput("00:00:01")
        .frames(1)
        .videoFilter("scale=640:360")
        .output(outputPath)
        .on("end", () => resolve(outputPath))
        .on("error", reject)
        .run();
    });
  },
};
