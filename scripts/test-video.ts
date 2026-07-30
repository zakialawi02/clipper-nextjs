import { prisma } from "@/lib/prisma";
import { downloadQueue } from "@/lib/queue";

const USER_ID = "01KYS0C54F9WH2MK6X2D11JZH7";
const YOUTUBE_URL = "https://www.youtube.com/watch?v=ShcR4Zfc6Dw";

async function main() {
  // Clean old projects with this URL
  await prisma.clip.deleteMany({ where: { project: { youtubeUrl: YOUTUBE_URL } } });
  await prisma.transcript.deleteMany({ where: { project: { youtubeUrl: YOUTUBE_URL } } });
  await prisma.analysis.deleteMany({ where: { project: { youtubeUrl: YOUTUBE_URL } } });
  await prisma.project.deleteMany({ where: { youtubeUrl: YOUTUBE_URL } });

  const project = await prisma.project.create({
    data: { userId: USER_ID, youtubeUrl: YOUTUBE_URL, status: "pending", progress: 0 },
  });
  console.log("✅ Project:", project.id);
  console.log("URL:", YOUTUBE_URL);

  const job = await downloadQueue.add("download", {
    projectId: project.id, userId: USER_ID, youtubeUrl: YOUTUBE_URL,
  });
  console.log("✅ Job:", job.id);
  console.log("\nMonitor:");
  console.log(`  npx tsx --env-file=.env scripts/check-status.ts ${project.id}`);
}
main().catch(console.error).finally(() => process.exit(0));
