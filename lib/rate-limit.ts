import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import * as Sentry from "@sentry/nextjs";
import { env } from "@/lib/env";
import { clientIpFromRequest } from "@/lib/request-ip";

export { clientIpFromRequest };

const CONTACT_WINDOW_MS = 15 * 60 * 1000;
const CONTACT_MAX = 5;

const SEARCH_WINDOW_MS = 60 * 1000;
const SEARCH_MAX = 60;

let contactUpstashLimiter: Ratelimit | null = null;
let searchUpstashLimiter: Ratelimit | null = null;
const memoryHits = new Map<string, { count: number; resetAt: number }>();

function getRedis(): Redis | null {
  const url = env.UPSTASH_REDIS_REST_URL;
  const token = env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

function getContactUpstashLimiter(): Ratelimit | null {
  const redis = getRedis();
  if (!redis) return null;
  if (!contactUpstashLimiter) {
    contactUpstashLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(CONTACT_MAX, "15 m"),
      prefix: "aabtaab:contact",
    });
  }
  return contactUpstashLimiter;
}

function getSearchUpstashLimiter(): Ratelimit | null {
  const redis = getRedis();
  if (!redis) return null;
  if (!searchUpstashLimiter) {
    searchUpstashLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(SEARCH_MAX, "1 m"),
      prefix: "aabtaab:search",
    });
  }
  return searchUpstashLimiter;
}

function checkMemoryLimit(
  key: string,
  max: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  const entry = memoryHits.get(key);

  if (!entry || now > entry.resetAt) {
    memoryHits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= max) {
    return false;
  }

  entry.count += 1;
  return true;
}

async function checkWithFallback(
  identifier: string,
  limiter: Ratelimit | null,
  max: number,
  windowMs: number,
): Promise<{ allowed: boolean }> {
  if (limiter) {
    try {
      const { success } = await limiter.limit(identifier);
      return { allowed: success };
    } catch (error) {
      console.error(
        "Upstash rate limiting failed, falling back to local memory:",
        error,
      );
      Sentry.captureException(error);
      return { allowed: checkMemoryLimit(identifier, max, windowMs) };
    }
  }

  return { allowed: checkMemoryLimit(identifier, max, windowMs) };
}

/** Public form writes: 5 requests / 15 minutes / IP */
export async function checkContactRateLimit(
  identifier: string,
): Promise<{ allowed: boolean }> {
  return checkWithFallback(
    identifier,
    getContactUpstashLimiter(),
    CONTACT_MAX,
    CONTACT_WINDOW_MS,
  );
}

/** Search API: 60 requests / minute / IP */
export async function checkSearchRateLimit(
  identifier: string,
): Promise<{ allowed: boolean }> {
  return checkWithFallback(
    identifier,
    getSearchUpstashLimiter(),
    SEARCH_MAX,
    SEARCH_WINDOW_MS,
  );
}
