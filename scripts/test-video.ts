import { prisma } from "@/lib/prisma";
import { downloadQueue } from "@/lib/queue";

const USER_ID = "01KYS0C54F9WH2MK6X2D11JZH7";
const YOUTUBE_URL = "https://www.youtube.com/watch?v=FrQCZxnL7YI";

async function main() {
  // Clean old
  await prisma.clip.deleteMany({ where: { project: { youtubeUrl: { contains: "FrQCZxnL7YI" } } } });
  await prisma.transcript.deleteMany({ where: { project: { youtubeUrl: { contains: "FrQCZxnL7YI" } } } });
  await prisma.analysis.deleteMany({ where: { project: { youtubeUrl: { contains: "FrQCZxnL7YI" } } } });
  await prisma.project.deleteMany({ where: { youtubeUrl: { contains: "FrQCZxnL7YI" } } });

  const project = await prisma.project.create({
    data: { userId: USER_ID, youtubeUrl: YOUTUBE_URL, status: "pending", progress: 0 },
  });
  console.log("✅ Project:", project.id);

  await downloadQueue.add("download", {
    projectId: project.id, userId: USER_ID, youtubeUrl: YOUTUBE_URL,
  });
  console.log("✅ Job enqueued");
  console.log(`Monitor: npx tsx --env-file=.env scripts/check-status.ts ${project.id}`);
}
main().catch(console.error).finally(() => process.exit(0));
