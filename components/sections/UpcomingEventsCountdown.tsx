import { getHomepageCarouselsData } from "@/lib/cms/queries";
import EventsCountdown from "./EventsCountdown";

export default async function UpcomingEventsCountdown() {
  const { upcomingEvents } = await getHomepageCarouselsData();
  
  if (!upcomingEvents || upcomingEvents.length === 0) {
    return null;
  }
  
  return <EventsCountdown events={upcomingEvents} />;
}
