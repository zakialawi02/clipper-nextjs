import { Worker } from "bullmq";
import { env } from "./env";
import ffmpeg from "fluent-ffmpeg";

console.log("Worker starting...");

const worker = new Worker(
  "video-clipping",
  async (job) => {
    console.log(`Processing job ${job.id}: ${job.name}`);
    
    // Example FFmpeg task
    // ffmpeg(job.data.inputPath).output(job.data.outputPath).run();

    return { status: "completed" };
  },
  {
    connection: {
      url: env.BULLMQ_REDIS_URL,
    },
  }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed!`);
});

worker.on("failed", (job, err) => {
  console.log(`Job ${job?.id} failed with error: ${err.message}`);
});
