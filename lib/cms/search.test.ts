import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockSanityFetch } = vi.hoisted(() => ({
  mockSanityFetch: vi.fn(),
}));

vi.mock("@/sanity/lib/fetch", () => ({
  sanityFetch: mockSanityFetch,
  CACHE_TAGS: {
    all: "sanity-all",
  },
}));

import { searchSite } from "@/lib/cms/search";

describe("searchSite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns empty result immediately for empty or whitespace query", async () => {
    const res1 = await searchSite("");
    expect(res1).toEqual({ keywordMatch: null, suggestions: [], results: [] });

    const res2 = await searchSite("   ");
    expect(res2).toEqual({ keywordMatch: null, suggestions: [], results: [] });

    expect(mockSanityFetch).not.toHaveBeenCalled();
  });

  it("refines query, detects matchTypes, and invokes sanityFetch", async () => {
    const mockResults = [
      {
        _id: "post-1",
        _type: "post",
        title: "Introduction to Tajweed",
        slug: "intro-tajweed",
      },
    ];
    mockSanityFetch.mockResolvedValueOnce(mockResults);

    const res = await searchSite("online tajweed course");

    expect(res.keywordMatch).toBeDefined();
    expect(res.suggestions).toBeInstanceOf(Array);
    expect(res.results).toEqual(mockResults);

    expect(mockSanityFetch).toHaveBeenCalledWith(
      expect.objectContaining({
        params: expect.objectContaining({
          rawTerm: "online tajweed course",
          // "online" and "course" filtered out as generic words
          term: "tajweed",
          hasTerm: true,
          matchTypes: expect.arrayContaining(["course"]),
        }),
      }),
    );
  });

  it("detects publication, article, and event match types", async () => {
    mockSanityFetch.mockResolvedValueOnce([]);

    await searchSite("read blog article about ramadan event and pdf book");

    expect(mockSanityFetch).toHaveBeenCalledWith(
      expect.objectContaining({
        params: expect.objectContaining({
          matchTypes: expect.arrayContaining(["post", "event", "publication"]),
        }),
      }),
    );
  });

  it("defaults to empty results array when sanityFetch returns null", async () => {
    mockSanityFetch.mockResolvedValueOnce(null);

    const res = await searchSite("fiqh");

    expect(res.results).toEqual([]);
  });
});

