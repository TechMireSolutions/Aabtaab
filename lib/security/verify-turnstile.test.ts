import { afterEach, describe, expect, it, vi } from "vitest";

const { envState } = vi.hoisted(() => ({
  envState: { TURNSTILE_SECRET_KEY: undefined as string | undefined },
}));

vi.mock("@/lib/env", () => ({
  env: envState,
}));

import { verifyTurnstileOrSkip } from "@/lib/security/verify-turnstile";

afterEach(() => {
  envState.TURNSTILE_SECRET_KEY = undefined;
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("verifyTurnstileOrSkip", () => {
  it("skips when secret is unset", async () => {
    await expect(
      verifyTurnstileOrSkip({ token: null, ip: "1.1.1.1" }),
    ).resolves.toBeUndefined();
  });

  it("rejects missing token when secret is set", async () => {
    envState.TURNSTILE_SECRET_KEY = "sec";
    await expect(
      verifyTurnstileOrSkip({ token: "", ip: "1.1.1.1" }),
    ).resolves.toMatch(/Security check failed/);
  });

  it("rejects failed Cloudflare response", async () => {
    envState.TURNSTILE_SECRET_KEY = "sec";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: async () => ({ success: false }),
      }),
    );
    await expect(
      verifyTurnstileOrSkip({ token: "tok", ip: "1.1.1.1" }),
    ).resolves.toMatch(/Security verification failed/);
  });

  it("returns undefined on success", async () => {
    envState.TURNSTILE_SECRET_KEY = "sec";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: async () => ({ success: true }),
      }),
    );
    await expect(
      verifyTurnstileOrSkip({ token: "tok", ip: "1.1.1.1" }),
    ).resolves.toBeUndefined();
  });
});
