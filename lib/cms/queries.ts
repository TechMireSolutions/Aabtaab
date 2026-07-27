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
  topLevelServicesQuery,
  topLevelCoursesQuery,
  headerNavQuery,
  footerNavQuery,
  footerServicesQuery,
  allEventsQuery,
  eventBySlugQuery,
  allCoursesForFormQuery,
  allServicesForFormQuery,
  postSlugsQuery,
  allCoursePathsQuery,
  allServicePathsQuery,
  eventSlugsQuery,
  homepageDataQuery,
  homepageHeroQuery,
  homepageCarouselsQuery,
  paymentMethodsQuery,
} from "@/sanity/lib/queries";
import type { EventDetail, EventSummary } from "@/types/event";
import type { CmsPageSummary, PostCardSummary } from "@/types/cms-page";
import type { ContactFormOption } from "@/types/contact";
import type { SlugParent } from "@/types/sanity";
import type { CourseDetail } from "@/types/course";
import type { ServiceDetail } from "@/types/service";
import type { Post, PaymentMethod, QuoteItem } from "@/types/sanity";
import type { TopLevelCourseSummary, TopLevelServiceSummary } from "@/types/catalog";
import type {
  HomeCourseSummary,
  HomePostSummary,
  HomeServiceSummary,
  HomepageSettings,
  Testimonial,
} from "@/types/homepage";
import type { FooterNav, FooterService, HeaderNav } from "@/types/site-navigation";

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
  const [settings, headerNav, footerNav, footerServices] = await Promise.all([
    getSiteSettings(),
    sanityFetch<HeaderNav>({
      query: headerNavQuery,
      tags: [CACHE_TAGS.siteSettings],
      revalidate: 86400,
    }),
    sanityFetch<FooterNav>({
      query: footerNavQuery,
      tags: [CACHE_TAGS.siteSettings],
      revalidate: 86400,
    }),
    sanityFetch<FooterService[]>({
      query: footerServicesQuery,
      tags: [CACHE_TAGS.services],
      revalidate: 3600,
    }),
  ]);

  return { settings, headerNav, footerNav, footerServices };
});

export const getHomepageHeroData = cache(async () => {
  const data = await sanityFetch<{
    homepage?: HomepageSettings | null;
    settings?: Awaited<ReturnType<typeof fetchSiteSettingsUncached>> | null;
    quotes?: QuoteItem[] | null;
  } | null>({
    query: homepageHeroQuery,
    tags: [CACHE_TAGS.homepage, CACHE_TAGS.siteSettings],
    revalidate: 3600,
  });

  return {
    homepage: data?.homepage ?? null,
    settings: data?.settings ?? null,
    quotes: data?.quotes ?? [],
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

/** @deprecated Use getHomepageCarouselsData */
export const getHomepageSectionsData = getHomepageCarouselsData;

export const getHomepageData = cache(async () => {
  const data = await sanityFetch<{
    featuredPosts?: HomePostSummary[] | null;
    courses?: HomeCourseSummary[] | null;
    services?: HomeServiceSummary[] | null;
    homepage?: HomepageSettings | null;
    testimonials?: Testimonial[] | null;
    upcomingEvents?: EventSummary[] | null;
    settings?: Awaited<ReturnType<typeof fetchSiteSettingsUncached>> | null;
  } | null>({
    query: homepageDataQuery,
    tags: [
      CACHE_TAGS.posts,
      CACHE_TAGS.courses,
      CACHE_TAGS.services,
      CACHE_TAGS.homepage,
      CACHE_TAGS.events,
      CACHE_TAGS.siteSettings,
      CACHE_TAGS.all,
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
      settings: null,
    };
  }

  return {
    posts: data.featuredPosts ?? [],
    services: data.services ?? [],
    courses: data.courses ?? [],
    homepage: data.homepage ?? null,
    testimonials: data.testimonials ?? [],
    upcomingEvents: data.upcomingEvents ?? [],
    settings: data.settings ?? null,
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

export const getPaymentMethods = cache(async () => {
  return sanityFetch<PaymentMethod[]>({
    query: paymentMethodsQuery,
    tags: [CACHE_TAGS.siteSettings],
    revalidate: 86400,
  });
});
