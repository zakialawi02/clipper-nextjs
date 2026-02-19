import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

import { SignInButton } from "@/components/auth-buttons";
import { authOptions, configuredAuthProviders } from "@/lib/auth";

export default async function SignUpPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    return redirect("/app");
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Get started with AI Video Clipper
          </h1>
          <p className="text-sm text-muted-foreground">
            Create an account to start clipping videos with AI.
          </p>
        </div>

        {/* Provider Buttons */}
        <div className="space-y-3 pt-4">
          {configuredAuthProviders.map((provider) => (
            <SignInButton
              key={provider.id}
              provider={provider.id}
              label={`Continue with ${provider.name}`}
            />
          ))}
        </div>

        {/* Switch to Sign In */}
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Sign in
          </Link>
        </p>

        {/* Footer Links */}
        <div className="flex items-center justify-center gap-4 pt-2 text-xs text-muted-foreground">
          <Link href="/terms" className="transition-colors hover:text-foreground">
            Terms of Service
          </Link>
          <span className="text-border">·</span>
          <Link href="/privacy" className="transition-colors hover:text-foreground">
            Privacy Policy
          </Link>
          <span className="text-border">·</span>
          <Link href="/" className="transition-colors hover:text-foreground">
            Help
          </Link>
        </div>
      </div>
    </div>
  );
}
