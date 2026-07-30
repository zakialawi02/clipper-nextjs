import { prisma } from "@/lib/prisma";
import { downloadQueue } from "@/lib/queue";

const USER_ID = "01KYS0C54F9WH2MK6X2D11JZH7";
// Short YouTube video for testing (~60s)
const YOUTUBE_URL = "https://www.youtube.com/watch?v=jNQXAC9IVRw";

async function main() {
  // Clean up any existing test project first
  const existing = await prisma.project.findFirst({
    where: { youtubeUrl: YOUTUBE_URL, userId: USER_ID },
  });
  if (existing) {
    console.log("Deleting existing test project...");
    await prisma.clip.deleteMany({ where: { projectId: existing.id } });
    await prisma.transcript.deleteMany({ where: { projectId: existing.id } });
    await prisma.analysis.deleteMany({ where: { projectId: existing.id } });
    await prisma.project.delete({ where: { id: existing.id } });
  }

  const project = await prisma.project.create({
    data: {
      userId: USER_ID,
      youtubeUrl: YOUTUBE_URL,
      status: "pending",
      progress: 0,
    },
  });
  console.log("✅ Created project:", project.id);

  // Enqueue download job
  const job = await downloadQueue.add("download", {
    projectId: project.id,
    userId: USER_ID,
    youtubeUrl: YOUTUBE_URL,
  });
  console.log("✅ Enqueued download job:", job.id);

  console.log("\n--- Now monitor pipeline progress ---");
  console.log("Project ID:", project.id);
  console.log("Job ID:", job.id);
}
main().catch(console.error);
