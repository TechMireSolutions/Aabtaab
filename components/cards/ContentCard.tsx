import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface ContentCardProps {
  image?: string | null;
  title: string;
  description?: string | null;
  href: string;
  ctaLabel?: string;
  badge?: string | null;
  active?: boolean;
  lazyImage?: boolean;
}

export default function ContentCard({
  image,
  title,
  description,
  href,
  ctaLabel = "Book Now",
  badge,
  active = false,
  lazyImage = true,
}: ContentCardProps) {
  return (
    <div
      className={`card-interactive group relative flex flex-col overflow-hidden ${
        active
          ? "border-brand-200/80 shadow-card-active"
          : ""
      }`}
    >
      {active && (
        <div className="absolute inset-x-0 top-0 z-10 h-card-accent bg-linear-to-r from-brand-400 via-brand-500 to-brand-300" />
      )}

      <Link href={href} className="block shrink-0 overflow-hidden">
        <div className="relative aspect-3/2 w-full bg-slate-100">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 320px"
              loading={lazyImage ? "lazy" : undefined}
              className="hover-scale-image"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-brand-50 via-brand-50 to-slate-100">
              <span className="text-5xl opacity-25 select-none">📖</span>
            </div>
          )}
          <div className="absolute inset-0 bg-slate-900/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      </Link>

      <div className="flex flex-1 flex-col px-4 pt-4 pb-5">
        {badge && <span className="badge-pill mb-3">{badge}</span>}

        <h3 className="mb-2 line-clamp-2 text-base-plus n font-semibold leading-snug text-[var(--color-text-page)]">
          <Link
            href={href}
            className="rounded-sm transition-colors duration-150 hover:text-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            {title}
          </Link>
        </h3>

        {description && (
          <p className="mb-4 line-clamp-2 flex-1 text-sm-plus text-[var(--color-text-muted)] leading-relaxed">
            {description}
          </p>
        )}

        <Link href={href} className="link-brand group/cta mt-auto inline-flex items-center gap-1 pt-0.5">
          {ctaLabel}
          <ArrowUpRight
            size={12}
            strokeWidth={2.5}
            aria-hidden="true"
            className="transition-transform duration-200 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
          />
        </Link>
      </div>
    </div>
  );
}
