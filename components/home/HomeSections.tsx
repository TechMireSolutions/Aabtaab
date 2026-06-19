import Link from "next/link";
import { getHomepageSectionsData } from "@/lib/cms/queries";
import { formatEventDateRange } from "@/lib/cms/event";
import { urlFor } from "@/sanity/lib/image";
import CarouselSection, {
  type CarouselItem,
} from "@/components/sections/CarouselSection";
import ContentCard from "@/components/cards/ContentCard";

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className={className}
    >
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

export default async function HomeSections() {
  const {
    posts,
    services,
    courses,
    homepage: hp,
    testimonials,
    upcomingEvents,
  } = await getHomepageSectionsData();

  const courseItems: CarouselItem[] = (courses ?? []).map((c) => ({
    id: c._id,
    image: c.featuredImage
      ? urlFor(c.featuredImage).width(480).height(360).url()
      : null,
    title: c.title,
    description: [c.price, c.duration].filter(Boolean).join(" · ") || null,
    href: `/online-courses/${c.slug.current}`,
    badge: c.subject,
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
      <section className="section-deferred relative section-y-xl overflow-hidden border-b border-gray-100 bg-white">
        <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-30" />
        <div className="container-page relative">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="text-eyebrow mb-3 flex items-center gap-2">
                <span className="eyebrow-line" />
                {hp?.aboutEyebrow || "Who We Are"}
              </p>
              <h2 className="heading-section-lg mb-4">
                {hp?.aboutHeading ||
                  "Bringing Shia Islamic Knowledge to Every Corner of the World"}
              </h2>
              <p className="text-body-muted mb-4">
                {hp?.aboutBody1 ||
                  "Aabtaab was founded with a single purpose — to make authentic Shia Islamic education and religious services accessible to every Muslim, regardless of location or background."}
              </p>
              <p className="text-body-muted mb-7">
                {hp?.aboutBody2 ||
                  "Through online courses taught by qualified scholars, and services like Niyabat Ziarat and Ijara performed with sincerity, we proudly serve thousands of families across the globe."}
              </p>
              <div className="mb-8 flex flex-wrap gap-2.5">
                {(hp?.aboutPillars?.length
                  ? hp.aboutPillars
                  : ["Faith", "Knowledge", "Access", "Sincerity"]
                ).map((pillar: string) => (
                  <span
                    key={pillar}
                    className="badge-pill inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm-plus font-semibold normal-case tracking-normal"
                  >
                    <span className="size-1.5 shrink-0 rounded-full bg-brand-500" />
                    {pillar}
                  </span>
                ))}
              </div>
              <Link href="/about" className="btn-primary group">
                {hp?.aboutCtaLabel || "Learn About Us"}
                <ArrowIcon className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="relative pb-10">
              <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 text-white sm:p-10">
                <div className="bg-hero-glow pointer-events-none absolute top-0 right-0 size-72 hero-glow-offset rounded-full opacity-60" />
                <p
                  className="mb-3 text-center text-2xl leading-relaxed font-normal text-gold-400 sm:text-3xl"
                  dir="rtl"
                >
                  {hp?.aboutHadithArabic || "اطلبوا العلم من المهد إلى اللحد"}
                </p>
                <div className="eyebrow-line-gold mx-auto mb-3 w-10" />
                <p className="text-center text-sm-plus leading-relaxed italic text-gray-400">
                  &quot;
                  {hp?.aboutHadithTranslation ||
                    "Seek knowledge from the cradle to the grave."}
                  &quot;
                </p>
                <p className="text-caption mt-2 text-center font-semibold tracking-wide text-gold-500">
                  — {hp?.aboutHadithAttribution || "Prophet Muhammad (S.A.W.W.)"}
                </p>
                <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
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
                      <p className="text-xl-plus leading-none font-bold text-white">
                        {s.value}
                      </p>
                      <p className="text-caption mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-surface absolute bottom-0 left-6 flex items-center gap-3 px-4 py-3">
                <div className="badge-trust">✓</div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    {hp?.aboutBadgeText || "Qualified Scholars"}
                  </p>
                  <p className="text-caption">
                    {hp?.aboutBadgeSubtext || "Certified & trusted"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
        <section className="section-deferred section-y-lg border-b border-gray-100 bg-white">
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
                <ArrowIcon className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
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
        <section className="section-deferred section-y-lg border-b border-gray-100 bg-slate-50">
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
                  <p className="text-body-muted mb-5 flex-1 text-gray-600">
                    &quot;{t.quote}&quot;
                  </p>
                  <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-100">
                      <span className="text-sm-plus font-bold text-brand-700">
                        {t.name[0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm-plus font-semibold text-slate-800">
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

      <section className="section-deferred relative overflow-hidden border-y border-slate-200 bg-slate-50 py-10 sm:py-12">
        <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-40" />
        <div className="container-content relative max-w-copy text-center">
          <div className="text-eyebrow-gold mb-4 inline-flex items-center gap-2.5">
            <span className="eyebrow-line-gold w-6" />
            <span>في سبيل الله</span>
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
            <div className="absolute -top-3.5 left-1/2 flex size-7 -translate-x-1/2 items-center justify-center rounded-full border border-slate-200 bg-white">
              <span className="text-base-plus leading-none font-bold text-gold-500">
                &ldquo;
              </span>
            </div>
            <p className="text-body-muted italic text-slate-600">
              {hp?.donateQuote ||
                "Sadaqah extinguishes the Lord's anger and wards off an evil death."}
            </p>
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="eyebrow-line-gold w-5" />
              <cite className="text-caption font-semibold tracking-wide text-gold-600 not-italic">
                {hp?.donateQuoteAttribution || "Imam Sadiq (A.S.)"}
              </cite>
              <span className="eyebrow-line-gold w-5" />
            </div>
          </div>
          <Link href="/donate" className="btn-primary group">
            {hp?.donateCtaLabel || "Donate Now"}
            <ArrowIcon className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>
    </>
  );
}
