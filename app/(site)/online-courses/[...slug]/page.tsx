import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { courseBySlugDeepQuery, allCoursePathsQuery } from '@/sanity/lib/queries'
import { PortableText } from '@portabletext/react'
import ContentCard from '@/components/ui/ContentCard'

export const revalidate = 60

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

function getAncestry(course: any): { title: string; slug: string }[] {
  const chain: { title: string; slug: string }[] = []
  let cur = course.parent
  while (cur) {
    chain.unshift({ title: cur.title, slug: cur.slug })
    cur = cur.parent
  }
  return chain
}

/* ─── Static params ───────────────────────────────────────────────────────── */

export async function generateStaticParams() {
  const courses = await client.fetch(allCoursePathsQuery)
  return courses.map((c: any) => {
    const slugs: string[] = [c.slug]
    let cur = c
    while (cur.parent) {
      slugs.unshift(cur.parent.slug)
      cur = cur.parent
    }
    return { slug: slugs }
  })
}

/* ─── Metadata ────────────────────────────────────────────────────────────── */

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string[] }> }
): Promise<Metadata> {
  const { slug } = await params
  const course = await client.fetch(courseBySlugDeepQuery, { slug: slug[slug.length - 1] })
  return {
    title:       course?.seoTitle       || course?.title || 'Course',
    description: course?.seoDescription || course?.excerpt,
  }
}

/* ─── Page ────────────────────────────────────────────────────────────────── */

export default async function CourseCatchAllPage(
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params
  const currentSlug = slug[slug.length - 1]

  const course = await client.fetch(courseBySlugDeepQuery, { slug: currentSlug })
  if (!course) notFound()

  const hasChildren = course.children?.length > 0
  const ancestry    = getAncestry(course)
  const currentPath = `/online-courses/${slug.join('/')}`
  const imageUrl    = course.featuredImage
    ? urlFor(course.featuredImage).width(900).height(500).url()
    : null

  return (
    <div className="py-14">
      <div className="max-w-7xl mx-auto px-8">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center flex-wrap gap-1 text-[13px] text-gray-400 mb-8">
          <Link href="/online-courses" className="hover:text-cyan-500 transition-colors">
            Online Courses
          </Link>
          {ancestry.map(({ title, slug: aSlug }, i) => {
            const href = `/online-courses/${[...ancestry.slice(0, i + 1).map(a => a.slug)].join('/')}`
            return (
              <span key={aSlug} className="flex items-center gap-1">
                <ChevronRight size={13} className="text-gray-300" />
                <Link href={href} className="hover:text-cyan-500 transition-colors">{title}</Link>
              </span>
            )
          })}
          <span className="flex items-center gap-1">
            <ChevronRight size={13} className="text-gray-300" />
            <span className="text-gray-700 font-medium">{course.title}</span>
          </span>
        </nav>

        {hasChildren ? (
          /* ════════════════════════════════
             HAS CHILDREN → show child cards
             ════════════════════════════════ */
          <>
            <p className="text-[11px] font-semibold text-cyan-500 uppercase tracking-widest mb-1">
              Courses
            </p>
            <h1 className="text-[32px] font-bold text-gray-900 mb-2">{course.title}</h1>

            {course.excerpt && (
              <p className="text-[14px] text-gray-500 mb-10 max-w-2xl leading-relaxed">
                {course.excerpt}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {course.children.map((child: any, i: number) => (
                <ContentCard
                  key={child._id}
                  href={`${currentPath}/${child.slug}`}
                  image={child.featuredImage
                    ? urlFor(child.featuredImage).width(600).height(450).url()
                    : null}
                  title={child.title}
                  description={
                    child.excerpt ||
                    [child.price, child.duration].filter(Boolean).join(' · ') ||
                    null
                  }
                  ctaLabel={child.childCount > 0 ? 'View Courses' : 'Enroll Now'}
                  active={i % 3 === 1}
                />
              ))}
            </div>
          </>
        ) : (
          /* ════════════════════════════════
             LEAF COURSE → detail page
             ════════════════════════════════ */
          <div className="max-w-3xl">

            {imageUrl && (
              <div className="relative w-full aspect-[16/7] rounded-xl overflow-hidden mb-8">
                <Image src={imageUrl} alt={course.title} fill className="object-cover" />
              </div>
            )}

            <p className="text-[11px] font-semibold text-cyan-500 uppercase tracking-widest mb-1">
              Course
            </p>
            <h1 className="text-[32px] font-bold text-gray-900 mb-2">{course.title}</h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 text-[13.5px] text-gray-500 mb-6">
              {course.instructor && (
                <span>Instructor: <strong className="text-gray-700">{course.instructor}</strong></span>
              )}
              {course.duration && (
                <span>Duration: <strong className="text-gray-700">{course.duration}</strong></span>
              )}
              {course.price && (
                <span className="font-semibold text-cyan-600 text-[15px]">{course.price}</span>
              )}
            </div>

            {course.excerpt && (
              <p className="text-[15px] text-gray-500 leading-relaxed mb-8 border-l-2 border-cyan-400 pl-4">
                {course.excerpt}
              </p>
            )}

            {/* Rich text body */}
            {course.body?.length > 0 && (
              <div className="prose prose-gray max-w-none mb-10">
                <PortableText value={course.body} />
              </div>
            )}

            {/* FAQs */}
            {course.faq?.length > 0 && (
              <div className="mt-10 mb-10">
                <h2 className="text-[20px] font-bold text-gray-900 mb-5">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-3">
                  {course.faq.map((item: any, i: number) => (
                    <div key={i} className="border border-gray-200 rounded-xl p-5">
                      <h3 className="font-semibold text-gray-900 mb-2 text-[15px]">
                        {item.question}
                      </h3>
                      {item.answer?.length > 0 && (
                        <div className="prose prose-sm text-gray-600 max-w-none">
                          <PortableText value={item.answer} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100">
              {course.enrollmentLink ? (
                <a
                  href={course.enrollmentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white text-[13.5px] font-medium px-6 py-2.5 rounded-full transition-colors"
                >
                  Enroll Now <ArrowRight size={14} strokeWidth={2.5} />
                </a>
              ) : (
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white text-[13.5px] font-medium px-6 py-2.5 rounded-full transition-colors"
                >
                  Enroll Now <ArrowRight size={14} strokeWidth={2.5} />
                </Link>
              )}
              <Link
                href="/online-courses"
                className="inline-flex items-center text-[13.5px] font-medium text-gray-600 hover:text-gray-900 border border-gray-300 hover:border-gray-400 px-6 py-2.5 rounded-full transition-colors"
              >
                All Courses
              </Link>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}
