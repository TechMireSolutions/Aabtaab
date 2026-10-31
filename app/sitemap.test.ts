import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockGetSitemapSlugs } = vi.hoisted(() => ({
  mockGetSitemapSlugs: vi.fn(),
}));

vi.mock("@/lib/cms/queries", () => ({
  getSitemapSlugs: mockGetSitemapSlugs,
}));

vi.mock("@/lib/seo", () => ({
  absoluteUrl: (path: string) => `https://aabtaab.com${path.startsWith("/") ? "" : "/"}${path}`,
}));

import sitemap from "./sitemap";

describe("sitemap generator", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("includes all static core routes", async () => {
    mockGetSitemapSlugs.mockResolvedValueOnce({
      posts: [],
      courses: [],
      services: [],
      events: [],
      publications: [],
    });

    const entries = await sitemap();
    const urls = entries.map((e) => e.url);

    expect(urls).toContain("https://aabtaab.com/");
    expect(urls).toContain("https://aabtaab.com/about");
    expect(urls).toContain("https://aabtaab.com/donate");
    expect(urls).toContain("https://aabtaab.com/contact");
    expect(urls).toContain("https://aabtaab.com/reviews");
    expect(urls).toContain("https://aabtaab.com/privacy-policy");
    expect(urls).toContain("https://aabtaab.com/terms-of-service");
  });

  it("excludes catalog hubs when their lists are empty", async () => {
    mockGetSitemapSlugs.mockResolvedValueOnce({
      posts: [],
      courses: [],
      services: [],
      events: [],
      publications: [],
    });

    const entries = await sitemap();
    const urls = entries.map((e) => e.url);

    expect(urls).not.toContain("https://aabtaab.com/online-courses");
    expect(urls).not.toContain("https://aabtaab.com/services");
    expect(urls).not.toContain("https://aabtaab.com/posts");
    expect(urls).not.toContain("https://aabtaab.com/events");
    expect(urls).not.toContain("https://aabtaab.com/publications");
  });

  it("includes catalog hubs and nested item routes when populated", async () => {
    mockGetSitemapSlugs.mockResolvedValueOnce({
      posts: [{ slug: "islamic-ethics", lastModified: "2026-02-01T00:00:00Z" }],
      courses: [
        {
          slug: "advanced-tajweed",
          parent: { slug: "tajweed", parent: null },
          lastModified: "2026-03-01T00:00:00Z",
        },
      ],
      services: [
        {
          slug: "kafara-calculator",
          parent: null,
          lastModified: "2026-03-15T00:00:00Z",
        },
      ],
      events: [{ slug: "ramadan-night", lastModified: "2026-04-01T00:00:00Z" }],
      publications: [{ slug: "duas-collection", lastModified: "invalid-date-string" }],
    });

    const entries = await sitemap();
    const urls = entries.map((e) => e.url);

    // Hubs
    expect(urls).toContain("https://aabtaab.com/online-courses");
    expect(urls).toContain("https://aabtaab.com/services");
    expect(urls).toContain("https://aabtaab.com/posts");
    expect(urls).toContain("https://aabtaab.com/events");
    expect(urls).toContain("https://aabtaab.com/publications");

    // Dynamic items
    expect(urls).toContain("https://aabtaab.com/posts/islamic-ethics");
    expect(urls).toContain("https://aabtaab.com/online-courses/tajweed/advanced-tajweed");
    expect(urls).toContain("https://aabtaab.com/services/kafara-calculator");
    expect(urls).toContain("https://aabtaab.com/events/ramadan-night");
    expect(urls).toContain("https://aabtaab.com/publications/duas-collection");

    // Date parsing
    const postEntry = entries.find((e) => e.url.includes("islamic-ethics"));
    expect(postEntry?.lastModified).toBeInstanceOf(Date);

    // Invalid date returns undefined gracefully
    const pubEntry = entries.find((e) => e.url.includes("duas-collection"));
    expect(pubEntry?.lastModified).toBeUndefined();
  });
});

