import { HeaderPublic } from "@/components/header-public";
import { Suspense } from "react";
import Loading from "../loading";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <HeaderPublic />
      <Suspense fallback={<Loading />}>
        <main className="flex-1">{children}</main>
      </Suspense>
    </div>
  );
}
