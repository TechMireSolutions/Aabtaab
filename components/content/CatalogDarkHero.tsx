import type { ReactNode } from "react";
import Image from "next/image";

interface CatalogDarkHeroProps {
  title: string;
  imageSrc?: string | null;
  imageAlt?: string;
  /** Compact height + content-width container (services) */
  compact?: boolean;
  children?: ReactNode;
}

/**
 * Shared dark catalog hero — media + gradient overlay + centered title shell.
 * Course/service-specific badges, body, and CTAs pass as children.
 */
export default function CatalogDarkHero({
  title,
  imageSrc,
  imageAlt,
  compact = false,
  children,
}: CatalogDarkHeroProps) {
  return (
    <section
      className={
        compact
          ? "relative flex min-h-hero-compact items-center justify-center overflow-hidden bg-slate-900"
          : "relative overflow-hidden bg-slate-900"
      }
    >
      {imageSrc && (
        <Image
          src={imageSrc}
          alt={imageAlt || title}
          fill
          sizes="100vw"
          className="object-cover opacity-hero-image"
          priority
          fetchPriority="high"
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-slate-900/60 via-transparent to-slate-900/80" />
      <div
        className={
          compact
            ? "container-content relative py-20 text-center sm:py-28"
            : "container-hero"
        }
      >
        {children}
        {!children && <h1 className="text-hero text-white">{title}</h1>}
      </div>
    </section>
  );
}
