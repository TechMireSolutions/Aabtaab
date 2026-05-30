import type { Metadata } from 'next'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { donateCausesQuery, siteSettingsQuery, pageBySlugQuery } from '@/sanity/lib/queries'
import { PortableText } from '@portabletext/react'

export const revalidate = 60
export const metadata: Metadata = { title: 'Donate' }

export default async function DonatePage() {
  const [causes, settings, page] = await Promise.all([
    client.fetch(donateCausesQuery),
    client.fetch(siteSettingsQuery),
    client.fetch(pageBySlugQuery, { slug: 'donate' }),
  ])

  return (
    <div className="py-14">
      <div className="container-main max-w-3xl">
        <div className="text-center mb-12">
          <p className="text-gold-500 text-2xl mb-2">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
          <h1 className="section-title text-4xl mb-3">{page?.title || 'Donate'}</h1>
          <p className="text-gray-500 text-lg">
            Your generosity keeps the light of Ahlul Bayt (A.S.) alive. Every donation — big or small — makes a difference.
          </p>
        </div>

        {/* CMS-driven page body (optional intro text) */}
        {page?.body && (
          <div className="prose prose-lg max-w-none text-gray-700 mb-10">
            <PortableText value={page.body} />
          </div>
        )}

        {/* Donate Causes from Sanity */}
        {causes?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {causes.map((cause: any) => (
              <div key={cause._id} className="bg-primary-50 rounded-xl p-6 border border-primary-100">
                <h3 className="font-bold text-primary-800 mb-1">{cause.title}</h3>
                {cause.description && <p className="text-sm text-gray-600 mb-2">{cause.description}</p>}
                {cause.targetAmount && (
                  <p className="text-xs font-medium text-gold-600">Target: {cause.targetAmount}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Fallback while Sanity causes are being added */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {['General Donation', 'Quran Education', 'Muharram Programs', 'Dar Ul Quran Support'].map((title) => (
              <div key={title} className="bg-primary-50 rounded-xl p-6 border border-primary-100">
                <h3 className="font-bold text-primary-800">{title}</h3>
              </div>
            ))}
          </div>
        )}

        <div className="bg-primary-500 text-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">How to Donate</h2>
          <p className="text-blue-200 mb-6">
            Please contact us to get bank transfer details or use the payment link below.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {settings?.donateUrl && (
              <a href={settings.donateUrl} target="_blank" rel="noopener noreferrer" className="btn-gold">
                Pay Online
              </a>
            )}
            <Link href="/contact" className="bg-white text-primary-500 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          Jazakallah Khair — May Allah (SWT) accept your donations.
        </p>
      </div>
    </div>
  )
}
