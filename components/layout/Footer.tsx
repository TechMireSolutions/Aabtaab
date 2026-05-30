import Link from 'next/link'

interface SiteSettings {
  siteName?: string
  tagline?: string
  email?: string
  phone?: string
  address?: string
  facebook?: string
  youtube?: string
  whatsapp?: string
  darulQuranUrl?: string
}

interface FooterProps {
  settings?: SiteSettings
}

const quickLinks = [
  { label: 'Home',           href: '/' },
  { label: 'Online Courses', href: '/online-courses' },
  { label: 'Services',       href: '/services' },
  { label: 'Articles',       href: '/articles' },
  { label: 'About Us',       href: '/about' },
  { label: 'Contact',        href: '/contact' },
]

export default function Footer({ settings }: FooterProps) {
  const siteName = settings?.siteName || 'AABTAAB'
  const tagline = settings?.tagline || 'Spreading the teachings of Ahlul Bayt (A.S.) through education, services, and authentic Islamic content.'

  return (
    <footer className="bg-primary-900 text-gray-300">
      <div className="container-main py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          <div>
            <h2 className="text-2xl font-bold text-white tracking-widest mb-3">{siteName}</h2>
            <p className="text-sm leading-relaxed text-gray-400">{tagline}</p>
            <div className="flex gap-4 mt-4">
              {settings?.facebook && (
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-gray-400 hover:text-gold-400 transition-colors">Facebook</a>
              )}
              {settings?.youtube && (
                <a href={settings.youtube} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-gray-400 hover:text-gold-400 transition-colors">YouTube</a>
              )}
              {settings?.darulQuranUrl && (
                <a href={settings.darulQuranUrl} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-gray-400 hover:text-gold-400 transition-colors">Dar Ul Quran</a>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm hover:text-gold-400 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              {settings?.email && (
                <li><a href={`mailto:${settings.email}`} className="hover:text-gold-400 transition-colors">{settings.email}</a></li>
              )}
              {settings?.phone && <li>{settings.phone}</li>}
              {settings?.whatsapp && (
                <li>
                  <a href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                    className="hover:text-gold-400 transition-colors">WhatsApp: {settings.whatsapp}</a>
                </li>
              )}
              {settings?.address && <li className="leading-relaxed whitespace-pre-line">{settings.address}</li>}
            </ul>
            <Link href="/donate" className="inline-block mt-4 btn-gold text-sm py-2 px-4">
              Donate Now
            </Link>
          </div>

        </div>

        <div className="mt-10 pt-6 border-t border-primary-700 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} {siteName}. All rights reserved.</p>
          <p>Built with Next.js &amp; Sanity</p>
        </div>
      </div>
    </footer>
  )
}
