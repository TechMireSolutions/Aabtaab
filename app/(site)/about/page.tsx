import type { Metadata } from 'next'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { pageBySlugQuery, siteSettingsQuery } from '@/sanity/lib/queries'
import { PortableText } from '@portabletext/react'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const page = await client.fetch(pageBySlugQuery, { slug: 'about' })
  return {
    title: page?.seoTitle || 'About Us',
    description: page?.seoDescription,
  }
}

export default async function AboutPage() {
  const [page, settings] = await Promise.all([
    client.fetch(pageBySlugQuery, { slug: 'about' }),
    client.fetch(siteSettingsQuery),
  ])

  const siteName = settings?.siteName || 'Aabtaab'

  return (
    <div className="py-14">
      <div className="container-main max-w-3xl">
        <h1 className="section-title text-4xl mb-2">{page?.title || 'About Us'}</h1>
        <p className="text-gray-500 mb-10">Who we are and what drives us</p>

        {page?.body ? (
          <div className="prose prose-lg text-gray-700 max-w-none">
            <PortableText value={page.body} />
          </div>
        ) : (
          /* Fallback content shown until a Sanity page doc is created */
          <div className="prose prose-lg text-gray-700 max-w-none">
            <p>
              <strong>{siteName}</strong> is a dedicated platform for the promotion of Islamic knowledge rooted in the
              teachings of the Holy Quran and the Ahlul Bayt (A.S.). Our name — meaning <em>&ldquo;luminous&rdquo;</em> —
              reflects our mission to spread light through education and authentic Islamic content.
            </p>
            <h2>Our Mission</h2>
            <ul>
              <li>Provide accessible online Islamic education — Quran, Fiqh, Ethics &amp; History</li>
              <li>Offer authentic religious services including Niyabat Ziarat, Zakat, and Khums</li>
              <li>Publish reliable articles on Islamic knowledge and current affairs</li>
              <li>Organize Majalis, events, and religious programs</li>
            </ul>
            <h2>Dar Ul Quran</h2>
            <p>We are also affiliated with <strong>Dar Ul Quran</strong>, our dedicated Quranic institute.</p>
          </div>
        )}

        <div className="mt-12 flex flex-wrap gap-4">
          <Link href="/contact" className="btn-primary">Contact Us</Link>
          <Link href="/online-courses" className="bg-gray-100 text-gray-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors">
            Our Courses
          </Link>
        </div>
      </div>
    </div>
  )
}
