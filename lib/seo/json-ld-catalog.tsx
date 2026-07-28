import { JsonLd } from "./json-ld";

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
