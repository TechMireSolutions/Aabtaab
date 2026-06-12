import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { sanityFetch, CACHE_TAGS } from "@/sanity/lib/sanityFetch";
import { urlFor } from "@/sanity/lib/image";
import {
  featuredPostsQuery,
  topLevelServicesQuery,
  topLevelCoursesQuery,
  homepageSettingsQuery,
  testimonialsQuery,
} from "@/sanity/lib/queries";
import HeroSection from "@/components/sections/HeroSection";
import CarouselSection, {
  CarouselItem,
} from "@/components/sections/CarouselSection";
import ContentCard from "@/components/ui/ContentCard";

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage?: { asset: { _ref: string }; alt?: string };
  excerpt?: string;
  categories?: { title: string }[];
}

interface Course {
  _id: string;
  title: string;
  slug: { current: string };
  featuredImage?: { asset: { _ref: string } };
  price?: string;
  duration?: string;
  subject?: string;
}

interface Service {
  _id: string;
  title: string;
  slug: { current: string };
  icon?: { asset: { _ref: string } };
  price?: string;
  children?: { title: string }[];
}

interface Testimonial {
  name: string;
  role?: string;
  quote: string;
}

interface HomepageSettings {
  heroImage?: { asset: { _ref: string } };
  heroArabicText?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroCta1Label?: string;
  heroCta1Link?: string;
  heroCta2Label?: string;
  heroCta2Link?: string;
  aboutEyebrow?: string;
  aboutHeading?: string;
  aboutBody1?: string;
  aboutBody2?: string;
  aboutPillars?: string[];
  aboutCtaLabel?: string;
  aboutHadithArabic?: string;
  aboutHadithTranslation?: string;
  aboutHadithAttribution?: string;
  aboutStat1Value?: string;
  aboutStat1Label?: string;
  aboutStat2Value?: string;
  aboutStat2Label?: string;
  aboutStat3Value?: string;
  aboutStat3Label?: string;
  aboutBadgeText?: string;
  aboutBadgeSubtext?: string;
  coursesHeading?: string;
  coursesSubheading?: string;
  servicesHeading?: string;
  servicesSubheading?: string;
  articlesHeading?: string;
  articlesSubheading?: string;
  testimonialsEyebrow?: string;
  testimonialsHeading?: string;
  donateHeading?: string;
  donateText?: string;
  donateQuote?: string;
  donateQuoteAttribution?: string;
  donateCtaLabel?: string;
}

