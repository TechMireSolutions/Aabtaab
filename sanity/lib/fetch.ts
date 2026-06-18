import { type QueryParams } from "next-sanity";
import { unstable_cache } from "next/cache";
import type { SiteSettings } from "@/types/sanity";
import { client } from "./client";
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
} as const;

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
