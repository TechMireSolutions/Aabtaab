import ContentCard from "@/components/cards/ContentCard";
import { nestedListCtaLabel } from "@/lib/catalog/formatters";
import { cardImageUrl } from "@/sanity/lib/image";
import type { TopLevelServiceSummary } from "@/types/catalog";

interface ServicesGridProps {
  services: TopLevelServiceSummary[];
}

export default function ServicesGrid({ services }: ServicesGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {services.map((service) => (
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
  );
}
