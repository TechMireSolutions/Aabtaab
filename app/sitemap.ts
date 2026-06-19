import type { MetadataRoute } from "next";
import { absoluteUrl, buildNestedContentPath } from "@/lib/seo";
import { getSitemapSlugs } from "@/lib/cms/queries";

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: absoluteUrl("/"), changeFrequency: "daily", priority: 1 },
  { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.8 },
  {
    url: absoluteUrl("/online-courses"),
    changeFrequency: "weekly",
    priority: 0.9,
  },
  { url: absoluteUrl("/services"), changeFrequency: "weekly", priority: 0.9 },
  { url: absoluteUrl("/posts"), changeFrequency: "daily", priority: 0.9 },
  { url: absoluteUrl("/events"), changeFrequency: "weekly", priority: 0.85 },
  { url: absoluteUrl("/donate"), changeFrequency: "monthly", priority: 0.7 },
  { url: absoluteUrl("/contact"), changeFrequency: "monthly", priority: 0.7 },
  { url: absoluteUrl("/search"), changeFrequency: "monthly", priority: 0.5 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { posts, courses, services, events } = await getSitemapSlugs();

  const articleRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/posts/${post.slug}`),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const courseRoutes: MetadataRoute.Sitemap = courses.map((course) => ({
    url: absoluteUrl(
      buildNestedContentPath("online-courses", course.slug, course.parent),
    ),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
    url: absoluteUrl(
      buildNestedContentPath("services", service.slug, service.parent),
    ),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const eventRoutes: MetadataRoute.Sitemap = events.map((event) => ({
    url: absoluteUrl(`/events/${event.slug}`),
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  return [
    ...STATIC_ROUTES,
    ...articleRoutes,
    ...courseRoutes,
    ...serviceRoutes,
    ...eventRoutes,
  ];
}
