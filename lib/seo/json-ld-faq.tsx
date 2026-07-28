import { JsonLd } from "./json-ld";

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
