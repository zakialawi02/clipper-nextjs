import IORedis from "ioredis";
import { env } from "@/env";

export const connection = new IORedis(env.BULLMQ_REDIS_URL, {
  maxRetriesPerRequest: null,
  enableOfflineQueue: false,
});
