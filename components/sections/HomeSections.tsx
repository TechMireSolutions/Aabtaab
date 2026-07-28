import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getHomepageCarouselsData } from "@/lib/cms/queries";
import { formatEventDateRange } from "@/lib/cms/event";
import { urlFor } from "@/sanity/lib/image";
import dynamic from "next/dynamic";
import type { CarouselItem } from "@/components/sections/CarouselSection";
import ContentCard from "@/components/cards/ContentCard";
import { formatPriceDuration } from "@/lib/catalog/formatters";
import {
  formatSubjectLabel,
  normalizePublicTitle,
} from "@/lib/catalog/subjects";

const CarouselSection = dynamic(() => import("@/components/sections/CarouselSection"), {
  ssr: true,
});



export default async function HomeSections() {
  const {
    posts,
    services,
    courses,
    homepage: hp,
    testimonials,
    upcomingEvents,
  } = await getHomepageCarouselsData();

  const courseItems: CarouselItem[] = (courses ?? []).map((c) => ({
    id: c._id,
    image: c.featuredImage
      ? urlFor(c.featuredImage).width(480).height(360).url()
      : null,
    title: normalizePublicTitle(c.title),
    description: formatPriceDuration(c.price, c.duration),
    href: `/online-courses/${c.slug.current}`,
    badge: c.subject ? formatSubjectLabel(c.subject) : null,
    ctaLabel: "Enroll Now",
  }));

  const serviceItems: CarouselItem[] = (services ?? []).map((s) => ({
    id: s._id,
    image: s.icon ? urlFor(s.icon).width(480).height(360).url() : null,
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

  const eventItems: CarouselItem[] = (upcomingEvents ?? [])
    .slice(0, 6)
    .map((event) => ({
      id: event._id,
      image: event.image
        ? urlFor(event.image).width(480).height(360).url()
        : null,
      title: event.title,
      description: formatEventDateRange(event.startDate, event.endDate),
      href: `/events/${event.slug.current}`,
      badge: event.city || null,
      ctaLabel: "View Event",
    }));

  return (
    <>
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
          trackId="carousel-courses"
        />
      )}

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
          trackId="carousel-services"
        />
      )}

      {eventItems.length > 0 && (
        <CarouselSection
          eyebrow="Community"
          title="Upcoming Events"
          subtitle="Majalis, programs, and gatherings for the Ummah"
          items={eventItems}
          viewAllHref="/events"
          viewAllLabel="All Events"
          bg="white"
          trackId="carousel-events"
        />
      )}

      {(posts?.length ?? 0) > 0 && (
        <section className="section-deferred section-y-lg border-b border-gray-100 dark:border-slate-900 bg-white dark:bg-slate-950">
          <div className="container-page">
            <div className="mb-7 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-eyebrow mb-2 flex items-center gap-2">
                  <span className="eyebrow-line" />
                  Knowledge
                </p>
                <h2 className="heading-section">
                  {hp?.articlesHeading || "Latest Articles"}
                </h2>
                {hp?.articlesSubheading && (
                  <p className="text-body-muted mt-1.5">
                    {hp.articlesSubheading}
                  </p>
                )}
              </div>
              <Link
                href="/posts"
                className="link-brand group inline-flex shrink-0 items-center gap-1.5 sm:ml-6"
              >
                View all
                <ArrowRight
                  size={14}
                  strokeWidth={2.5}
                  className="transition-transform duration-150 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(posts ?? []).slice(0, 3).map((post) => (
                <ContentCard
                  key={post._id}
                  href={`/posts/${post.slug.current}`}
                  image={
                    post.mainImage
                      ? urlFor(post.mainImage).width(480).height(360).url()
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

      {(testimonials?.length ?? 0) > 0 && (
        <section className="section-deferred section-y-lg border-b border-gray-100 dark:border-slate-900 bg-slate-50 dark:bg-slate-900/40">
          <div className="container-page">
            <div className="mb-10 text-center">
              <p className="text-eyebrow mb-3 flex items-center justify-center gap-2">
                <span className="eyebrow-line" />
                {hp?.testimonialsEyebrow || "Community"}
                <span className="eyebrow-line" />
              </p>
              <h2 className="heading-section">
                {hp?.testimonialsHeading || "What Our Community Says"}
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {(testimonials ?? []).map((t) => (
                <div
                  key={t.name}
                  className="card-surface flex flex-col px-6 py-6"
                >
                  <div className="mb-4 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className="text-base-plus leading-none text-gold-400"
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-body-muted mb-5 flex-1 text-gray-600 dark:text-slate-300">
                    &quot;{t.quote}&quot;
                  </p>
                  <div className="flex items-center gap-3 border-t border-gray-100 dark:border-slate-800/80 pt-4">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/40">
                      <span className="text-sm-plus font-bold text-brand-700 dark:text-brand-400">
                        {t.name[0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm-plus font-semibold text-slate-800 dark:text-white">
                        {t.name}
                      </p>
                      <p className="text-caption">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-deferred relative overflow-hidden border-y border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 py-10 sm:py-12">
        <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-40" />
        <div className="container-content relative max-w-copy text-center">
          <div className="text-eyebrow-gold mb-4 inline-flex items-center gap-2.5">
            <span className="eyebrow-line-gold w-6" />
            <span lang="ar" dir="rtl" className="font-arabic">فِي سَبِيلِ اللَّهِ</span>
            <span className="eyebrow-line-gold w-6" />
          </div>
          <h2 className="heading-section-lg mb-3">
            {hp?.donateHeading || "Support Our Mission"}
          </h2>
          <p className="text-body-muted mx-auto mb-6 max-w-sm">
            {hp?.donateText ||
              "Your Sadqah and donations help us continue spreading the teachings of Ahlul Bayt (A.S.)"}
          </p>
          <div className="card-quote">
            <div className="absolute -top-3.5 left-1/2 flex size-7 -translate-x-1/2 items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-base-plus leading-none font-bold text-gold-500">
                &ldquo;
              </span>
            </div>
            <p className="text-body-muted italic text-slate-600 dark:text-slate-300">
              {hp?.donateQuote ||
                "Sadaqah extinguishes the Lord's anger and wards off an evil death."}
            </p>
            <div className="mt-3 flex flex-col items-center justify-center gap-1">
              <div className="flex items-center gap-2">
                <span className="eyebrow-line-gold w-5" />
                <cite className="text-caption font-semibold tracking-wide text-gold-600 not-italic">
                  {hp?.donateQuoteAttribution || "Imam Sadiq (A.S.)"}
                </cite>
                <span className="eyebrow-line-gold w-5" />
              </div>
              {hp?.donateQuoteReference && (
                <span className="text-xs text-slate-500 dark:text-slate-400 opacity-80">
                  {hp.donateQuoteReference}
                </span>
              )}
            </div>
          </div>
          <Link href="/donate" className="btn-primary group">
            {hp?.donateCtaLabel || "Donate Now"}
            <ArrowRight
              size={14}
              strokeWidth={2.5}
              className="transition-transform duration-150 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </section>
    </>
  );
}
