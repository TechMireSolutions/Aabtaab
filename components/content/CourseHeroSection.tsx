import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CatalogDarkHero from "@/components/content/CatalogDarkHero";
import OpensInNewTab from "@/components/ui/OpensInNewTab";
import { heroImageUrl } from "@/sanity/lib/image";
import {
  formatSubjectLabel,
  normalizePublicTitle,
} from "@/lib/catalog/subjects";
import { COURSE_NESTED_CTA_LABELS } from "@/lib/catalog/formatters";
import { EXTERNAL_LINK_PROPS } from "@/lib/urls";

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
  heroCtaLabel = COURSE_NESTED_CTA_LABELS.leaf,
  enrollHref,
  enrollExternal = false,
  image,
}: CourseHeroSectionProps) {
  const subtitle = heroSubtitle || excerpt;
  const ctaClassName = "btn-pill-accent group";
  const imageSrc = image ? heroImageUrl(image, 1400, 700) : null;
  const displayTitle = normalizePublicTitle(title);
  const subjectLabel = subject ? formatSubjectLabel(subject) : null;

  return (
    <CatalogDarkHero
      title={displayTitle}
      imageSrc={imageSrc}
      imageAlt={image?.alt || displayTitle}
    >
      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {subjectLabel && <span className="badge-hero">{subjectLabel}</span>}
        {duration && <span className="badge-hero-muted">{duration}</span>}
        {instructor && <span className="badge-hero-muted">{instructor}</span>}
      </div>

      <h1 className="text-hero mb-5 text-white">{displayTitle}</h1>

      {subtitle && (
        <p className="mx-auto mb-10 max-w-copy text-base-plus leading-relaxed text-slate-300 sm:text-lg-plus">
          {subtitle}
        </p>
      )}

      <div className="flex flex-wrap justify-center gap-3">
        {enrollExternal ? (
          <a
            href={enrollHref}
            {...EXTERNAL_LINK_PROPS}
            className={ctaClassName}
          >
            {heroCtaLabel}
            <OpensInNewTab />
            <ArrowRight
              size={14}
              strokeWidth={2.5}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </a>
        ) : (
          <Link href={enrollHref} className={ctaClassName}>
            {heroCtaLabel}
            <ArrowRight
              size={14}
              strokeWidth={2.5}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        )}
      </div>
    </CatalogDarkHero>
  );
}
