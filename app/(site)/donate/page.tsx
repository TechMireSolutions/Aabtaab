import type { Metadata } from 'next'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { siteSettingsQuery, pageBySlugQuery } from '@/sanity/lib/queries'
import { PortableText } from '@portabletext/react'
import { ArrowRight, Heart, BookOpen, Moon, GraduationCap } from 'lucide-react'

export const revalidate = 60
export const metadata: Metadata = { title: 'Donate' }

const CAUSES = [
  { title: 'General Donation',     desc: 'Support the overall mission of Aabtaab',            Icon: Heart         },
  { title: 'Quran Education',      desc: 'Fund free Quran classes for children',               Icon: BookOpen      },
  { title: 'Muharram Programs',    desc: 'Help organise Majalis and Aza events',               Icon: Moon          },
  { title: 'Dar Ul Quran Support', desc: 'Contribute to our sister Quranic institute',         Icon: GraduationCap },
]

export default async function DonatePage() {
  const [settings, page] = await Promise.all([
    client.fetch(siteSettingsQuery),
    client.fetch(pageBySlugQuery, { slug: 'donate' }),
  ])

  return (
    <div>
      {/* Page header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-8 py-12 text-center">
          <p className="text-[22px] text-cyan-600 mb-3 leading-none">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
          <p className="flex items-center justify-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.18em] text-amber-600 mb-3">
            <span className="w-5 h-px bg-amber-400 inline-block" />
            Give Back
            <span className="w-5 h-px bg-amber-400 inline-block" />
          </p>
          <h1 className="font-bold text-[30px] text-slate-900 tracking-[-0.02em] mb-3">
            {page?.title || 'Donate'}
          </h1>
          <p className="text-[14px] text-gray-500 max-w-md mx-auto leading-relaxed">
            Your generosity keeps the light of Ahlul Bayt (A.S.) alive. Every donation — big or small — makes a difference.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="py-12 bg-slate-50/40">
        <div className="max-w-3xl mx-auto px-8">

          {page?.body && (
            <div className="prose prose-sm max-w-none text-gray-700 mb-10">
              <PortableText value={page.body} />
            </div>
          )}

          {/* Cause cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {CAUSES.map(({ title, desc, Icon }) => (
              <div key={title}
                className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <div className="w-9 h-9 bg-cyan-50 border border-cyan-100 rounded-xl flex items-center justify-center mb-3">
                  <Icon size={15} className="text-cyan-600" strokeWidth={1.75} />
                </div>
                <h3 className="font-semibold text-slate-900 text-[14.5px] mb-1">{title}</h3>
                <p className="text-[13px] text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* How to donate */}
          <div className="bg-slate-900 rounded-2xl p-8 text-center">
            <h2 className="font-bold text-[22px] text-white tracking-[-0.02em] mb-2">How to Donate</h2>
            <p className="text-[13.5px] text-slate-400 mb-6 max-w-sm mx-auto leading-relaxed">
              Contact us for bank transfer details or use the online payment link below.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {settings?.donateUrl && (
                <a href={settings.donateUrl} target="_blank" rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white text-[13px] font-semibold px-6 py-2.5 rounded-full
                    shadow-[0_4px_16px_rgba(6,182,212,0.4)] hover:shadow-[0_6px_24px_rgba(6,182,212,0.55)]
                    transition-all duration-200 hover:-translate-y-px">
                  Pay Online
                  <ArrowRight size={13} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
                </a>
              )}
              <Link href="/contact"
                className="inline-flex items-center text-[13px] font-medium text-slate-300 hover:text-white border border-white/20 hover:border-white/50 px-6 py-2.5 rounded-full transition-all duration-200">
                Contact Us
              </Link>
            </div>
          </div>

          <p className="text-center text-[12px] text-gray-400 mt-6">
            Jazakallah Khair — May Allah (SWT) accept your donations.
          </p>

        </div>
      </div>
    </div>
  )
}
