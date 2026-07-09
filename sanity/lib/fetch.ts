import { type QueryParams } from "next-sanity";
import { draftMode } from "next/headers";
import { unstable_cache } from "next/cache";
import type { SiteSettings } from "@/types/sanity";
import { isProduction } from "@/lib/env";
import { client } from "./client";
import { getPreviewClient } from "./previewClient";
import { siteSettingsQuery } from "./queries";

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
  pages: "sanity-pages",
  page: (slug: string) => `sanity-page-${slug}`,
} as const;

interface SanityFetchOptions {
  query: string;
  params?: QueryParams;
  tags?: string[];
  revalidate?: number | false;
}

async function isDraftModeEnabled(): Promise<boolean> {
  try {
    const { isEnabled } = await draftMode();
    return isEnabled;
  } catch {
    return false;
  }
}

async function fetchFromSanity<T>(
  query: string,
  params: QueryParams,
): Promise<T> {
  const preview = await isDraftModeEnabled();
  const activeClient = preview ? getPreviewClient() : client;
  return activeClient.fetch<T>(query, params);
}

export async function sanityFetch<T>({
  query,
  params = {},
  tags = [],
  revalidate = 3600,
}: SanityFetchOptions): Promise<T> {
  const preview = await isDraftModeEnabled();

  if (preview || !isProduction) {
    try {
      return await fetchFromSanity<T>(query, params);
    } catch (error) {
      console.error("Sanity fetch failed:", error);
      return null as unknown as T;
    }
  }

  const cachedFetch = unstable_cache(
    async () => {
      try {
        return await client.fetch<T>(query, params);
      } catch (error) {
        console.error("Sanity fetch failed in production:", error);
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

export async function fetchSiteSettings(): Promise<SiteSettings> {
  return sanityFetch<SiteSettings>({
    query: siteSettingsQuery,
    tags: [CACHE_TAGS.siteSettings],
    revalidate: 86400,
  });
}
