import { cache } from "react";
import {
  sanityFetch,
  CACHE_TAGS,
  fetchSiteSettings as fetchSiteSettingsUncached,
} from "@/sanity/lib/fetch";
import {
  pageBySlugQuery,
  postBySlugQuery,
  courseBySlugDeepQuery,
  serviceBySlugDeepQuery,
} from "@/sanity/lib/queries";
import type { CmsPageSummary } from "@/types/cms-page";
import type { CourseDetail } from "@/types/course";
import type { ServiceDetail } from "@/types/service";
import type { Post } from "@/types/sanity";

export const getSiteSettings = cache(fetchSiteSettingsUncached);

export const getCmsPage = cache(async (slug: string) => {
  return sanityFetch<CmsPageSummary | null>({
    query: pageBySlugQuery,
    params: { slug },
    tags: [CACHE_TAGS.siteSettings],
    revalidate: 86400,
  });
});

export const getPostBySlug = cache(async (slug: string) => {
  return sanityFetch<Post | null>({
    query: postBySlugQuery,
    params: { slug },
    tags: [CACHE_TAGS.post(slug)],
    revalidate: 3600,
  });
});

export const getCourseBySlug = cache(async (slug: string) => {
  return sanityFetch<CourseDetail | null>({
    query: courseBySlugDeepQuery,
    params: { slug },
    tags: [CACHE_TAGS.course(slug)],
    revalidate: 3600,
  });
});

export const getServiceBySlug = cache(async (slug: string) => {
  return sanityFetch<ServiceDetail | null>({
    query: serviceBySlugDeepQuery,
    params: { slug },
    tags: [CACHE_TAGS.service(slug)],
    revalidate: 3600,
  });
});
