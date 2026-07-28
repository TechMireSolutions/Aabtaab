import { cache } from "react";
import { sanityFetch, CACHE_TAGS } from "@/sanity/lib/fetch";
import {
  courseBySlugDeepQuery,
  serviceBySlugDeepQuery,
  topLevelServicesQuery,
  topLevelCoursesQuery,
  allCoursePathsQuery,
  allServicePathsQuery,
  postSlugsQuery,
  eventSlugsQuery,
} from "@/sanity/lib/queries";
import type { SlugParent } from "@/types/sanity";
import type { CourseDetail } from "@/types/course";
import type { ServiceDetail } from "@/types/service";
import type { TopLevelCourseSummary, TopLevelServiceSummary } from "@/types/catalog";

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

export const getTopLevelCourses = cache(async () => {
  return sanityFetch<TopLevelCourseSummary[]>({
    query: topLevelCoursesQuery,
    tags: [CACHE_TAGS.courses],
    revalidate: 3600,
  });
});

export const getTopLevelServices = cache(async () => {
  return sanityFetch<TopLevelServiceSummary[]>({
    query: topLevelServicesQuery,
    tags: [CACHE_TAGS.services],
    revalidate: 3600,
  });
});

export const getSitemapSlugs = cache(async () => {
  type SitemapEntry = {
    slug: string;
    lastModified?: string;
    parent?: SlugParent | null;
  };

  const [posts, courses, services, events] = await Promise.all([
    sanityFetch<SitemapEntry[]>({
      query: postSlugsQuery,
      tags: [CACHE_TAGS.posts],
      revalidate: 3600,
    }),
    sanityFetch<SitemapEntry[]>({
      query: allCoursePathsQuery,
      tags: [CACHE_TAGS.courses],
      revalidate: 3600,
    }),
    sanityFetch<SitemapEntry[]>({
      query: allServicePathsQuery,
      tags: [CACHE_TAGS.services],
      revalidate: 3600,
    }),
    sanityFetch<SitemapEntry[]>({
      query: eventSlugsQuery,
      tags: [CACHE_TAGS.events],
      revalidate: 3600,
    }),
  ]);

  return {
    posts: posts ?? [],
    courses: courses ?? [],
    services: services ?? [],
    events: events ?? [],
  };
});
