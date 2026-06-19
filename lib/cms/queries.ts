import { cache } from "react";
import {
  sanityFetch,
  CACHE_TAGS,
  fetchSiteSettings as fetchSiteSettingsUncached,
} from "@/sanity/lib/fetch";
import {
  pageBySlugQuery,
  postBySlugQuery,
  postsQuery,
  courseBySlugDeepQuery,
  serviceBySlugDeepQuery,
  featuredPostsQuery,
  topLevelServicesQuery,
  topLevelCoursesQuery,
  homepageSettingsQuery,
  testimonialsQuery,
  headerNavQuery,
  footerServicesQuery,
  allEventsQuery,
  eventBySlugQuery,
  upcomingEventsQuery,
  allCoursesForFormQuery,
  allServicesForFormQuery,
  postSlugsQuery,
  allCoursePathsQuery,
  allServicePathsQuery,
  eventSlugsQuery,
} from "@/sanity/lib/queries";
import type { EventDetail, EventSummary } from "@/types/event";
import type { CmsPageSummary, PostCardSummary } from "@/types/cms-page";
import type { ContactFormOption } from "@/types/contact";
import type { SlugParent } from "@/types/sanity";
import type { CourseDetail } from "@/types/course";
import type { ServiceDetail } from "@/types/service";
import type { Post } from "@/types/sanity";
import type { TopLevelCourseSummary, TopLevelServiceSummary } from "@/types/catalog";
import type {
  HomeCourseSummary,
  HomePostSummary,
  HomeServiceSummary,
  HomepageSettings,
  Testimonial,
} from "@/types/homepage";
import type { FooterService, HeaderNav } from "@/types/site-navigation";

export const getSiteSettings = cache(fetchSiteSettingsUncached);

export const getCmsPage = cache(async (slug: string) => {
  return sanityFetch<CmsPageSummary | null>({
    query: pageBySlugQuery,
    params: { slug },
    tags: [CACHE_TAGS.pages, CACHE_TAGS.page(slug)],
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

export const getSiteLayoutData = cache(async () => {
  const [settings, headerNav, footerServices] = await Promise.all([
    getSiteSettings(),
    sanityFetch<HeaderNav>({
      query: headerNavQuery,
      tags: [CACHE_TAGS.siteSettings],
      revalidate: 86400,
    }),
    sanityFetch<FooterService[]>({
      query: footerServicesQuery,
      tags: [CACHE_TAGS.services],
      revalidate: 3600,
    }),
  ]);

  return { settings, headerNav, footerServices };
});

export const getHomepageData = cache(async () => {
  const [posts, services, courses, homepage, testimonials, upcomingEvents, settings] =
    await Promise.all([
      sanityFetch<HomePostSummary[]>({
        query: featuredPostsQuery,
        tags: [CACHE_TAGS.posts],
        revalidate: 3600,
      }),
      sanityFetch<HomeServiceSummary[]>({
        query: topLevelServicesQuery,
        tags: [CACHE_TAGS.services],
        revalidate: 3600,
      }),
      sanityFetch<HomeCourseSummary[]>({
        query: topLevelCoursesQuery,
        tags: [CACHE_TAGS.courses],
        revalidate: 3600,
      }),
      sanityFetch<HomepageSettings>({
        query: homepageSettingsQuery,
        tags: [CACHE_TAGS.homepage],
        revalidate: 3600,
      }),
      sanityFetch<Testimonial[]>({
        query: testimonialsQuery,
        tags: [CACHE_TAGS.all],
        revalidate: 3600,
      }),
      sanityFetch<EventSummary[]>({
        query: upcomingEventsQuery,
        tags: [CACHE_TAGS.events],
        revalidate: 3600,
      }),
      getSiteSettings(),
    ]);

  return {
    posts,
    services,
    courses,
    homepage,
    testimonials,
    upcomingEvents,
    settings,
  };
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

export const getEvents = cache(async () => {
  return sanityFetch<EventSummary[]>({
    query: allEventsQuery,
    tags: [CACHE_TAGS.events],
    revalidate: 3600,
  });
});

export const getEventBySlug = cache(async (slug: string) => {
  return sanityFetch<EventDetail | null>({
    query: eventBySlugQuery,
    params: { slug },
    tags: [CACHE_TAGS.event(slug)],
    revalidate: 3600,
  });
});

export const getPosts = cache(async () => {
  return sanityFetch<PostCardSummary[]>({
    query: postsQuery,
    tags: [CACHE_TAGS.posts],
    revalidate: 3600,
  });
});

export const getContactFormOptions = cache(async () => {
  const [courses, services] = await Promise.all([
    sanityFetch<ContactFormOption[]>({
      query: allCoursesForFormQuery,
      tags: [CACHE_TAGS.courses],
      revalidate: 3600,
    }),
    sanityFetch<ContactFormOption[]>({
      query: allServicesForFormQuery,
      tags: [CACHE_TAGS.services],
      revalidate: 3600,
    }),
  ]);
  return { courses: courses ?? [], services: services ?? [] };
});

export const getSitemapSlugs = cache(async () => {
  type SitemapEntry = { slug: string; lastModified?: string; parent?: SlugParent | null };

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
