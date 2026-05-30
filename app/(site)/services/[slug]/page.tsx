import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { serviceBySlugQuery, serviceSlugsQuery } from '@/sanity/lib/queries'
import { PortableText } from '@portabletext/react'

export const revalidate = 60

export async function generateStaticParams() {
  const slugs = await client.fetch(serviceSlugsQuery)
  return slugs.map(({ slug }: { slug: string }) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const service = await client.fetch(serviceBySlugQuery, { slug })
  return { title: service?.seoTitle ?? service?.title ?? 'Service' }
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = await client.fetch(serviceBySlugQuery, { slug })
  if (!service) notFound()

  return (
    <div className="py-14">
      <div className="container-main max-w-4xl">
        <div className="text-sm text-gray-400 mb-6">
          <Link href="/services" className="hover:text-primary-500">Services</Link>
          {service.parent && (
            <> / <Link href={`/services/${service.parent.slug.current}`} className="hover:text-primary-500">{service.parent.title}</Link></>
          )}
          <span className="text-gray-600"> / {service.title}</span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <h1 className="text-3xl font-bold text-primary-800 mb-2">{service.title}</h1>
          {service.price && <p className="text-gold-600 font-semibold mb-4">{service.price}</p>}

          {service.description && (
            <div className="prose prose-sm max-w-none text-gray-700 mb-8">
              <PortableText value={service.description} />
            </div>
          )}

          {service.children?.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-primary-700 mb-4">Sub-services</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {service.children.map((child: any) => (
                  <Link key={child._id} href={`/services/${child.slug.current}`}
                    className="bg-primary-50 hover:bg-primary-500 hover:text-white text-primary-700 font-medium text-sm rounded-lg px-4 py-3 transition-colors text-center">
                    {child.title}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {service.isBookable && (
            <div className="mt-8 pt-8 border-t border-gray-100">
              <Link href="/contact" className="btn-primary">Request This Service</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
