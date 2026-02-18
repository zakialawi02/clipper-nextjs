import Link from "next/link";
import { Scissors, Github, Twitter, Mail } from "lucide-react";

const productLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#", label: "Pricing" },
  { href: "#", label: "Integrations" },
];

const resourceLinks = [
  { href: "#", label: "Blog" },
  { href: "#", label: "Community" },
  { href: "#", label: "Help Center" },
];

const legalLinks = [
  { href: "#", label: "Privacy" },
  { href: "#", label: "Terms" },
];

export const FooterPublic = () => {
  return (
    <footer className="border-t border-border bg-card py-12 text-sm">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 md:flex-row md:justify-between">
        {/* Brand */}
        <div className="flex max-w-xs flex-col gap-4">
          <div className="flex items-center gap-2 text-foreground">
            <div className="flex size-6 items-center justify-center rounded bg-primary/20 text-primary">
              <Scissors className="size-3.5" />
            </div>
            <span className="font-bold">Clipper</span>
          </div>
          <p className="text-muted-foreground">
            The #1 AI tool for repurposing long-form video content into short viral clips.
          </p>
        </div>

        {/* Link Columns */}
        <div className="flex flex-wrap gap-12">
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-foreground">Product</h4>
            {productLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-foreground">Resources</h4>
            {resourceLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-foreground">Legal</h4>
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mx-auto mt-12 flex w-full max-w-7xl flex-col items-center justify-between gap-4 border-t border-border px-6 pt-8 text-muted-foreground md:flex-row">
        <p>&copy; {new Date().getFullYear()} Clipper Inc. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="#" className="transition-colors hover:text-foreground">
            <Github className="size-5" />
          </Link>
          <Link href="#" className="transition-colors hover:text-foreground">
            <Twitter className="size-5" />
          </Link>
          <Link href="#" className="transition-colors hover:text-foreground">
            <Mail className="size-5" />
          </Link>
        </div>
      </div>
    </footer>
  );
};
