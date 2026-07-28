import dynamic from "next/dynamic";
import { formatEventDateRange } from "@/lib/cms/event";
import { urlFor } from "@/sanity/lib/image";
import type { EventSummary } from "@/types/event";

const CarouselSection = dynamic(
  () => import("@/components/sections/CarouselSection"),
  { ssr: true },
);

interface HomeEventsCarouselProps {
  upcomingEvents: EventSummary[];
}

export default function HomeEventsCarousel({
  upcomingEvents,
}: HomeEventsCarouselProps) {
  const items = (upcomingEvents ?? [])
    .slice(0, 6)
    .map((event) => ({
      id: event._id,
      image: event.image
        ? urlFor(event.image).width(480).height(360).url()
        : null,
      title: event.title,
      description: formatEventDateRange(event.startDate, event.endDate),
      href: `/events/${event.slug.current}`,
      badge: event.city || null,
      ctaLabel: "View Event",
    }));

  if (items.length === 0) return null;

  return (
    <CarouselSection
      eyebrow="Community"
      title="Upcoming Events"
      subtitle="Majalis, programs, and gatherings for the Ummah"
      items={items}
      viewAllHref="/events"
      viewAllLabel="All Events"
      bg="white"
      trackId="carousel-events"
    />
  );
}
