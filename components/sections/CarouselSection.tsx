"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || items.length === 0) return;

    function handleScroll() {
      if (!el) return;
      const { scrollLeft, scrollWidth, clientWidth } = el;
      setCanScrollLeft(scrollLeft > 4);
      setCanScrollRight(scrollWidth - clientWidth - scrollLeft > 4);
    }

    handleScroll();

    el.addEventListener("scroll", handleScroll, { passive: true });
    
    // ResizeObserver to handle width adjustments dynamically
    const observer = new ResizeObserver(handleScroll);
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [items]);

  if (!items.length) return null;

  const resolvedTrackId = trackId ?? `carousel-${slugify(title)}`;
  const headingId = `${resolvedTrackId}-heading`;
  const bgClass = bg === "gray" ? "bg-slate-50 dark:bg-slate-900" : "bg-white dark:bg-slate-950";

  return (
    <section
      className={`section-y-lg section-deferred border-b border-gray-100 dark:border-slate-900 ${bgClass}`}
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
              <ArrowRight
                size={14}
                strokeWidth={2.5}
                className="transition-transform duration-150 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>

        <div className="relative">
          {/* Left Fade Overlay */}
          <div
            className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r ${
              bg === "gray"
                ? "from-slate-50 dark:from-slate-900"
                : "from-white dark:from-slate-950"
            } to-transparent transition-opacity duration-300 ${
              canScrollLeft ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Right Fade Overlay */}
          <div
            className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l ${
              bg === "gray"
                ? "from-slate-50 dark:from-slate-900"
                : "from-white dark:from-slate-950"
            } to-transparent transition-opacity duration-300 ${
              canScrollRight ? "opacity-100" : "opacity-0"
            }`}
          />

          <div
            ref={scrollRef}
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
