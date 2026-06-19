"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import ContentCard from "@/components/cards/ContentCard";

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
}

export default function CarouselSection({
  eyebrow,
  title,
  subtitle,
  items,
  viewAllHref,
  viewAllLabel = "View all",
  bg = "white",
}: CarouselSectionProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateScrollButtons = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    updateScrollButtons();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);
    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [updateScrollButtons, items]);

  function scrollBy(dir: "left" | "right") {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("[data-card]") as HTMLElement | null;
    const amount = card ? card.offsetWidth + 24 : 320;
    el.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }

  if (!items.length) return null;

  const bgClass = bg === "gray" ? "bg-slate-50" : "bg-white";

  return (
    <section className={`section-y-lg border-b border-gray-100 ${bgClass}`}>
      <div className="container-page">
        <div className="mb-7 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-eyebrow mb-2 flex items-center gap-2">
              <span className="eyebrow-line" />
              {eyebrow}
            </p>
            <h2 className="heading-section">{title}</h2>
            {subtitle && (
              <p className="text-body-muted mt-1.5 max-w-md">{subtitle}</p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-3 sm:ml-6">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scrollBy("left")}
                disabled={!canLeft}
                aria-label="Previous"
                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                  canLeft
                    ? "border-gray-200 text-gray-500 hover:border-brand-500 hover:bg-brand-50 hover:text-brand-600"
                    : "cursor-not-allowed border-gray-100 text-gray-300"
                }`}
              >
                <ChevronLeft size={16} strokeWidth={2} />
              </button>
              <button
                onClick={() => scrollBy("right")}
                disabled={!canRight}
                aria-label="Next"
                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                  canRight
                    ? "border-gray-200 text-gray-500 hover:border-brand-500 hover:bg-brand-50 hover:text-brand-600"
                    : "cursor-not-allowed border-gray-100 text-gray-300"
                }`}
              >
                <ChevronRight size={16} strokeWidth={2} />
              </button>
            </div>

            <Link href={viewAllHref} className="link-brand group whitespace-nowrap">
              {viewAllLabel}
              <ArrowRight
                size={13}
                strokeWidth={2.5}
                className="transition-transform duration-150 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>

        <div className="relative">
          <div
            className={`pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-10 bg-linear-to-r transition-opacity duration-200 ${
              bg === "gray" ? "from-slate-50" : "from-white"
            } to-transparent ${canLeft ? "opacity-100" : "opacity-0"}`}
          />
          <div
            className={`pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-10 bg-linear-to-l transition-opacity duration-200 ${
              bg === "gray" ? "from-slate-50" : "from-white"
            } to-transparent ${canRight ? "opacity-100" : "opacity-0"}`}
          />

          <div
            ref={trackRef}
            className="scrollbar-hide flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch]"
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
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
