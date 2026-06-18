import type { Metadata } from "next";

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://aabtaab.com").replace(
    /\/$/,
    "",
  );
}

export function absoluteUrl(path = "/"): string {
  const siteUrl = getSiteUrl();
  if (!path || path === "/") return `${siteUrl}/`;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${normalized}`;
}

interface PageSeoOptions {
  title: string;
  description?: string;
  path: string;
  noIndex?: boolean;
  ogImage?: string;
  /** Use for homepage to avoid "Aabtaab | Aabtaab" from the title template */
  absoluteTitle?: boolean;
}

export function buildPageMetadata({
  title,
  description,
  path,
  noIndex,
  ogImage,
  absoluteTitle,
}: PageSeoOptions): Metadata {
  const url = absoluteUrl(path);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: true, googleBot: { index: false, follow: true } }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      locale: "en_US",
      ...(ogImage && {
        images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      }),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
  };
}

type SlugParent = { slug?: string; parent?: SlugParent | null };

export function buildNestedContentPath(
  base: "online-courses" | "services",
  slug: string,
  parent?: SlugParent | null,
): string {
  const segments: string[] = [];
  let cur: SlugParent | null | undefined = parent;
  while (cur?.slug) {
    segments.unshift(cur.slug);
    cur = cur.parent;
  }
  segments.push(slug);
  return `/${base}/${segments.join("/")}`;
}
