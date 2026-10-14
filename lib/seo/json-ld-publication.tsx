import { JsonLd } from "./json-ld";

interface PublicationJsonLdProps {
  title: string;
  description?: string;
  imageUrl?: string;
  publisherLogoUrl?: string;
  publishedAt?: string;
  authorName?: string;
  siteUrl: string;
  slug: string;
  siteName: string;
  fileUrl?: string;
  language?: string;
  pages?: number;
}

export function PublicationJsonLd({
  title,
  description,
  imageUrl,
  publisherLogoUrl,
  publishedAt,
  authorName,
  siteUrl,
  slug,
  siteName,
  fileUrl,
  language,
  pages,
}: PublicationJsonLdProps) {
  const publicationUrl = `${siteUrl}/publications/${slug}`;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: title,
    ...(description && { description }),
    ...(imageUrl && { image: [imageUrl] }),
    ...(publishedAt && { datePublished: publishedAt }),
    ...(language && { inLanguage: language }),
    ...(pages && { numberOfPages: pages }),
    bookFormat: "https://schema.org/EBook",
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
    mainEntityOfPage: { "@type": "WebPage", "@id": publicationUrl },
    url: publicationUrl,
    ...(fileUrl && {
      encoding: {
        "@type": "MediaObject",
        contentUrl: fileUrl,
        encodingFormat: "application/pdf",
      },
    }),
  };

  return <JsonLd schema={schema} />;
}
