import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { topLevelServicesQuery } from '@/sanity/lib/queries'
import ContentCard from '@/components/ui/ContentCard'

export const revalidate = 60
export const metadata: Metadata = { title: 'Services' }

export default async function ServicesPage() {
  const services = await client.fetch(topLevelServicesQuery)

  return (
    <div className="py-14">
      <div className="max-w-7xl mx-auto px-8">

        <p className="text-[11px] font-semibold text-cyan-500 uppercase tracking-widest mb-1">
          What we offer
        </p>
        <h1 className="text-[32px] font-bold text-gray-900 mb-2">Services</h1>
        <p className="text-[14px] text-gray-500 mb-12 max-w-2xl">
          Religious services offered with sincerity — Niyabat Ziarat, Zakat, Khums &amp; more.
          Click any service to explore further.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((svc: any, i: number) => (
            <ContentCard
              key={svc._id}
              href={`/services/${svc.slug.current}`}
              image={svc.icon ? urlFor(svc.icon).width(600).height(450).url() : null}
              title={svc.title}
              description={svc.excerpt || (svc.price ? svc.price : null)}
              ctaLabel={svc.childCount > 0 ? 'View Services' : 'Book Now'}
              active={i % 3 === 1}
            />
          ))}
        </div>

        {services.length === 0 && (
          <p className="text-gray-400 text-center py-24">Services coming soon.</p>
        )}

      </div>
    </div>
  )
}
