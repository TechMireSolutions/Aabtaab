import type { SeoData } from "./sanity";

/** Shared shape for CMS `page` documents used on listing/detail routes */
export interface CmsPageSummary {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  body?: unknown[];
  seo?: SeoData;
}

export interface PostCardSummary {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage?: { asset: { _ref: string }; alt?: string };
  excerpt?: string;
  publishedAt?: string;
  categories?: { title: string }[];
}
