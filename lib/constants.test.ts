import { describe, expect, it } from "vitest";
import { DEFAULT_SITE_NAME, resolveSiteName } from "@/lib/constants";

describe("resolveSiteName", () => {
  it("returns CMS site name when present", () => {
    expect(resolveSiteName({ siteName: "Aabtaab Institute" })).toBe(
      "Aabtaab Institute",
    );
  });

  it("falls back to default for nullish settings", () => {
    expect(resolveSiteName(null)).toBe(DEFAULT_SITE_NAME);
    expect(resolveSiteName(undefined)).toBe(DEFAULT_SITE_NAME);
    expect(resolveSiteName({})).toBe(DEFAULT_SITE_NAME);
    expect(resolveSiteName({ siteName: "" })).toBe(DEFAULT_SITE_NAME);
  });
});
