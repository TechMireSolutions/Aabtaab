import { JsonLd } from "./json-ld";
import { buildFaqPageSchema } from "./json-ld-faq";

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
