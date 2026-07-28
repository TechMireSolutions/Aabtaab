import dynamic from "next/dynamic";
import { getHomepageCarouselsData } from "@/lib/cms/queries";

const EventsCountdown = dynamic(
  () => import("@/components/sections/EventsCountdown"),
  { ssr: true },
);

export default async function UpcomingEventsLoader() {
  const { upcomingEvents } = await getHomepageCarouselsData();
  if (!upcomingEvents?.length) return null;
  return <EventsCountdown events={upcomingEvents} />;
}
