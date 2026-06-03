import type { Metadata } from 'next'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { siteSettingsQuery, pageBySlugQuery } from '@/sanity/lib/queries'
import { PortableText } from '@portabletext/react'
import { ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const page = await client.fetch(pageBySlugQuery, { slug: 'donate' })
  return {
    title: page?.seoTitle || page?.title || 'Donate',
    description: page?.seoDescription || page?.subtitle,
  }
}

export default async function DonatePage() {
  const [settings, page] = await Promise.all([
    client.fetch(siteSettingsQuery),
    client.fetch(pageBySlugQuery, { slug: 'donate' }),
  ])

  const causes: { title: string; desc: string }[] = settings?.donateCauses?.length
    ? settings.donateCauses
    : [
        { title: 'General Donation',     desc: 'Support the overall mission of Aabtaab' },
        { title: 'Quran Education',      desc: 'Fund free Quran classes for children' },
        { title: 'Muharram Programs',    desc: 'Help organise Majalis and Aza events' },
        { title: 'Dar Ul Quran Support', desc: 'Contribute to our sister Quranic institute' },
      ]

  return (
    <div>
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-center">
          <p className="text-[20px] sm:text-[22px] text-cyan-600 mb-3 leading-none">
            {settings?.donateArabicVerse || 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ'}
          </p>
          <p className="flex items-center justify-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.18em] text-amber-600 mb-3">
            <span className="w-5 h-px bg-amber-400 inline-block" />
            {page?.eyebrow || 'Give Back'}
            <span className="w-5 h-px bg-amber-400 inline-block" />
          </p>
          <h1 className="font-bold text-[26px] sm:text-[30px] text-slate-900 tracking-[-0.02em] mb-3">
            {page?.title || 'Donate'}
          </h1>
          <p className="text-[13.5px] text-gray-500 mx-auto leading-relaxed">
            {page?.subtitle || 'Your generosity keeps the light of Ahlul Bayt (A.S.) alive. Every donation — big or small — makes a difference.'}
          </p>
        </div>
      </div>

      <div className="py-8 sm:py-12 bg-slate-50/40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          {page?.body && (
            <div className="prose prose-sm max-w-none text-gray-700 mb-8 sm:mb-10">
              <PortableText value={page.body} />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 sm:mb-10">
            {causes.map(({ title, desc }, i) => (
              <div key={i}
                className="bg-white border border-gray-100 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <div className="w-9 h-9 bg-cyan-50 border border-cyan-100 rounded-xl flex items-center justify-center mb-3">
                  <span className="text-cyan-600 font-bold text-[16px] leading-none">{i + 1}</span>
                </div>
                <h3 className="font-semibold text-slate-900 text-[14px] mb-1">{title}</h3>
                <p className="text-[13px] text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-center">
            <h2 className="font-bold text-[20px] sm:text-[22px] text-white tracking-[-0.02em] mb-2">
              {settings?.donateHowToHeading || 'How to Donate'}
            </h2>
            <p className="text-[13px] sm:text-[13.5px] text-slate-400 mb-6 max-w-sm mx-auto leading-relaxed">
              {settings?.donateHowToText || 'Contact us for bank transfer details or use the online payment link below.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {settings?.donateUrl && (
                <a href={settings.donateUrl} target="_blank" rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white text-[13px] font-semibold px-6 py-2.5 rounded-full
                    shadow-[0_4px_16px_rgba(6,182,212,0.4)] transition-all duration-200 hover:-translate-y-px">
                  {settings?.donatePayOnlineLabel || 'Pay Online'}
                  <ArrowRight size={13} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
                </a>
              )}
              <Link href="/contact"
                className="inline-flex items-center justify-center text-[13px] font-medium text-slate-300 hover:text-white border border-white/20 hover:border-white/50 px-6 py-2.5 rounded-full transition-all duration-200">
                {settings?.donateContactLabel || 'Contact Us'}
              </Link>
            </div>
          </div>

          <p className="text-center text-[12px] text-gray-400 mt-6">
            {settings?.donateClosingMessage || 'Jazakallah Khair — May Allah (SWT) accept your donations.'}
          </p>

        </div>
      </div>
    </div>
  )
}
