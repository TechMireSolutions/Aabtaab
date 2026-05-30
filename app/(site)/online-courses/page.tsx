import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { coursesQuery } from '@/sanity/lib/queries'

export const revalidate = 60
export const metadata: Metadata = { title: 'Online Courses' }

const SUBJECTS = [
  { value: 'quran',        label: 'Quran' },
  { value: 'nejul-balagha',label: 'Nejul Balagha' },
  { value: 'jurisprudence',label: 'Jurisprudence' },
  { value: 'ethics',       label: 'Ethics' },
  { value: 'history',      label: 'History' },
]

export default async function CoursesPage() {
  const courses = await client.fetch(coursesQuery)

  const grouped = SUBJECTS.map((s) => ({
    ...s,
    courses: courses.filter((c: any) => c.subject === s.value),
  })).filter((g) => g.courses.length > 0)

  return (
    <div className="py-14">
      <div className="container-main">
        <h1 className="section-title text-4xl mb-2">Online Courses</h1>
        <p className="text-gray-500 mb-10">Learn from qualified scholars — Quran, Fiqh, Ethics & more</p>

        {grouped.map((group) => (
          <div key={group.value} className="mb-14">
            <h2 className="text-2xl font-bold text-primary-700 mb-6 pb-2 border-b border-primary-100">{group.label}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {group.courses.map((course: any) => (
                <Link key={course._id} href={`/online-courses/${course.slug.current}`}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col">
                  {course.featuredImage && (
                    <div className="relative h-44 w-full">
                      <Image src={urlFor(course.featuredImage).width(600).height(300).url()} alt={course.title} fill className="object-cover" />
                    </div>
                  )}
                  <div className="p-5 flex-1 flex flex-col">
                    {course.quranType && (
                      <span className="text-xs font-medium bg-gold-400 text-white px-2 py-0.5 rounded w-fit mb-2">{course.quranType}</span>
                    )}
                    <h3 className="font-bold text-primary-800 text-lg mb-1">{course.title}</h3>
                    {course.instructor && <p className="text-sm text-gray-500 mb-2">Instructor: {course.instructor.name}</p>}
                    {course.levels?.length > 0 && (
                      <p className="text-xs text-primary-600 mt-auto">{course.levels.length} level{course.levels.length > 1 ? 's' : ''} available</p>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      {course.price && <span className="text-sm font-semibold text-gold-600">{course.price}</span>}
                      <span className="text-sm text-primary-500 font-medium">View details →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {courses.length === 0 && (
          <p className="text-gray-400 text-center py-20">Courses coming soon. Please check back.</p>
        )}
      </div>
    </div>
  )
}
