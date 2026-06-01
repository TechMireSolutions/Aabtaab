import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import { client } from '@/sanity/lib/client'
import { siteSettingsQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'

export const revalidate = 300

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await client.fetch(siteSettingsQuery)

  const logoUrl = settings?.logo
    ? urlFor(settings.logo).width(72).height(72).url()
    : null

  return (
    <>
      <Header
        darulQuranUrl={settings?.darulQuranUrl}
        siteName={settings?.siteName}
        logoUrl={logoUrl}
      />
      <main className="min-h-screen">{children}</main>
      <Footer settings={settings} logoUrl={logoUrl} />
      {settings?.whatsapp && <WhatsAppButton number={settings.whatsapp} />}
    </>
  )
}
