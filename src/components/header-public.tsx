import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Scissors, Menu } from "lucide-react";

export const HeaderPublic = async () => {
  const session = await getServerSession(authOptions);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
            <Scissors className="size-4" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">Clipper</span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-8">
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              How It Works
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Testimonials
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <ModeToggle />
            <Link
              href={session ? "/dashboard" : "/auth/signin"}
              className="hidden items-center justify-center rounded-lg border border-border bg-transparent px-4 py-2 text-sm font-semibold text-foreground transition-all hover:bg-accent sm:inline-flex"
            >
              {session ? "Dashboard" : "Sign In"}
            </Link>
            {!session && (
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[0_0_15px_var(--primary)] transition-all hover:opacity-90"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
