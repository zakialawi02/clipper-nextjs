"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Captions,
  Scissors,
  AudioLines,
  Maximize,
  Clapperboard,
  Mic2,
  Upload,
  HardDrive,
  Link2,
  MoreHorizontal,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const features = [
  { icon: Sparkles, label: "Long to shorts", color: "text-amber-400" },
  { icon: Captions, label: "AI Captions", color: "text-emerald-400" },
  { icon: Scissors, label: "Video editor", color: "text-blue-400" },
  { icon: AudioLines, label: "Enhance speech", color: "text-sky-400" },
  { icon: Maximize, label: "AI Reframe", color: "text-indigo-400" },
  { icon: Clapperboard, label: "AI B-Roll", color: "text-violet-400" },
  { icon: Mic2, label: "AI hook", color: "text-orange-400" },
];

const projects = [
  {
    id: 1,
    title: "24 Hours with Danny Duncan (...",
    thumbnail:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=300&h=170&fit=crop",
    tags: ["Free Plan", "Demo"],
    description: "Demo project",
  },
  {
    id: 2,
    title: "Curry Drills 12 Threes Including...",
    thumbnail:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=300&h=170&fit=crop",
    tags: ["Free Plan", "Demo"],
    description: "Demo project",
  },
  {
    id: 3,
    title: "Tal Wilkenfeld: Music, Guitar, B...",
    thumbnail:
      "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=300&h=170&fit=crop",
    tags: ["Free Plan", "Demo"],
    description: "Demo project",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [autoSave, setAutoSave] = useState(true);
  const [autoImport, setAutoImport] = useState(false);
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleClip = () => {
    if (!url.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      router.push(`/workflow?url=${encodeURIComponent(url)}`);
    }, 1500);
  };

  return (
    <div className="space-y-12">
      {/* Top Banner */}
      <div className="flex items-center justify-center gap-4 px-6 py-3 bg-muted/50 border border-border/50 rounded-2xl w-full">
        <p className="text-[13px] font-medium text-muted-foreground">
          You are using the Free Plan of OpusClip with watermark and limited features.
        </p>
        <Button
          size="sm"
          className="h-8 rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground text-[12px] font-bold border-none px-4"
        >
          Upgrade
        </Button>
      </div>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center py-10 overflow-hidden min-h-[400px]">
        {/* Input Box Container */}
        <div className="relative z-10 w-full max-w-[580px] space-y-8">
          <div className="relative w-full max-w-2xl mx-auto group">
            {/* Outer Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 via-indigo-500/20 to-primary/50 rounded-[2rem] blur-xl opacity-10 group-hover:opacity-30 transition-opacity duration-1000 animate-pulse" />

            {/* Main Glass Card */}
            <div className="relative backdrop-blur-3xl bg-card/40 border border-border/50 rounded-[1.8rem] p-7 shadow-2xl space-y-6 overflow-hidden">
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none" />

              <div className="space-y-1">
                <h2 className="text-lg font-black text-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Smart URL Processor
                </h2>
                <p className="text-[12px] text-muted-foreground font-medium tracking-tight">
                  Enter a video link to unleash AI magic
                </p>
              </div>

              <div className="space-y-5">
                <div className="relative group/input">
                  <div
                    className={`absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-0 group-focus-within/input:opacity-20 transition-opacity duration-500`}
                  />
                  <div className="relative">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                      <Link2 className="w-4 h-4 text-muted-foreground/30 group-focus-within/input:text-primary transition-colors duration-300" />
                    </div>
                    <input
                      type="text"
                      placeholder="Paste YouTube, Twitch, or Vimeo link..."
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full h-14 bg-muted/20 border border-border/50 rounded-xl pl-14 pr-6 text-[14px] font-semibold text-foreground placeholder:text-muted-foreground/30 outline-none focus:border-primary/30 focus:bg-muted/30 transition-all duration-300"
                    />
                    {/* Glowing status dot */}
                    <div className="absolute right-5 top-1/2 -translate-y-1/2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_var(--primary)]" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <Button 
                    onClick={handleClip}
                    disabled={isLoading || !url.trim()}
                    className="group/btn relative h-14 w-full bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-500 text-white font-black text-base rounded-xl transition-all duration-500 overflow-hidden shadow-[0_10px_30px_-10px_rgba(99,102,241,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                    <span className="relative flex items-center justify-center gap-2">
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Get Clips in 1 Click
                          <motion.div
                            animate={{ x: [0, 4, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                          >
                            <ArrowRight className="w-4 h-4" />
                          </motion.div>
                        </>
                      )}
                    </span>
                  </Button>

                  <div className="flex items-center justify-center gap-5">
                    <a
                      href="#"
                      className="text-[10px] text-muted-foreground/60 hover:text-foreground underline underline-offset-4 transition-colors font-bold uppercase tracking-widest"
                    >
                      Sample Project
                    </a>
                    <div className="w-1 h-1 rounded-full bg-border/30" />
                    <span className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-widest">
                      100+ platforms supported
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Icons */}
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 pt-4">
            {features.map((feature) => (
              <div
                key={feature.label}
                className="flex flex-col items-center gap-3 group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-muted/30 border border-border/50 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-muted/50 group-hover:border-primary/50">
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <span className="text-[11px] font-bold text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-widest">
                  {feature.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-6 border-b border-white/5 pb-6">
          <div className="flex items-center gap-6 border-b border-border">
            <button className="relative pb-4 text-[14px] font-black text-foreground">
              Projects (3)
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />
            </button>
            <button className="pb-4 text-[14px] font-bold text-muted-foreground hover:text-foreground transition-colors">
              Saved projects (0)
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-8">
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-black text-white/60 tracking-wider">0 GB</span>
              <span className="text-[12px] font-bold text-white/20">/</span>
              <span className="text-[12px] font-black text-white/60 tracking-wider">0 GB</span>
            </div>

            <div className="flex items-center gap-3">
              <div
                onClick={() => setAutoSave(!autoSave)}
                className={`flex items-center gap-2.5 px-4 py-2 rounded-xl bg-muted/30 border border-border/50 cursor-pointer transition-all hover:bg-muted/50 ${autoSave ? "border-primary/50 bg-primary/10" : ""}`}
              >
                <div
                  className={`w-2 h-2 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all ${autoSave ? "bg-primary shadow-[0_0_8px_var(--primary)]" : "bg-muted-foreground/30"}`}
                />
                <span className="text-[12px] font-black uppercase tracking-tight text-foreground/80">
                  Auto-save
                </span>
              </div>

              <div
                onClick={() => setAutoImport(!autoImport)}
                className={`flex items-center gap-2.5 px-4 py-2 rounded-xl bg-muted/30 border border-border/50 cursor-pointer transition-all hover:bg-muted/50 ${autoImport ? "border-primary/50 bg-primary/10" : ""}`}
              >
                <div
                  className={`w-2 h-2 rounded-full transition-all ${autoImport ? "bg-primary" : "bg-muted-foreground/30"}`}
                />
                <span className="text-[12px] font-black flex items-center gap-2 uppercase tracking-tight text-foreground/80">
                  Auto-import{" "}
                  <span className="text-[9px] bg-primary/20 px-1.5 py-0.5 rounded-md text-primary font-bold tracking-normal">
                    App BETA
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pt-4">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="group relative bg-card/30 border border-white/5 rounded-3xl overflow-hidden cursor-pointer transition-all hover:border-white/10 hover:shadow-2xl"
            >
              {/* Thumbnail */}
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-xl text-[10px] font-black text-white border border-white/10 uppercase tracking-tighter"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white/80">
                      {project.description}
                    </span>
                    <MoreHorizontal className="w-5 h-5 text-white/60 hover:text-white transition-colors" />
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="p-5 space-y-1.5">
                <h3 className="text-[14px] font-black truncate group-hover:text-white transition-colors tracking-tight">
                  {project.title}
                </h3>
                <p className="text-[12px] text-white/30 font-bold uppercase tracking-widest leading-none">
                  Demo project
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
