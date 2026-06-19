import CatalogPageLayout from "@/components/layout/CatalogPageLayout";
import EventCardGrid from "@/components/content/EventCardGrid";
import { defineCmsPageMetadata } from "@/lib/cms/page";
import { getCmsPage, getEvents } from "@/lib/cms/queries";

export const generateMetadata = defineCmsPageMetadata("events", {
  path: "/events",
  fallbackTitle: "Events",
  fallbackDescription:
    "Shia Islamic events, majalis, and community programs near you.",
});

export default async function EventsPage() {
  const [events, page] = await Promise.all([
    getEvents(),
    getCmsPage("events"),
  ]);
  const eventList = events ?? [];

  return (
    <CatalogPageLayout
      eyebrow={page?.eyebrow || "Community"}
      title={page?.title || "Events"}
      subtitle={
        page?.subtitle ||
        "Majalis, programs, and gatherings for the Shia Muslim community."
      }
      isEmpty={eventList.length === 0}
      emptyMessage="No events scheduled yet. Check back soon."
    >
      <EventCardGrid events={eventList} />
    </CatalogPageLayout>
  );
}
