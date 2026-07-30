import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      clips: {
        orderBy: [{ score: "desc" }, { createdAt: "desc" }],
      },
      transcript: true,
      analysis: true,
    },
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  if (project.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { formatClipWithSignedUrls } = await import("@/lib/storage/r2");
  const formattedClips = await Promise.all(project.clips.map(formatClipWithSignedUrls));

  return NextResponse.json({
    ...project,
    clips: formattedClips,
  });
}
