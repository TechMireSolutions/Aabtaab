import { describe, expect, it, vi } from "vitest";
import { resolvePublicationImageUrls, buildPublicationPageMetadata } from "./publication";
import type { PublicationDetail } from "@/types/publication";

vi.mock("@/lib/cms/queries", () => ({
  getPublicationBySlug: vi.fn(async (slug: string) => {
    if (slug === "test-book") {
      return {
        _id: "pub-1",
        title: "Test Book",
        slug: "test-book",
        author: "Allama Majlisi",
        description: "A profound book.",
        fileUrl: "https://example.com/test.pdf",
        fileSize: 2048576,
        language: "Arabic",
        pages: 150,
      } as PublicationDetail;
    }
    return null;
  }),
}));

describe("resolvePublicationImageUrls", () => {
  it("returns undefined when no coverImage or OG override is set", () => {
    const pub: PublicationDetail = {
      _id: "1",
      title: "No Image Book",
      slug: "no-image",
    };
    const { coverImageUrl, ogImageUrl } = resolvePublicationImageUrls(pub);
    expect(coverImageUrl).toBeUndefined();
    expect(ogImageUrl).toBeUndefined();
  });

  it("returns 3:4 cropped coverImageUrl when coverImage is provided", () => {
    const pub: PublicationDetail = {
      _id: "1",
      title: "Test Book",
      slug: "test-book",
      coverImage: {
        asset: {
          _ref: "image-1234567890abcdef-1200x1600-jpg",
        },
        alt: "Test Book Cover",
      },
    };
    const { coverImageUrl, ogImageUrl } = resolvePublicationImageUrls(pub);
    expect(coverImageUrl).toBeDefined();
    expect(coverImageUrl).toContain("w=900");
    expect(coverImageUrl).toContain("h=1200");
    expect(coverImageUrl).toContain("fit=crop");
    expect(ogImageUrl).toBeDefined();
  });
});

describe("buildPublicationPageMetadata", () => {
  it("builds metadata for an existing publication", async () => {
    const meta = await buildPublicationPageMetadata("test-book");
    expect(meta.title).toBe("Test Book");
    expect(meta.description).toBe("A profound book.");
    expect(meta.openGraph).toMatchObject({ type: "article" });
  });
});
