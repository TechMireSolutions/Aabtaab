import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { courseBySlugQuery, courseSlugsQuery } from '@/sanity/lib/queries'

export const revalidate = 60

export async function generateStaticParams() {
  const slugs = await client.fetch(courseSlugsQuery)
  return slugs.map(({ slug }: { slug: string }) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const course = await client.fetch(courseBySlugQuery, { slug })
  return { title: course?.title ?? 'Course' }
}

const LEVEL_ORDER: Record<string, number> = { beginner: 1, intermediate: 2, advanced: 3 }

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const course = await client.fetch(courseBySlugQuery, { slug })
  if (!course) notFound()

  const sortedLevels = course.levels?.sort((a: any, b: any) =>
    (LEVEL_ORDER[a.title] ?? 9) - (LEVEL_ORDER[b.title] ?? 9)
  )

  return (
    <div className="py-14">
      <div className="container-main max-w-4xl">
        <Link href="/online-courses" className="text-primary-500 text-sm hover:underline mb-6 inline-block">← Back to Courses</Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {course.featuredImage && (
            <div className="relative h-64 w-full">
              <Image src={urlFor(course.featuredImage).width(900).height(400).url()} alt={course.title} fill className="object-cover" />
            </div>
          )}
          <div className="p-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs font-medium bg-primary-50 text-primary-600 px-3 py-1 rounded-full">{course.subject}</span>
              {course.quranType && <span className="text-xs font-medium bg-gold-400 text-white px-3 py-1 rounded-full">{course.quranType}</span>}
            </div>
            <h1 className="text-3xl font-bold text-primary-800 mb-2">{course.title}</h1>
            {course.instructor && <p className="text-gray-500 mb-6">Instructor: <span className="font-medium text-primary-600">{course.instructor}</span></p>}

            <div className="flex flex-wrap gap-6 text-sm mb-8">
              {course.duration && <span className="text-gray-600">Duration: <strong>{course.duration}</strong></span>}
              {course.price && <span className="text-gold-600 font-semibold text-base">{course.price}</span>}
            </div>

            {sortedLevels?.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-primary-700 mb-4">Course Levels</h2>
                <div className="space-y-4">
                  {sortedLevels.map((level: any, i: number) => (
                    <div key={level._id} className="bg-primary-50 rounded-lg p-5">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="w-7 h-7 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center">{i + 1}</span>
                        <h3 className="font-semibold text-primary-800 capitalize">{level.title} Level</h3>
                        {level.duration && <span className="ml-auto text-xs text-gray-500">{level.duration}</span>}
                      </div>
                      {level.prerequisites && <p className="text-xs text-gray-500 ml-10">Prerequisites: {level.prerequisites}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {course.enrollmentLink && (
              <a href={course.enrollmentLink} target="_blank" rel="noopener noreferrer" className="btn-primary">
                Enroll Now
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
