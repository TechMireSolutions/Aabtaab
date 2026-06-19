import ContentCard from "@/components/cards/ContentCard";
import { cardImageUrl } from "@/sanity/lib/image";
import {
  formatEventDateRange,
  formatEventLocation,
} from "@/lib/cms/event";
import type { EventSummary } from "@/types/event";

interface EventCardGridProps {
  events: EventSummary[];
  emptyMessage?: string;
}

export default function EventCardGrid({
  events,
  emptyMessage = "No events scheduled yet.",
}: EventCardGridProps) {
  if (events.length === 0) {
    return <p className="empty-state">{emptyMessage}</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      {events.map((event) => {
        const slug = event.slug.current;
        const location = formatEventLocation(event);
        const dateLabel = formatEventDateRange(
          event.startDate,
          event.endDate,
        );
        const priceLabel = event.isFree
          ? "Free"
          : event.price || null;

        return (
          <ContentCard
            key={event._id}
            href={`/events/${slug}`}
            image={event.image ? cardImageUrl(event.image) : null}
            title={event.title}
            description={
              [dateLabel, location, priceLabel].filter(Boolean).join(" · ") ||
              event.description ||
              null
            }
            badge={
              event.status === "EventCancelled"
                ? "Cancelled"
                : event.eventType === "OnlineEventAttendanceMode"
                  ? "Online"
                  : null
            }
            ctaLabel="View Event"
          />
        );
      })}
    </div>
  );
}
