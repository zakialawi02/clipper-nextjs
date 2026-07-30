"use server";

import { prisma } from "@/lib/prisma";
import { downloadQueue } from "@/lib/queue";
import { revalidatePath } from "next/cache";

const YOUTUBE_URL_REGEX =
  /^(https?:\/\/)?(www\.|m\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)[\w-]{11}([?&].*)?$/i;

function isValidYoutubeUrl(url: string): boolean {
  return YOUTUBE_URL_REGEX.test(url.trim());
}

export async function createProject(userId: string, youtubeUrl: string) {
  if (!userId) throw new Error("User ID is required");
  if (!youtubeUrl || !isValidYoutubeUrl(youtubeUrl)) {
    throw new Error("Invalid YouTube URL");
  }

  const trimmedUrl = youtubeUrl.trim();

  const project = await prisma.project.create({
    data: {
      userId,
      youtubeUrl: trimmedUrl,
      status: "pending",
      progress: 0,
    },
  });

  // Enqueue the download job to start the pipeline
  await downloadQueue.add("download", {
    projectId: project.id,
    userId,
    youtubeUrl: trimmedUrl,
  });

  revalidatePath("/");

  return project;
}

export async function getProjects(userId: string) {
  if (!userId) return [];

  const projects = await prisma.project.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { clips: true },
      },
    },
  });

  return projects;
}

export async function getProject(projectId: string) {
  if (!projectId) throw new Error("Project ID is required");

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      clips: {
        orderBy: [{ score: "desc" }, { createdAt: "desc" }],
      },
      transcript: true,
      analysis: true,
    },
  });

  if (!project) throw new Error("Project not found");

  const { formatClipWithSignedUrls } = await import("@/lib/storage/r2");
  const formattedClips = await Promise.all(project.clips.map(formatClipWithSignedUrls));

  return {
    ...project,
    clips: formattedClips,
  };
}

export async function getProjectClips(projectId: string) {
  if (!projectId) return [];

  const clips = await prisma.clip.findMany({
    where: { projectId },
    orderBy: [{ score: "desc" }, { createdAt: "desc" }],
  });

  const { formatClipWithSignedUrls } = await import("@/lib/storage/r2");
  return Promise.all(clips.map(formatClipWithSignedUrls));
}

export async function retryProject(projectId: string) {
  if (!projectId) throw new Error("Project ID is required");

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) throw new Error("Project not found");

  const updated = await prisma.project.update({
    where: { id: projectId },
    data: {
      status: "pending",
      progress: 0,
      errorMessage: null,
    },
  });

  // Re-enqueue the download job
  await downloadQueue.add("download", {
    projectId: project.id,
    userId: project.userId,
    youtubeUrl: project.youtubeUrl,
  });

  revalidatePath(`/projects/${projectId}`);

  return updated;
}

export async function deleteProject(projectId: string) {
  if (!projectId) throw new Error("Project ID is required");

  await prisma.project.delete({
    where: { id: projectId },
  });

  revalidatePath("/");

  return { success: true };
}
