import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ChevronRight, MessageCircle, Plus, Check } from 'lucide-react'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { serviceBySlugDeepQuery, siteSettingsQuery } from '@/sanity/lib/queries'
import { PortableText } from '@portabletext/react'
import ContentCard from '@/components/ui/ContentCard'

export const dynamic = 'force-dynamic'

function getAncestry(service: any): { title: string; slug: string }[] {
  const chain: { title: string; slug: string }[] = []
  let cur = service.parent
  while (cur) {
    chain.unshift({ title: cur.title, slug: cur.slug })
    cur = cur.parent
  }
  return chain
}

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

export default async function ServiceCatchAllPage(
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params
  const currentSlug = slug[slug.length - 1]

  const [service, site] = await Promise.all([
    client.fetch(serviceBySlugDeepQuery, { slug: currentSlug }),
    client.fetch(siteSettingsQuery),
  ])
  if (!service) notFound()

  const hasChildren   = service.children?.length > 0
  const ancestry      = getAncestry(service)
  const currentPath   = `/services/${slug.join('/')}`
  const heroImageUrl  = service.heroImage  ? urlFor(service.heroImage).width(1600).height(800).url()  : null
  const whyUsImageUrl = service.whyUsImage ? urlFor(service.whyUsImage).width(700).height(700).url()  : null
  const whatsappHref  = site?.whatsapp
    ? `https://wa.me/${String(site.whatsapp).replace(/\D/g, '')}`
    : '/contact'

  return (
    <div>

      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center flex-wrap gap-1 text-[12.5px] text-gray-400">
            <Link href="/services" className="hover:text-cyan-600 transition-colors font-medium">Services</Link>
            {ancestry.map(({ title, slug: aSlug }, i) => {
              const href = `/services/${ancestry.slice(0, i + 1).map(a => a.slug).join('/')}`
              return (
                <span key={aSlug} className="flex items-center gap-1">
                  <ChevronRight size={12} className="text-gray-300" />
                  <Link href={href} className="hover:text-cyan-600 transition-colors">{title}</Link>
                </span>
              )
            })}
            <span className="flex items-center gap-1">
              <ChevronRight size={12} className="text-gray-300" />
              <span className="text-slate-700 font-medium">{service.title}</span>
            </span>
          </nav>
        </div>
      </div>

      {hasChildren ? (

        /* ── Parent: child service cards ─────────────────────────────────── */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <p className="flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.18em] text-cyan-600 mb-3">
            <span className="w-5 h-px bg-cyan-400 inline-block" />
            Services
          </p>
          <h1 className="font-bold text-[30px] text-slate-900 tracking-[-0.02em] mb-2">{service.title}</h1>
          {service.excerpt && (
            <p className="text-[14px] text-gray-500 mb-10 max-w-2xl leading-relaxed">{service.excerpt}</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {service.children.map((child: any) => (
              <ContentCard
                key={child._id}
                href={`${currentPath}/${child.slug}`}
                image={child.icon ? urlFor(child.icon).width(600).height(450).url() : null}
                title={child.title}
                description={child.excerpt || child.price || null}
                ctaLabel={child.childCount > 0 ? 'View Services' : 'Learn More'}
              />
            ))}
          </div>
        </div>

      ) : (

        /* ── Leaf: full detail page ──────────────────────────────────────── */
        <div>

          {/* ── 1. HERO ────────────────────────────────────────────────────── */}
          <section className="relative bg-slate-900 overflow-hidden min-h-[340px] flex items-center justify-center">
            {heroImageUrl && (
              <Image
                src={heroImageUrl}
                alt={service.title}
                fill
                className="object-cover opacity-[0.18]"
                priority
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-transparent to-slate-900/80 pointer-events-none" />

            <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
              {service.price && (
                <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] text-cyan-400 border border-cyan-700/60 rounded-full px-3.5 py-1 bg-cyan-950/40 mb-6">
                  {service.price}
                </span>
              )}
              <h1 className="font-bold text-[36px] sm:text-[50px] text-white tracking-[-0.03em] leading-[1.1] mb-5">
                {service.title}
              </h1>
              {service.heroSubtitle && (
                <p className="text-[16px] sm:text-[18px] font-semibold text-white/90 mb-4 leading-relaxed">
                  {service.heroSubtitle}
                </p>
              )}
              {(service.heroBody || (!service.heroSubtitle && service.excerpt)) && (
                <p className="text-[15px] text-slate-300 max-w-2xl mx-auto leading-[1.85]">
                  {service.heroBody || service.excerpt}
                </p>
              )}
            </div>
          </section>

          {/* ── 2. WHY USE OUR PLATFORM ──────────────────────────────────── */}
          {service.whyUs?.length > 0 && (
            <section className="bg-white py-16 sm:py-20">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                  {/* Left: image */}
                  <div className="flex justify-center lg:justify-start order-2 lg:order-1">
                    {whyUsImageUrl ? (
                      <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                        <Image src={whyUsImageUrl} alt={service.whyUsHeading || service.title} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-full max-w-sm aspect-square rounded-2xl bg-slate-50 border border-gray-200 flex items-center justify-center">
                        <span className="text-[12px] text-gray-400">Add image in Studio</span>
                      </div>
                    )}
                  </div>

                  {/* Right: features */}
                  <div className="order-1 lg:order-2">
                    <h2 className="font-bold text-[24px] sm:text-[30px] text-slate-900 tracking-[-0.02em] mb-8">
                      {service.whyUsHeading || 'Why Use Our Platform?'}
                    </h2>
                    <ul className="space-y-4">
                      {service.whyUs.map((item: any, i: number) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-md bg-cyan-50 border border-cyan-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check size={13} className="text-cyan-600" strokeWidth={2.5} />
                          </div>
                          <p className="text-[14.5px] text-slate-700 leading-relaxed">
                            <span className="font-semibold text-slate-900">{item.title}:</span>
                            {item.desc && <span className="text-gray-600"> {item.desc}</span>}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              </div>
            </section>
          )}

          {/* ── 3. OUR COMMITMENT ────────────────────────────────────────── */}
          {service.commitment?.length > 0 && (
            <section className="bg-slate-900 py-16 sm:py-20">
              <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
                <h2 className="font-bold text-[24px] sm:text-[32px] text-white tracking-[-0.02em] mb-10">
                  {service.commitmentHeading || 'Our Commitment'}
                </h2>
                <ul className="space-y-5">
                  {service.commitment.map((item: any, i: number) => (
                    <li key={i} className="text-[14.5px] text-slate-300 leading-relaxed">
                      <span className="font-semibold text-white">{item.title}:</span>
                      {item.desc && <span> {item.desc}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* ── 4. HOW IT WORKS ──────────────────────────────────────────── */}
          {service.howItWorks?.length > 0 && (
            <section className="bg-cyan-50 py-16 sm:py-20">
              <div className="max-w-2xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-12">
                  <h2 className="font-bold text-[24px] sm:text-[32px] text-slate-900 tracking-[-0.02em]">
                    {service.howItWorksHeading || 'How It Works'}
                  </h2>
                </div>
                <ol className="space-y-4">
                  {service.howItWorks.map((step: any, i: number) => (
                    <li
                      key={i}
                      className="flex items-start gap-5 bg-white rounded-2xl px-6 py-5 border border-cyan-100 shadow-sm"
                    >
                      <span className="shrink-0 w-9 h-9 rounded-full bg-cyan-600 text-white text-[13px] font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <div className="pt-0.5">
                        <span className="font-bold text-slate-900 text-[15px]">{step.label}</span>
                        {step.desc && (
                          <span className="text-gray-500 text-[14px]"> — {step.desc}</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          )}

          {/* ── 5. CTA BANNER ────────────────────────────────────────────── */}
          {(service.ctaHeading || service.ctaSubtitle) && (
            <section className="bg-slate-900 py-16 sm:py-20">
              <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
                {service.ctaHeading && (
                  <h2 className="font-bold text-[26px] sm:text-[34px] text-white tracking-[-0.02em] mb-4">
                    {service.ctaHeading}
                  </h2>
                )}
                {service.ctaSubtitle && (
                  <p className="text-[15px] text-slate-400 mb-8 leading-relaxed">{service.ctaSubtitle}</p>
                )}
                <div className="flex flex-wrap justify-center gap-3">
                  <Link href="/contact"
                    className="group inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold text-[14px] px-8 py-3.5 rounded-full shadow-[0_4px_20px_rgba(6,182,212,0.3)] transition-all duration-200 hover:-translate-y-px">
                    {service.ctaBtn1Label || 'Get Started'}
                    <ArrowRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white text-[14px] font-semibold px-8 py-3.5 rounded-full border border-white/20 transition-all duration-200 hover:-translate-y-px">
                    <MessageCircle size={14} />
                    {service.ctaBtn2Label || 'WhatsApp Us'}
                  </a>
                </div>
              </div>
            </section>
          )}

          {/* ── Extra rich text body (optional) ──────────────────────────── */}
          {service.body?.length > 0 && (
            <section className="bg-white py-12 sm:py-16">
              <div className="max-w-3xl mx-auto px-4 sm:px-6
                prose prose-slate prose-lg max-w-none
                prose-headings:font-bold prose-headings:tracking-tight
                prose-a:text-cyan-600 prose-a:no-underline hover:prose-a:underline">
                <PortableText value={service.body} />
              </div>
            </section>
          )}

          {/* ── 6. FAQs ──────────────────────────────────────────────────── */}
          {service.faq?.length > 0 && (
            <section className="bg-slate-50 py-16 sm:py-20">
              <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-10">
                  <h2 className="font-bold text-[24px] sm:text-[30px] text-slate-900 tracking-[-0.02em]">
                    {service.faqSectionHeading || 'Frequently Asked Questions'}
                  </h2>
                </div>
                <div className="space-y-3">
                  {service.faq.map((item: any, i: number) => (
                    <details
                      key={i}
                      className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm"
                    >
                      <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none font-semibold text-[15px] text-slate-900 hover:text-cyan-700 transition-colors">
                        {item.question}
                        <Plus
                          size={16}
                          strokeWidth={2}
                          className="shrink-0 text-gray-400 group-open:rotate-45 transition-transform duration-200"
                        />
                      </summary>
                      {item.answer?.length > 0 && (
                        <div className="px-6 pb-5 pt-1 text-[14px] text-gray-600 leading-relaxed border-t border-gray-50 prose prose-sm max-w-none">
                          <PortableText value={item.answer} />
                        </div>
                      )}
                    </details>
                  ))}
                </div>
              </div>
            </section>
          )}

        </div>
      )}

    </div>
  )
}
