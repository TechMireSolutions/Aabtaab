import ProseSection from "@/components/portable-text/ProseSection";

interface PortableTextPageSectionProps {
  body?: unknown[];
}

export default function PortableTextPageSection({
  body,
}: PortableTextPageSectionProps) {
  if (!body?.length) return null;

  return (
    <section className="section-y bg-white dark:bg-slate-950">
      <div className="container-content">
        <ProseSection value={body} />
      </div>
    </section>
  );
}
