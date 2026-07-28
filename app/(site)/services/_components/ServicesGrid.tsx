import ContentCard from "@/components/cards/ContentCard";
import {
  nestedListCtaLabel,
  SERVICE_NESTED_CTA_LABELS,
} from "@/lib/catalog/formatters";
import { cardImageUrl } from "@/sanity/lib/image";
import type { TopLevelServiceSummary } from "@/types/catalog";

interface ServicesGridProps {
  services: TopLevelServiceSummary[];
}

export default function ServicesGrid({ services }: ServicesGridProps) {
  return (
    <div className="grid-catalog-cards">
      {services.map((service) => (
        <ContentCard
          key={service._id}
          href={`/services/${service.slug.current}`}
          image={service.icon ? cardImageUrl(service.icon) : null}
          title={service.title}
          description={service.excerpt || service.price || null}
          ctaLabel={nestedListCtaLabel(
            service.childCount,
            SERVICE_NESTED_CTA_LABELS,
          )}
        />
      ))}
    </div>
  );
}
