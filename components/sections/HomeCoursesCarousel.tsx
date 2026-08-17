import dynamic from "next/dynamic";
import { cardImageUrl } from "@/sanity/lib/image";
import { formatPriceDuration, COURSE_NESTED_CTA_LABELS } from "@/lib/catalog/formatters";
import {
  formatSubjectLabel,
  normalizePublicTitle,
} from "@/lib/catalog/subjects";
import type { HomeCourseSummary, HomepageSettings } from "@/types/homepage";

const CarouselSection = dynamic(
  () => import("@/components/sections/CarouselSection"),
  { ssr: true },
);

interface HomeCoursesCarouselProps {
  courses: HomeCourseSummary[];
  homepage: HomepageSettings | null;
}

export default function HomeCoursesCarousel({
  courses,
  homepage: hp,
}: HomeCoursesCarouselProps) {
  const items = (courses ?? []).map((c) => ({
    id: c._id,
    image: c.featuredImage ? cardImageUrl(c.featuredImage) : null,
    title: normalizePublicTitle(c.title),
    description: formatPriceDuration(c.price, c.duration),
    href: `/online-courses/${c.slug.current}`,
    ctaHref: "/contact",
    badge: c.subject ? formatSubjectLabel(c.subject) : null,
    ctaLabel: COURSE_NESTED_CTA_LABELS.leaf,
  }));

  if (items.length === 0) return null;

  return (
    <CarouselSection
      eyebrow="Education"
      title={hp?.coursesHeading || "Online Courses"}
      subtitle={
        hp?.coursesSubheading ||
        "Learn from qualified scholars — Quran, Fiqh, Ethics & more"
      }
      items={items}
      viewAllHref="/online-courses"
      viewAllLabel="All Courses"
      bg="white"
      trackId="carousel-courses"
    />
  );
}
