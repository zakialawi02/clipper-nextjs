import { prisma } from "@/lib/prisma";
import { downloadQueue } from "@/lib/queue";

const USER_ID = "01KYS0C54F9WH2MK6X2D11JZH7";
const YOUTUBE_URL = "https://www.youtube.com/watch?v=jNQXAC9IVRw";

async function main() {
  await prisma.clip.deleteMany({ where: { project: { youtubeUrl: YOUTUBE_URL } } });
  await prisma.transcript.deleteMany({ where: { project: { youtubeUrl: YOUTUBE_URL } } });
  await prisma.analysis.deleteMany({ where: { project: { youtubeUrl: YOUTUBE_URL } } });
  await prisma.project.deleteMany({ where: { youtubeUrl: YOUTUBE_URL } });

  const project = await prisma.project.create({
    data: { userId: USER_ID, youtubeUrl: YOUTUBE_URL, status: "pending", progress: 0 },
  });
  console.log("✅ Project:", project.id);

  const job = await downloadQueue.add("download", {
    projectId: project.id, userId: USER_ID, youtubeUrl: YOUTUBE_URL,
  });
  console.log("✅ Job:", job.id);
  console.log("Model: medium\n");
  console.log(`npx tsx --env-file=.env scripts/check-status.ts ${project.id}`);
}
main().catch(console.error).finally(() => process.exit(0));
