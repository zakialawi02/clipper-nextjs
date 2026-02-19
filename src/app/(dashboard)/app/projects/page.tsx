import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  PlayCircle,
  GraduationCap,
  Video,
  Film,
  ArrowRight,
  Camera,
} from "lucide-react";

const quickStartItems = [
  {
    title: "Demo Project",
    description: "See how it works with a sample video.",
    icon: GraduationCap,
    iconColor: "text-primary",
    iconBg: "bg-primary/15",
  },
  {
    title: "Video Tutorial",
    description: "Watch a quick guide on cutting clips.",
    icon: Video,
    iconColor: "text-purple-400",
    iconBg: "bg-purple-400/15",
  },
  {
    title: "Sample Clips",
    description: "View examples of viral shorts created.",
    icon: Film,
    iconColor: "text-amber-400",
    iconBg: "bg-amber-400/15",
  },
];

export default function ProjectsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
      {/* Empty State Container */}
      <div className="flex flex-col items-center max-w-xl mx-auto text-center">
        {/* Avatar Area */}
        <div className="relative mb-8">
          <div className="w-28 h-28 rounded-2xl bg-card border border-border flex flex-col items-center justify-center gap-1 shadow-lg">
            <span className="text-xs font-semibold text-primary tracking-wider">✦Ai</span>
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Camera className="w-5 h-5 text-primary" />
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-foreground mb-3">No projects yet</h1>

        {/* Description */}
        <p className="text-muted-foreground leading-relaxed mb-8 max-w-md">
          Your dashboard is looking a little empty. Start by uploading a long-form video, and watch
          our AI turn it into viral clips in seconds.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <Button size="lg" className="rounded-full px-8 py-6 text-base gap-3">
            <PlusCircle className="w-5 h-5" />
            Create your first project
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="rounded-full px-6 py-6 text-base gap-3 text-muted-foreground hover:text-foreground"
          >
            <PlayCircle className="w-5 h-5" />
            Watch Tutorial
          </Button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 w-full mb-8">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs font-medium text-muted-foreground tracking-[0.2em] uppercase">
            Or try a quick start
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Quick Start Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          {quickStartItems.map((item) => (
            <button
              key={item.title}
              className="group relative flex flex-col items-start gap-3 p-5 rounded-xl bg-card border border-border hover:border-primary/40 transition-all duration-200 text-left hover:shadow-md hover:shadow-primary/5"
            >
              <div className="flex items-center justify-between w-full">
                <div
                  className={`w-10 h-10 rounded-lg ${item.iconBg} flex items-center justify-center`}
                >
                  <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">{item.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
