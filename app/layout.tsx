import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets:  ['latin'],
  weight:   ['300', '400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display:  'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const settings = await client.fetch(
    `*[_type == "siteSettings"][0]{ siteName, description, favicon }`,
    {},
    { next: { revalidate: 3600 } }
  )

  const siteName   = settings?.siteName   || 'Aabtaab'
  const faviconUrl = settings?.favicon ? urlFor(settings.favicon).width(256).height(256).url() : undefined

  return {
    title:       { default: siteName, template: `%s | ${siteName}` },
    description: settings?.description || 'Shia Islamic knowledge, online courses, and services',
    icons:       faviconUrl ? { icon: faviconUrl, apple: faviconUrl } : undefined,
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body
        className={`${jakarta.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  )
}
