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
    <div>
      {/* Breadcrumb bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center flex-wrap gap-1 text-[12.5px] text-gray-400">
            <Link href="/online-courses" className="hover:text-cyan-600 transition-colors font-medium">Online Courses</Link>
            {ancestry.map(({ title, slug: aSlug }, i) => {
              const href = `/online-courses/${[...ancestry.slice(0, i + 1).map(a => a.slug)].join('/')}`
              return (
                <span key={aSlug} className="flex items-center gap-1">
                  <ChevronRight size={12} className="text-gray-300" />
                  <Link href={href} className="hover:text-cyan-600 transition-colors">{title}</Link>
                </span>
              )
            })}
            <span className="flex items-center gap-1">
              <ChevronRight size={12} className="text-gray-300" />
              <span className="text-slate-700 font-medium">{course.title}</span>
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {hasChildren ? (
          /* ── Parent: show child cards ── */
          <>
            <p className="flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.18em] text-cyan-600 mb-3">
              <span className="w-5 h-px bg-cyan-400 inline-block" />
              Courses
            </p>
            <h1 className="font-bold text-[30px] text-slate-900 tracking-[-0.02em] mb-2">{course.title}</h1>
            {course.excerpt && (
              <p className="text-[14px] text-gray-500 mb-10 max-w-2xl leading-relaxed">{course.excerpt}</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {course.children.map((child: any) => (
                <ContentCard
                  key={child._id}
                  href={`${currentPath}/${child.slug}`}
                  image={child.featuredImage ? urlFor(child.featuredImage).width(600).height(450).url() : null}
                  title={child.title}
                  description={child.excerpt || [child.price, child.duration].filter(Boolean).join(' · ') || null}
                  ctaLabel={child.childCount > 0 ? 'View Courses' : 'Enroll Now'}
                />
              ))}
            </div>
          </>
        ) : (
          /* ── Leaf: detail page ── */
          <div className="max-w-3xl">

            {imageUrl && (
              <div className="relative w-full aspect-[16/7] rounded-2xl overflow-hidden mb-8 shadow-sm">
                <Image src={imageUrl} alt={course.title} fill className="object-cover" />
              </div>
            )}

            <p className="flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.18em] text-cyan-600 mb-3">
              <span className="w-5 h-px bg-cyan-400 inline-block" />
              Course
            </p>
            <h1 className="font-bold text-[30px] text-slate-900 tracking-[-0.02em] mb-4">{course.title}</h1>

            {/* Meta pills */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {course.instructor && (
                <span className="text-[12.5px] text-gray-600 bg-slate-100 rounded-full px-3 py-1">
                  Instructor: <strong className="text-slate-800">{course.instructor}</strong>
                </span>
              )}
              {course.duration && (
                <span className="text-[12.5px] text-gray-600 bg-slate-100 rounded-full px-3 py-1">
                  {course.duration}
                </span>
              )}
              {course.price && (
                <span className="text-[13px] font-semibold text-cyan-700 bg-cyan-50 border border-cyan-100 rounded-full px-3 py-1">
                  {course.price}
                </span>
              )}
            </div>

            {course.excerpt && (
              <p className="text-[15px] text-gray-600 leading-[1.8] mb-8 border-l-[3px] border-cyan-400 pl-4">
                {course.excerpt}
              </p>
            )}

            {course.body?.length > 0 && (
              <div className="prose prose-slate prose-lg max-w-none mb-10
                prose-headings:font-bold prose-headings:tracking-tight
                prose-a:text-cyan-600 prose-a:no-underline hover:prose-a:underline">
                <PortableText value={course.body} />
              </div>
            )}

            {/* FAQs */}
            {course.faq?.length > 0 && (
              <div className="mt-10 mb-10">
                <h2 className="font-bold text-[20px] text-slate-900 tracking-[-0.01em] mb-5">Frequently Asked Questions</h2>
                <div className="space-y-3">
                  {course.faq.map((item: any, i: number) => (
                    <div key={i} className="bg-slate-50 border border-gray-100 rounded-xl p-5">
                      <h3 className="font-semibold text-slate-900 mb-2 text-[14.5px]">{item.question}</h3>
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
            <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-gray-100">
              {course.enrollmentLink ? (
                <a href={course.enrollmentLink} target="_blank" rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white text-[13.5px] font-semibold px-6 py-2.5 rounded-full shadow-[0_4px_16px_rgba(8,145,178,0.3)] hover:-translate-y-px transition-all duration-200">
                  Enroll Now <ArrowRight size={13} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
                </a>
              ) : (
                <Link href="/contact"
                  className="group inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white text-[13.5px] font-semibold px-6 py-2.5 rounded-full shadow-[0_4px_16px_rgba(8,145,178,0.3)] hover:-translate-y-px transition-all duration-200">
                  Enroll Now <ArrowRight size={13} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              )}
              <Link href="/online-courses"
                className="inline-flex items-center text-[13.5px] font-medium text-slate-700 hover:text-slate-900 border border-gray-300 hover:border-gray-400 bg-white px-6 py-2.5 rounded-full transition-all duration-200">
                All Courses
              </Link>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}
