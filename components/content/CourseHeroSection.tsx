import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { heroImageUrl } from "@/sanity/lib/image";

interface CourseHeroSectionProps {
  title: string;
  subject?: string;
  duration?: string;
  instructor?: string;
  heroSubtitle?: string;
  excerpt?: string;
  heroCtaLabel?: string;
  enrollHref: string;
  enrollExternal?: boolean;
  image?: { asset: { _ref: string }; alt?: string };
}

export default function CourseHeroSection({
  title,
  subject,
  duration,
  instructor,
  heroSubtitle,
  excerpt,
  heroCtaLabel = "Enroll Now",
  enrollHref,
  enrollExternal = false,
  image,
}: CourseHeroSectionProps) {
  const subtitle = heroSubtitle || excerpt;
  const ctaClassName =
    "group inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold text-[14px] px-8 py-3.5 rounded-full shadow-[0_4px_24px_rgba(6,182,212,0.45)] transition-all duration-200 hover:-translate-y-px";

  return (
    <section className="relative bg-slate-900 overflow-hidden">
      {image && (
        <Image
          src={heroImageUrl(image, 1400, 700)}
          alt={image.alt || title}
          fill
          className="object-cover opacity-[0.18]"
          priority
        />
      )}
      <div className="absolute inset-0 bg-linear-to-b from-slate-900/60 via-transparent to-slate-900/80 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {subject && (
            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-cyan-400 border border-cyan-700/60 rounded-full px-3.5 py-1 bg-cyan-950/40">
              {subject}
            </span>
          )}
          {duration && (
            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400 border border-slate-700/60 rounded-full px-3.5 py-1 bg-slate-800/40">
              {duration}
            </span>
          )}
          {instructor && (
            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400 border border-slate-700/60 rounded-full px-3.5 py-1 bg-slate-800/40">
              {instructor}
            </span>
          )}
        </div>

        <h1 className="font-bold text-[34px] sm:text-[46px] lg:text-[54px] text-white leading-[1.1] tracking-[-0.03em] mb-5">
          {title}
        </h1>

        {subtitle && (
          <p className="text-[16px] sm:text-[18px] text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
            {subtitle}
          </p>
        )}

        <div className="flex flex-wrap justify-center gap-3">
          {enrollExternal ? (
            <a
              href={enrollHref}
              target="_blank"
              rel="noopener noreferrer"
              className={ctaClassName}
            >
              {heroCtaLabel}
              <ArrowRight
                size={14}
                strokeWidth={2.5}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </a>
          ) : (
            <Link href={enrollHref} className={ctaClassName}>
              {heroCtaLabel}
              <ArrowRight
                size={14}
                strokeWidth={2.5}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
