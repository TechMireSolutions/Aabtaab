import ContentCard from "@/components/cards/ContentCard";
import CatalogPageLayout from "@/components/layout/CatalogPageLayout";
import { defineCmsPageMetadata } from "@/lib/cms/page";
import { getCmsPage, getTopLevelServices } from "@/lib/cms/queries";
import { cardImageUrl } from "@/sanity/lib/image";
import { nestedListCtaLabel } from "@/lib/catalog/formatters";

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {serviceList.map((service) => (
          <ContentCard
            key={service._id}
            href={`/services/${service.slug.current}`}
            image={service.icon ? cardImageUrl(service.icon) : null}
            title={service.title}
            description={service.excerpt || service.price || null}
            ctaLabel={nestedListCtaLabel(service.childCount, {
              parent: "View Services",
              leaf: "Book Now",
            })}
          />
        ))}
      </div>
    </CatalogPageLayout>
  );
}
