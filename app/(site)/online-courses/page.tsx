import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { topLevelCoursesQuery, pageBySlugQuery } from '@/sanity/lib/queries'
import ContentCard from '@/components/ui/ContentCard'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const page = await client.fetch(pageBySlugQuery, { slug: 'online-courses' })
  return {
    title: page?.seoTitle || page?.title || 'Online Courses',
    description: page?.seoDescription || page?.subtitle,
  }
}

export default async function CoursesPage() {
  const [courses, page] = await Promise.all([
    client.fetch(topLevelCoursesQuery),
    client.fetch(pageBySlugQuery, { slug: 'online-courses' }),
  ])

  return (
    <div>
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <p className="flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.18em] text-cyan-600 mb-3">
            <span className="w-5 h-px bg-cyan-400 inline-block" />
            {page?.eyebrow || 'Education'}
          </p>
          <h1 className="font-bold text-[26px] sm:text-[30px] text-slate-900 tracking-[-0.02em] mb-2">
            {page?.title || 'Online Courses'}
          </h1>
          <p className="text-[13.5px] text-gray-500 max-w-xl leading-relaxed">
            {page?.subtitle || 'Learn from qualified scholars — Quran, Nahjul Balagha, Jurisprudence, Ethics & History.'}
          </p>
        </div>
      </div>

      <div className="py-8 sm:py-12 bg-slate-50/40 min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {courses.length === 0 ? (
            <p className="text-center text-gray-400 text-[15px] py-24">Courses coming soon.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {courses.map((course: any) => (
                <ContentCard
                  key={course._id}
                  href={`/online-courses/${course.slug.current}`}
                  image={course.featuredImage ? urlFor(course.featuredImage).width(600).height(450).url() : null}
                  title={course.title}
                  description={course.excerpt || [course.price, course.duration].filter(Boolean).join(' · ') || null}
                  ctaLabel={course.childCount > 0 ? 'View Courses' : 'Enroll Now'}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
