import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { client } from '@/sanity/lib/client'
import { siteSettingsQuery } from '@/sanity/lib/queries'

export const revalidate = 300

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await client.fetch(siteSettingsQuery)

  return (
    <>
      <Header darulQuranUrl={settings?.darulQuranUrl} siteName={settings?.siteName} />
      <main className="min-h-screen">{children}</main>
      <Footer settings={settings} />
    </>
  )
}
