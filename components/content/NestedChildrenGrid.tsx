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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <p className="flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.18em] text-cyan-600 mb-3">
        <span className="w-5 h-px bg-cyan-400 inline-block" />
        {eyebrow}
      </p>
      <h1 className="font-bold text-[30px] text-slate-900 tracking-[-0.02em] mb-2">
        {title}
      </h1>
      {excerpt && (
        <p className="text-[14px] text-gray-500 mb-10 max-w-2xl leading-relaxed">
          {excerpt}
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
