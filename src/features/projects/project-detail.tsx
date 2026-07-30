"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Clock,
  Clapperboard,
  Download,
  AlertCircle,
  RefreshCw,
  Star,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react";

type Project = {
  id: string;
  youtubeUrl: string;
  title: string | null;
  thumbnailUrl: string | null;
  duration: number | null;
  channelName: string | null;
  status: string;
  progress: number;
  errorMessage: string | null;
  creditsUsed: number;
  createdAt: string;
  updatedAt: string;
  clips: Clip[];
  transcript: Transcript | null;
  analysis: Analysis | null;
};

type Clip = {
  id: string;
  title: string | null;
  startTime: number;
  endTime: number;
  duration: number | null;
  score: number | null;
  reason: string | null;
  hookSuggestion: string | null;
  targetPlatform: string | null;
  storageUrl: string | null;
  thumbnailUrl: string | null;
  status: string;
  createdAt: string;
};

type Transcript = {
  id: string;
  language: string | null;
  segments: unknown;
  raw: string | null;
};

type Analysis = {
  id: string;
  summary: string | null;
  hashtags: string[] | null;
  raw: unknown;
};

function formatDuration(seconds: number | null): string {
  if (!seconds) return "—";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatClipDuration(startTime: number, endTime: number): string {
  const dur = endTime - startTime;
  return formatDuration(dur);
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

function getClipStatusLabel(status: string): string {
  switch (status) {
    case "pending":
      return "Pending";
    case "rendering":
      return "Rendering";
    case "uploading":
      return "Uploading";
    case "completed":
      return "Ready";
    case "failed":
      return "Failed";
    default:
      return status;
  }
}

const isInProgress = (status: string) =>
  ["pending", "in-progress", "downloading", "transcribing", "analyzing", "rendering"].includes(
    status
  );

function ClipVideoPreview({
  storageUrl,
  title,
}: {
  storageUrl: string | null;
  title: string | null;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleMouseEnter = () => {
    if (videoRef.current && !hasError) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current && !hasError) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current || hasError) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  if (!storageUrl || hasError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-muted/50 text-muted-foreground p-4">
        <Clapperboard className="size-8 mb-2 opacity-40" />
        <span className="text-xs text-center">Video preview</span>
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-full group/video cursor-pointer overflow-hidden bg-black flex items-center justify-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={storageUrl}
        muted={isMuted}
        loop
        playsInline
        preload="metadata"
        onError={() => setHasError(true)}
        className="w-full h-full object-cover"
      />
      {/* Top right mute/unmute button */}
      <button
        type="button"
        onClick={toggleMute}
        className="absolute top-1.5 right-1.5 z-20 size-6 rounded-full bg-black/60 backdrop-blur-xs text-white flex items-center justify-center hover:bg-black/80 transition-colors border border-white/20"
        title={isMuted ? "Unmute audio" : "Mute audio"}
      >
        {isMuted ? (
          <VolumeX className="size-3 text-white/80" />
        ) : (
          <Volume2 className="size-3 text-white" />
        )}
      </button>
      {/* Play/Pause center overlay */}
      <div
        className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity duration-200 ${
          isPlaying ? "opacity-0 group-hover/video:opacity-100" : "opacity-100"
        }`}
      >
        <div className="size-8 rounded-full bg-black/60 backdrop-blur-sm text-white flex items-center justify-center shadow-lg border border-white/20">
          {isPlaying ? (
            <Pause className="size-4 fill-current" />
          ) : (
            <Play className="size-4 fill-current ml-0.5" />
          )}
        </div>
      </div>
    </div>
  );
}

interface ProjectDetailProps {
  initialProject: Project;
}

export function ProjectDetail({ initialProject }: ProjectDetailProps) {
  const router = useRouter();
  const [project, setProject] = useState<Project>(initialProject);
  const [loading, setLoading] = useState(false);

  const pollProject = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${project.id}`);
      if (res.ok) {
        const data: Project = await res.json();
        setProject(data);
      }
    } catch {
      // Silently fail on poll errors
    }
  }, [project.id]);

  useEffect(() => {
    if (!isInProgress(project.status)) return;

    const interval = setInterval(pollProject, 3000);
    return () => clearInterval(interval);
  }, [project.status, pollProject]);

  const handleRetry = async () => {
    setLoading(true);
    try {
      const { retryProject } = await import("@/features/projects/actions");
      await retryProject(project.id);
      router.refresh();
    } catch {
      setLoading(false);
    }
  };

  const sortedClips = [...project.clips].sort((a, b) => (b.score ?? -1) - (a.score ?? -1));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/app"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <ArrowLeft className="size-3" />
            Back to projects
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">
            {project.title || project.youtubeUrl}
          </h1>
          {project.channelName && (
            <p className="text-sm text-muted-foreground">{project.channelName}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={getStatusVariant(project.status)}>
            {getStatusLabel(project.status)}
          </Badge>
          {project.status === "failed" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              disabled={loading}
            >
              <RefreshCw className={`size-3 ${loading ? "animate-spin" : ""}`} />
              Retry
            </Button>
          )}
        </div>
      </div>

      {/* Progress */}
      {isInProgress(project.status) && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Processing...</span>
            <span>{project.progress}%</span>
          </div>
          <Progress value={project.progress} />
        </div>
      )}

      {/* Error Message */}
      {project.status === "failed" && project.errorMessage && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="flex items-start gap-3 py-4">
            <AlertCircle className="size-4 text-destructive mt-0.5 shrink-0" />
            <p className="text-sm text-destructive">{project.errorMessage}</p>
          </CardContent>
        </Card>
      )}

      {/* Info Row */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="size-3" />
          {formatDuration(project.duration)}
        </span>
        <span className="flex items-center gap-1">
          <Clapperboard className="size-3" />
          {project.clips.length} clips
        </span>
        {project.creditsUsed > 0 && (
          <span className="flex items-center gap-1">
            <Star className="size-3" />
            {project.creditsUsed} credits used
          </span>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="clips" className="w-full">
        <TabsList>
          <TabsTrigger value="clips">
            <Clapperboard className="size-3.5" />
            Clips ({project.clips.length})
          </TabsTrigger>
          <TabsTrigger value="transcript">Transcript</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        {/* Clips Tab */}
        <TabsContent value="clips" className="mt-4">
          {sortedClips.length === 0 ? (
            <Card className="border-dashed border-border/50">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Clapperboard className="size-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">
                  {isInProgress(project.status)
                    ? "Clips are being generated. This page will update automatically."
                    : "No clips found for this project."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {sortedClips.map((clip) => (
                <Card key={clip.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-[9/16] bg-muted relative">
                    <ClipVideoPreview
                      storageUrl={clip.storageUrl}
                      title={clip.title}
                    />
                    <div className="absolute top-1.5 left-1.5 flex flex-wrap items-center gap-1 z-10 pointer-events-none">
                      {clip.score != null && (
                        <Badge variant="default" className="text-[9px] px-1 py-0 h-4 gap-0.5">
                          <Star className="size-2 fill-current" />
                          {clip.score}
                        </Badge>
                      )}
                      <Badge
                        variant={
                          clip.status === "completed" || clip.status === "ready" ? "default" : "outline"
                        }
                        className="text-[9px] px-1 py-0 h-4"
                      >
                        {getClipStatusLabel(clip.status)}
                      </Badge>
                    </div>
                    <div className="absolute bottom-1.5 right-1.5 z-10 pointer-events-none">
                      <span className="px-1 py-0.5 rounded bg-black/70 text-[9px] font-medium text-white backdrop-blur-xs">
                        {formatClipDuration(clip.startTime, clip.endTime)}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-2.5 space-y-1.5">
                    <h4 className="font-semibold text-xs truncate" title={clip.title ?? undefined}>
                      {clip.title || `Clip at ${formatClipDuration(0, clip.startTime)}`}
                    </h4>
                    {clip.reason && (
                      <p className="text-[11px] text-muted-foreground line-clamp-2 leading-tight">
                        {clip.reason}
                      </p>
                    )}
                    {clip.storageUrl && (
                      <a
                        href={clip.storageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline pt-0.5"
                      >
                        <Download className="size-3" />
                        Download clip
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Transcript Tab */}
        <TabsContent value="transcript" className="mt-4">
          {isInProgress(project.status) && !project.transcript ? (
            <Skeleton className="h-64 w-full rounded-xl" />
          ) : project.transcript?.raw ? (
            <Card>
              <CardContent className="p-4 max-h-[600px] overflow-y-auto">
                <pre className="text-sm whitespace-pre-wrap font-sans">
                  {project.transcript.raw}
                </pre>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed border-border/50">
              <CardContent className="flex items-center justify-center py-12">
                <p className="text-sm text-muted-foreground">
                  No transcript available yet.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="mt-4">
          {isInProgress(project.status) && !project.analysis ? (
            <Skeleton className="h-64 w-full rounded-xl" />
          ) : project.analysis?.summary ? (
            <Card>
              <CardContent className="p-4 space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2">Summary</h4>
                  <p className="text-sm text-muted-foreground">
                    {project.analysis.summary}
                  </p>
                </div>
                {project.analysis.hashtags && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Suggested Hashtags</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.analysis.hashtags.map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed border-border/50">
              <CardContent className="flex items-center justify-center py-12">
                <p className="text-sm text-muted-foreground">
                  No analysis available yet.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
