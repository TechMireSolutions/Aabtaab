import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { publicationCoverImageUrl } from "@/sanity/lib/image";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { resolveDocOgImage } from "@/lib/seo/resolve-og-image";
import type { PublicationDetail } from "@/types/publication";
import { getPublicationBySlug } from "./queries";

export function resolvePublicationImageUrls(publication: PublicationDetail) {
  const coverImageUrl = publication.coverImage
    ? publicationCoverImageUrl(publication.coverImage)
    : undefined;

  const ogImageUrl = resolveDocOgImage(publication);

  return { coverImageUrl, ogImageUrl };
}

export async function buildPublicationPageMetadata(
  slug: string,
): Promise<Metadata> {
  const publication = await getPublicationBySlug(slug);
  if (!publication) notFound();

  const { ogImageUrl } = resolvePublicationImageUrls(publication);

  const title = publication.seo?.metaTitle ?? publication.title ?? "Publication";
  const description =
    publication.seo?.metaDescription ??
    publication.description ??
    "Read and download Islamic publications, ebooks, and literature on Aabtaab.";
  const path = `/publications/${slug}`;

  const canonicalPath = publication.seo?.canonicalUrl
    ? publication.seo.canonicalUrl.startsWith("http")
      ? new URL(publication.seo.canonicalUrl).pathname
      : publication.seo.canonicalUrl
    : path;

  const base = buildPageMetadata({
    title,
    description,
    path: canonicalPath,
    noIndex: Boolean(publication.seo?.noIndex),
    ogImage: ogImageUrl,
    keywords: publication.seo?.keywords,
  });

  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
    },
  };
}
