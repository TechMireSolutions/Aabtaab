import dynamic from "next/dynamic";
import type { EventSummary } from "@/types/event";

const EventsCountdown = dynamic(() => import("./EventsCountdown"), {
  ssr: true,
});

export default function UpcomingEventsCountdown({
  events,
}: {
  events: EventSummary[];
}) {
  if (!events.length) return null;
  return <EventsCountdown events={events} />;
}
