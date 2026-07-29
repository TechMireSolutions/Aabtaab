import { getScholars } from "@/lib/cms/queries";
import PageHeader from "@/components/layout/PageHeader";
import { buildPageMetadata } from "@/lib/seo/metadata";
import ScholarsGrid from "./_components/ScholarsGrid";

export const metadata = buildPageMetadata({
  title: "Our Scholars",
  description:
    "Learn directly from highly qualified and experienced teachers of the Hawza.",
  path: "/scholars",
});

export default async function ScholarsPage() {
  const scholars = (await getScholars()) || [];

  return (
    <>
      <PageHeader
        eyebrow="Faculty"
        title="Our Scholars"
        subtitle="Learn directly from highly qualified and experienced teachers of the Hawza, dedicated to your spiritual and academic growth."
      />

      <section className="section-y relative bg-slate-50 dark:bg-slate-950 overflow-hidden flex-1">
        <div className="pointer-events-none absolute top-0 left-1/2 h-160 w-full max-w-5xl -translate-x-1/2 rounded-full bg-brand-500/5 blur-orb dark:bg-brand-500/10" />

        <div className="container-narrow relative z-10">
          <ScholarsGrid scholars={scholars} />
        </div>
      </section>
    </>
  );
}
