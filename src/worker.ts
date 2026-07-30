import "./env";
import pino from "pino";
import { createDownloadWorker } from "@/lib/queue/workers/download";
import { createTranscribeWorker } from "@/lib/queue/workers/transcribe";
import { createAnalyzeWorker } from "@/lib/queue/workers/analyze";
import { createRenderWorker } from "@/lib/queue/workers/render";
import { createUploadWorker } from "@/lib/queue/workers/upload";
import { connection } from "@/lib/queue/connection";

const logger = pino({ level: "info", name: "clipper-worker" });

async function main() {
  logger.info("Starting AI Clipper workers...");

  const downloadWorker = createDownloadWorker();
  const transcribeWorker = createTranscribeWorker();
  const analyzeWorker = createAnalyzeWorker();
  const renderWorker = createRenderWorker();
  const uploadWorker = createUploadWorker();

  logger.info("Workers started: download, transcribe, analyze, render, upload");

  const shutdown = async () => {
    logger.info("Shutting down workers...");

    await Promise.all([
      downloadWorker.close(),
      transcribeWorker.close(),
      analyzeWorker.close(),
      renderWorker.close(),
      uploadWorker.close(),
      connection.quit(),
    ]);

    logger.info("Workers shut down cleanly");
    process.exit(0);
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

main().catch((err) => {
  logger.error(err, "Worker failed to start");
  process.exit(1);
});
