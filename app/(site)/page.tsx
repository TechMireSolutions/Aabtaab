import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import {
  featuredPostsQuery,
  topLevelServicesQuery,
  coursesQuery,
  upcomingEventsQuery,
  homepageSettingsQuery,
} from '@/sanity/lib/queries'
import HeroSection from '@/components/sections/HeroSection'

export const revalidate = 60

export default async function HomePage() {
  const [posts, services, courses, events, hp] = await Promise.all([
    client.fetch(featuredPostsQuery),
    client.fetch(topLevelServicesQuery),
    client.fetch(coursesQuery),
    client.fetch(upcomingEventsQuery),
    client.fetch(homepageSettingsQuery),
  ])

  const heroImageUrl = hp?.heroImage
    ? urlFor(hp.heroImage).width(1400).height(800).url()
    : null

  return (
    <>
      {/* ── Hero ── */}
      <HeroSection
        subtitle={hp?.heroArabicText || undefined}
        title={hp?.heroTitle ? hp.heroTitle.replace(/\\n/g, '\n') : undefined}
        description={hp?.heroSubtitle || undefined}
        heroImage={heroImageUrl}
        cta1Label={hp?.heroCta1Label || undefined}
        cta1Link={hp?.heroCta1Link  || undefined}
        cta2Label={hp?.heroCta2Label || undefined}
        cta2Link={hp?.heroCta2Link  || undefined}
      />

      {/* ── Upcoming Events ticker ── */}
      {events?.length > 0 && (
        <section className="bg-[#f8f8f8] border-b border-gray-100 py-3">
          <div className="max-w-7xl mx-auto px-8 flex items-center gap-6 overflow-x-auto scrollbar-hide">
            <span className="text-[11px] font-semibold text-cyan-500 uppercase tracking-widest flex-shrink-0">Upcoming</span>
            <div className="flex gap-6">
              {events.map((ev: any) => (
                <div key={ev._id} className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-[11px] font-semibold text-gray-400">
                    {new Date(ev.eventDate).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })}
                  </span>
                  <span className="text-[13px] text-gray-700 font-medium">{ev.title}</span>
                  {ev.location && <span className="text-[12px] text-gray-400">— {ev.location}</span>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Services ── */}
      {services?.length > 0 && (
        <section className="py-16 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-[11px] font-semibold text-cyan-500 uppercase tracking-widest mb-1">What we offer</p>
                <h2 className="text-[28px] font-bold text-gray-900">{hp?.servicesHeading || 'Our Services'}</h2>
                {hp?.servicesSubheading && <p className="text-[14px] text-gray-500 mt-1">{hp.servicesSubheading}</p>}
              </div>
              <Link href="/services" className="text-[13px] text-cyan-500 hover:text-cyan-600 font-medium transition-colors">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {services.slice(0, 6).map((svc: any) => (
                <Link key={svc._id} href={`/services/${svc.slug.current}`}
                  className="group border border-gray-200 hover:border-cyan-400 rounded-xl p-4 text-center transition-colors duration-150">
                  <p className="text-[13px] font-medium text-gray-700 group-hover:text-cyan-600 transition-colors">{svc.title}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Online Courses ── */}
      {courses?.length > 0 && (
        <section className="py-16 bg-[#fafafa] border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-[11px] font-semibold text-cyan-500 uppercase tracking-widest mb-1">Education</p>
                <h2 className="text-[28px] font-bold text-gray-900">{hp?.coursesHeading || 'Online Courses'}</h2>
                {hp?.coursesSubheading && <p className="text-[14px] text-gray-500 mt-1">{hp.coursesSubheading}</p>}
              </div>
              <Link href="/online-courses" className="text-[13px] text-cyan-500 hover:text-cyan-600 font-medium transition-colors">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {courses.slice(0, 3).map((course: any) => (
                <Link key={course._id} href={`/online-courses/${course.slug.current}`}
                  className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-cyan-300 transition-colors duration-150">
                  {course.featuredImage && (
                    <div className="relative h-44 w-full">
                      <Image src={urlFor(course.featuredImage).width(600).height(300).url()} alt={course.title} fill className="object-cover" />
                    </div>
                  )}
                  <div className="p-5">
                    <span className="text-[11px] font-semibold text-cyan-500 uppercase tracking-wider">{course.subject}</span>
                    <h3 className="font-semibold text-gray-900 mt-1.5 mb-1 group-hover:text-cyan-600 transition-colors">{course.title}</h3>
                    {course.price && <p className="text-[13px] text-gray-500">{course.price}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Latest Articles ── */}
      {posts?.length > 0 && (
        <section className="py-16 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-[11px] font-semibold text-cyan-500 uppercase tracking-widest mb-1">Knowledge</p>
                <h2 className="text-[28px] font-bold text-gray-900">{hp?.articlesHeading || 'Latest Articles'}</h2>
                {hp?.articlesSubheading && <p className="text-[14px] text-gray-500 mt-1">{hp.articlesSubheading}</p>}
              </div>
              <Link href="/articles" className="text-[13px] text-cyan-500 hover:text-cyan-600 font-medium transition-colors">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.slice(0, 3).map((post: any) => (
                <Link key={post._id} href={`/articles/${post.slug.current}`}
                  className="group flex flex-col bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-cyan-300 transition-colors duration-150">
                  {post.mainImage && (
                    <div className="relative h-44 w-full">
                      <Image src={urlFor(post.mainImage).width(600).height(350).url()} alt={post.mainImage.alt ?? post.title} fill className="object-cover" />
                    </div>
                  )}
                  <div className="p-5 flex-1 flex flex-col">
                    <p className="text-[11px] text-gray-400 mb-2">
                      {post.publishedAt && new Date(post.publishedAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <h3 className="font-semibold text-gray-900 group-hover:text-cyan-600 transition-colors leading-snug flex-1">{post.title}</h3>
                    {post.excerpt && <p className="text-[13px] text-gray-500 mt-2 line-clamp-2">{post.excerpt}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Donate CTA ── */}
      <section className="py-16 bg-[#0d2137]">
        <div className="max-w-2xl mx-auto px-8 text-center">
          <h2 className="text-[28px] font-bold text-white mb-3">{hp?.donateHeading || 'Support Our Mission'}</h2>
          <p className="text-[14px] text-gray-400 leading-relaxed mb-8">
            {hp?.donateText || 'Your Sadqah and donations help us continue spreading the teachings of Ahlul Bayt (A.S.)'}
          </p>
          <Link href="/donate"
            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white text-[14px] font-medium px-8 py-3 rounded-full transition-colors">
            {hp?.donateCtaLabel || 'Donate Now'}
            <ArrowRight size={14} strokeWidth={2.5} />
          </Link>
        </div>
      </section>
    </>
  )
}
