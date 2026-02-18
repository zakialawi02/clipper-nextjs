"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TextSubmitInput } from "@/components/text-submit-input";
import { ScissorsLineDashed, Link2 } from "lucide-react";
import { toast } from "sonner";

export default function ClipPage() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  // Regex for YouTube URLs (Standard, Shortened, Embed)
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
  // Regex for common video file extensions
  const videoFileRegex = /\.(mp4|webm|ogg|mov)$/i;

  const validateUrl = (url: string) => {
    try {
      const parsedUrl = new URL(url);

      // Check if it matches YouTube patterns
      if (youtubeRegex.test(url)) {
        return true;
      }

      // Check for video file extensions in the pathname
      if (videoFileRegex.test(parsedUrl.pathname)) {
        return true;
      }

      return false;
    } catch {
      return false;
    }
  };

  const handleUrlSubmit = (url: string) => {
    if (!url.trim()) {
      toast.error("Please enter a URL.");
      return;
    }

    if (!validateUrl(url)) {
      toast.error(
        "Invalid video URL. Please provide a valid YouTube link or a direct link to a video file (mp4, webm, ogg, mov).",
      );
      setVideoUrl(null);
      return;
    }

    setVideoUrl(url);
  };

  const renderVideoPlayer = (url: string) => {
    // Check for YouTube
    const ytRegex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const ytMatch = url.match(ytRegex);

    if (ytMatch && ytMatch[1]) {
      return (
        <div className="relative w-full overflow-hidden pt-[56.25%] rounded-md bg-muted">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/${ytMatch[1]}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }

    // Default to generic video tag for direct files or other supported formats
    return (
      <div className="relative w-full rounded-md overflow-hidden bg-black aspect-video flex items-center justify-center">
        <video className="w-full h-full" controls src={url}>
          Your browser does not support the video tag.
        </video>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Clip Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage your clips here.</p>
      </div>

      <div className="space-y-4">
        <div className="py-2">
          <TextSubmitInput
            onSubmit={handleUrlSubmit}
            placeholder="Paste your video URL here..."
            buttonText="Clip"
            buttonIcon={ScissorsLineDashed}
            icon={Link2}
            type="url"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Video Preview</CardTitle>
            <CardDescription>
              {videoUrl ? "Review your video content below." : "Enter a URL to see a preview."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {videoUrl ? (
              renderVideoPlayer(videoUrl)
            ) : (
              <div className="flex items-center justify-center h-64 bg-muted/30 rounded-md border-2 border-dashed border-muted-foreground/25">
                <p className="text-muted-foreground text-sm">No video loaded</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <CardTitle>Clip Settings</CardTitle>
            <CardDescription>Configure your clip parameters.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Settings will appear here once a video is loaded.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
