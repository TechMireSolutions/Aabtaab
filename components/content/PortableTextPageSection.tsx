import ProseSection from "@/components/portable-text/ProseSection";

interface PortableTextPageSectionProps {
  body?: unknown[];
}

export default function PortableTextPageSection({
  body,
}: PortableTextPageSectionProps) {
  if (!body?.length) return null;

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <ProseSection value={body} />
      </div>
    </section>
  );
}
