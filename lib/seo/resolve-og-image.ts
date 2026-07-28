import { ogImageUrl } from "@/sanity/lib/image";
import type { SeoData } from "@/types/seo";

type SanityImageRef = { asset?: { _ref: string } | null; alt?: string } | null;

interface OgImageSource {
  seo?: SeoData;
  featuredImage?: SanityImageRef;
  heroImage?: SanityImageRef;
  icon?: SanityImageRef;
  mainImage?: SanityImageRef;
  image?: SanityImageRef;
}

/** Resolve OG image URL from CMS seo override or first available content image. */
export function resolveDocOgImage(doc?: OgImageSource | null): string | undefined {
  if (!doc) return undefined;
  if (doc.seo?.ogImage) return ogImageUrl(doc.seo.ogImage);
  const fallback =
    doc.featuredImage ??
    doc.heroImage ??
    doc.mainImage ??
    doc.image ??
    doc.icon;
  return fallback && fallback.asset ? ogImageUrl(fallback) : undefined;
}
