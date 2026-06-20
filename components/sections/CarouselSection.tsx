import Link from "next/link";
import ContentCard from "@/components/cards/ContentCard";
import CarouselScrollButtons from "@/components/sections/CarouselScrollButtons";

export interface CarouselItem {
  id: string;
  image?: string | null;
  title: string;
  description?: string | null;
  href: string;
  badge?: string | null;
  ctaLabel?: string;
}

interface CarouselSectionProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  items: CarouselItem[];
  viewAllHref: string;
  viewAllLabel?: string;
  bg?: "white" | "gray";
  /** Stable id for scroll track — defaults from title */
  trackId?: string;
  deferImages?: boolean;
}

function slugify(value: string): string {
  return value
   .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function CarouselSection({
  eyebrow,
  title,
  subtitle,
  items,
  viewAllHref,
  viewAllLabel = "View all",
  bg = "white",
  trackId,
  deferImages = true,
}: CarouselSectionProps) {
  if (!items.length) return null;

  const resolvedTrackId = trackId ?? `carousel-${slugify(title)}`;
  const headingId = `${resolvedTrackId}-heading`;
  const bgClass = bg === "gray" ? "bg-slate-50" : "bg-white";

  return (
    <section
      className={`section-y-lg section-deferred border-b border-gray-100 ${bgClass}`}
      aria-labelledby={headingId}
    >
      <div className="container-page">
        <div className="mb-7 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-eyebrow mb-2 flex items-center gap-2">
              <span className="eyebrow-line" aria-hidden="true" />
              {eyebrow}
            </p>
            <h2 id={headingId} className="heading-section">
              {title}
            </h2>
            {subtitle && (
              <p className="text-body-muted mt-1.5 max-w-md">{subtitle}</p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-3 sm:ml-6">
            <CarouselScrollButtons trackId={resolvedTrackId} bg={bg} />

            <Link href={viewAllHref} className="link-brand group whitespace-nowrap">
              {viewAllLabel}
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5"
              >
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="relative">
          <div
            id={resolvedTrackId}
            tabIndex={0}
            role="region"
            aria-roledescription="carousel"
            aria-label={`${title} items`}
            className="scrollbar-hide flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            {items.map((item) => (
              <div
                key={item.id}
                data-card
                className="w-carousel-card shrink-0 snap-start sm:w-carousel-card-md lg:w-carousel-card-lg"
              >
                <ContentCard
                  image={item.image}
                  title={item.title}
                  description={item.description}
                  href={item.href}
                  badge={item.badge}
                  ctaLabel={item.ctaLabel}
                  lazyImage={deferImages}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
