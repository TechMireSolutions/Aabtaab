import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "@/lib/env";
import { clientIpFromRequest } from "@/lib/request-ip";

export { clientIpFromRequest };

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 5;

let upstashLimiter: Ratelimit | null = null;
const memoryHits = new Map<string, { count: number; resetAt: number }>();

function getUpstashLimiter(): Ratelimit | null {
  const url = env.UPSTASH_REDIS_REST_URL;
  const token = env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  if (!upstashLimiter) {
    upstashLimiter = new Ratelimit({
      redis: new Redis({
        url,
        token,
      }),
      limiter: Ratelimit.slidingWindow(MAX_REQUESTS, "15 m"),
      prefix: "aabtaab:contact",
    });
  }
  return upstashLimiter;
}

function checkMemoryLimit(key: string): boolean {
  const now = Date.now();
  const entry = memoryHits.get(key);

  if (!entry || now > entry.resetAt) {
    memoryHits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= MAX_REQUESTS) {
    return false;
  }

  entry.count += 1;
  return true;
}

export async function checkContactRateLimit(
  identifier: string,
): Promise<{ allowed: boolean }> {
  const limiter = getUpstashLimiter();

  if (limiter) {
    const { success } = await limiter.limit(identifier);
    return { allowed: success };
  }

  return { allowed: checkMemoryLimit(identifier) };
}
