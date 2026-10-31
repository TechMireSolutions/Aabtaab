import { describe, expect, it, vi, beforeEach } from "vitest";

const { mockGetPostBySlug, mockNotFound } = vi.hoisted(() => ({
  mockGetPostBySlug: vi.fn(),
  mockNotFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("next/navigation", () => ({
  notFound: mockNotFound,
}));

vi.mock("./queries", () => ({
  getPostBySlug: mockGetPostBySlug,
}));

vi.mock("@/sanity/lib/image", () => ({
  articleHeroImageUrl: (img: { asset?: { _ref: string } }) =>
    `https://cdn.sanity.io/images/test/hero-${img?.asset?._ref}`,
  ogImageUrl: (img: { asset?: { _ref: string } }) =>
    `https://cdn.sanity.io/images/test/og-${img?.asset?._ref}`,
}));

import {
  buildPostPageMetadata,
  resolvePostImageUrls,
} from "@/lib/cms/post";
import type { Post } from "@/types/post";

describe("resolvePostImageUrls", () => {
  it("resolves mainImageUrl and ogImageUrl when mainImage is present", () => {
    const post = {
      _id: "post-1",
      title: "Sample Article",
      mainImage: { asset: { _ref: "image-asset-456" } },
    } as unknown as Post;

    const urls = resolvePostImageUrls(post);
    expect(urls.mainImageUrl).toContain("hero-image-asset-456");
    expect(urls.ogImageUrl).toContain("og-image-asset-456");
  });

  it("handles missing mainImage gracefully", () => {
    const post = {
      _id: "post-2",
      title: "Text Article",
    } as unknown as Post;

    const urls = resolvePostImageUrls(post);
    expect(urls.mainImageUrl).toBeUndefined();
    expect(urls.ogImageUrl).toBeUndefined();
  });
});

describe("buildPostPageMetadata", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws notFound() when post is missing", async () => {
    mockGetPostBySlug.mockResolvedValueOnce(null);

    await expect(buildPostPageMetadata("unknown-slug")).rejects.toThrow("NEXT_NOT_FOUND");
    expect(mockNotFound).toHaveBeenCalled();
  });

  it("builds article metadata with published time and authors", async () => {
    mockGetPostBySlug.mockResolvedValueOnce({
      title: "Ethics in Islam",
      excerpt: "A brief reflection on Islamic ethics.",
      publishedAt: "2026-01-10T12:00:00Z",
      author: { name: "Shaykh Al-Amili" },
      seo: {
        metaTitle: "Ethics in Islam — Deep Dive",
        metaDescription: "Detailed SEO description",
        keywords: ["ethics", "islam"],
      },
    });

    const meta = await buildPostPageMetadata("ethics-in-islam");
    expect(meta.title).toBe("Ethics in Islam — Deep Dive");
    expect(meta.description).toBe("Detailed SEO description");
    expect(meta.alternates?.canonical).toContain("/posts/ethics-in-islam");
    expect(meta.openGraph).toMatchObject({
      type: "article",
      publishedTime: "2026-01-10T12:00:00Z",
      authors: ["Shaykh Al-Amili"],
    });
  });

  it("normalizes full HTTP canonicalUrl in seo to relative pathname", async () => {
    mockGetPostBySlug.mockResolvedValueOnce({
      title: "Canonical URL Test",
      seo: {
        canonicalUrl: "https://aabtaab.com/custom-canonical-path",
      },
    });

    const meta = await buildPostPageMetadata("canonical-test");
    expect(meta.alternates?.canonical).toContain("/custom-canonical-path");
  });

  it("accepts relative canonicalUrl in seo directly", async () => {
    mockGetPostBySlug.mockResolvedValueOnce({
      title: "Relative Canonical",
      seo: {
        canonicalUrl: "/relative-canonical-path",
      },
    });

    const meta = await buildPostPageMetadata("rel-test");
    expect(meta.alternates?.canonical).toContain("/relative-canonical-path");
  });
});

