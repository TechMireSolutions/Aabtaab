import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { resolveDocOgImage } from "@/lib/seo/resolve-og-image";
import type { CmsPageSummary } from "@/types/cms-page";
import type { SeoData, SlugParent } from "@/types/sanity";
import { getCmsPage } from "./queries";
import { buildNestedContentPath } from "../paths";

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
    noIndex: options.noIndex ?? page?.seo?.noIndex,
    ogImage: resolveDocOgImage(page),
    keywords: page?.seo?.keywords,
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
  featuredImage?: { asset: { _ref: string } };
  heroImage?: { asset: { _ref: string } };
  icon?: { asset: { _ref: string } };
  slug?: { current: string };
  parent?: { slug?: string; parent?: unknown; title?: string } | null;
}

export function buildNestedSlugMetadata(
  doc: NestedSlugDoc | null | undefined,
  basePath: string,
  slugParts: string[],
  fallbackTitle: string,
): Metadata {
  const segment = basePath.replace(/^\//, "") as "online-courses" | "services";
  const canonicalPath =
    doc?.slug?.current && (segment === "online-courses" || segment === "services")
      ? buildNestedContentPath(segment, doc.slug.current, doc.parent as SlugParent | null)
      : `${basePath}/${slugParts.join("/")}`;

  const title = doc?.seo?.metaTitle || doc?.title || fallbackTitle;
  const kindLabel =
    segment === "services" ? "religious service" : "online course";
  const description =
    doc?.seo?.metaDescription ||
    doc?.excerpt ||
    `${title} — ${kindLabel} from Aabtaab.`;

  return buildPageMetadata({
    title,
    description,
    path: canonicalPath,
    noIndex: doc?.seo?.noIndex,
    ogImage: resolveDocOgImage(doc),
    keywords: doc?.seo?.keywords,
  });
}
