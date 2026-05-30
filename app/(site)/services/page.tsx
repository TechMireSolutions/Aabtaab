import type { Metadata } from 'next'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { topLevelServicesQuery } from '@/sanity/lib/queries'

export const revalidate = 60
export const metadata: Metadata = { title: 'Services' }

export default async function ServicesPage() {
  const services = await client.fetch(topLevelServicesQuery)

  return (
    <div className="py-14">
      <div className="container-main">
        <h1 className="section-title text-4xl mb-2">Services</h1>
        <p className="text-gray-500 mb-10">Religious services offered with sincerity — Niyabat, Zakat, Khums & more</p>

        <div className="space-y-10">
          {services.map((svc: any) => (
            <div key={svc._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-primary-500 text-white px-8 py-5">
                <Link href={`/services/${svc.slug.current}`} className="text-xl font-bold hover:text-gold-400 transition-colors">
                  {svc.title}
                </Link>
              </div>

              {svc.children?.length > 0 && (
                <div className="p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {svc.children.map((child: any) => (
                      <div key={child._id}>
                        <Link href={`/services/${child.slug.current}`}
                          className="block bg-primary-50 hover:bg-primary-500 hover:text-white text-primary-700 font-medium text-sm rounded-lg px-4 py-3 transition-colors text-center">
                          {child.title}
                        </Link>
                        {child.children?.length > 0 && (
                          <div className="mt-2 space-y-1 pl-2">
                            {child.children.map((grandchild: any) => (
                              <Link key={grandchild._id} href={`/services/${grandchild.slug.current}`}
                                className="block text-xs text-gray-500 hover:text-primary-500 py-1 hover:underline transition-colors">
                                — {grandchild.title}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {services.length === 0 && (
            <p className="text-gray-400 text-center py-20">Services information coming soon.</p>
          )}
        </div>
      </div>
    </div>
  )
}
