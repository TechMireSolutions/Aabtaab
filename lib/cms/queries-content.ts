import { cache } from "react";
import { sanityFetch, CACHE_TAGS } from "@/sanity/lib/fetch";
import {
  pageBySlugQuery,
  postBySlugQuery,
  postsQuery,
  allEventsQuery,
  eventBySlugQuery,
  allCoursesForFormQuery,
  allServicesForFormQuery,
  testimonialsQuery,
  scholarsQuery,
  countriesQuery,
} from "@/sanity/lib/queries";
import type { EventDetail, EventSummary } from "@/types/event";
import type { CmsPageSummary, PostCardSummary } from "@/types/cms-page";
import type { ContactFormOption } from "@/types/contact";
import type { Post } from "@/types/post";
import type { Testimonial } from "@/types/testimonial";
import type { Scholar } from "@/types/scholar";
import type { Country } from "@/types/country";

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

export const getPosts = cache(async () => {
  return sanityFetch<PostCardSummary[]>({
    query: postsQuery,
    tags: [CACHE_TAGS.posts],
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

export const getTestimonials = cache(async () => {
  return sanityFetch<Testimonial[]>({
    query: testimonialsQuery,
    tags: [CACHE_TAGS.testimonials],
  });
});

export const getScholars = cache(async () => {
  return sanityFetch<Scholar[]>({
    query: scholarsQuery,
    tags: [CACHE_TAGS.scholars],
  });
});

export const getCountries = cache(async () => {
  return sanityFetch<Country[]>({
    query: countriesQuery,
    tags: [CACHE_TAGS.countries],
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
