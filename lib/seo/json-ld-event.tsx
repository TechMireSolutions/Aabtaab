import { JsonLd } from "./json-ld";

interface EventSchemaProps {
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  imageUrl?: string;
  eventType?: string;
  status?: string;
  venueName?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  onlineUrl?: string;
  organizerName?: string;
  organizerUrl?: string;
  registrationUrl?: string;
  isFree?: boolean;
  price?: string;
  siteUrl: string;
  slug: string;
}

function buildEventLocation({
  eventType,
  venueName,
  streetAddress,
  city,
  state,
  postalCode,
  country,
  onlineUrl,
}: Pick<
  EventSchemaProps,
  | "eventType"
  | "venueName"
  | "streetAddress"
  | "city"
  | "state"
  | "postalCode"
  | "country"
  | "onlineUrl"
>): Record<string, unknown> | Record<string, unknown>[] | undefined {
  const isOnline = eventType === "OnlineEventAttendanceMode";
  const isHybrid = eventType === "MixedEventAttendanceMode";
  const hasPhysical = Boolean(venueName || streetAddress);
  const hasVirtual = Boolean((isOnline || isHybrid) && onlineUrl);

  const physical =
    hasPhysical && !isOnline
      ? {
          "@type": "Place",
          name: venueName,
          address: {
            "@type": "PostalAddress",
            streetAddress,
            addressLocality: city,
            addressRegion: state,
            postalCode,
            addressCountry: country || "US",
          },
        }
      : null;

  const virtual = hasVirtual
    ? { "@type": "VirtualLocation", url: onlineUrl }
    : null;

  if (physical && virtual) return [physical, virtual];
  if (physical) return physical;
  if (virtual) return virtual;
  return undefined;
}

export function EventJsonLd({
  title,
  description,
  startDate,
  endDate,
  imageUrl,
  eventType,
  status,
  venueName,
  streetAddress,
  city,
  state,
  postalCode,
  country,
  onlineUrl,
  organizerName,
  organizerUrl,
  registrationUrl,
  isFree,
  price,
  siteUrl,
  slug,
}: EventSchemaProps) {
  const location = buildEventLocation({
    eventType,
    venueName,
    streetAddress,
    city,
    state,
    postalCode,
    country,
    onlineUrl,
  });

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: title,
    startDate,
    ...(endDate && { endDate }),
    ...(description && { description }),
    ...(imageUrl && { image: imageUrl }),
    eventStatus: `https://schema.org/${status || "EventScheduled"}`,
    eventAttendanceMode: `https://schema.org/${eventType || "OfflineEventAttendanceMode"}`,
    url: `${siteUrl}/events/${slug}`,
    ...(location && { location }),
    ...(organizerName && {
      organizer: {
        "@type": "Organization",
        name: organizerName,
        ...(organizerUrl && { url: organizerUrl }),
      },
    }),
    offers: {
      "@type": "Offer",
      price: isFree ? "0" : price || undefined,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      ...(registrationUrl && { url: registrationUrl }),
    },
    inLanguage: "en-US",
  };

  return <JsonLd schema={schema} />;
}
