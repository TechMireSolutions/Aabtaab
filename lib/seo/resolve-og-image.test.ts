import { describe, expect, it, vi } from "vitest";

vi.mock("@/sanity/lib/image", () => ({
  ogImageUrl: (img: { asset?: { _ref: string } }) =>
    `https://cdn.sanity.io/og/${img?.asset?._ref}`,
}));

import { resolveDocOgImage } from "@/lib/seo/resolve-og-image";

describe("resolveDocOgImage", () => {
  it("returns undefined for null or undefined documents", () => {
    expect(resolveDocOgImage(null)).toBeUndefined();
    expect(resolveDocOgImage(undefined)).toBeUndefined();
  });

  it("prioritizes seo.ogImage over all content images", () => {
    const doc = {
      seo: { ogImage: { asset: { _ref: "seo-og-1" } } },
      featuredImage: { asset: { _ref: "featured-1" } },
      heroImage: { asset: { _ref: "hero-1" } },
    };

    expect(resolveDocOgImage(doc)).toBe("https://cdn.sanity.io/og/seo-og-1");
  });

  it("falls back through image fields in proper order", () => {
    expect(
      resolveDocOgImage({
        featuredImage: { asset: { _ref: "featured-1" } },
        heroImage: { asset: { _ref: "hero-1" } },
      }),
    ).toBe("https://cdn.sanity.io/og/featured-1");

    expect(
      resolveDocOgImage({
        heroImage: { asset: { _ref: "hero-1" } },
        mainImage: { asset: { _ref: "main-1" } },
      }),
    ).toBe("https://cdn.sanity.io/og/hero-1");

    expect(
      resolveDocOgImage({
        mainImage: { asset: { _ref: "main-1" } },
        coverImage: { asset: { _ref: "cover-1" } },
      }),
    ).toBe("https://cdn.sanity.io/og/main-1");

    expect(
      resolveDocOgImage({
        coverImage: { asset: { _ref: "cover-1" } },
        image: { asset: { _ref: "image-1" } },
      }),
    ).toBe("https://cdn.sanity.io/og/cover-1");

    expect(
      resolveDocOgImage({
        image: { asset: { _ref: "image-1" } },
        icon: { asset: { _ref: "icon-1" } },
      }),
    ).toBe("https://cdn.sanity.io/og/image-1");

    expect(
      resolveDocOgImage({
        icon: { asset: { _ref: "icon-1" } },
      }),
    ).toBe("https://cdn.sanity.io/og/icon-1");
  });

  it("falls back when earlier image references are null or undefined", () => {
    const doc = {
      featuredImage: null,
      heroImage: undefined,
      mainImage: { asset: { _ref: "main-valid" } },
    };

    expect(resolveDocOgImage(doc)).toBe("https://cdn.sanity.io/og/main-valid");
  });

  it("returns undefined when the selected fallback image lacks an asset", () => {
    const doc = {
      featuredImage: { alt: "no asset reference" },
      mainImage: { asset: { _ref: "main-valid" } },
    };

    expect(resolveDocOgImage(doc)).toBeUndefined();
  });

  it("returns undefined when no valid image asset is found", () => {
    const doc = {
      title: "No Images",
      featuredImage: null,
      heroImage: undefined,
    };

    expect(resolveDocOgImage(doc)).toBeUndefined();
  });
});
