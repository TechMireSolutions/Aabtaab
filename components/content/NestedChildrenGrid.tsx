import ContentCard from "@/components/cards/ContentCard";

export interface NestedChildCard {
  _id: string;
  slug: string;
  title: string;
  excerpt?: string;
  price?: string;
  duration?: string;
  childCount?: number;
  imageUrl?: string | null;
  description?: string | null;
  ctaLabel: string;
}

interface NestedChildrenGridProps {
  eyebrow: string;
  title: string;
  excerpt?: string;
  currentPath: string;
  items: NestedChildCard[];
}

export default function NestedChildrenGrid({
  eyebrow,
  title,
  excerpt,
  currentPath,
  items,
}: NestedChildrenGridProps) {
  return (
    <div className="container-page section-y">
      <p className="text-eyebrow mb-3 flex items-center gap-2">
        <span className="eyebrow-line" />
        {eyebrow}
      </p>
      <h1 className="heading-page mb-2">{title}</h1>
      {excerpt && (
        <p className="text-body-muted mb-10 max-w-copy">{excerpt}</p>
      )}
      <div className="grid-catalog-cards">
        {items.map((child) => (
          <ContentCard
            key={child._id}
            href={`${currentPath}/${child.slug}`}
            image={child.imageUrl}
            title={child.title}
            description={child.description}
            ctaLabel={child.ctaLabel}
          />
        ))}
      </div>
    </div>
  );
}
