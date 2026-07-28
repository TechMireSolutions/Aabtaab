import type { MetadataRoute } from "next";
import { absoluteUrl, buildNestedContentPath } from "@/lib/seo";
import { getSitemapSlugs } from "@/lib/cms/queries";

interface SitemapSlug {
  slug: string;
  lastModified?: string;
}

function toLastModified(iso?: string): Date | undefined {
  if (!iso) return undefined;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { posts, courses, services, events } = await getSitemapSlugs();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.8 },
    {
      url: absoluteUrl("/online-courses"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    { url: absoluteUrl("/services"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/donate"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/contact"), changeFrequency: "monthly", priority: 0.7 },
    {
      url: absoluteUrl("/reviews"),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: absoluteUrl("/privacy-policy"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: absoluteUrl("/terms-of-service"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Only list catalog hubs when they have content
  if (posts.length > 0) {
    staticRoutes.push({
      url: absoluteUrl("/posts"),
      changeFrequency: "daily",
      priority: 0.9,
    });
  }
  if (events.length > 0) {
    staticRoutes.push({
      url: absoluteUrl("/events"),
      changeFrequency: "weekly",
      priority: 0.85,
    });
  }

  const articleRoutes: MetadataRoute.Sitemap = posts.map(
    (post: SitemapSlug) => ({
      url: absoluteUrl(`/posts/${post.slug}`),
      lastModified: toLastModified(post.lastModified),
      changeFrequency: "weekly",
      priority: 0.7,
    }),
  );

  const courseRoutes: MetadataRoute.Sitemap = courses.map((course) => ({
    url: absoluteUrl(
      buildNestedContentPath("online-courses", course.slug, course.parent),
    ),
    lastModified: toLastModified(course.lastModified),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
    url: absoluteUrl(
      buildNestedContentPath("services", service.slug, service.parent),
    ),
    lastModified: toLastModified(service.lastModified),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const eventRoutes: MetadataRoute.Sitemap = events.map(
    (event: SitemapSlug) => ({
      url: absoluteUrl(`/events/${event.slug}`),
      lastModified: toLastModified(event.lastModified),
      changeFrequency: "weekly",
      priority: 0.75,
    }),
  );

  return [
    ...staticRoutes,
    ...articleRoutes,
    ...courseRoutes,
    ...serviceRoutes,
    ...eventRoutes,
  ];
}
