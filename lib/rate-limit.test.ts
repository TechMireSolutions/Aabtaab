import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@sentry/nextjs", () => ({
  captureException: vi.fn(),
}));

vi.mock("@/lib/env", () => ({
  env: {
    UPSTASH_REDIS_REST_URL: undefined,
    UPSTASH_REDIS_REST_TOKEN: undefined,
  },
}));

import { checkContactRateLimit, checkSearchRateLimit } from "@/lib/rate-limit";

describe("checkContactRateLimit (memory fallback)", () => {
  beforeEach(() => {
    vi.useRealTimers();
  });

  it("allows requests under the limit", async () => {
    const key = `test-allow-${Date.now()}-${Math.random()}`;
    await expect(checkContactRateLimit(key)).resolves.toEqual({
      allowed: true,
    });
  });

  it("blocks the 6th request within the window", async () => {
    const key = `test-block-${Date.now()}-${Math.random()}`;

    for (let i = 0; i < 5; i += 1) {
      await expect(checkContactRateLimit(key)).resolves.toEqual({
        allowed: true,
      });
    }

    await expect(checkContactRateLimit(key)).resolves.toEqual({
      allowed: false,
    });
  });
});

describe("checkSearchRateLimit (memory fallback)", () => {
  it("allows more requests than the contact limiter", async () => {
    const key = `test-search-${Date.now()}-${Math.random()}`;
    for (let i = 0; i < 10; i += 1) {
      await expect(checkSearchRateLimit(key)).resolves.toEqual({
        allowed: true,
      });
    }
  });
});
