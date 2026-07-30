import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import IORedis from "ioredis";

export async function GET() {
  const checks: Record<string, string> = {};

  // Check database
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = "ok";
  } catch {
    checks.database = "error";
  }

  // Check BullMQ Redis
  try {
    const redis = new IORedis(process.env.BULLMQ_REDIS_URL ?? "redis://localhost:6380");
    await redis.ping();
    redis.disconnect();
    checks.redis = "ok";
  } catch {
    checks.redis = "error";
  }

  const allOk = Object.values(checks).every((v) => v === "ok");

  return NextResponse.json(
    {
      status: allOk ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      checks,
    },
    { status: allOk ? 200 : 503 }
  );
}
