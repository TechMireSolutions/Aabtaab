import Link from 'next/link'
import Image from 'next/image'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import {
  featuredPostsQuery,
  topLevelServicesQuery,
  coursesQuery,
  upcomingEventsQuery,
  homepageSettingsQuery,
} from '@/sanity/lib/queries'

export const revalidate = 60

export default async function HomePage() {
  const [posts, services, courses, events, hp] = await Promise.all([
    client.fetch(featuredPostsQuery),
    client.fetch(topLevelServicesQuery),
    client.fetch(coursesQuery),
    client.fetch(upcomingEventsQuery),
    client.fetch(homepageSettingsQuery),
  ])

  const heroTitle    = hp?.heroTitle    || 'AABTAAB'
  const heroSubtitle = hp?.heroSubtitle || 'Spreading the light of Ahlul Bayt (A.S.) — Islamic education, authentic content, and spiritual services.'
  const heroArabic   = hp?.heroArabicText || 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ'
  const cta1Label    = hp?.heroCta1Label || 'Explore Courses'
  const cta1Link     = hp?.heroCta1Link  || '/online-courses'
  const cta2Label    = hp?.heroCta2Label || 'Our Services'
  const cta2Link     = hp?.heroCta2Link  || '/services'
  const donateHeading = hp?.donateHeading || 'Support Our Mission'
  const donateText    = hp?.donateText    || 'Your Sadqah and donations help us continue spreading the teachings of Ahlul Bayt (A.S.)'
  const donateCtaLabel = hp?.donateCtaLabel || 'Donate Now'

  return (
    <>
      {/* Hero */}
      <section
        className="relative bg-primary-500 text-white py-24 overflow-hidden"
        style={hp?.heroImage ? { backgroundImage: `url(${urlFor(hp.heroImage).width(1600).url()})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
      >
        {hp?.heroImage && <div className="absolute inset-0 bg-primary-900/70" />}
        <div className="container-main text-center relative z-10">
          <p className="text-gold-400 text-lg mb-2 tracking-widest font-medium">{heroArabic}</p>
          <h1 className="text-5xl font-bold mb-4 tracking-wide">{heroTitle}</h1>
          <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">{heroSubtitle}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href={cta1Link} className="btn-gold">{cta1Label}</Link>
            <Link href={cta2Link} className="bg-white text-primary-500 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors">
              {cta2Label}
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      {events?.length > 0 && (
        <section className="bg-primary-50 py-10 border-b border-primary-100">
          <div className="container-main">
            <p className="text-sm font-semibold text-primary-500 uppercase tracking-wider mb-3">Upcoming</p>
            <div className="flex gap-6 overflow-x-auto pb-2">
              {events.map((ev: any) => (
                <div key={ev._id} className="flex-shrink-0 bg-white border border-primary-100 rounded-lg px-5 py-4 min-w-[220px]">
                  <p className="text-xs text-gray-500 mb-1">{new Date(ev.eventDate).toLocaleDateString('en-PK', { day: 'numeric', month: 'long' })}</p>
                  <p className="font-semibold text-primary-700 text-sm">{ev.title}</p>
                  {ev.location && <p className="text-xs text-gray-500 mt-1">{ev.location}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      {services?.length > 0 && (
        <section className="py-16">
          <div className="container-main">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="section-title">{hp?.servicesHeading || 'Our Services'}</h2>
                <p className="text-gray-500">{hp?.servicesSubheading || 'Religious services performed with sincerity and care'}</p>
              </div>
              <Link href="/services" className="text-primary-500 font-medium hover:underline text-sm">View all →</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {services.slice(0, 6).map((svc: any) => (
                <Link key={svc._id} href={`/services/${svc.slug.current}`}
                  className="bg-primary-50 hover:bg-primary-500 hover:text-white group rounded-xl p-5 text-center transition-colors border border-primary-100">
                  <p className="font-semibold text-sm text-primary-700 group-hover:text-white">{svc.title}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Online Courses */}
      {courses?.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container-main">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="section-title">{hp?.coursesHeading || 'Online Courses'}</h2>
                <p className="text-gray-500">{hp?.coursesSubheading || 'Learn Quran, Fiqh, Ethics & more from qualified scholars'}</p>
              </div>
              <Link href="/online-courses" className="text-primary-500 font-medium hover:underline text-sm">View all →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.slice(0, 3).map((course: any) => (
                <Link key={course._id} href={`/online-courses/${course.slug.current}`}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                  {course.featuredImage && (
                    <div className="relative h-40 w-full">
                      <Image src={urlFor(course.featuredImage).width(600).height(300).url()} alt={course.title} fill className="object-cover" />
                    </div>
                  )}
                  <div className="p-5">
                    <span className="text-xs font-medium bg-primary-50 text-primary-600 px-2 py-1 rounded">{course.subject}</span>
                    <h3 className="font-bold text-primary-800 mt-2 mb-1">{course.title}</h3>
                    {course.price && <p className="text-sm text-gold-600 font-medium">{course.price}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Articles */}
      {posts?.length > 0 && (
        <section className="py-16">
          <div className="container-main">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="section-title">{hp?.articlesHeading || 'Latest Articles'}</h2>
                <p className="text-gray-500">{hp?.articlesSubheading || 'News, knowledge & reflections'}</p>
              </div>
              <Link href="/articles" className="text-primary-500 font-medium hover:underline text-sm">View all →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.slice(0, 3).map((post: any) => (
                <Link key={post._id} href={`/articles/${post.slug.current}`}
                  className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                  {post.mainImage && (
                    <div className="relative h-48 w-full">
                      <Image src={urlFor(post.mainImage).width(600).height(350).url()} alt={post.mainImage.alt ?? post.title} fill className="object-cover" />
                    </div>
                  )}
                  <div className="p-5 flex-1">
                    <p className="text-xs text-gray-400 mb-2">{new Date(post.publishedAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <h3 className="font-bold text-primary-800 group-hover:text-primary-500 transition-colors leading-snug">{post.title}</h3>
                    {post.excerpt && <p className="text-sm text-gray-500 mt-2 line-clamp-2">{post.excerpt}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Donate CTA */}
      <section className="bg-primary-500 py-16 text-white text-center">
        <div className="container-main max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">{donateHeading}</h2>
          <p className="text-blue-200 mb-8">{donateText}</p>
          <Link href="/donate" className="btn-gold text-lg px-8 py-4">{donateCtaLabel}</Link>
        </div>
      </section>
    </>
  )
}
