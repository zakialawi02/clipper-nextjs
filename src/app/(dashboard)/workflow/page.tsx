"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Link2, Info, ChevronDown, Zap, Smartphone, Loader2 } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function WorkflowContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const url = searchParams.get("url") || "https://www.youtube.com/watch?v=Sg5YKhKfweg";
  const [activeTab, setActiveTab] = useState("ai");
  const [activePreset, setActivePreset] = useState("karaoke");
  const [videoInfo, setVideoInfo] = useState<{ 
    title: string; 
    thumbnail: string; 
    loading: boolean;
    width: number;
    height: number;
  }>({
    title: "Loading video info...",
    thumbnail: "",
    loading: true,
    width: 16,
    height: 9,
  });

  const [clipModel, setClipModel] = useState("Auto");
  const [genre, setGenre] = useState("Auto");
  const [clipLength, setClipLength] = useState("Auto (0m-3m)");
  const [autoHook, setAutoHook] = useState(false);
  const [timeframe, setTimeframe] = useState([0, 100]); // Percentage 0-100 for now
  const [duration, setDuration] = useState(684); // 11:24 in seconds for example

  const handleRemove = () => {
    router.push("/app");
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return `${hours}:${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${remainingMinutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const startTime = Math.floor((timeframe[0] / 100) * duration);
  const endTime = Math.floor((timeframe[1] / 100) * duration);

  useEffect(() => {
    async function fetchVideoInfo() {
      setVideoInfo(prev => ({ ...prev, loading: true }));
      try {
        // Try YouTube oEmbed first
        const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
        if (response.ok) {
          const data = await response.json();
          setVideoInfo({
            title: data.title,
            thumbnail: data.thumbnail_url,
            loading: false,
            width: data.width || 16,
            height: data.height || 9,
          });
          return;
        }

        // Fallback for non-youtube or if oembed fails
        const youtubeIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
        if (youtubeIdMatch?.[1]) {
          setVideoInfo({
            title: "YouTube Video",
            thumbnail: `https://img.youtube.com/vi/${youtubeIdMatch[1]}/maxresdefault.jpg`,
            loading: false,
            width: 16,
            height: 9,
          });
        } else {
          setVideoInfo({
            title: "Video Preview",
            thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&h=338&fit=crop",
            loading: false,
            width: 16,
            height: 9,
          });
        }
      } catch (error) {
        console.error("Error fetching video info:", error);
        setVideoInfo({
          title: "Video Preview",
          thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&h=338&fit=crop",
          loading: false,
          width: 16,
          height: 9,
        });
      }
    }

    fetchVideoInfo();
  }, [url]);

  const captionPresets = [
    { id: "karaoke", name: "Karaoke", badge: "", color: "border-green-500", text: "CLIPPING WITH AI", textColor: "text-green-500" },
    { id: "deep", name: "Deep Diver", badge: "", color: "border-border/50", text: "To get started", textColor: "text-white/80" },
    { id: "pod", name: "Pod P", badge: "", color: "border-border/50", text: "TO GET", textColor: "text-fuchsia-500" },
    { id: "pop", name: "Popline", badge: "", color: "border-border/50", text: "TO GET STARTED", textColor: "text-white/80" },
    { id: "seamless", name: "Seamless Bounce", badge: "New", color: "border-border/50", text: "To get started", textColor: "text-green-400" },
    { id: "beasty", name: "Beasty", badge: "", color: "border-border/50", text: "TO GET", textColor: "text-white/40" },
    { id: "youshaei", name: "Youshaei", badge: "", color: "border-border/50", text: "TO GET STARTED", textColor: "text-white/60" },
    { id: "mozi", name: "Mozi", badge: "", color: "border-border/50", text: "TO GET STARTED", textColor: "text-green-500" },
    { id: "glitch", name: "Glitch Infinite", badge: "New", color: "border-border/50", text: "To get started", textColor: "text-orange-500" },
    { id: "baby", name: "Baby Earthquake", badge: "New", color: "border-border/50", text: "to get started", textColor: "text-white/60" },
  ];

  // Calculate dynamic aspect ratio
  const aspectRatio = videoInfo.width / videoInfo.height;
  const isPortrait = aspectRatio < 1;

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      {/* URL Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-card border border-border/50 rounded-xl">
        <div className="flex items-center gap-3 text-muted-foreground truncate mr-4">
          <Link2 className="w-4 h-4 shrink-0" />
          <span className="text-[13px] truncate">{url}</span>
        </div>
        <button 
          onClick={handleRemove}
          className="text-[13px] font-medium text-muted-foreground hover:text-foreground shrink-0 transition-colors"
        >
          Remove
        </button>
      </div>

      {/* Main Action */}
      <Button className="w-full h-12 bg-white hover:bg-white/90 text-black font-black text-[15px] rounded-xl shadow-lg transition-colors">
        Get clips in 1 click
      </Button>

      {/* Sub Header Options */}
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[12px] font-medium text-muted-foreground">
        <div className="flex items-center gap-1.5 cursor-pointer hover:text-foreground transition-colors">
          Speech language: <span className="font-bold text-foreground flex items-center gap-1">Indonesian <ChevronDown className="w-3.5 h-3.5" /></span>
        </div>
        <div className="flex items-center gap-1.5 cursor-pointer hover:text-foreground transition-colors underline underline-offset-4">
          Upload .SRT (optional)
        </div>
        <div className="flex items-center gap-1.5">
          Credit usage: <span className="text-amber-400 font-bold flex items-center gap-1"><Zap className="w-3.5 h-3.5 fill-amber-400" /> 11</span>
          <Info className="w-3.5 h-3.5 ml-0.5" />
        </div>
      </div>

      {/* Video Preview */}
      <div 
        className={`relative w-full mx-auto rounded-3xl overflow-hidden border border-border/50 bg-black shadow-2xl transition-all duration-500`}
        style={{ 
          maxWidth: isPortrait ? '200px' : '400px',
          aspectRatio: `${videoInfo.width} / ${videoInfo.height}` 
        }}
      >
        {videoInfo.loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-muted/20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="text-[12px] font-bold text-muted-foreground">Fetching metadata...</span>
          </div>
        ) : (
          <>
            <img 
              src={videoInfo.thumbnail} 
              alt={videoInfo.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-black text-white border border-white/10 uppercase tracking-widest">
              1080p
            </div>
          </>
        )}
      </div>

      <p className="text-center text-[11px] text-muted-foreground/80 max-w-lg mx-auto px-4">
        Using video you don't own may violate copyright laws. By continuing, you confirm this is your own original content.
      </p>

      {/* Settings Panel */}
      <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm mx-4 sm:mx-0">
        {/* Tabs */}
        <div className="flex border-b border-border/50">
          <button 
            onClick={() => setActiveTab("ai")}
            className={`flex-1 py-4 text-[13px] font-bold transition-all ${activeTab === "ai" ? "bg-muted/30 text-foreground border-b-2 border-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/10"}`}
          >
            AI clipping
          </button>
          <button 
            onClick={() => setActiveTab("dont")}
            className={`flex-1 py-4 text-[13px] font-bold transition-all border-l border-border/50 ${activeTab === "dont" ? "bg-muted/30 text-foreground border-b-2 border-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/10"}`}
          >
            Don't clip
          </button>
        </div>

        {activeTab === "ai" && (
          <div className="p-6 space-y-6 bg-muted/5">
            {/* Top Config Row */}
            <div className="grid grid-cols-2 md:flex md:flex-wrap items-center gap-6 text-[12px]">
              <div className="flex flex-col gap-1.5">
                <span className="text-muted-foreground font-medium">Clip model</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="font-bold text-foreground flex items-center gap-1 bg-muted/30 hover:bg-muted/50 px-2 py-1 rounded-md transition-colors outline-none">
                      {clipModel} <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="bg-card border-border/50">
                    {["Auto", "GPT-4o", "Claude 3.5 Sonnet", "Gemini 1.5 Pro"].map((model) => (
                      <DropdownMenuItem 
                        key={model} 
                        onClick={() => setClipModel(model)}
                        className="text-[12px] font-medium focus:bg-primary/10 focus:text-primary cursor-pointer"
                      >
                        {model}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-muted-foreground font-medium">Genre</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="font-bold text-foreground flex items-center gap-1 bg-muted/30 hover:bg-muted/50 px-2 py-1 rounded-md transition-colors outline-none">
                      {genre} <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="bg-card border-border/50">
                    {["Auto", "Educational", "Gaming", "Podcast", "Vlog", "Entertainment"].map((g) => (
                      <DropdownMenuItem 
                        key={g} 
                        onClick={() => setGenre(g)}
                        className="text-[12px] font-medium focus:bg-primary/10 focus:text-primary cursor-pointer"
                      >
                        {g}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-muted-foreground font-medium">Clip Length</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="font-bold text-foreground flex items-center gap-1 bg-muted/30 hover:bg-muted/50 px-2 py-1 rounded-md transition-colors outline-none">
                      {clipLength} <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="bg-card border-border/50">
                    {["Auto (0m-3m)", "Short (< 60s)", "Medium (1m-3m)", "Long (> 3m)"].map((len) => (
                      <DropdownMenuItem 
                        key={len} 
                        onClick={() => setClipLength(len)}
                        className="text-[12px] font-medium focus:bg-primary/10 focus:text-primary cursor-pointer"
                      >
                        {len}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex flex-col gap-1.5 md:ml-auto">
                <span className="text-muted-foreground font-medium">Auto hook</span>
                <div 
                  onClick={() => setAutoHook(!autoHook)}
                  className={`w-10 h-5 rounded-full border transition-all relative cursor-pointer ${
                    autoHook ? "bg-primary border-primary" : "bg-muted border-border/50 hover:bg-muted/80"
                  }`}
                >
                  <div className={`absolute top-[3px] w-3 h-3 rounded-full transition-all ${
                    autoHook ? "left-[21px] bg-white" : "left-[3px] bg-muted-foreground/40"
                  }`} />
                </div>
              </div>
            </div>

            {/* Prompt Input */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[12px]">
                <span className="font-black text-foreground uppercase tracking-tight">Include specific moments</span>
                <a href="#" className="text-primary hover:text-primary/80 underline underline-offset-2 font-bold">Not sure how to prompt? learn more</a>
              </div>
              <input 
                type="text" 
                placeholder="Example: find all the moments when someone scored" 
                className="w-full h-12 bg-card border border-border/50 rounded-xl px-4 text-[13px] text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all shadow-inner"
              />
            </div>

            {/* Timeline */}
            <div className="pt-2 space-y-4">
              <div className="flex items-center justify-between text-[12px]">
                <span className="font-black text-foreground uppercase tracking-tight">Processing timeframe</span>
                <span className="text-muted-foreground font-medium">Selected: <span className="text-primary font-bold">{formatTime(startTime)} - {formatTime(endTime)}</span></span>
              </div>
              
              <div className="px-1">
                <Slider 
                  value={timeframe} 
                  onValueChange={setTimeframe} 
                  max={100} 
                  step={1} 
                  className="py-4"
                />
              </div>

              <div className="flex justify-between items-center text-[12px] font-black text-foreground font-mono">
                <div className="bg-muted/50 border border-border/50 px-3 py-1.5 rounded-lg">{formatTime(0)}</div>
                <div className="w-full mx-4 h-[1px] bg-border/30" />
                <div className="bg-muted/50 border border-border/50 px-3 py-1.5 rounded-lg">{formatTime(duration)}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Presets Panel */}
      <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm mx-4 sm:mx-0">
        <div className="flex border-b border-border/50 px-6 pt-4 gap-8">
          <button className="pb-4 text-[13px] font-black text-foreground border-b-2 border-primary uppercase tracking-tight">
            Quick presets
          </button>
          <button className="pb-4 text-[13px] font-black text-muted-foreground hover:text-foreground transition-colors uppercase tracking-tight">
            My templates
          </button>
        </div>

        <div className="p-6 space-y-8">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Style preset</span>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all border border-border/30">
                <ChevronDown className="w-4 h-4 rotate-90" />
              </button>
              <button className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all border border-border/30">
                <ChevronDown className="w-4 h-4 -rotate-90" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {captionPresets.map((preset) => (
              <div key={preset.id} className="space-y-2 group">
                <div 
                  onClick={() => setActivePreset(preset.id)}
                  className={`relative aspect-[4/5] rounded-2xl bg-muted/10 border-2 flex items-center justify-center p-4 cursor-pointer transition-all duration-300 group-hover:scale-[1.02] ${activePreset === preset.id ? 'border-primary bg-primary/5 shadow-[0_15px_30px_-10px_rgba(var(--primary),0.2)]' : 'border-border/50 hover:border-border'}`}
                >
                  {preset.badge && (
                    <span className="absolute -top-2 -right-1 bg-primary text-primary-foreground text-[9px] font-black px-2 py-0.5 rounded-full shadow-lg border border-white/10 uppercase">
                      {preset.badge}
                    </span>
                  )}
                  <div className={`text-center font-black text-[13px] uppercase leading-tight tracking-tighter ${preset.textColor} drop-shadow-sm`}>
                    {preset.text}
                  </div>
                </div>
                <div className={`text-center text-[10px] font-bold transition-colors uppercase tracking-widest ${activePreset === preset.id ? 'text-primary' : 'text-muted-foreground'}`}>
                  {preset.name}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-4 border-t border-border/30">
            <span className="text-[12px] font-black uppercase tracking-tight text-muted-foreground">Choose aspect ratio</span>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/30 text-[12px] font-black text-primary hover:bg-primary/20 transition-all w-fit">
              <Smartphone className="w-4 h-4" />
              9:16 (Vertical)
              <ChevronDown className="w-4 h-4 opacity-50" />
            </button>
          </div>
        </div>
      </div>

      {/* Save Default Action */}
      <div className="flex justify-center px-4">
        <button className="w-full sm:w-auto px-8 py-3 text-[12px] font-black text-muted-foreground bg-muted/20 border border-border/50 rounded-xl hover:text-foreground hover:bg-muted/40 transition-all uppercase tracking-widest shadow-sm">
          Save settings above as default
        </button>
      </div>

    </div>
  );
}

export default function WorkflowPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-bold text-muted-foreground animate-pulse">Initializing workflow...</p>
        </div>
      </div>
    }>
      <WorkflowContent />
    </Suspense>
  );
}
