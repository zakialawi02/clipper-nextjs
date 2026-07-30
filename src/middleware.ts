import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimitMiddleware } from "@/lib/middleware/rate-limit";
import { securityMiddleware } from "@/lib/middleware/security";

export function middleware(request: NextRequest) {
  // Rate limiting
  const rateLimitResponse = rateLimitMiddleware(request);
  if (rateLimitResponse) return rateLimitResponse;

  // Security headers
  const response = NextResponse.next();
  return securityMiddleware(request, response);
}

export const config = {
  matcher: [
    // Apply to all routes except static files and _next
    "/((?!_next/static|_next/image|favicon.ico|assets/).*)",
  ],
};
