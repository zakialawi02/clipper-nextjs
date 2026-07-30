import { prisma } from "@/lib/prisma";

async function main() {
  const projectId = process.argv[2] || "01KYS7YC852A46KR8E04H2JEQ2";
  
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      clips: true,
      transcript: true,
      analysis: true,
    },
  });

  if (!project) {
    console.log("❌ Project not found");
    process.exit(1);
  }

  console.log("\n📊 PROJECT STATUS");
  console.log("━━━━━━━━━━━━━━━━━━━");
  console.log(`ID:        ${project.id}`);
  console.log(`URL:       ${project.youtubeUrl}`);
  console.log(`Status:    ${project.status}`);
  console.log(`Progress:  ${project.progress}%`);
  console.log(`Title:     ${project.title || "—"}`);
  console.log(`Duration:  ${project.duration || "—"}s`);
  console.log(`Clips:     ${project.clips.length}`);
  console.log(`Transcript: ${project.transcript ? "✅" : "⏳"}`);
  console.log(`Analysis:  ${project.analysis ? "✅" : "⏳"}`);
  console.log(`Error:     ${project.errorMessage || "—"}`);

  if (project.clips.length > 0) {
    console.log("\n🎬 CLIPS:");
    for (const clip of project.clips) {
      console.log(`  [${clip.status}] ${clip.title || "Untitled"} (${clip.startTime}s→${clip.endTime}s, score: ${clip.score || "—"})`);
    }
  }
}
main().catch(console.error);
