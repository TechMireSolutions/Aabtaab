import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import {
  featuredPostsQuery,
  topLevelServicesQuery,
  coursesQuery,
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
    client.fetch(coursesQuery),
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
        <section className="py-14 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-[11px] font-semibold text-cyan-500 uppercase tracking-widest mb-1">Knowledge</p>
                <h2 className="text-[26px] font-bold text-gray-900">{hp?.articlesHeading || 'Latest Articles'}</h2>
                {hp?.articlesSubheading && (
                  <p className="text-[13.5px] text-gray-500 mt-1">{hp.articlesSubheading}</p>
                )}
              </div>
              <Link href="/articles" className="text-[13px] text-cyan-500 hover:text-cyan-600 font-medium transition-colors">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.slice(0, 3).map((post: any, i: number) => (
                <ContentCard
                  key={post._id}
                  href={`/articles/${post.slug.current}`}
                  image={post.mainImage ? urlFor(post.mainImage).width(600).height(450).url() : null}
                  title={post.title}
                  description={post.excerpt || null}
                  badge={post.categories?.[0]?.title || null}
                  ctaLabel="Read More"
                  active={i === 1}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Donate CTA ── */}
      <section className="py-16 bg-[#0d2137]">
        <div className="max-w-2xl mx-auto px-8 text-center">
          <h2 className="text-[28px] font-bold text-white mb-3">
            {hp?.donateHeading || 'Support Our Mission'}
          </h2>
          <p className="text-[14px] text-gray-400 leading-relaxed mb-8">
            {hp?.donateText || 'Your Sadqah and donations help us continue spreading the teachings of Ahlul Bayt (A.S.)'}
          </p>
          <Link
            href="/donate"
            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white text-[14px] font-medium px-8 py-3 rounded-full transition-colors"
          >
            {hp?.donateCtaLabel || 'Donate Now'}
            <ArrowRight size={14} strokeWidth={2.5} />
          </Link>
        </div>
      </section>
    </>
  )
}
