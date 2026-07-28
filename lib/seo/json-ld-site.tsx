import { JsonLd } from "./json-ld";

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
