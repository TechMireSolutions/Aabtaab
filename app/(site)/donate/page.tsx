import type { Metadata } from 'next'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { siteSettingsQuery, pageBySlugQuery } from '@/sanity/lib/queries'
import { PortableText } from '@portabletext/react'
import { ArrowRight } from 'lucide-react'

export const revalidate = 60
export const metadata: Metadata = { title: 'Donate' }

const CAUSES = [
  { title: 'General Donation',     desc: 'Support the overall mission of Aabtaab' },
  { title: 'Quran Education',      desc: 'Fund free Quran classes for children' },
  { title: 'Muharram Programs',    desc: 'Help organise Majalis and Aza events' },
  { title: 'Dar Ul Quran Support', desc: 'Contribute to our sister institute' },
]

export default async function DonatePage() {
  const [settings, page] = await Promise.all([
    client.fetch(siteSettingsQuery),
    client.fetch(pageBySlugQuery, { slug: 'donate' }),
  ])

  return (
    <div className="py-14">
      <div className="max-w-3xl mx-auto px-8">

        <div className="text-center mb-12">
          <p className="text-2xl text-cyan-500 mb-3">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
          <p className="text-[11px] font-semibold text-cyan-500 uppercase tracking-widest mb-1">Give Back</p>
          <h1 className="text-[32px] font-bold text-gray-900 mb-3">{page?.title || 'Donate'}</h1>
          <p className="text-[14px] text-gray-500 max-w-md mx-auto leading-relaxed">
            Your generosity keeps the light of Ahlul Bayt (A.S.) alive. Every donation — big or small — makes a difference.
          </p>
        </div>

        {/* CMS page body */}
        {page?.body && (
          <div className="prose prose-sm max-w-none text-gray-700 mb-10">
            <PortableText value={page.body} />
          </div>
        )}

        {/* Causes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {CAUSES.map(({ title, desc }) => (
            <div key={title} className="border border-gray-200 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
              <p className="text-[13px] text-gray-500">{desc}</p>
            </div>
          ))}
        </div>

        {/* How to donate */}
        <div className="bg-[#0d2137] text-white rounded-2xl p-8 text-center">
          <h2 className="text-[22px] font-bold mb-3">How to Donate</h2>
          <p className="text-[14px] text-gray-400 mb-6">
            Please contact us for bank transfer details or use the payment link below.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {settings?.donateUrl && (
              <a href={settings.donateUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white text-[13.5px] font-medium px-6 py-2.5 rounded-full transition-colors">
                Pay Online <ArrowRight size={14} strokeWidth={2.5} />
              </a>
            )}
            <Link href="/contact"
              className="inline-flex items-center text-[13.5px] font-medium text-gray-300 hover:text-white border border-white/20 hover:border-white/40 px-6 py-2.5 rounded-full transition-colors">
              Contact Us
            </Link>
          </div>
        </div>

        <p className="text-center text-[12px] text-gray-400 mt-8">
          Jazakallah Khair — May Allah (SWT) accept your donations.
        </p>
      </div>
    </div>
  )
}
