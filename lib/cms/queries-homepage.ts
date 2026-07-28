import { cache } from "react";
import {
  sanityFetch,
  CACHE_TAGS,
  fetchSiteSettings as fetchSiteSettingsUncached,
} from "@/sanity/lib/fetch";
import {
  homepageHeroQuery,
  homepageCarouselsQuery,
} from "@/sanity/lib/queries";
import type { EventSummary } from "@/types/event";
import type { QuoteItem } from "@/types/quote";
import type {
  HomeCourseSummary,
  HomePostSummary,
  HomeServiceSummary,
  HomepageSettings,
} from "@/types/homepage";
import type { Testimonial } from "@/types/testimonial";

export const getHomepageHeroData = cache(async () => {
  const data = await sanityFetch<{
    homepage?: HomepageSettings | null;
    settings?: Awaited<ReturnType<typeof fetchSiteSettingsUncached>> | null;
    quotes?: QuoteItem[] | null;
    courseCount?: number;
    scholarCount?: number;
    countryCount?: number;
  } | null>({
    query: homepageHeroQuery,
    tags: [CACHE_TAGS.homepage, CACHE_TAGS.siteSettings],
    revalidate: 3600,
  });

  return {
    homepage: data?.homepage ?? null,
    settings: data?.settings ?? null,
    quotes: data?.quotes ?? [],
    courseCount: data?.courseCount ?? 0,
    scholarCount: data?.scholarCount ?? 0,
    countryCount: data?.countryCount ?? 0,
  };
});

export const getHomepageCarouselsData = cache(async () => {
  const data = await sanityFetch<{
    featuredPosts?: HomePostSummary[] | null;
    courses?: HomeCourseSummary[] | null;
    services?: HomeServiceSummary[] | null;
    homepage?: HomepageSettings | null;
    testimonials?: Testimonial[] | null;
    upcomingEvents?: EventSummary[] | null;
  } | null>({
    query: homepageCarouselsQuery,
    tags: [
      CACHE_TAGS.posts,
      CACHE_TAGS.courses,
      CACHE_TAGS.services,
      CACHE_TAGS.homepage,
      CACHE_TAGS.events,
    ],
    revalidate: 3600,
  });

  if (!data) {
    return {
      posts: [] as HomePostSummary[],
      services: [] as HomeServiceSummary[],
      courses: [] as HomeCourseSummary[],
      homepage: null as HomepageSettings | null,
      testimonials: [] as Testimonial[],
      upcomingEvents: [] as EventSummary[],
    };
  }

  return {
    posts: data.featuredPosts ?? [],
    services: data.services ?? [],
    courses: data.courses ?? [],
    homepage: data.homepage ?? null,
    testimonials: data.testimonials ?? [],
    upcomingEvents: data.upcomingEvents ?? [],
  };
});
