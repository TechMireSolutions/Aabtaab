import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CalendarDays, MapPin, ExternalLink } from "lucide-react";
import ProseSection from "@/components/portable-text/ProseSection";
import {
  buildEventPageMetadata,
  formatEventDateRange,
  formatEventLocation,
  resolveEventImageUrls,
} from "@/lib/cms/event";
import { getEventBySlug, getSiteSettings } from "@/lib/cms/queries";
import { EventJsonLd, getSiteUrl } from "@/lib/seo";

const siteUrl = getSiteUrl();

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return buildEventPageMetadata(slug);
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [event, settings] = await Promise.all([
    getEventBySlug(slug),
    getSiteSettings(),
  ]);
  if (!event) notFound();

  const { mainImageUrl } = resolveEventImageUrls(event);
  const location = formatEventLocation(event);
  const dateLabel = formatEventDateRange(event.startDate, event.endDate);

  return (
    <div className="min-h-screen bg-white">
      <EventJsonLd
        title={event.title}
        description={event.seo?.metaDescription || event.description}
        startDate={event.startDate}
        endDate={event.endDate}
        imageUrl={mainImageUrl}
        eventType={event.eventType}
        status={event.status}
        venueName={event.venueName}
        streetAddress={event.streetAddress}
        city={event.city}
        state={event.state}
        postalCode={event.postalCode}
        country={event.country}
        onlineUrl={event.onlineUrl}
        organizerName={event.organizerName || settings?.siteName}
        organizerUrl={event.organizerUrl || siteUrl}
        registrationUrl={event.registrationUrl}
        isFree={event.isFree}
        price={event.price}
        siteUrl={siteUrl}
        slug={slug}
      />

      <div className="sticky-below-header z-10 border-b border-gray-100 bg-white">
        <div className="container-content py-3">
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-sm-plus font-medium text-gray-500 transition-colors hover:text-slate-900 group"
          >
            <ArrowLeft
              size={13}
              strokeWidth={2}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            Back to Events
          </Link>
        </div>
      </div>

      <article className="container-content section-y">
        {event.status === "EventCancelled" && (
          <span className="badge-pill mb-4 border-red-200 bg-red-50 text-red-700">
            Cancelled
          </span>
        )}

        <h1 className="heading-page mb-4 sm:mb-5">{event.title}</h1>

        <div className="text-caption mb-8 flex flex-wrap items-center gap-4 border-b border-gray-100 pb-7">
          <span className="flex items-center gap-1.5">
            <CalendarDays size={13} strokeWidth={2} />
            {dateLabel}
          </span>
          {location && (
            <span className="flex items-center gap-1.5">
              <MapPin size={13} strokeWidth={2} />
              {location}
            </span>
          )}
          {event.isFree ? (
            <span className="font-medium text-brand-700">Free</span>
          ) : event.price ? (
            <span className="font-medium text-slate-700">{event.price}</span>
          ) : null}
        </div>

        {mainImageUrl && (
          <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-xl shadow-sm sm:mb-10 sm:rounded-2xl">
            <Image
              src={mainImageUrl}
              alt={event.image?.alt ?? event.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              priority
              className="object-cover"
            />
          </div>
        )}

        {event.description && (
          <p className="text-lead mb-8 text-slate-600">{event.description}</p>
        )}

        {event.body && (
          <ProseSection value={event.body} variant="article" />
        )}

        {event.registrationUrl && (
          <div className="mt-10">
            <a
              href={event.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2"
            >
              Register
              <ExternalLink size={14} />
            </a>
          </div>
        )}
      </article>
    </div>
  );
}
