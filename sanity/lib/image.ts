import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { getSanityClient } from "./client";

export function urlFor(source: SanityImageSource) {
  return createImageUrlBuilder(getSanityClient()).image(source).auto("format");
}

export function cardImageUrl(source: SanityImageSource): string {
  return urlFor(source).width(600).height(450).url();
}

export function ogImageUrl(source: SanityImageSource): string {
  return urlFor(source).width(1200).height(630).url();
}

export function articleHeroImageUrl(source: SanityImageSource): string {
  return urlFor(source).width(900).height(500).url();
}

export function heroImageUrl(
  source: SanityImageSource,
  width = 1600,
  height = 800,
): string {
  return urlFor(source).width(width).height(height).url();
}

/**
 * 3:4 portrait thumbnail URL for publication cards, book listings, etc.
 * Crops to vertical 3:4 portrait dimensions (default 600x800).
 */
export function publicationThumbnailUrl(
  source: SanityImageSource,
  width = 600,
  height = 800,
): string {
  return urlFor(source).width(width).height(height).fit("crop").url();
}

/**
 * 3:4 portrait cover image URL for publication detail pages and book covers.
 * Crops to vertical 3:4 portrait dimensions (default 900x1200).
 */
export function publicationCoverImageUrl(
  source: SanityImageSource,
  width = 900,
  height = 1200,
): string {
  return urlFor(source).width(width).height(height).fit("crop").url();
}

// Aliases for book thumbnails, book covers, and generic 3:4 crops
export const bookThumbnailUrl = publicationThumbnailUrl;
export const bookCoverImageUrl = publicationCoverImageUrl;
export const coverImageUrl = publicationCoverImageUrl;
export const thumbnailUrl = publicationThumbnailUrl;