export default async function HomePage() {
  const [posts, services, courses, hp, testimonials] = await Promise.all([
    sanityFetch<Post[]>({
      query: featuredPostsQuery,
      tags: [CACHE_TAGS.posts],
      revalidate: 3600,
    }),
    sanityFetch<Service[]>({
      query: topLevelServicesQuery,
      tags: [CACHE_TAGS.services],
      revalidate: 3600,
    }),
    sanityFetch<Course[]>({
      query: topLevelCoursesQuery,
      tags: [CACHE_TAGS.courses],
      revalidate: 3600,
    }),
    sanityFetch<HomepageSettings>({
      query: homepageSettingsQuery,
      tags: [CACHE_TAGS.homepage],
      revalidate: 3600,
    }),
    sanityFetch<Testimonial[]>({
      query: testimonialsQuery,
      tags: [CACHE_TAGS.all],
      revalidate: 3600,
    }),
  ]);

  const heroImageUrl = hp?.heroImage
    ? urlFor(hp.heroImage).width(1400).height(800).url()
    : null;

  const courseItems: CarouselItem[] = (courses ?? []).map((c) => ({
    id: c._id,
    image: c.featuredImage
      ? urlFor(c.featuredImage).width(600).height(450).url()
      : null,
    title: c.title,
    description: [c.price, c.duration].filter(Boolean).join(" · ") || null,
    href: `/online-courses/${c.slug.current}`,
    badge: c.subject,
    ctaLabel: "Enroll Now",
  }));

  const serviceItems: CarouselItem[] = (services ?? []).map((s) => ({
    id: s._id,
    image: s.icon ? urlFor(s.icon).width(600).height(450).url() : null,
    title: s.title,
    description: s.children?.length
      ? s.children
          .slice(0, 4)
          .map((c) => c.title)
          .join(" · ")
      : (s.price ?? null),
    href: `/services/${s.slug.current}`,
    badge: null,
    ctaLabel: "Book Now",
  }));

  return (
    <>
      {/* ── Hero ── */}
      <HeroSection
        subtitle={hp?.heroArabicText || undefined}
        title={hp?.heroTitle ? hp.heroTitle.replace(/\\n/g, "\n") : undefined}
        description={hp?.heroSubtitle || undefined}
        heroImage={heroImageUrl}
        cta1Label={hp?.heroCta1Label || undefined}
        cta1Link={hp?.heroCta1Link || undefined}
        cta2Label={hp?.heroCta2Label || undefined}
        cta2Link={hp?.heroCta2Link || undefined}
      />

      {/* ── About Us ── */}
      <section className="relative py-14 md:py-20 bg-white overflow-hidden border-b border-gray-100">
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, #dde5ef 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text */}
            <div>
              <p className="flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.18em] text-cyan-600 mb-3">
                <span className="w-6 h-px bg-cyan-400 inline-block" />
                {hp?.aboutEyebrow || "Who We Are"}
              </p>
              <h2 className="font-bold text-[26px] sm:text-[32px] text-slate-900 leading-tight tracking-[-0.02em] mb-4">
                {hp?.aboutHeading ||
                  "Bringing Shia Islamic Knowledge to Every Corner of the World"}
              </h2>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                {hp?.aboutBody1 ||
                  "Aabtaab was founded with a single purpose — to make authentic Shia Islamic education and religious services accessible to every Muslim, regardless of location or background."}
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-7">
                {hp?.aboutBody2 ||
                  "Through online courses taught by qualified scholars, and services like Niyabat Ziarat and Ijara performed with sincerity, we proudly serve thousands of families across the globe."}
              </p>
              <div className="flex flex-wrap gap-2.5 mb-8">
                {(hp?.aboutPillars?.length
                  ? hp.aboutPillars
                  : ["Faith", "Knowledge", "Access", "Sincerity"]
                ).map((pillar: string) => (
                  <span
                    key={pillar}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-100 text-[12px] font-semibold text-cyan-700"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
                    {pillar}
                  </span>
                ))}
              </div>
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white
                  text-[13px] font-semibold px-6 py-2.5 rounded-full
                  shadow-[0_4px_16px_rgba(8,145,178,0.3)] hover:shadow-[0_6px_22px_rgba(8,145,178,0.45)]
                  transition-all duration-200 hover:-translate-y-px"
              >
                {hp?.aboutCtaLabel || "Learn About Us"}
                <ArrowRight
                  size={13}
                  strokeWidth={2.5}
                  className="group-hover:translate-x-0.5 transition-transform duration-150"
                />
              </Link>
            </div>

            {/* Visual card */}
            <div className="relative pb-10">
              <div className="bg-slate-900 rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden">
                <div
                  className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none opacity-20"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(8,145,178,0.6) 0%, transparent 70%)",
                    transform: "translate(30%, -30%)",
                  }}
                />
                <p
                  className="text-center text-[28px] sm:text-[32px] leading-relaxed text-amber-400 font-light mb-3"
                  dir="rtl"
                >
                  {hp?.aboutHadithArabic || "اطلبوا العلم من المهد إلى اللحد"}
                </p>
                <div className="w-10 h-px bg-amber-400/40 mx-auto mb-3" />
                <p className="text-center text-[13px] text-gray-400 italic leading-relaxed">
                  &quot;
                  {hp?.aboutHadithTranslation ||
                    "Seek knowledge from the cradle to the grave."}
                  &quot;
                </p>
                <p className="text-center text-[11px] text-amber-500 font-semibold mt-2 tracking-wide">
                  —{" "}
                  {hp?.aboutHadithAttribution || "Prophet Muhammad (S.A.W.W.)"}
                </p>
                <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10">
                  {[
                    {
                      value: hp?.aboutStat1Value || "500+",
                      label: hp?.aboutStat1Label || "Students",
                    },
                    {
                      value: hp?.aboutStat2Value || "10+",
                      label: hp?.aboutStat2Label || "Scholars",
                    },
                    {
                      value: hp?.aboutStat3Value || "5+",
                      label: hp?.aboutStat3Label || "Countries",
                    },
                  ].map((s) => (
                    <div key={s.label} className="text-center">
                      <p className="text-[22px] font-bold text-white leading-none">
                        {s.value}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-1">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute bottom-0 left-6 bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-lg flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                  <span className="text-emerald-600 font-bold text-[16px]">
                    ✓
                  </span>
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-slate-800">
                    {hp?.aboutBadgeText || "Qualified Scholars"}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    {hp?.aboutBadgeSubtext || "Certified & trusted"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Online Courses Carousel ── */}
      {courseItems.length > 0 && (
        <CarouselSection
          eyebrow="Education"
          title={hp?.coursesHeading || "Online Courses"}
          subtitle={
            hp?.coursesSubheading ||
            "Learn from qualified scholars — Quran, Fiqh, Ethics & more"
          }
          items={courseItems}
          viewAllHref="/online-courses"
          viewAllLabel="All Courses"
          bg="white"
        />
      )}

      {/* ── Services Carousel ── */}
      {serviceItems.length > 0 && (
        <CarouselSection
          eyebrow="What we offer"
          title={hp?.servicesHeading || "Our Services"}
          subtitle={
            hp?.servicesSubheading ||
            "Religious services performed with sincerity and care"
          }
          items={serviceItems}
          viewAllHref="/services"
          viewAllLabel="All Services"
          bg="gray"
        />
      )}

      {/* ── Latest Articles ── */}
      {(posts?.length ?? 0) > 0 && (
        <section className="py-10 md:py-16 border-b border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-7 sm:mb-10">
              <div>
                <p className="flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.18em] text-cyan-600 mb-2">
                  <span className="w-6 h-px bg-cyan-400 inline-block" />
                  Knowledge
                </p>
                <h2 className="font-bold text-[24px] sm:text-[27px] text-slate-900 leading-tight tracking-[-0.02em]">
                  {hp?.articlesHeading || "Latest Articles"}
                </h2>
                {hp?.articlesSubheading && (
                  <p className="text-[13px] text-gray-500 mt-1.5">
                    {hp.articlesSubheading}
                  </p>
                )}
              </div>
              <Link
                href="/articles"
                className="group inline-flex items-center gap-1.5 text-[13px] font-semibold text-cyan-600 hover:text-cyan-700 transition-colors shrink-0 sm:ml-6"
              >
                View all
                <ArrowRight
                  size={13}
                  strokeWidth={2.5}
                  className="group-hover:translate-x-0.5 transition-transform duration-150"
                />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(posts ?? []).slice(0, 3).map((post) => (
                <ContentCard
                  key={post._id}
                  href={`/articles/${post.slug.current}`}
                  image={
                    post.mainImage
                      ? urlFor(post.mainImage).width(600).height(450).url()
                      : null
                  }
                  title={post.title}
                  description={post.excerpt ?? null}
                  badge={post.categories?.[0]?.title ?? null}
                  ctaLabel="Read More"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Testimonials ── */}
      {(testimonials?.length ?? 0) > 0 && (
        <section className="py-12 md:py-16 bg-slate-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="flex items-center justify-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.18em] text-cyan-600 mb-3">
                <span className="w-6 h-px bg-cyan-400 inline-block" />
                {hp?.testimonialsEyebrow || "Community"}
                <span className="w-6 h-px bg-cyan-400 inline-block" />
              </p>
              <h2 className="font-bold text-[24px] sm:text-[28px] text-slate-900 leading-tight tracking-[-0.02em]">
                {hp?.testimonialsHeading || "What Our Community Says"}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(testimonials ?? []).map((t) => (
                <div
                  key={t.name}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-6 flex flex-col"
                >
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className="text-amber-400 text-[15px] leading-none"
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-[13.5px] text-gray-600 leading-relaxed flex-1 mb-5">
                    &quot;{t.quote}&quot;
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <div className="w-9 h-9 rounded-full bg-cyan-100 flex items-center justify-center shrink-0">
                      <span className="text-[14px] font-bold text-cyan-700">
                        {t.name[0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-slate-800">
                        {t.name}
                      </p>
                      <p className="text-[11.5px] text-gray-400">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Donate CTA ── */}
      <section className="relative overflow-hidden bg-slate-50 border-y border-slate-200 py-10 sm:py-12">
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, #cbd5e1 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2.5 mb-4">
            <span className="w-6 h-px bg-amber-400" />
            <span className="text-[9.5px] font-bold uppercase tracking-[0.28em] text-amber-600">
              في سبيل الله
            </span>
            <span className="w-6 h-px bg-amber-400" />
          </div>

          <h2 className="font-bold text-[28px] lg:text-[34px] text-slate-900 leading-tight tracking-[-0.02em] mb-3">
            {hp?.donateHeading || "Support Our Mission"}
          </h2>

          <p className="text-[13.5px] text-gray-500 leading-relaxed mb-6 max-w-sm mx-auto">
            {hp?.donateText ||
              "Your Sadqah and donations help us continue spreading the teachings of Ahlul Bayt (A.S.)"}
          </p>

          <div className="relative max-w-lg mx-auto mb-7 bg-white border border-slate-200 rounded-xl px-6 py-5 shadow-sm">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-7 h-7 bg-white border border-slate-200 rounded-full flex items-center justify-center">
              <span className="text-amber-500 text-[15px] font-bold leading-none">
                "
              </span>
            </div>
            <p className="text-[13.5px] text-slate-600 italic leading-relaxed">
              {hp?.donateQuote ||
                "Sadaqah extinguishes the Lord's anger and wards off an evil death."}
            </p>
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="w-5 h-px bg-amber-300" />
              <cite className="not-italic text-[11px] font-semibold text-amber-600 tracking-wide">
                {hp?.donateQuoteAttribution || "Imam Sadiq (A.S.)"}
              </cite>
              <span className="w-5 h-px bg-amber-300" />
            </div>
          </div>

          <Link
            href="/donate"
            className="group inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white
              text-[13px] font-semibold px-7 py-2.5 rounded-full
              shadow-[0_4px_16px_rgba(8,145,178,0.3)] hover:shadow-[0_6px_22px_rgba(8,145,178,0.45)]
              transition-all duration-200 hover:-translate-y-px"
          >
            {hp?.donateCtaLabel || "Donate Now"}
            <ArrowRight
              size={13}
              strokeWidth={2.5}
              className="group-hover:translate-x-0.5 transition-transform duration-150"
            />
          </Link>
        </div>
      </section>
    </>
  );
}
