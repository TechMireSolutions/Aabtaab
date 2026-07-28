import UpcomingEventsCountdown from "@/components/sections/UpcomingEventsCountdown";
import { getHomepageCarouselsData } from "@/lib/cms/queries";

export default async function UpcomingEventsLoader() {
  const { upcomingEvents } = await getHomepageCarouselsData();
  return <UpcomingEventsCountdown events={upcomingEvents ?? []} />;
}
