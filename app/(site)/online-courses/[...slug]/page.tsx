import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ChevronRight, Check, MessageCircle, Mail, Phone } from 'lucide-react'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { courseBySlugDeepQuery, siteSettingsQuery } from '@/sanity/lib/queries'
import { PortableText } from '@portabletext/react'
import ContentCard from '@/components/ui/ContentCard'

export const dynamic = 'force-dynamic'

function getAncestry(course: any): { title: string; slug: string }[] {
  const chain: { title: string; slug: string }[] = []
  let cur = course.parent
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
  const course = await client.fetch(courseBySlugDeepQuery, { slug: slug[slug.length - 1] })
  return {
    title: course?.seoTitle || course?.title || 'Course',
    description: course?.seoDescription || course?.excerpt,
  }
}

export default async function CourseCatchAllPage(
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params
  const currentSlug = slug[slug.length - 1]

  const [course, site] = await Promise.all([
    client.fetch(courseBySlugDeepQuery, { slug: currentSlug }),
    client.fetch(siteSettingsQuery),
  ])
  if (!course) notFound()

  const hasChildren = course.children?.length > 0
  const ancestry    = getAncestry(course)
  const currentPath = `/online-courses/${slug.join('/')}`
  const heroImageUrl = course.featuredImage
    ? urlFor(course.featuredImage).width(1400).height(700).url()
    : null

  const enrollHref   = course.enrollmentLink || '/contact'
  const whatsappHref = site?.whatsapp
    ? `https://wa.me/${String(site.whatsapp).replace(/\D/g, '')}`
    : '/contact'

  return (
    <div>

      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center flex-wrap gap-1 text-[12.5px] text-gray-400">
            <Link href="/online-courses" className="hover:text-cyan-600 transition-colors font-medium">
              Online Courses
            </Link>
            {ancestry.map(({ title, slug: aSlug }, i) => {
              const href = `/online-courses/${ancestry.slice(0, i + 1).map(a => a.slug).join('/')}`
              return (
                <span key={aSlug} className="flex items-center gap-1">
                  <ChevronRight size={12} className="text-gray-300" />
                  <Link href={href} className="hover:text-cyan-600 transition-colors">{title}</Link>
                </span>
              )
            })}
            <span className="flex items-center gap-1">
              <ChevronRight size={12} className="text-gray-300" />
              <span className="text-slate-700 font-medium">{course.title}</span>
            </span>
          </nav>
        </div>
      </div>

      {hasChildren ? (

        /* ── Parent: child course cards ────────────────────────────────────── */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <p className="flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.18em] text-cyan-600 mb-3">
            <span className="w-5 h-px bg-cyan-400 inline-block" />
            Courses
          </p>
          <h1 className="font-bold text-[30px] text-slate-900 tracking-[-0.02em] mb-2">{course.title}</h1>
          {course.excerpt && (
            <p className="text-[14px] text-gray-500 mb-10 max-w-2xl leading-relaxed">{course.excerpt}</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {course.children.map((child: any) => (
              <ContentCard
                key={child._id}
                href={`${currentPath}/${child.slug}`}
                image={child.featuredImage ? urlFor(child.featuredImage).width(600).height(450).url() : null}
                title={child.title}
                description={child.excerpt || [child.price, child.duration].filter(Boolean).join(' · ') || null}
                ctaLabel={child.childCount > 0 ? 'View Courses' : 'Enroll Now'}
              />
            ))}
          </div>
        </div>

      ) : (

        /* ── Leaf: full detail page ────────────────────────────────────────── */
        <div>

          {/* ── 1. HERO ──────────────────────────────────────────────────────── */}
          <section className="relative bg-slate-900 overflow-hidden">
            {heroImageUrl && (
              <Image
                src={heroImageUrl}
                alt={course.title}
                fill
                className="object-cover opacity-[0.18]"
                priority
              />
            )}
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-transparent to-slate-900/80 pointer-events-none" />

            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
              {/* Eyebrow tags */}
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {course.subject && (
                  <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-cyan-400 border border-cyan-700/60 rounded-full px-3.5 py-1 bg-cyan-950/40">
                    {course.subject}
                  </span>
                )}
                {course.duration && (
                  <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400 border border-slate-700/60 rounded-full px-3.5 py-1 bg-slate-800/40">
                    {course.duration}
                  </span>
                )}
                {course.instructor && (
                  <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400 border border-slate-700/60 rounded-full px-3.5 py-1 bg-slate-800/40">
                    {course.instructor}
                  </span>
                )}
              </div>

              <h1 className="font-bold text-[34px] sm:text-[46px] lg:text-[54px] text-white leading-[1.1] tracking-[-0.03em] mb-5">
                {course.title}
              </h1>

              {(course.heroSubtitle || course.excerpt) && (
                <p className="text-[16px] sm:text-[18px] text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
                  {course.heroSubtitle || course.excerpt}
                </p>
              )}

              <div className="flex flex-wrap justify-center gap-3">
                <a
                  href={enrollHref}
                  target={course.enrollmentLink ? '_blank' : undefined}
                  rel={course.enrollmentLink ? 'noopener noreferrer' : undefined}
                  className="group inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold text-[14px] px-8 py-3.5 rounded-full shadow-[0_4px_24px_rgba(6,182,212,0.45)] transition-all duration-200 hover:-translate-y-px"
                >
                  {course.heroCtaLabel || 'Enroll Now'}
                  <ArrowRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>
          </section>

          {/* ── 2. OVERVIEW ──────────────────────────────────────────────────── */}
          {(course.overviewHeading || course.overviewBody) && (
            <section className="bg-white py-16 sm:py-20">
              <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
                {course.overviewHeading && (
                  <h2 className="font-bold text-[24px] sm:text-[32px] text-slate-900 tracking-[-0.02em] mb-5">
                    {course.overviewHeading}
                  </h2>
                )}
                {course.overviewBody && (
                  <p className="text-[16px] text-gray-600 leading-[1.9]">{course.overviewBody}</p>
                )}
              </div>
            </section>
          )}

          {/* ── 3. WHAT YOU'LL ACHIEVE ───────────────────────────────────────── */}
          {course.outcomes?.length > 0 && (
            <section className="bg-slate-50 py-16 sm:py-20">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="font-bold text-[24px] sm:text-[32px] text-slate-900 tracking-[-0.02em]">
                    {course.outcomesHeading || "What You'll Achieve"}
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {course.outcomes.map((item: any, i: number) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center mb-4">
                        <Check size={17} className="text-cyan-600" strokeWidth={2.5} />
                      </div>
                      <h3 className="font-bold text-[15px] text-slate-900 mb-2">{item.title}</h3>
                      {item.desc && (
                        <p className="text-[13.5px] text-gray-500 leading-relaxed">{item.desc}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── 4. WHY OUR COURSE STANDS OUT ─────────────────────────────────── */}
          {course.whyUs?.length > 0 && (
            <section className="bg-white py-16 sm:py-20">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="font-bold text-[24px] sm:text-[32px] text-slate-900 tracking-[-0.02em]">
                    {course.whyUsHeading || 'Why Our Course Stands Out'}
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {course.whyUs.map((item: any, i: number) => (
                    <div
                      key={i}
                      className="flex gap-4 p-6 rounded-2xl border border-gray-100 hover:border-cyan-100 hover:bg-cyan-50/30 transition-colors duration-200"
                    >
                      <div className="shrink-0 w-8 h-8 rounded-lg bg-cyan-600 text-white text-[12px] font-bold flex items-center justify-center mt-0.5">
                        {i + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-[15px] text-slate-900 mb-1.5">{item.title}</h3>
                        {item.desc && (
                          <p className="text-[13.5px] text-gray-500 leading-relaxed">{item.desc}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── 5. HOW IT WORKS ──────────────────────────────────────────────── */}
          {course.howItWorks?.length > 0 && (
            <section className="bg-cyan-50 py-16 sm:py-20">
              <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="font-bold text-[24px] sm:text-[32px] text-slate-900 tracking-[-0.02em]">
                    {course.howItWorksHeading || 'How It Works'}
                  </h2>
                </div>
                <ol className="space-y-4">
                  {course.howItWorks.map((step: any, i: number) => (
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

          {/* ── 6. PRICING TABLES ────────────────────────────────────────────── */}
          {course.pricingTables?.length > 0 && (
            <section className="bg-white py-16 sm:py-20">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-cyan-600 mb-2">
                    Plans
                  </p>
                  <h2 className="font-bold text-[24px] sm:text-[32px] text-slate-900 tracking-[-0.02em]">
                    {course.pricingHeading || 'Affordable Plans'}
                  </h2>
                </div>
                <div className="space-y-10">
                  {course.pricingTables.map((table: any, ti: number) => (
                    <div key={ti}>
                      {table.label && (
                        <h3 className="font-bold text-[14.5px] text-slate-700 mb-4 flex items-center gap-2">
                          <span className="w-5 h-px bg-cyan-400 inline-block" />
                          {table.label}
                        </h3>
                      )}
                      {table.rows?.length > 0 && (
                        <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
                          <table className="w-full text-[13.5px] border-collapse">
                            <thead>
                              <tr className="bg-slate-800 text-white">
                                <th className="text-left font-semibold px-5 py-4 rounded-tl-2xl">Study Plan</th>
                                <th className="text-left font-semibold px-5 py-4">Weekly Frequency</th>
                                <th className="text-left font-semibold px-5 py-4">Monthly Classes</th>
                                <th className="text-left font-semibold px-5 py-4">Fee Per Class</th>
                                <th className="text-left font-semibold px-5 py-4 rounded-tr-2xl">Monthly Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {table.rows.map((row: any, ri: number) => (
                                <tr
                                  key={ri}
                                  className={`border-t border-gray-100 ${ri % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}`}
                                >
                                  <td className="px-5 py-3.5 font-semibold text-slate-900">{row.plan}</td>
                                  <td className="px-5 py-3.5 text-gray-600">{row.weeklyFrequency}</td>
                                  <td className="px-5 py-3.5 text-gray-600">{row.monthlyClasses}</td>
                                  <td className="px-5 py-3.5 text-gray-600">{row.feePerClass}</td>
                                  <td className="px-5 py-3.5 font-semibold text-cyan-700">{row.monthlyTotal}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── 7. CTA BANNER ────────────────────────────────────────────────── */}
          {(course.ctaHeading || course.ctaSubtitle) && (
            <section className="bg-slate-900 py-16 sm:py-20">
              <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
                {course.ctaHeading && (
                  <h2 className="font-bold text-[26px] sm:text-[34px] text-white tracking-[-0.02em] mb-4">
                    {course.ctaHeading}
                  </h2>
                )}
                {course.ctaSubtitle && (
                  <p className="text-[15px] text-slate-400 mb-8 leading-relaxed">{course.ctaSubtitle}</p>
                )}
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                  <a
                    href={enrollHref}
                    target={course.enrollmentLink ? '_blank' : undefined}
                    rel={course.enrollmentLink ? 'noopener noreferrer' : undefined}
                    className="group inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold text-[14px] px-8 py-3.5 rounded-full shadow-[0_4px_20px_rgba(6,182,212,0.3)] transition-all duration-200 hover:-translate-y-px"
                  >
                    {course.ctaBtn1Label || 'Join Now'}
                    <ArrowRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
                  </a>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white text-[14px] font-semibold px-8 py-3.5 rounded-full border border-white/20 transition-all duration-200 hover:-translate-y-px"
                  >
                    <MessageCircle size={14} />
                    {course.ctaBtn2Label || 'WhatsApp Us'}
                  </a>
                </div>
                {(site?.email || site?.phone) && (
                  <div className="flex flex-wrap justify-center gap-6 text-[13px] text-slate-500">
                    {site.email && (
                      <span className="flex items-center gap-1.5">
                        <Mail size={12} className="text-slate-600" />
                        {site.email}
                      </span>
                    )}
                    {site.phone && (
                      <span className="flex items-center gap-1.5">
                        <Phone size={12} className="text-slate-600" />
                        {site.phone}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ── 8. OUR PROMISE ───────────────────────────────────────────────── */}
          {(course.promiseHeading || course.promiseBody) && (
            <section className="bg-white py-16 sm:py-20">
              <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
                {course.promiseHeading && (
                  <h2 className="font-bold text-[24px] sm:text-[30px] text-slate-900 tracking-[-0.02em] mb-5">
                    {course.promiseHeading}
                  </h2>
                )}
                {course.promiseBody && (
                  <p className="text-[15px] text-gray-600 leading-[1.9]">{course.promiseBody}</p>
                )}
              </div>
            </section>
          )}

          {/* ── 9. FAQs ──────────────────────────────────────────────────────── */}
          {course.faq?.length > 0 && (
            <section className="bg-slate-50 py-16 sm:py-20">
              <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-10">
                  <h2 className="font-bold text-[24px] sm:text-[30px] text-slate-900 tracking-[-0.02em]">
                    {course.faqSectionHeading || 'FAQs'}
                  </h2>
                </div>
                <div className="space-y-3">
                  {course.faq.map((item: any, i: number) => (
                    <details
                      key={i}
                      className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm"
                    >
                      <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none font-semibold text-[15px] text-slate-900 hover:text-cyan-700 transition-colors">
                        {item.question}
                        <ChevronRight
                          size={15}
                          className="shrink-0 text-gray-400 group-open:rotate-90 transition-transform duration-200"
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

          {/* ── Extra body content (optional) ────────────────────────────────── */}
          {course.body?.length > 0 && (
            <section className="bg-white py-12 sm:py-16">
              <div className="max-w-3xl mx-auto px-4 sm:px-6
                prose prose-slate prose-lg max-w-none
                prose-headings:font-bold prose-headings:tracking-tight
                prose-a:text-cyan-600 prose-a:no-underline hover:prose-a:underline">
                <PortableText value={course.body} />
              </div>
            </section>
          )}

        </div>
      )}

    </div>
  )
}
