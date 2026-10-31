import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/seo", () => ({
  getSiteUrl: () => "https://aabtaab.com",
}));

import robots from "./robots";

describe("robots.txt route", () => {
  it("generates correct robots rules and sitemap reference", () => {
    const config = robots();

    expect(config.host).toBe("https://aabtaab.com");
    expect(config.sitemap).toBe("https://aabtaab.com/sitemap.xml");

    const rules = Array.isArray(config.rules) ? config.rules : [config.rules];
    const generalRule = rules.find((r) => r.userAgent === "*");

    expect(generalRule).toBeDefined();
    expect(generalRule?.allow).toBe("/");
    expect(generalRule?.disallow).toEqual(
      expect.arrayContaining(["/studio/", "/api/", "/search"]),
    );
  });
});

