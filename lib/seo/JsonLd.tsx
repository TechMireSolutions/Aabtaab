// Server component — renders JSON-LD structured data into <script> tags.

interface JsonLdProps {
  schema: Record<string, unknown> | Record<string, unknown>[];
}

export function JsonLd({ schema }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ArticleSchemaProps {
  title: string;
  description?: string;
  imageUrl?: string;
  publisherLogoUrl?: string;
  publishedAt?: string;
  updatedAt?: string;
  authorName?: string;
  siteUrl: string;
  slug: string;
  siteName: string;
  faqItems?: Array<{ question: string; answer: string }>;
}

export function ArticleJsonLd({
  title,
  description,
  imageUrl,
  publisherLogoUrl,
  publishedAt,
  updatedAt,
  authorName,
  siteUrl,
  slug,
  siteName,
  faqItems,
}: ArticleSchemaProps) {
  const articleUrl = `${siteUrl}/posts/${slug}`;

  const schemas: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      ...(description && { description }),
      ...(imageUrl && { image: [imageUrl] }),
      ...(publishedAt && { datePublished: publishedAt }),
      ...(updatedAt || publishedAt
        ? { dateModified: updatedAt ?? publishedAt }
        : {}),
      author: authorName
        ? { "@type": "Person", name: authorName }
        : { "@type": "Organization", name: siteName },
      publisher: {
        "@type": "Organization",
        name: siteName,
        ...(publisherLogoUrl && {
          logo: { "@type": "ImageObject", url: publisherLogoUrl },
        }),
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
      url: articleUrl,
      inLanguage: "en-US",
    },
  ];

  const faqSchema = buildFaqPageSchema(faqItems);
  if (faqSchema) schemas.push(faqSchema);

  return <JsonLd schema={schemas} />;
}

export function buildFaqPageSchema(
  faqItems?: Array<{ question: string; answer: string }>,
): Record<string, unknown> | null {
  if (!faqItems?.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}

export function FaqPageJsonLd({
  faqItems,
}: {
  faqItems?: Array<{ question: string; answer: string }>;
}) {
  const schema = buildFaqPageSchema(faqItems);
  if (!schema) return null;
  return <JsonLd schema={schema} />;
}

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

interface CourseSchemaProps {
  title: string;
  description?: string;
  imageUrl?: string;
  siteName: string;
  siteUrl: string;
  url: string;
  price?: string;
  instructor?: string;
  duration?: string;
}

export function CourseJsonLd({
  title,
  description,
  imageUrl,
  siteName,
  siteUrl,
  url,
  price,
  instructor,
  duration,
}: CourseSchemaProps) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: title,
    ...(description && { description }),
    ...(imageUrl && { image: [imageUrl] }),
    url,
    courseMode: "Online",
    inLanguage: "en-US",
    ...(duration && {
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "Online",
        ...(duration && { duration }),
      },
    }),
    provider: {
      "@type": "Organization",
      name: siteName,
      url: siteUrl,
    },
    ...(instructor && {
      instructor: { "@type": "Person", name: instructor },
    }),
    ...(price && {
      offers: {
        "@type": "Offer",
        price,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url,
      },
    }),
  };

  return <JsonLd schema={schema} />;
}

interface ServiceSchemaProps {
  title: string;
  description?: string;
  imageUrl?: string;
  siteName: string;
  siteUrl: string;
  url: string;
  price?: string;
}

export function ServiceJsonLd({
  title,
  description,
  imageUrl,
  siteName,
  siteUrl,
  url,
  price,
}: ServiceSchemaProps) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: title,
    ...(description && { description }),
    ...(imageUrl && { image: imageUrl }),
    url,
    serviceType: title,
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
    provider: {
      "@type": "Organization",
      name: siteName,
      url: siteUrl,
    },
    ...(price && {
      offers: {
        "@type": "Offer",
        price,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url,
      },
    }),
  };

  return <JsonLd schema={schema} />;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLd schema={schema} />;
}

interface WebSiteSchemaProps {
  siteName: string;
  siteUrl: string;
  description?: string;
}

export function WebSiteJsonLd({
  siteName,
  siteUrl,
  description,
}: WebSiteSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
    ...(description && { description }),
    inLanguage: "en-US",
    publisher: {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: siteName,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return <JsonLd schema={schema} />;
}
