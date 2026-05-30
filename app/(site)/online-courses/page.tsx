import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { coursesQuery } from '@/sanity/lib/queries'
import ContentCard from '@/components/ui/ContentCard'

export const revalidate = 60
export const metadata: Metadata = { title: 'Online Courses' }

const SUBJECTS = [
  { value: 'quran',         label: 'Quran' },
  { value: 'nejul-balagha', label: 'Nejul Balagha' },
  { value: 'jurisprudence', label: 'Jurisprudence' },
  { value: 'ethics',        label: 'Ethics' },
  { value: 'history',       label: 'History' },
]

export default async function CoursesPage() {
  const courses = await client.fetch(coursesQuery)

  const grouped = SUBJECTS.map((s) => ({
    ...s,
    courses: courses.filter((c: any) => c.subject === s.value),
  })).filter((g) => g.courses.length > 0)

  return (
    <div className="py-14">
      <div className="max-w-7xl mx-auto px-8">

        <p className="text-[11px] font-semibold text-cyan-500 uppercase tracking-widest mb-1">Education</p>
        <h1 className="text-[32px] font-bold text-gray-900 mb-1">Online Courses</h1>
        <p className="text-[14px] text-gray-500 mb-12">Learn from qualified scholars — Quran, Fiqh, Ethics &amp; more</p>

        {grouped.map((group) => (
          <div key={group.value} className="mb-14">
            <h2 className="text-[20px] font-bold text-gray-900 mb-6 pb-3 border-b border-gray-100">
              {group.label}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {group.courses.map((course: any, i: number) => (
                <ContentCard
                  key={course._id}
                  href={`/online-courses/${course.slug.current}`}
                  image={course.featuredImage ? urlFor(course.featuredImage).width(600).height(450).url() : null}
                  title={course.title}
                  description={course.price ? `${course.price}${course.duration ? ' · ' + course.duration : ''}` : course.duration || null}
                  badge={course.quranType || undefined}
                  ctaLabel="Enroll Now"
                  active={i % 3 === 1}
                />
              ))}
            </div>
          </div>
        ))}

        {courses.length === 0 && (
          <p className="text-gray-400 text-center py-24">Courses coming soon.</p>
        )}
      </div>
    </div>
  )
}
