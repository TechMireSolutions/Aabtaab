import { getContentAncestry } from "@/lib/paths";
import { getSiteUrl } from "@/lib/seo";
import { whatsappUrl } from "@/lib/urls";
import type { ContentAncestor } from "@/types/sanity";
import type { SiteSettings } from "@/types/sanity";

export interface NestedCatalogBase {
  segment: "online-courses" | "services";
  label: string;
  eyebrow: string;
}

interface NestedCatalogItem {
  title: string;
  children?: unknown[] | null;
  parent?: ContentAncestor;
}

export interface NestedCatalogPageContext {
  currentSlug: string;
  currentPath: string;
  childItems: unknown[];
  hasChildren: boolean;
  ancestry: ContentAncestor[];
  siteUrl: string;
  whatsappHref: string;
}

export function resolveCurrentSlug(slug: string[]): string {
  return slug[slug.length - 1];
}

export function buildNestedCatalogPageContext(
  base: NestedCatalogBase,
  slug: string[],
  item: NestedCatalogItem,
  site: SiteSettings | null | undefined,
): NestedCatalogPageContext {
  const currentSlug = resolveCurrentSlug(slug);
  const childItems = Array.isArray(item.children) ? item.children : [];
  const currentPath = `/${base.segment}/${slug.join("/")}`;

  return {
    currentSlug,
    currentPath,
    childItems,
    hasChildren: childItems.length > 0,
    ancestry: getContentAncestry(item),
    siteUrl: getSiteUrl(),
    whatsappHref: site?.whatsapp ? whatsappUrl(site.whatsapp) : "/contact",
  };
}
