import { type QueryParams } from "next-sanity";
import { unstable_cache } from "next/cache";
import { client } from "./client";
import { siteSettingsQuery } from "./queries";

// ── Cache tag registry ────────────────────────────────────────────────────────
// Shared between this fetch utility and /api/revalidate so tag strings never
// drift out of sync when the webhook fires revalidateTag().
export const CACHE_TAGS = {
  all: "sanity-all",
  posts: "sanity-posts",
  post: (slug: string) => `sanity-post-${slug}`,
  events: "sanity-events",
  event: (slug: string) => `sanity-event-${slug}`,
  courses: "sanity-courses",
  course: (slug: string) => `sanity-course-${slug}`,
  services: "sanity-services",
  service: (slug: string) => `sanity-service-${slug}`,
  siteSettings: "sanity-site-settings",
  homepage: "sanity-homepage",
} as const;

// ── Core typed fetch utility ──────────────────────────────────────────────────
// In development: skips cache so Studio edits appear on every hot reload.
// In production: wraps each GROQ call in unstable_cache keyed by (query, params)
// and tagged for surgical on-demand revalidation via the /api/revalidate webhook.

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface SanityFetchOptions<T> {
  query: string;
  params?: QueryParams;
  tags?: string[];
  revalidate?: number | false;
}

export async function sanityFetch<T>({
  query,
  params = {},
  tags = [],
  revalidate = 3600,
}: SanityFetchOptions<T>): Promise<T> {
  if (process.env.NODE_ENV !== "production") {
    try {
      return await client.fetch<T>(query, params);
    } catch (error) {
      console.error("Sanity fetch failed in development:", error);
      return null as unknown as T;
    }
  }

  const cachedFetch = unstable_cache(
    async () => {
      try {
        return await client.fetch<T>(query, params);
      } catch {
        // Return null when Sanity CDN is unreachable (e.g. during build on a
        // machine without outbound access). Pages will render with fallback data.
        return null as unknown as T;
      }
    },
    [query, JSON.stringify(params)],
    {
      tags: [CACHE_TAGS.all, ...tags],
      revalidate: revalidate === false ? undefined : revalidate,
    },
  );

  return cachedFetch();
}

// ── Site settings convenience wrapper ────────────────────────────────────────
export async function fetchSiteSettings(): Promise<SiteSettings> {
  return sanityFetch<SiteSettings>({
    query: siteSettingsQuery,
    tags: [CACHE_TAGS.siteSettings],
    revalidate: 86400,
  });
}

// ── Shared TypeScript interfaces ──────────────────────────────────────────────

export interface SeoData {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: { asset: { _ref: string }; alt?: string };
  canonicalUrl?: string;
  noIndex?: boolean;
  keywords?: string[];
}

export interface SiteSettings {
  siteName?: string;
  description?: string;
  favicon?: { asset: { _ref: string } };
  logo?: { asset: { _ref: string }; alt?: string };
  tagline?: string;
  siteUrl?: string;
  twitterHandle?: string;
  facebook?: string;
  youtube?: string;
  whatsapp?: string;
  darulQuranUrl?: string;
  donateUrl?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage?: { asset: { _ref: string }; alt?: string };
  publishedAt?: string;
  categories?: Array<{ _id: string; title: string; slug: { current: string } }>;
  author?: {
    name: string;
    image?: { asset: { _ref: string } };
    bio?: unknown[];
  };
  body?: unknown[];
  faqItems?: FaqItem[];
  seo?: SeoData;
}
