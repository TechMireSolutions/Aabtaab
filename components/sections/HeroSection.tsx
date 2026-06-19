import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Users, BookOpen, GraduationCap } from "lucide-react";
import { DEFAULT_SITE_NAME } from "@/lib/constants";

interface HeroSectionProps {
  siteName?: string;
  subtitle?: string;
  title?: string;
  description?: string;
  heroImage?: string | null;
  heroImageAlt?: string;
  cta1Label?: string;
  cta1Link?: string;
  cta2Label?: string;
  cta2Link?: string;
}

const DEFAULT_LINES = ["Learn Quran, Fiqh &", "More From Shia", "Scholars."];

const STATS = [
  { value: "500+", label: "Students", Icon: Users },
  { value: "20+", label: "Courses", Icon: BookOpen },
  { value: "10+", label: "Scholars", Icon: GraduationCap },
];

export default function HeroSection({
  siteName = DEFAULT_SITE_NAME,
  subtitle,
  title,
  description,
  heroImage,
  heroImageAlt,
  cta1Label = "Explore Courses",
  cta1Link = "/online-courses",
  cta2Label = "Our Services",
  cta2Link = "/services",
}: HeroSectionProps) {
  const resolvedSubtitle =
    subtitle ?? `${siteName} — Faith. Knowledge. Access.`;
  const resolvedDescription =
    description ??
    `At ${siteName}, we bring accessible and affordable Shia Islamic education to everyone, no matter where you are in the world.`;

  const titleLines = title ? title.split("\n") : DEFAULT_LINES;
  const imageAlt =
    heroImageAlt ?? `${siteName} — Shia Islamic education and community`;

  const delayClasses = [
    "",
    "motion-safe:animate-delay-150",
    "motion-safe:animate-delay-200",
    "motion-safe:animate-delay-300",
  ];

  return (
    <section className="relative min-h-hero w-full overflow-hidden bg-white md:min-h-hero-lg">
      <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-50" />

      <div className="pointer-events-none absolute -left-24 top-1/2 size-hero-glow -translate-y-1/2 rounded-full bg-hero-glow" />

      {heroImage && (
        <div className="pointer-events-none absolute inset-0 hidden select-none md:inset-auto md:top-0 md:right-0 md:block md:h-full md:w-hero-image">
          <Image
            src={heroImage}
            alt={imageAlt}
            fill
            sizes="55vw"
            priority
            fetchPriority="high"
            className="object-cover object-left-top"
          />
          <div className="absolute inset-0 bg-linear-to-r from-white via-white/55 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-t from-white/15 to-transparent" />
        </div>
      )}

      <div className="container-page relative z-10 flex min-h-hero flex-col justify-center py-12 md:min-h-hero-lg md:px-14 md:py-hero-pad">
        <div className="w-full max-w-hero-copy">
          <div className="badge-enrolling motion-safe:animate-fade-up">
            <span className="size-1.5 shrink-0 animate-pulse rounded-full bg-brand-500" />
            <span className="text-2xs font-semibold tracking-wide text-gray-600">
              Enrolling Now
            </span>
          </div>

          <p className="text-eyebrow mb-4 text-gray-400 motion-safe:animate-fade-up motion-safe:animate-delay-75">
            {resolvedSubtitle}
          </p>

          <h1 className="text-hero mb-4 font-bold">
            {titleLines.map((line, i) => (
              <span
                key={i}
                className={`block motion-safe:animate-fade-up ${delayClasses[i] ?? "motion-safe:animate-delay-300"} ${
                  i === titleLines.length - 1
                    ? "text-brand-600"
                    : "text-slate-900"
                }`}
              >
                {line}
              </span>
            ))}
          </h1>

          <p className="text-body-muted mb-7 max-w-hero-lead motion-safe:animate-fade-up motion-safe:animate-delay-400">
            {resolvedDescription}
          </p>

          <div className="flex flex-wrap items-center gap-3 motion-safe:animate-fade-up motion-safe:animate-delay-500">
            <Link href={cta1Link} className="btn-primary group">
              {cta1Label}
              <ArrowRight
                size={13}
                strokeWidth={2.5}
                className="transition-transform duration-150 group-hover:translate-x-0.5"
              />
            </Link>
            <Link href={cta2Link} className="btn-secondary">
              {cta2Label}
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-5 border-t border-gray-100 pt-7 motion-safe:animate-fade-up motion-safe:animate-delay-600 sm:gap-6">
            {STATS.map(({ value, label, Icon }) => (
              <div key={label} className="flex items-center gap-2.5">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-brand-100 bg-brand-50 sm:size-9">
                  <Icon
                    size={14}
                    className="text-brand-600"
                    strokeWidth={1.75}
                  />
                </div>
                <div>
                  <p className="text-base sm:text-lg-plus font-bold leading-none tracking-tight text-slate-900">
                    {value}
                  </p>
                  <p className="text-caption mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
