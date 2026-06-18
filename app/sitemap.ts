import type { MetadataRoute } from "next";
import { absoluteUrl, buildNestedContentPath } from "@/lib/seo";
import { sanityFetch } from "@/sanity/lib/sanityFetch";
import {
  postSlugsQuery,
  allCoursePathsQuery,
  allServicePathsQuery,
} from "@/sanity/lib/queries";

type SlugParent = { slug?: string; parent?: SlugParent | null };

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: absoluteUrl("/"), changeFrequency: "daily", priority: 1 },
  { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.8 },
  {
    url: absoluteUrl("/online-courses"),
    changeFrequency: "weekly",
    priority: 0.9,
  },
  { url: absoluteUrl("/services"), changeFrequency: "weekly", priority: 0.9 },
  { url: absoluteUrl("/articles"), changeFrequency: "daily", priority: 0.9 },
  { url: absoluteUrl("/donate"), changeFrequency: "monthly", priority: 0.7 },
  { url: absoluteUrl("/contact"), changeFrequency: "monthly", priority: 0.7 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, courses, services] = await Promise.all([
    sanityFetch<{ slug: string }[]>({
      query: postSlugsQuery,
      revalidate: 3600,
    }),
    sanityFetch<
      { slug: string; parent?: SlugParent | null }[]
    >({
      query: allCoursePathsQuery,
      revalidate: 3600,
    }),
    sanityFetch<
      { slug: string; parent?: SlugParent | null }[]
    >({
      query: allServicePathsQuery,
      revalidate: 3600,
    }),
  ]);

  const articleRoutes: MetadataRoute.Sitemap = (posts ?? []).map((post) => ({
    url: absoluteUrl(`/articles/${post.slug}`),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const courseRoutes: MetadataRoute.Sitemap = (courses ?? []).map((course) => ({
    url: absoluteUrl(
      buildNestedContentPath("online-courses", course.slug, course.parent),
    ),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const serviceRoutes: MetadataRoute.Sitemap = (services ?? []).map(
    (service) => ({
      url: absoluteUrl(
        buildNestedContentPath("services", service.slug, service.parent),
      ),
      changeFrequency: "weekly",
      priority: 0.8,
    }),
  );

  return [
    ...STATIC_ROUTES,
    ...articleRoutes,
    ...courseRoutes,
    ...serviceRoutes,
  ];
}
