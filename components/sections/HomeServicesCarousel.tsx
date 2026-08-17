import dynamic from "next/dynamic";
import { cardImageUrl } from "@/sanity/lib/image";
import { SERVICE_NESTED_CTA_LABELS } from "@/lib/catalog/formatters";
import type { HomeServiceSummary, HomepageSettings } from "@/types/homepage";

const CarouselSection = dynamic(
  () => import("@/components/sections/CarouselSection"),
  { ssr: true },
);

interface HomeServicesCarouselProps {
  services: HomeServiceSummary[];
  homepage: HomepageSettings | null;
}

export default function HomeServicesCarousel({
  services,
  homepage: hp,
}: HomeServicesCarouselProps) {
  const items = (services ?? []).map((s) => ({
    id: s._id,
    image: s.icon ? cardImageUrl(s.icon) : null,
    title: s.title,
    description: s.children?.length
      ? s.children
          .slice(0, 4)
          .map((c) => c.title)
          .join(" · ")
      : (s.price ?? null),
    href: `/services/${s.slug.current}`,
    ctaHref: "/contact",
    badge: null,
    ctaLabel: SERVICE_NESTED_CTA_LABELS.leaf,
  }));

  if (items.length === 0) return null;

  return (
    <CarouselSection
      eyebrow="What we offer"
      title={hp?.servicesHeading || "Our Services"}
      subtitle={
        hp?.servicesSubheading ||
        "Religious services performed with sincerity and care"
      }
      items={items}
      viewAllHref="/services"
      viewAllLabel="All Services"
      bg="gray"
      trackId="carousel-services"
    />
  );
}
