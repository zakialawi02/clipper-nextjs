import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getProject } from "@/features/projects/actions";
import { ProjectDetail } from "@/features/projects/project-detail";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/signin");

  const { id } = await params;
  let project;

  try {
    project = await getProject(id);
  } catch {
    redirect("/");
  }

  // Ensure user owns the project
  if ((project as { userId?: string }).userId !== session.user.id) {
    redirect("/");
  }

  return <ProjectDetail initialProject={JSON.parse(JSON.stringify(project))} />;
}
