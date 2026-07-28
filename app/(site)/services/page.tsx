import CatalogPageLayout from "@/components/layout/CatalogPageLayout";
import ServicesGrid from "./_components/ServicesGrid";
import { defineCmsPageMetadata } from "@/lib/cms/page";
import { getCmsPage, getTopLevelServices } from "@/lib/cms/queries";

export const generateMetadata = defineCmsPageMetadata("services", {
  path: "/services",
  fallbackTitle: "Services",
  fallbackDescription:
    "Religious services — Niyabat Ziarat, Zakat, Khums, Ijara, and more.",
});

export default async function ServicesPage() {
  const [services, page] = await Promise.all([
    getTopLevelServices(),
    getCmsPage("services"),
  ]);
  const serviceList = services ?? [];

  return (
    <CatalogPageLayout
      eyebrow={page?.eyebrow || "What We Offer"}
      title={page?.title || "Services"}
      subtitle={
        page?.subtitle ||
        "Religious services offered with sincerity — Niyabat Ziarat, Zakat, Khums & more."
      }
      isEmpty={serviceList.length === 0}
      emptyMessage="Services coming soon."
    >
      <ServicesGrid services={serviceList} />
    </CatalogPageLayout>
  );
}
