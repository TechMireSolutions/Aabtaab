import type { Metadata } from "next";
import { ogImageUrl, cardImageUrl } from "@/sanity/lib/image";
import { buildPageMetadata } from "@/lib/seo/metadata";
import type { EventDetail } from "@/types/event";
import { getEventBySlug } from "./queries";

export function resolveEventImageUrls(event: EventDetail) {
  const mainImageUrl = event.image ? cardImageUrl(event.image) : undefined;
  const ogImage = event.seo?.ogImage
    ? ogImageUrl(event.seo.ogImage)
    : event.image
      ? ogImageUrl(event.image)
      : undefined;
  return { mainImageUrl, ogImageUrl: ogImage };
}

export async function buildEventPageMetadata(slug: string): Promise<Metadata> {
  const event = await getEventBySlug(slug);
  const { ogImageUrl: og } = event ? resolveEventImageUrls(event) : {};

  const title = event?.seo?.metaTitle ?? event?.title ?? "Event";
  const description = event?.seo?.metaDescription ?? event?.description;
  const path = `/events/${slug}`;

  return buildPageMetadata({
    title,
    description,
    path,
    noIndex: event?.seo?.noIndex,
    ogImage: og,
  });
}

export function formatEventDateRange(
  startDate: string,
  endDate?: string,
): string {
  const start = new Date(startDate);
  const opts: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  if (!endDate) {
    return start.toLocaleDateString("en-US", {
      ...opts,
      hour: "numeric",
      minute: "2-digit",
    });
  }
  const end = new Date(endDate);
  if (start.toDateString() === end.toDateString()) {
    return `${start.toLocaleDateString("en-US", opts)} · ${start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} – ${end.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
  }
  return `${start.toLocaleDateString("en-US", opts)} – ${end.toLocaleDateString("en-US", opts)}`;
}

export function formatEventLocation(
  event: Pick<EventDetail, "venueName" | "city" | "state">,
): string | null {
  const parts = [event.venueName, event.city, event.state].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : null;
}
