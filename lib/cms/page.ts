import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";
import type { CmsPageSummary } from "@/types/cms-page";
import type { SeoData } from "@/types/sanity";
import { getCmsPage } from "./queries";

interface CmsMetadataOptions {
  path: string;
  fallbackTitle: string;
  fallbackDescription: string;
  title?: string;
  noIndex?: boolean;
}

export function buildCmsPageMetadata(
  page: CmsPageSummary | null | undefined,
  options: CmsMetadataOptions,
): Metadata {
  return buildPageMetadata({
    title:
      options.title ||
      page?.seo?.metaTitle ||
      page?.title ||
      options.fallbackTitle,
    description:
      page?.seo?.metaDescription ||
      page?.subtitle ||
      options.fallbackDescription,
    path: options.path,
    noIndex: options.noIndex,
  });
}

export function defineCmsPageMetadata(
  slug: string,
  options: CmsMetadataOptions,
) {
  return async (): Promise<Metadata> => {
    const page = await getCmsPage(slug);
    return buildCmsPageMetadata(page, options);
  };
}

interface NestedSlugDoc {
  seo?: SeoData;
  title?: string;
  excerpt?: string;
}

export function buildNestedSlugMetadata(
  doc: NestedSlugDoc | null | undefined,
  basePath: string,
  slugParts: string[],
  fallbackTitle: string,
): Metadata {
  return buildPageMetadata({
    title: doc?.seo?.metaTitle || doc?.title || fallbackTitle,
    description: doc?.seo?.metaDescription || doc?.excerpt,
    path: `${basePath}/${slugParts.join("/")}`,
    noIndex: doc?.seo?.noIndex,
  });
}
