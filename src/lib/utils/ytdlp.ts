import { execFile } from "node:child_process";
import { promises as fs } from "node:fs";
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

export async function downloadYouTubeSubtitles(
  youtubeUrl: string,
  outputPath: string,
  lang = "en",
): Promise<string | null> {
  try {
    // Try auto-generated subtitles first, then manual subtitles
    await execFileAsync(
      "yt-dlp",
      [
        "--write-auto-subs",
        "--sub-langs",
        lang,
        "--skip-download",
        "--convert-subs",
        "srt",
        "-o",
        outputPath,
        youtubeUrl,
      ],
      {
        timeout: 60_000,
        maxBuffer: 10 * 1024 * 1024,
      },
    );

    const srtPath = `${outputPath}.${lang}.srt`;
    await fs.stat(srtPath); // Ensure file exists
    return srtPath;
  } catch {
    try {
      // Fallback: try manual subtitles
      await execFileAsync(
        "yt-dlp",
        [
          "--write-subs",
          "--sub-langs",
          lang,
          "--skip-download",
          "--convert-subs",
          "srt",
          "-o",
          outputPath,
          youtubeUrl,
        ],
        {
          timeout: 60_000,
          maxBuffer: 10 * 1024 * 1024,
        },
      );
      const srtPath = `${outputPath}.${lang}.srt`;
      await fs.stat(srtPath);
      return srtPath;
    } catch {
      return null; // No subtitles available
    }
  }
}

export type SrtSegment = {
  start: number;
  end: number;
  text: string;
  confidence: number;
};

export function parseSrt(content: string): { segments: SrtSegment[]; raw: string } {
  const segments: SrtSegment[] = [];
  const rawParts: string[] = [];

  const blocks = content.trim().split(/\n\s*\n/);

  for (const block of blocks) {
    const lines = block.trim().split("\n");
    if (lines.length < 3) continue;

    // Skip index line, parse timestamp line
    const timestampLine = lines[1];
    const match = timestampLine.match(
      /(\d{2}):(\d{2}):(\d{2})[,.](\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2})[,.](\d{3})/,
    );
    if (!match) continue;

    const start =
      parseInt(match[1]) * 3600 +
      parseInt(match[2]) * 60 +
      parseInt(match[3]) +
      parseInt(match[4]) / 1000;

    const end =
      parseInt(match[5]) * 3600 +
      parseInt(match[6]) * 60 +
      parseInt(match[7]) +
      parseInt(match[8]) / 1000;

    const text = lines.slice(2).join(" ").replace(/<[^>]+>/g, "").trim();
    if (!text) continue;

    segments.push({ start, end, text, confidence: 0.9 });
    rawParts.push(text);
  }

  return { segments, raw: rawParts.join(" ") };
}
