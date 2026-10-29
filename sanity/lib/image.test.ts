import { describe, expect, it } from "vitest";
import {
  articleHeroImageUrl,
  bookCoverImageUrl,
  bookThumbnailUrl,
  cardImageUrl,
  coverImageUrl,
  heroImageUrl,
  ogImageUrl,
  publicationCoverImageUrl,
  publicationThumbnailUrl,
  thumbnailUrl,
  urlFor,
} from "./image";

describe("sanity/lib/image helper functions", () => {
  const sampleImageSource = {
    _type: "image",
    asset: {
      _ref: "image-abc123456789-1200x1600-jpg",
    },
  };

  it("builds generic image URL with urlFor", () => {
    const url = urlFor(sampleImageSource).url();
    expect(url).toContain("auto=format");
  });

  it("crops publication thumbnails to 3:4 portrait dimensions (default 600x800)", () => {
    const url = publicationThumbnailUrl(sampleImageSource);
    expect(url).toContain("w=600");
    expect(url).toContain("h=800");
    expect(url).toContain("fit=crop");
    expect(url).toContain("auto=format");
  });

  it("crops publication covers to 3:4 portrait dimensions (default 900x1200)", () => {
    const url = publicationCoverImageUrl(sampleImageSource);
    expect(url).toContain("w=900");
    expect(url).toContain("h=1200");
    expect(url).toContain("fit=crop");
    expect(url).toContain("auto=format");
  });

  it("supports custom 3:4 portrait dimensions for thumbnails and covers", () => {
    const thumbUrl = publicationThumbnailUrl(sampleImageSource, 300, 400);
    expect(thumbUrl).toContain("w=300");
    expect(thumbUrl).toContain("h=400");
    expect(thumbUrl).toContain("fit=crop");

    const coverUrl = publicationCoverImageUrl(sampleImageSource, 750, 1000);
    expect(coverUrl).toContain("w=750");
    expect(coverUrl).toContain("h=1000");
    expect(coverUrl).toContain("fit=crop");
  });

  it("exposes aliases that match the 3:4 portrait helpers", () => {
    expect(bookThumbnailUrl).toBe(publicationThumbnailUrl);
    expect(bookCoverImageUrl).toBe(publicationCoverImageUrl);
    expect(coverImageUrl).toBe(publicationCoverImageUrl);
    expect(thumbnailUrl).toBe(publicationThumbnailUrl);
  });

  it("builds cardImageUrl with 4:3 dimensions (600x450)", () => {
    const url = cardImageUrl(sampleImageSource);
    expect(url).toContain("w=600");
    expect(url).toContain("h=450");
  });

  it("builds ogImageUrl with OpenGraph dimensions (1200x630)", () => {
    const url = ogImageUrl(sampleImageSource);
    expect(url).toContain("w=1200");
    expect(url).toContain("h=630");
  });

  it("builds articleHeroImageUrl with article dimensions (900x500)", () => {
    const url = articleHeroImageUrl(sampleImageSource);
    expect(url).toContain("w=900");
    expect(url).toContain("h=500");
  });

  it("builds heroImageUrl with default and custom dimensions", () => {
    const defaultUrl = heroImageUrl(sampleImageSource);
    expect(defaultUrl).toContain("w=1600");
    expect(defaultUrl).toContain("h=800");

    const customUrl = heroImageUrl(sampleImageSource, 1400, 700);
    expect(customUrl).toContain("w=1400");
    expect(customUrl).toContain("h=700");
  });
});

