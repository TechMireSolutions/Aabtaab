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
  publishedAt?: string;
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
  publishedAt,
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
      ...(imageUrl && { image: imageUrl }),
      ...(publishedAt && {
        datePublished: publishedAt,
        dateModified: publishedAt,
      }),
      author: authorName
        ? { "@type": "Person", name: authorName }
        : { "@type": "Organization", name: siteName },
      publisher: {
        "@type": "Organization",
        name: siteName,
        ...(imageUrl && { logo: { "@type": "ImageObject", url: imageUrl } }),
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
      url: articleUrl,
    },
  ];

  if (faqItems && faqItems.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map(({ question, answer }) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    });
  }

  return <JsonLd schema={schemas} />;
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
  const isOnline = eventType === "OnlineEventAttendanceMode";
  const isHybrid = eventType === "MixedEventAttendanceMode";

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
    ...((venueName || streetAddress) && {
      location: isOnline
        ? undefined
        : {
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
          },
    }),
    ...((isOnline || isHybrid) &&
      onlineUrl && {
        location: {
          "@type": "VirtualLocation",
          url: onlineUrl,
        },
      }),
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
