"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link2, Upload, Clapperboard, ChevronRight, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const recentProjects = [
  {
    id: 1,
    name: "AI Clipper",
    videoCount: 14,
    time: "3:27 PM",
  },
  {
    id: 2,
    name: "Marketing Reel",
    videoCount: 8,
    time: "1:15 PM",
  },
  {
    id: 3,
    name: "Podcast Highlights",
    videoCount: 22,
    time: "11:04 AM",
  },
];

export default function ClipPage() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
  const videoFileRegex = /\.(mp4|webm|ogg|mov)$/i;

  const validateUrl = (url: string) => {
    try {
      const parsedUrl = new URL(url);
      if (youtubeRegex.test(url)) return true;
      if (videoFileRegex.test(parsedUrl.pathname)) return true;
      return false;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!url.trim()) {
      toast.error("Please enter a URL.");
      return;
    }
    if (!validateUrl(url)) {
      toast.error(
        "Invalid video URL. Please provide a valid YouTube link or a direct link to a video file.",
      );
      return;
    }
    setIsLoading(true);
    // Simulate processing
    setTimeout(() => {
      toast.success("Video URL submitted successfully!");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-10 max-w-3xl mx-auto">
      {/* Start a New Project Card */}
      <div className="relative rounded-2xl p-px bg-gradient-to-b from-primary/60 via-primary/20 to-transparent">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-primary/10 rounded-2xl blur-xl -z-10" />

        <div className="rounded-2xl bg-card p-8 sm:p-10 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Start a New Clip</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Enter your video containent with a combined URL.
            </p>
          </div>

          {/* URL Input */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Link2 className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
              <Input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste your video URL here..."
                disabled={isLoading}
                className="pl-12 pr-10 h-12 bg-background border-2 border-muted hover:border-primary/40 focus-visible:border-primary focus-visible:ring-0 rounded-xl transition-all"
              />
              {url && !isLoading && (
                <button
                  type="button"
                  onClick={() => setUrl("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="h-12 px-8 text-base font-semibold rounded-xl bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Clip"}
            </Button>
          </form>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-foreground">Recent Projects</h2>

        <div className="space-y-2">
          {recentProjects.map((project) => (
            <Link
              key={project.name}
              href="/dashboard/clip/editor"
              className="group w-full flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/40 transition-all text-left hover:shadow-md hover:shadow-primary/5"
            >
              <div className="w-11 h-11 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Clapperboard className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{project.name}</p>
                <p className="text-xs text-muted-foreground">
                  {project.videoCount} video • {project.time}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
