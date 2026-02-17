import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-16">
      <section className="space-y-6 text-center sm:text-left">
        <span className="inline-flex items-center rounded-full border border-border bg-background px-4 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Secure Authentication Boilerplate
        </span>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Jumpstart your Next.js app with ready-to-use authentication and admin tooling.
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          A modern template powered by NextAuth, Prisma, and Tailwind CSS. Start with a polished
          public landing page and a secure admin dashboard that works out of the box.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/auth"
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
          >
            Get Started
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-md border border-border bg-background px-5 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:bg-accent hover:text-accent-foreground"
          >
            View Dashboard
          </Link>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: "Prisma-powered database",
            description:
              "Type-safe models and migrations for storing users, sessions, and application data with ease.",
          },
          {
            title: "NextAuth integration",
            description:
              "OAuth providers and session management are preconfigured so you can focus on your product.",
          },
          {
            title: "Admin dashboard",
            description:
              "A protected area with reusable layout components for authenticated workflows and management tools.",
          },
        ].map((feature) => (
          <article
            key={feature.title}
            className="rounded-xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <h3 className="text-lg font-semibold text-card-foreground">{feature.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
