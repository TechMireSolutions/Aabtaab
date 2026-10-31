import { describe, expect, it } from "vitest";
import { env, isBuildTime, isProduction, publicEnv } from "@/lib/env";

describe("env configuration and fallbacks", () => {
  it("exports boolean flags for runtime environment", () => {
    expect(typeof isProduction).toBe("boolean");
    expect(typeof isBuildTime).toBe("boolean");
    // Under vitest, NODE_ENV is "test", so isBuildTime should be true
    expect(isBuildTime).toBe(true);
  });

  it("provides safe publicEnv defaults", () => {
    expect(publicEnv).toBeDefined();
    expect(typeof publicEnv.NEXT_PUBLIC_SANITY_DATASET).toBe("string");
    expect(typeof publicEnv.NEXT_PUBLIC_SITE_URL).toBe("string");
    expect(publicEnv.NEXT_PUBLIC_SITE_URL).toMatch(/^https?:\/\//);
  });

  it("exports unified env object containing public and server variables", () => {
    expect(env).toBeDefined();
    expect(env.NEXT_PUBLIC_SITE_URL).toBe(publicEnv.NEXT_PUBLIC_SITE_URL);
    expect(env.NEXT_PUBLIC_SANITY_DATASET).toBe(publicEnv.NEXT_PUBLIC_SANITY_DATASET);
  });
});

