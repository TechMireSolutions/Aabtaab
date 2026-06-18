import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { getSanityClient } from "./client";

export function urlFor(source: SanityImageSource) {
  return createImageUrlBuilder(getSanityClient()).image(source);
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
