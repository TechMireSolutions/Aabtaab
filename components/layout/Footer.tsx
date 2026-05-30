import Link from 'next/link'
import { Mail, Phone, MapPin, Facebook, Youtube, ExternalLink } from 'lucide-react'

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
  { label: 'Online Classes', href: '/online-courses' },
  { label: 'Services',       href: '/services' },
  { label: 'Articles',       href: '/articles' },
  { label: 'Donate',         href: '/donate' },
  { label: 'About Us',       href: '/about' },
  { label: 'Contact',        href: '/contact' },
]

const services = [
  { label: 'Niyabat Ziarat', href: '/services/niyabat-ziarat' },
  { label: 'Zakat',          href: '/services/zakat' },
  { label: 'Khums',          href: '/services/khums' },
  { label: 'Ijara',          href: '/services/ijara' },
  { label: 'Expiation',      href: '/services/expiation' },
  { label: 'Sacrifice',      href: '/services/sacrifice' },
]

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h3 className="text-white text-[13px] font-semibold uppercase tracking-[0.08em]">
        {children}
      </h3>
      <div className="mt-2 w-7 h-[2px] bg-cyan-500" />
    </div>
  )
}

export default function Footer({ settings }: FooterProps) {
  const siteName = settings?.siteName || 'Aabtaab'
  const tagline  = settings?.tagline  || 'Spreading the light of Ahlul Bayt (A.S.) through education, authentic content, and spiritual services.'

  return (
    <footer>
      {/* ── Main footer body ── */}
      <div className="bg-[#0d2137] text-gray-400">
        <div className="max-w-7xl mx-auto px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

            {/* Col 1 — Brand */}
            <div className="lg:col-span-1">
              <h2 className="text-white text-xl font-bold tracking-wide mb-3">{siteName}</h2>
              <p className="text-[13.5px] leading-relaxed text-gray-400 mb-6">{tagline}</p>

              {/* Social links */}
              <div className="flex items-center gap-3">
                {settings?.facebook && (
                  <a href={settings.facebook} target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:border-cyan-500 hover:text-cyan-400 transition-colors"
                    aria-label="Facebook">
                    <Facebook size={14} />
                  </a>
                )}
                {settings?.youtube && (
                  <a href={settings.youtube} target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:border-cyan-500 hover:text-cyan-400 transition-colors"
                    aria-label="YouTube">
                    <Youtube size={14} />
                  </a>
                )}
                {settings?.darulQuranUrl && (
                  <a href={settings.darulQuranUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-cyan-400 transition-colors border border-white/10 hover:border-cyan-500 rounded-full px-3 py-1">
                    Dar ul Quran <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </div>

            {/* Col 2 — Quick Links */}
            <div>
              <FooterHeading>Quick Links</FooterHeading>
              <ul className="space-y-3">
                {quickLinks.map(({ label, href }) => (
                  <li key={href}>
                    <Link href={href}
                      className="text-[13.5px] text-gray-400 hover:text-cyan-400 transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3 — Services */}
            <div>
              <FooterHeading>Services</FooterHeading>
              <ul className="space-y-3">
                {services.map(({ label, href }) => (
                  <li key={href}>
                    <Link href={href}
                      className="text-[13.5px] text-gray-400 hover:text-cyan-400 transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4 — Contact */}
            <div>
              <FooterHeading>Contact Us</FooterHeading>
              <ul className="space-y-4">
                {settings?.email && (
                  <li className="flex items-start gap-3">
                    <Mail size={14} className="text-cyan-500 mt-[3px] flex-shrink-0" />
                    <a href={`mailto:${settings.email}`}
                      className="text-[13.5px] text-gray-400 hover:text-cyan-400 transition-colors break-all">
                      {settings.email}
                    </a>
                  </li>
                )}
                {settings?.phone && (
                  <li className="flex items-start gap-3">
                    <Phone size={14} className="text-cyan-500 mt-[3px] flex-shrink-0" />
                    <a href={`tel:${settings.phone}`}
                      className="text-[13.5px] text-gray-400 hover:text-cyan-400 transition-colors">
                      {settings.phone}
                    </a>
                  </li>
                )}
                {settings?.whatsapp && (
                  <li className="flex items-start gap-3">
                    <Phone size={14} className="text-cyan-500 mt-[3px] flex-shrink-0" />
                    <a href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`}
                      target="_blank" rel="noopener noreferrer"
                      className="text-[13.5px] text-gray-400 hover:text-cyan-400 transition-colors">
                      WhatsApp: {settings.whatsapp}
                    </a>
                  </li>
                )}
                {settings?.address && (
                  <li className="flex items-start gap-3">
                    <MapPin size={14} className="text-cyan-500 mt-[3px] flex-shrink-0" />
                    <p className="text-[13.5px] text-gray-400 leading-relaxed whitespace-pre-line">
                      {settings.address}
                    </p>
                  </li>
                )}

                {/* Fallback if no settings */}
                {!settings?.email && !settings?.phone && !settings?.address && (
                  <li className="text-[13px] text-gray-500 italic">
                    Add contact info in Sanity → Site Settings
                  </li>
                )}
              </ul>

              <Link href="/donate"
                className="inline-block mt-6 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white text-[13px] font-medium rounded-full transition-colors">
                Donate Now
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="bg-[#081626] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-gray-500">
            &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/about"  className="text-[12px] text-gray-500 hover:text-gray-300 transition-colors">About</Link>
            <Link href="/contact" className="text-[12px] text-gray-500 hover:text-gray-300 transition-colors">Contact</Link>
            <Link href="/donate"  className="text-[12px] text-gray-500 hover:text-gray-300 transition-colors">Donate</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
