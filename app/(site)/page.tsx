import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import {
  featuredPostsQuery,
  topLevelServicesQuery,
  topLevelCoursesQuery,
  homepageSettingsQuery,
} from '@/sanity/lib/queries'
import HeroSection from '@/components/sections/HeroSection'
import CarouselSection, { CarouselItem } from '@/components/sections/CarouselSection'
import ContentCard from '@/components/ui/ContentCard'

export const revalidate = 60

export default async function HomePage() {
  const [posts, services, courses, hp] = await Promise.all([
    client.fetch(featuredPostsQuery),
    client.fetch(topLevelServicesQuery),
    client.fetch(topLevelCoursesQuery),
    client.fetch(homepageSettingsQuery),
  ])

  const heroImageUrl = hp?.heroImage
    ? urlFor(hp.heroImage).width(1400).height(800).url()
    : null

  /* ── Build carousel item arrays ── */
  const courseItems: CarouselItem[] = courses.map((c: any) => ({
    id:          c._id,
    image:       c.featuredImage ? urlFor(c.featuredImage).width(600).height(450).url() : null,
    title:       c.title,
    description: [c.price, c.duration].filter(Boolean).join(' · ') || null,
    href:        `/online-courses/${c.slug.current}`,
    badge:       c.subject,
    ctaLabel:    'Enroll Now',
  }))

  const serviceItems: CarouselItem[] = services.map((s: any) => ({
    id:          s._id,
    image:       s.icon ? urlFor(s.icon).width(600).height(450).url() : null,
    title:       s.title,
    description: s.children?.length
      ? s.children.slice(0, 4).map((c: any) => c.title).join(' · ')
      : s.price || null,
    href:        `/services/${s.slug.current}`,
    badge:       null,
    ctaLabel:    'Book Now',
  }))

  return (
    <>
      {/* ── Hero ── */}
      <HeroSection
        subtitle={hp?.heroArabicText    || undefined}
        title={hp?.heroTitle ? hp.heroTitle.replace(/\\n/g, '\n') : undefined}
        description={hp?.heroSubtitle   || undefined}
        heroImage={heroImageUrl}
        cta1Label={hp?.heroCta1Label    || undefined}
        cta1Link={hp?.heroCta1Link      || undefined}
        cta2Label={hp?.heroCta2Label    || undefined}
        cta2Link={hp?.heroCta2Link      || undefined}
      />

      {/* ── Online Courses Carousel ── */}
      {courseItems.length > 0 && (
        <CarouselSection
          eyebrow="Education"
          title={hp?.coursesHeading    || 'Online Courses'}
          subtitle={hp?.coursesSubheading || 'Learn from qualified scholars — Quran, Fiqh, Ethics & more'}
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
          title={hp?.servicesHeading    || 'Our Services'}
          subtitle={hp?.servicesSubheading || 'Religious services performed with sincerity and care'}
          items={serviceItems}
          viewAllHref="/services"
          viewAllLabel="All Services"
          bg="gray"
        />
      )}

      {/* ── Latest Articles ── */}
      {posts?.length > 0 && (
        <section className="py-10 md:py-16 border-b border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-7 sm:mb-10">
              <div>
                <p className="flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.18em] text-cyan-600 mb-2">
                  <span className="w-6 h-px bg-cyan-400 inline-block" />
                  Knowledge
                </p>
                <h2 className="font-bold text-[24px] sm:text-[27px] text-slate-900 leading-tight tracking-[-0.02em]">
                  {hp?.articlesHeading || 'Latest Articles'}
                </h2>
                {hp?.articlesSubheading && (
                  <p className="text-[13px] text-gray-500 mt-1.5">{hp.articlesSubheading}</p>
                )}
              </div>
              <Link
                href="/articles"
                className="group inline-flex items-center gap-1.5 text-[13px] font-semibold text-cyan-600 hover:text-cyan-700 transition-colors flex-shrink-0 sm:ml-6"
              >
                View all
                <ArrowRight size={13} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform duration-150" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.slice(0, 3).map((post: any, i: number) => (
                <ContentCard
                  key={post._id}
                  href={`/articles/${post.slug.current}`}
                  image={post.mainImage ? urlFor(post.mainImage).width(600).height(450).url() : null}
                  title={post.title}
                  description={post.excerpt || null}
                  badge={post.categories?.[0]?.title || null}
                  ctaLabel="Read More"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Donate CTA ── */}
      <section className="relative overflow-hidden bg-slate-50 border-y border-slate-200 py-10 sm:py-12">

        {/* Subtle dot grid */}
        <div className="absolute inset-0 opacity-40 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}/>

        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">

          {/* Arabic eyebrow */}
          <div className="inline-flex items-center gap-2.5 mb-4">
            <span className="w-6 h-px bg-amber-400"/>
            <span className="text-[9.5px] font-bold uppercase tracking-[0.28em] text-amber-600">في سبيل الله</span>
            <span className="w-6 h-px bg-amber-400"/>
          </div>

          {/* Heading */}
          <h2 className="font-bold text-[28px] lg:text-[34px] text-slate-900 leading-tight tracking-[-0.02em] mb-3">
            {hp?.donateHeading || 'Support Our Mission'}
          </h2>

          {/* Description */}
          <p className="text-[13.5px] text-gray-500 leading-relaxed mb-6 max-w-sm mx-auto">
            {hp?.donateText || 'Your Sadqah and donations help us continue spreading the teachings of Ahlul Bayt (A.S.)'}
          </p>

          {/* Quote */}
          <div className="relative max-w-lg mx-auto mb-7 bg-white border border-slate-200 rounded-xl px-6 py-5 shadow-sm">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-7 h-7 bg-white border border-slate-200 rounded-full flex items-center justify-center">
              <span className="text-amber-500 text-[15px] font-bold leading-none">"</span>
            </div>
            <p className="text-[13.5px] text-slate-600 italic leading-relaxed">
              Sadaqah extinguishes the Lord&apos;s anger and wards off an evil death.
            </p>
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="w-5 h-px bg-amber-300"/>
              <cite className="not-italic text-[11px] font-semibold text-amber-600 tracking-wide">Imam Sadiq (A.S.)</cite>
              <span className="w-5 h-px bg-amber-300"/>
            </div>
          </div>

          {/* CTA */}
          <Link
            href="/donate"
            className="group inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white
              text-[13px] font-semibold px-7 py-2.5 rounded-full
              shadow-[0_4px_16px_rgba(8,145,178,0.3)] hover:shadow-[0_6px_22px_rgba(8,145,178,0.45)]
              transition-all duration-200 hover:-translate-y-px"
          >
            {hp?.donateCtaLabel || 'Donate Now'}
            <ArrowRight size={13} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform duration-150"/>
          </Link>

        </div>
      </section>
    </>
  )
}
