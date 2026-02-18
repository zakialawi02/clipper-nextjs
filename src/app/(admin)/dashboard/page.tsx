import { Button } from "@/components/ui/button";
import {
  Film,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Filter,
  ArrowDownUp,
  Play,
  Circle,
  Triangle,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";

const stats = [
  {
    title: "Total Clips",
    value: "1,248",
    subtitle: "↗12% vs last month",
    subtitleColor: "text-emerald-400",
    icon: Film,
    iconColor: "text-primary",
    iconBg: "bg-primary/15",
  },
  {
    title: "Processing",
    value: "3",
    subtitle: "Est. completion: 5 mins",
    subtitleColor: "text-muted-foreground",
    icon: RefreshCw,
    iconColor: "text-purple-400",
    iconBg: "bg-purple-400/15",
  },
  {
    title: "Credits Left",
    value: "450",
    subtitle: "progress",
    subtitleColor: "",
    icon: Zap,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-400/15",
  },
  {
    title: "Avg. Engagement",
    value: "8.4%",
    subtitle: "↗2.1% vs last month",
    subtitleColor: "text-emerald-400",
    icon: Sparkles,
    iconColor: "text-purple-400",
    iconBg: "bg-purple-400/15",
  },
];

type ProjectStatus = "Ready" | "Processing" | "Failed";

const projects = [
  {
    name: "Tech Talk Episode 44",
    category: "Podcast Series",
    duration: "02:30",
    status: "Ready" as ProjectStatus,
    date: "Oct 24, 2023",
    thumbnailIcon: Play,
    thumbnailColor: "bg-purple-500/20 text-purple-400",
  },
  {
    name: "Product Demo V2",
    category: "Marketing Clips",
    duration: "05:15",
    status: "Processing" as ProjectStatus,
    date: "Oct 24, 2023",
    thumbnailIcon: Circle,
    thumbnailColor: "bg-primary/20 text-primary",
  },
  {
    name: "Stream Highlight #401",
    category: "Twitch Exports",
    duration: "00:45",
    status: "Failed" as ProjectStatus,
    date: "Oct 23, 2023",
    thumbnailIcon: Triangle,
    thumbnailColor: "bg-red-500/20 text-red-400",
  },
  {
    name: "CEO Interview - Q3",
    category: "Internal Comms",
    duration: "12:00",
    status: "Ready" as ProjectStatus,
    date: "Oct 22, 2023",
    thumbnailIcon: Play,
    thumbnailColor: "bg-muted text-muted-foreground",
  },
  {
    name: "Travel Vlog: Japan",
    category: "YouTube Shorts",
    duration: "00:58",
    status: "Ready" as ProjectStatus,
    date: "Oct 21, 2023",
    thumbnailIcon: Play,
    thumbnailColor: "bg-emerald-500/20 text-emerald-400",
  },
];

const statusConfig: Record<
  ProjectStatus,
  { label: string; dotColor: string; bgColor: string; textColor: string }
> = {
  Ready: {
    label: "Ready",
    dotColor: "bg-emerald-400",
    bgColor: "bg-emerald-400/10",
    textColor: "text-emerald-400",
  },
  Processing: {
    label: "Processing",
    dotColor: "bg-amber-400",
    bgColor: "bg-amber-400/10",
    textColor: "text-amber-400",
  },
  Failed: {
    label: "Failed",
    dotColor: "bg-red-400",
    bgColor: "bg-red-400/10",
    textColor: "text-red-400",
  },
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-xl bg-card border border-border p-5 flex items-start justify-between"
          >
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
              <p className="text-3xl font-bold text-foreground tracking-tight">{stat.value}</p>
              {stat.subtitle === "progress" ? (
                <div className="w-full">
                  <div className="h-1.5 w-32 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-400" style={{ width: "60%" }} />
                  </div>
                </div>
              ) : (
                <p className={`text-xs ${stat.subtitleColor}`}>{stat.subtitle}</p>
              )}
            </div>
            <div
              className={`w-10 h-10 rounded-lg ${stat.iconBg} flex items-center justify-center shrink-0`}
            >
              <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Projects */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Recent Projects</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 bg-transparent">
              <Filter className="w-3.5 h-3.5" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 bg-transparent">
              <ArrowDownUp className="w-3.5 h-3.5" />
              Sort
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[80px_1fr_100px_120px_140px_60px] items-center px-5 py-3 border-b border-border">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Thumbnail
            </span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Project Name
            </span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Duration
            </span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Status
            </span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Date Created
            </span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider text-right">
              Actions
            </span>
          </div>

          {/* Table Rows */}
          {projects.map((project) => {
            const status = statusConfig[project.status];
            return (
              <div
                key={project.name}
                className="grid grid-cols-[80px_1fr_100px_120px_140px_60px] items-center px-5 py-4 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
              >
                {/* Thumbnail */}
                <div>
                  <div
                    className={`w-12 h-12 rounded-xl ${project.thumbnailColor} flex items-center justify-center`}
                  >
                    <project.thumbnailIcon className="w-5 h-5" />
                  </div>
                </div>

                {/* Project Name */}
                <div>
                  <p className="text-sm font-medium text-foreground">{project.name}</p>
                  <p className="text-xs text-muted-foreground">{project.category}</p>
                </div>

                {/* Duration */}
                <p className="text-sm text-muted-foreground font-mono">{project.duration}</p>

                {/* Status */}
                <div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.textColor}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${status.dotColor}`} />
                    {status.label}
                  </span>
                </div>

                {/* Date */}
                <p className="text-sm text-muted-foreground">{project.date}</p>

                {/* Actions */}
                <div className="flex justify-end">
                  {project.status === "Failed" ? (
                    <button className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  ) : (
                    <button className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-border">
            <p className="text-sm text-muted-foreground">Showing 1-5 of 124 projects</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                <ChevronLeft className="w-3.5 h-3.5" />
                Previous
              </Button>
              <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
