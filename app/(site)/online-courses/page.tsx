import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { topLevelCoursesQuery } from '@/sanity/lib/queries'
import ContentCard from '@/components/ui/ContentCard'

export const revalidate = 60
export const metadata: Metadata = { title: 'Online Courses' }

export default async function CoursesPage() {
  const courses = await client.fetch(topLevelCoursesQuery)

  return (
    <div className="py-14">
      <div className="max-w-7xl mx-auto px-8">

        <p className="text-[11px] font-semibold text-cyan-500 uppercase tracking-widest mb-1">
          Education
        </p>
        <h1 className="text-[32px] font-bold text-gray-900 mb-2">Online Courses</h1>
        <p className="text-[14px] text-gray-500 mb-12 max-w-2xl">
          Learn from qualified scholars — Quran, Nejul Balagha, Jurisprudence, Ethics &amp; History.
          Click any subject to explore further.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course: any, i: number) => (
            <ContentCard
              key={course._id}
              href={`/online-courses/${course.slug.current}`}
              image={course.featuredImage
                ? urlFor(course.featuredImage).width(600).height(450).url()
                : null}
              title={course.title}
              description={
                course.excerpt ||
                [course.price, course.duration].filter(Boolean).join(' · ') ||
                null
              }
              ctaLabel={course.childCount > 0 ? 'View Courses' : 'Enroll Now'}
              active={i % 3 === 1}
            />
          ))}
        </div>

        {courses.length === 0 && (
          <p className="text-gray-400 text-center py-24">Courses coming soon.</p>
        )}

      </div>
    </div>
  )
}
