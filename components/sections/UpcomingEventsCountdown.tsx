import { getHomepageCarouselsData } from "@/lib/cms/queries";
import dynamic from "next/dynamic";

const EventsCountdown = dynamic(() => import("./EventsCountdown"), {
  ssr: true,
});

export default async function UpcomingEventsCountdown() {
  const { upcomingEvents } = await getHomepageCarouselsData();
  
  if (!upcomingEvents || upcomingEvents.length === 0) {
    return null;
  }
  
  return <EventsCountdown events={upcomingEvents} />;
}
