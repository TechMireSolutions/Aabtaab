import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { CalendarDays, MapPin, ExternalLink } from "lucide-react";
import ArticleDetailShell from "@/components/layout/ArticleDetailShell";
import ProseSection from "@/components/portable-text/ProseSection";
import {
  buildEventPageMetadata,
  formatEventDateRange,
  formatEventLocation,
  resolveEventImageUrls,
} from "@/lib/cms/event";
import { getEventBySlug, getSiteSettings } from "@/lib/cms/queries";
import { EventJsonLd, BreadcrumbJsonLd, getSiteUrl } from "@/lib/seo";
import { EXTERNAL_LINK_PROPS } from "@/lib/urls";
import OpensInNewTab from "@/components/ui/OpensInNewTab";

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
    <>
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
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteUrl },
          { name: "Events", url: `${siteUrl}/events` },
          { name: event.title, url: `${siteUrl}/events/${slug}` },
        ]}
      />

      <ArticleDetailShell backHref="/events" backLabel="Back to Events">
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
          <div className="media-hero mb-8 sm:mb-10">
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
              {...EXTERNAL_LINK_PROPS}
              className="btn-primary inline-flex items-center gap-2"
            >
              Register
              <ExternalLink size={14} aria-hidden="true" />
              <OpensInNewTab />
            </a>
          </div>
        )}
      </ArticleDetailShell>
    </>
  );
}
