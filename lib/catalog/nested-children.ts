import { cardImageUrl } from "@/sanity/lib/image";
import { formatPriceDuration, nestedListCtaLabel } from "@/lib/urls";
import { normalizePublicTitle } from "@/lib/catalog/subjects";
import type { CourseChild } from "@/types/course";
import type { ServiceChild } from "@/types/service";

interface NestedChildCard {
  _id: string;
  slug: string;
  title: string;
  imageUrl: string | null;
  description: string | null;
  ctaLabel: string;
}

interface CtaLabels {
  parent: string;
  leaf: string;
}

export function mapCourseChildForGrid(
  child: CourseChild,
  labels: CtaLabels,
): NestedChildCard {
  return {
    _id: child._id,
    slug: child.slug,
    title: normalizePublicTitle(child.title),
    imageUrl: child.featuredImage ? cardImageUrl(child.featuredImage) : null,
    description:
      child.excerpt ||
      formatPriceDuration(child.price, child.duration) ||
      null,
    ctaLabel: nestedListCtaLabel(child.childCount, labels),
  };
}

export function mapServiceChildForGrid(
  child: ServiceChild,
  labels: CtaLabels,
): NestedChildCard {
  return {
    _id: child._id,
    slug: child.slug,
    title: child.title,
    imageUrl: child.icon ? cardImageUrl(child.icon) : null,
    description: child.excerpt || child.price || null,
    ctaLabel: nestedListCtaLabel(child.childCount, labels),
  };
}
