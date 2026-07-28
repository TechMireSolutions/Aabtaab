import { permanentRedirect } from "next/navigation";
import {
  buildNestedBreadcrumbItems,
  buildNestedContentPath,
  getContentAncestry,
} from "@/lib/paths";
import { getSiteUrl } from "@/lib/seo";
import { whatsappUrl } from "@/lib/urls";
import type { ContentAncestor, SlugParent } from "@/types/sanity";
import type { SiteSettings } from "@/types/site-settings";

export interface NestedCatalogBase {
  segment: "online-courses" | "services";
  label: string;
  eyebrow: string;
}

interface NestedCatalogItem<TChild = unknown> {
  title: string;
  slug: { current: string };
  children?: TChild[] | null;
  parent?: ContentAncestor;
}

export interface NestedCatalogPageContext<TChild = unknown> {
  currentSlug: string;
  currentPath: string;
  childItems: TChild[];
  hasChildren: boolean;
  ancestry: ContentAncestor[];
  siteUrl: string;
  whatsappHref: string;
  breadcrumbItems: Array<{ name: string; url: string }>;
}

export function resolveCurrentSlug(slug: string[]): string {
  return slug[slug.length - 1];
}

/** Build catch-all `generateStaticParams` entries from sitemap path rows. */
export function nestedStaticParamsFromEntries(
  segment: NestedCatalogBase["segment"],
  entries: Array<{ slug: string; parent?: SlugParent | null }> | null | undefined,
): Array<{ slug: string[] }> {
  const prefix = `/${segment}/`;
  return (entries ?? []).map((entry) => {
    const path = buildNestedContentPath(segment, entry.slug, entry.parent);
    return {
      slug: path.startsWith(prefix)
        ? path.slice(prefix.length).split("/").filter(Boolean)
        : path.split("/").filter(Boolean),
    };
  });
}

/** 301 to the canonical nested path when the URL ancestry is wrong. */
export function ensureCanonicalNestedPath(
  base: NestedCatalogBase,
  item: {
    slug: { current: string };
    parent?: ContentAncestor | SlugParent | null;
  },
  currentPath: string,
): void {
  const canonicalPath = buildNestedContentPath(
    base.segment,
    item.slug.current,
    (item.parent as SlugParent | null | undefined) ?? null,
  );
  if (currentPath !== canonicalPath) {
    permanentRedirect(canonicalPath);
  }
}

export function buildNestedCatalogPageContext<TChild>(
  base: NestedCatalogBase,
  slug: string[],
  item: NestedCatalogItem<TChild>,
  site: SiteSettings | null | undefined,
): NestedCatalogPageContext<TChild> {
  const currentSlug = resolveCurrentSlug(slug);
  const childItems = Array.isArray(item.children) ? item.children : [];
  const currentPath = `/${base.segment}/${slug.join("/")}`;
  const ancestry = getContentAncestry(item);
  const siteUrl = getSiteUrl();

  return {
    currentSlug,
    currentPath,
    childItems,
    hasChildren: childItems.length > 0,
    ancestry,
    siteUrl,
    whatsappHref: site?.whatsapp ? whatsappUrl(site.whatsapp) : "/contact",
    breadcrumbItems: buildNestedBreadcrumbItems(
      base.segment,
      base.label,
      ancestry,
      item.title,
      currentPath,
      siteUrl,
    ),
  };
}
