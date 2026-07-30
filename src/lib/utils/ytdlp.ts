import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

type YtDlpMetadata = {
  id?: string;
  title?: string;
  thumbnail?: string;
  duration?: number;
  channel?: string;
  uploader?: string;
};

export async function getYouTubeMetadata(youtubeUrl: string): Promise<YtDlpMetadata> {
  const { stdout } = await execFileAsync("yt-dlp", ["--dump-single-json", "--no-download", youtubeUrl], {
    timeout: 60_000,
    maxBuffer: 20 * 1024 * 1024,
  });

  return JSON.parse(stdout) as YtDlpMetadata;
}

export async function downloadYouTubeVideo(youtubeUrl: string, outputTemplate: string): Promise<void> {
  await execFileAsync(
    "yt-dlp",
    [
      "-f",
      "bestvideo[height<=1080]+bestaudio/best[height<=1080]",
      "--merge-output-format",
      "mp4",
      "-o",
      outputTemplate,
      youtubeUrl,
    ],
    {
      timeout: 15 * 60_000,
      maxBuffer: 50 * 1024 * 1024,
    },
  );
}
