import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Play,
  Link2,
  Wand2,
  Share2,
  CheckCircle2,
  Check,
  Star,
  ScanFace,
  Captions,
  TrendingUp,
  Youtube,
  Instagram,
  Music2,
  Podcast,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex w-full flex-col pt-16">
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden px-6 py-16 lg:px-10 lg:py-24">
        {/* Background glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-primary/20 opacity-50 blur-[120px]" />

        <div className="mx-auto flex max-w-7xl flex-col gap-12 lg:flex-row lg:items-center">
          {/* Content */}
          <div className="flex flex-1 flex-col gap-8 lg:pr-10">
            <div className="flex flex-col gap-5 text-left">
              {/* Badge */}
              <div className="inline-flex items-center self-start rounded-full border border-primary/30 bg-primary/10 px-3 py-1">
                <Sparkles className="mr-2 size-4 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                  AI-Powered Magic
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl font-black leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl">
                Turn Long Videos into{" "}
                <span className="bg-gradient-to-r from-primary to-indigo-300 bg-clip-text text-transparent dark:to-indigo-300">
                  Viral Clips
                </span>{" "}
                in Seconds
              </h1>

              {/* Subtitle */}
              <p className="max-w-[600px] text-lg leading-relaxed text-muted-foreground">
                Stop editing manually. Our AI automatically identifies the most engaging moments
                from your footage and reformats them for TikTok, Reels, and Shorts.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/auth/signup"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-base font-bold text-primary-foreground shadow-[0_4px_20px_color-mix(in_srgb,var(--primary)_40%,transparent)] transition-all hover:scale-105 hover:opacity-90"
              >
                Get Started for Free
                <ArrowRight className="ml-2 size-5" />
              </Link>
              <button className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-card px-8 text-base font-bold text-foreground transition-all hover:bg-accent">
                <Play className="mr-2 size-5" />
                Watch Demo
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="size-4.5 text-green-500" />
              <span>No credit card required</span>
              <span className="mx-2 text-border">|</span>
              <CheckCircle2 className="size-4.5 text-green-500" />
              <span>4K Export available</span>
            </div>
          </div>

          {/* Hero Visual / App Mockup */}
          <div className="relative flex flex-1 items-center justify-center lg:justify-end">
            <div className="relative aspect-[4/3] w-full max-w-[600px] rounded-xl border border-border bg-card/50 p-2 shadow-2xl backdrop-blur-sm">
              <div className="relative h-full w-full overflow-hidden rounded-lg bg-background">
                {/* Top Bar */}
                <div className="absolute top-0 flex h-10 w-full items-center gap-2 border-b border-border bg-card px-4">
                  <div className="size-3 rounded-full bg-destructive/50" />
                  <div className="size-3 rounded-full bg-warning/50" />
                  <div className="size-3 rounded-full bg-success/50" />
                </div>

                {/* Main Content */}
                <div className="absolute bottom-0 top-10 flex w-full">
                  {/* Sidebar */}
                  <div className="hidden w-16 flex-col items-center gap-4 border-r border-border bg-card py-4 sm:flex">
                    <div className="size-8 rounded bg-primary/20" />
                    <div className="size-8 rounded bg-muted" />
                    <div className="size-8 rounded bg-muted" />
                  </div>

                  {/* Stage */}
                  <div className="relative flex flex-1 items-center justify-center overflow-hidden p-6">
                    {/* Floating Clips */}
                    <div className="relative z-10 flex items-center justify-center gap-4">
                      {/* Left clip */}
                      <div className="relative h-[180px] w-[100px] -rotate-6 overflow-hidden rounded-lg border-2 border-primary bg-gradient-to-br from-card to-muted shadow-[0_0_30px_color-mix(in_srgb,var(--primary)_30%,transparent)] transition-transform duration-500 hover:rotate-0 sm:h-[213px] sm:w-[120px]">
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                          <Play className="size-8 text-primary/60" />
                        </div>
                        <div className="absolute bottom-3 left-2 right-2">
                          <div className="rounded bg-background/70 p-1 text-center text-[8px] font-bold text-foreground backdrop-blur-sm">
                            &quot;This changed everything!&quot;
                          </div>
                        </div>
                        <div className="absolute right-2 top-2 rounded bg-primary px-1.5 py-0.5 text-[8px] font-bold text-primary-foreground">
                          98%
                        </div>
                      </div>

                      {/* Center clip (main) */}
                      <div className="relative z-20 h-[210px] w-[120px] scale-110 overflow-hidden rounded-lg border-2 border-primary bg-gradient-to-br from-card to-muted shadow-[0_0_40px_color-mix(in_srgb,var(--primary)_50%,transparent)] transition-transform duration-500 hover:scale-[1.15] sm:h-[248px] sm:w-[140px]">
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/30 to-primary/10">
                          <Wand2 className="size-10 text-primary/70" />
                        </div>
                        <div className="absolute bottom-5 left-3 right-3">
                          <div className="rounded-lg bg-background/80 p-2 text-center text-[10px] font-bold leading-tight text-foreground backdrop-blur-md">
                            <span className="text-yellow-400 dark:text-yellow-300">
                              AI clipped this
                            </span>{" "}
                            automatically!
                          </div>
                        </div>
                        <div className="absolute right-3 top-3 rounded bg-green-500 px-2 py-1 text-[10px] font-bold text-white">
                          Viral Pick
                        </div>
                      </div>

                      {/* Right clip */}
                      <div className="relative h-[180px] w-[100px] rotate-6 overflow-hidden rounded-lg border-2 border-primary bg-gradient-to-br from-card to-muted shadow-[0_0_30px_color-mix(in_srgb,var(--primary)_30%,transparent)] transition-transform duration-500 hover:rotate-0 sm:h-[213px] sm:w-[120px]">
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                          <Share2 className="size-8 text-primary/60" />
                        </div>
                        <div className="absolute bottom-3 left-2 right-2">
                          <div className="rounded bg-background/70 p-1 text-center text-[8px] font-bold text-foreground backdrop-blur-sm">
                            Subscribe for more tips
                          </div>
                        </div>
                        <div className="absolute right-2 top-2 rounded bg-primary px-1.5 py-0.5 text-[8px] font-bold text-primary-foreground">
                          92%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SOCIAL PROOF ===== */}
      <section className="border-y border-border bg-muted py-10">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="mb-8 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Trusted by 10,000+ Creators &amp; Podcasts
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0 sm:gap-12">
            <div className="flex items-center gap-2 text-xl font-bold text-foreground">
              <Youtube className="size-6 text-red-500" />
              YouTube
            </div>
            <div className="flex items-center gap-2 text-xl font-bold text-foreground">
              <Music2 className="size-6 text-pink-500" />
              TikTok
            </div>
            <div className="flex items-center gap-2 text-xl font-bold text-foreground">
              <Instagram className="size-6 text-purple-500" />
              Instagram
            </div>
            <div className="flex items-center gap-2 text-xl font-bold text-foreground">
              <Podcast className="size-6 text-green-500" />
              Spotify
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="px-6 py-20 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-12">
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Go from long-form to short-form in <span className="text-primary">3 steps</span>
            </h2>
            <p className="max-w-[720px] text-lg text-muted-foreground">
              Our intelligent algorithms do the heavy lifting. You just paste a link, and we handle
              the rest.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Step 1 */}
            <div className="group relative flex flex-col gap-6 rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-[0_0_30px_color-mix(in_srgb,var(--primary)_10%,transparent)]">
              <div className="absolute -left-4 -top-4 flex size-10 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground shadow-lg">
                1
              </div>
              <div className="flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                <Link2 className="size-7" />
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="text-xl font-bold text-foreground">Paste URL or Upload</h3>
                <p className="leading-relaxed text-muted-foreground">
                  Simply drop in a YouTube link or upload your raw MP4/MOV footage directly to our
                  secure cloud.
                </p>
              </div>
            </div>

            {/* Step 2 (highlighted) */}
            <div className="group relative flex flex-col gap-6 rounded-2xl border border-primary/40 bg-card p-8 shadow-[0_0_20px_color-mix(in_srgb,var(--primary)_15%,transparent)] transition-all hover:border-primary hover:shadow-[0_0_40px_color-mix(in_srgb,var(--primary)_25%,transparent)]">
              <div className="absolute -left-4 -top-4 flex size-10 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground shadow-lg">
                2
              </div>
              <div className="flex size-14 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg transition-transform duration-300 group-hover:scale-110">
                <Sparkles className="size-7 animate-pulse" />
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="text-xl font-bold text-foreground">AI Analysis &amp; Clipping</h3>
                <p className="leading-relaxed text-muted-foreground">
                  Our AI scans your video for viral triggers, funny moments, and hooks, then crops
                  them vertically automatically.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="group relative flex flex-col gap-6 rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-[0_0_30px_color-mix(in_srgb,var(--primary)_10%,transparent)]">
              <div className="absolute -left-4 -top-4 flex size-10 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground shadow-lg">
                3
              </div>
              <div className="flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                <Share2 className="size-7" />
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="text-xl font-bold text-foreground">Edit Captions &amp; Export</h3>
                <p className="leading-relaxed text-muted-foreground">
                  Customize your AI-generated captions, add your branding watermark, and export in
                  4K quality instantly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="bg-muted px-6 py-20 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-16 lg:flex-row lg:items-center">
          {/* Feature List */}
          <div className="flex flex-1 flex-col gap-8">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              Why creators choose Clipper
            </h2>
            <div className="flex flex-col gap-6">
              {[
                {
                  icon: ScanFace,
                  title: "Face-Tracking Technology",
                  desc: "Keeps the speaker centered in the vertical frame automatically, even if they move around.",
                },
                {
                  icon: Captions,
                  title: "Dynamic Captions",
                  desc: "Burn in Hormozi-style captions with one click. 95% accuracy on transcription.",
                },
                {
                  icon: TrendingUp,
                  title: "Virality Score",
                  desc: "Our AI assigns a score to each clip based on hook strength and topic relevance.",
                },
              ].map((f) => (
                <div key={f.title} className="flex gap-4">
                  <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-green-500/20 text-green-500">
                    <Check className="size-4" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-foreground">{f.title}</h4>
                    <p className="text-muted-foreground">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Video Mockup */}
          <div className="relative flex-1">
            <div className="absolute inset-0 rounded-full bg-primary/20 opacity-30 blur-3xl" />
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-transparent">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary shadow-[0_0_20px_color-mix(in_srgb,var(--primary)_60%,transparent)] transition-transform hover:scale-110">
                    <Play className="ml-0.5 size-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">See it in action</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section id="testimonials" className="px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
            Loved by modern creators
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                quote:
                  '"I used to spend 10 hours a week clipping my podcast. Clipper does it in 10 minutes. The face tracking is honestly magic."',
                name: "Michael T.",
                role: "Tech YouTuber (150K Subs)",
              },
              {
                quote:
                  '"The virality score feature is a game changer. It helps me choose which clips to post first. My TikTok engagement is up 300%."',
                name: "Sarah L.",
                role: "Podcast Host",
              },
              {
                quote:
                  '"Finally, an AI tool that actually understands context. The clips aren\'t just random cuts, they have a beginning, middle, and end."',
                name: "David K.",
                role: "Content Strategist",
              },
            ].map((t) => (
              <div
                key={t.name}
                className="rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Stars */}
                <div className="mb-4 flex gap-1 text-yellow-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-5 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="mb-6 leading-relaxed text-muted-foreground">{t.quote}</p>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
                    {t.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <div className="font-bold text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-7xl rounded-3xl bg-gradient-to-br from-primary to-primary/70 p-12 text-center shadow-2xl">
          <h2 className="mb-4 text-3xl font-black text-primary-foreground md:text-5xl">
            Ready to go viral?
          </h2>
          <p className="mb-8 text-lg font-medium text-primary-foreground/80">
            Join 10,000+ creators saving hours every single week.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/auth/signup"
              className="inline-flex h-12 min-w-[160px] items-center justify-center rounded-lg bg-background px-6 text-base font-bold text-primary shadow-lg transition-transform hover:scale-105"
            >
              Get Started for Free
            </Link>
            <Link
              href="#"
              className="inline-flex h-12 min-w-[160px] items-center justify-center rounded-lg border-2 border-primary-foreground/30 bg-transparent px-6 text-base font-bold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              View Pricing
            </Link>
          </div>
          <p className="mt-6 text-xs text-primary-foreground/60">
            Free forever plan available. No credit card required.
          </p>
        </div>
      </section>
    </div>
  );
}
