import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cardImageUrl } from "@/sanity/lib/image";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { resolveDocOgImage } from "@/lib/seo/resolve-og-image";
import type { EventDetail } from "@/types/event";
import { getEventBySlug } from "./queries";

export function resolveEventImageUrls(event: EventDetail) {
  const mainImageUrl = event.image ? cardImageUrl(event.image) : undefined;
  const ogImage = resolveDocOgImage(event);
  return { mainImageUrl, ogImageUrl: ogImage };
}

export async function buildEventPageMetadata(slug: string): Promise<Metadata> {
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const { ogImageUrl: og } = resolveEventImageUrls(event);

  const title = event.seo?.metaTitle ?? event.title ?? "Event";
  const description = event.seo?.metaDescription ?? event.description;
  const path = `/events/${slug}`;

  return buildPageMetadata({
    title,
    description,
    path,
    noIndex: Boolean(event.seo?.noIndex),
    ogImage: og,
    keywords: event.seo?.keywords,
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
