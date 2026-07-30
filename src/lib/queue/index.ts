import { Queue, QueueEvents } from "bullmq";
import { connection } from "./connection";

const DEFAULT_JOB_OPTIONS = {
  attempts: 5,
  backoff: {
    type: "exponential" as const,
    delay: 60_000,
  },
  removeOnComplete: { age: 60 * 60 * 24 },
  removeOnFail: { age: 60 * 60 * 72 },
};

const DEFAULT_QUEUE_CONFIG = {
  connection,
  defaultJobOptions: DEFAULT_JOB_OPTIONS,
};

export type DownloadJobData = {
  projectId: string;
  userId: string;
  youtubeUrl: string;
};

export type TranscribeJobData = {
  projectId: string;
  videoPath: string;
  audioPath: string;
};

export type AnalyzeJobData = {
  projectId: string;
  videoPath: string;
  transcript: string;
};

export type RenderJobData = {
  projectId: string;
  clipId: string;
  videoPath: string;
  startTime: number;
  endTime: number;
};

export type UploadJobData = {
  projectId: string;
  clipId: string;
  outputPath: string;
  thumbnailPath: string;
};

export const downloadQueue = new Queue<DownloadJobData>("download", DEFAULT_QUEUE_CONFIG);
export const transcribeQueue = new Queue<TranscribeJobData>("transcribe", DEFAULT_QUEUE_CONFIG);
export const analyzeQueue = new Queue<AnalyzeJobData>("analyze", DEFAULT_QUEUE_CONFIG);
export const renderQueue = new Queue<RenderJobData>("render", DEFAULT_QUEUE_CONFIG);
export const uploadQueue = new Queue<UploadJobData>("upload", DEFAULT_QUEUE_CONFIG);
export const cleanupQueue = new Queue("cleanup", DEFAULT_QUEUE_CONFIG);

export const downloadQueueEvents = new QueueEvents("download", { connection });
export const transcribeQueueEvents = new QueueEvents("transcribe", { connection });
export const analyzeQueueEvents = new QueueEvents("analyze", { connection });
export const renderQueueEvents = new QueueEvents("render", { connection });
export const uploadQueueEvents = new QueueEvents("upload", { connection });

export { connection } from "./connection";
