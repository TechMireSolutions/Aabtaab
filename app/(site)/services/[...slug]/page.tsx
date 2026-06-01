import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { serviceBySlugDeepQuery, allServicePathsQuery } from '@/sanity/lib/queries'
import { PortableText } from '@portabletext/react'
import ContentCard from '@/components/ui/ContentCard'

export const revalidate = 60

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

/** Walk the parent chain and return ordered ancestors (oldest first) */
function getAncestry(service: any): { title: string; slug: string }[] {
  const chain: { title: string; slug: string }[] = []
  let cur = service.parent
  while (cur) {
    chain.unshift({ title: cur.title, slug: cur.slug })
    cur = cur.parent
  }
  return chain
}

/** Build the full /services/a/b/c href for a given ancestor list + current slug */
function buildPath(slugArray: string[]): string {
  return `/services/${slugArray.join('/')}`
}

/* ─── Static params ───────────────────────────────────────────────────────── */

export async function generateStaticParams() {
  const services = await client.fetch(allServicePathsQuery)

  return services.map((s: any) => {
    const slugs: string[] = [s.slug]
    let cur = s
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
  const service = await client.fetch(serviceBySlugDeepQuery, { slug: slug[slug.length - 1] })
  return {
    title:       service?.seoTitle       || service?.title || 'Service',
    description: service?.seoDescription || service?.excerpt,
  }
}

/* ─── Page ────────────────────────────────────────────────────────────────── */

export default async function ServiceCatchAllPage(
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params
  const currentSlug = slug[slug.length - 1]

  const service = await client.fetch(serviceBySlugDeepQuery, { slug: currentSlug })
  if (!service) notFound()

  const hasChildren = service.children?.length > 0
  const ancestry    = getAncestry(service)
  const currentPath = buildPath(slug)
  const imageUrl    = service.icon ? urlFor(service.icon).width(900).height(500).url() : null

  return (
    <div className="py-14">
      <div className="max-w-7xl mx-auto px-8">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center flex-wrap gap-1 text-[13px] text-gray-400 mb-8">
          <Link href="/services" className="hover:text-cyan-500 transition-colors">Services</Link>
          {ancestry.map(({ title, slug: aSlug }, i) => {
            const href = buildPath([...ancestry.slice(0, i + 1).map(a => a.slug)])
            return (
              <span key={aSlug} className="flex items-center gap-1">
                <ChevronRight size={13} className="text-gray-300" />
                <Link href={href} className="hover:text-cyan-500 transition-colors">{title}</Link>
              </span>
            )
          })}
          <span className="flex items-center gap-1">
            <ChevronRight size={13} className="text-gray-300" />
            <span className="text-gray-700 font-medium">{service.title}</span>
          </span>
        </nav>

        {hasChildren ? (
          /* ════════════════════════════════
             SERVICE HAS CHILDREN → show cards
             ════════════════════════════════ */
          <>
            <p className="text-[11px] font-semibold text-cyan-500 uppercase tracking-widest mb-1">
              Services
            </p>
            <h1 className="text-[32px] font-bold text-gray-900 mb-2">{service.title}</h1>

            {service.excerpt && (
              <p className="text-[14px] text-gray-500 mb-10 max-w-2xl leading-relaxed">
                {service.excerpt}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {service.children.map((child: any, i: number) => (
                <ContentCard
                  key={child._id}
                  href={`${currentPath}/${child.slug}`}
                  image={child.icon ? urlFor(child.icon).width(600).height(450).url() : null}
                  title={child.title}
                  description={child.excerpt || (child.price ? child.price : null)}
                  ctaLabel={child.childCount > 0 ? 'View Services' : 'Book Now'}
                  active={i % 3 === 1}
                />
              ))}
            </div>
          </>
        ) : (
          /* ════════════════════════════════
             LEAF SERVICE → detail page
             ════════════════════════════════ */
          <div className="max-w-3xl">

            {/* Cover image */}
            {imageUrl && (
              <div className="relative w-full aspect-[16/7] rounded-xl overflow-hidden mb-8">
                <Image src={imageUrl} alt={service.title} fill className="object-cover" />
              </div>
            )}

            <p className="text-[11px] font-semibold text-cyan-500 uppercase tracking-widest mb-1">
              Service
            </p>
            <h1 className="text-[32px] font-bold text-gray-900 mb-2">{service.title}</h1>

            {service.price && (
              <p className="text-[15px] font-medium text-cyan-600 mb-4">{service.price}</p>
            )}

            {service.excerpt && (
              <p className="text-[15px] text-gray-500 leading-relaxed mb-8 border-l-2 border-cyan-400 pl-4">
                {service.excerpt}
              </p>
            )}

            {/* Rich text body */}
            {service.body && service.body.length > 0 && (
              <div className="prose prose-gray max-w-none mb-10">
                <PortableText value={service.body} />
              </div>
            )}

            {/* FAQs */}
            {service.faq?.length > 0 && (
              <div className="mt-10 mb-10">
                <h2 className="text-[20px] font-bold text-gray-900 mb-5">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-3">
                  {service.faq.map((item: any, i: number) => (
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
              {service.isBookable && (
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white text-[13.5px] font-medium px-6 py-2.5 rounded-full transition-colors"
                >
                  Book This Service <ArrowRight size={14} strokeWidth={2.5} />
                </Link>
              )}
              <Link
                href="/services"
                className="inline-flex items-center text-[13.5px] font-medium text-gray-600 hover:text-gray-900 border border-gray-300 hover:border-gray-400 px-6 py-2.5 rounded-full transition-colors"
              >
                All Services
              </Link>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}
