import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { getProjects } from "@/features/projects/actions";
import { CreateProjectForm } from "@/features/projects/create-form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Clapperboard,
  Clock,
  Video,
  AlertCircle,
} from "lucide-react";

function formatDuration(seconds: number | null): string {
  if (!seconds) return "—";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function getStatusVariant(
  status: string
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "completed":
      return "default";
    case "in-progress":
    case "downloading":
    case "transcribing":
    case "analyzing":
    case "rendering":
      return "secondary";
    case "failed":
    case "error":
      return "destructive";
    case "pending":
    default:
      return "outline";
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case "pending":
      return "Pending";
    case "downloading":
      return "Downloading";
    case "transcribing":
      return "Transcribing";
    case "analyzing":
      return "Analyzing";
    case "rendering":
      return "Rendering";
    case "completed":
      return "Completed";
    case "failed":
      return "Failed";
    default:
      return status;
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/signin");

  const projects = await getProjects(session.user.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your AI clip projects
        </p>
      </div>

      <CreateProjectForm userId={session.user.id} />

      {projects.length === 0 ? (
        <Card className="border-dashed border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Clapperboard className="size-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground">
              No projects yet
            </h3>
            <p className="text-sm text-muted-foreground/60 mt-1 max-w-sm">
              Paste a YouTube URL above to get started with your first AI clip project.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card className="group hover:border-primary/30 transition-colors cursor-pointer h-full">
                <div className="aspect-video bg-muted relative overflow-hidden rounded-t-xl">
                  {project.thumbnailUrl ? (
                    <img
                      src={project.thumbnailUrl}
                      alt={project.title ?? "Project thumbnail"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted/50">
                      <Video className="size-10 text-muted-foreground/30" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <Badge
                      variant={getStatusVariant(project.status)}
                      className="text-[10px]"
                    >
                      {getStatusLabel(project.status)}
                    </Badge>
                  </div>
                  {project.status === "failed" && (
                    <div className="absolute top-3 right-3">
                      <AlertCircle className="size-4 text-destructive" />
                    </div>
                  )}
                </div>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                      {project.title || project.youtubeUrl}
                    </h3>
                    {project.channelName && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {project.channelName}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {formatDuration(project.duration)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clapperboard className="size-3" />
                      {project._count?.clips ?? 0} clips
                    </span>
                  </div>

                  {(project.status === "in-progress" ||
                    project.status === "downloading" ||
                    project.status === "pending") && (
                    <Progress value={project.progress} className="h-1.5" />
                  )}

                  <p className="text-[10px] text-muted-foreground/50">
                    {formatDate(project.createdAt)}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
