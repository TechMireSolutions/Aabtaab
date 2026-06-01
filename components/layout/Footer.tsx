import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, MapPin, MessageCircle, Facebook, Youtube, ExternalLink } from 'lucide-react'

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
  logoUrl?: string | null
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

function ColHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">
      {children}
    </h3>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="group flex items-center gap-0 text-[13px] text-gray-500 hover:text-cyan-600 transition-colors duration-150"
      >
        <span className="inline-block w-0 overflow-hidden group-hover:w-3 transition-all duration-150 text-cyan-500 text-[11px] leading-none">
          ›
        </span>
        {children}
      </Link>
    </li>
  )
}

export default function Footer({ settings, logoUrl }: FooterProps) {
  const siteName = settings?.siteName || 'Aabtaab'
  const tagline  = settings?.tagline  || 'Spreading the light of Ahlul Bayt (A.S.) through education, authentic content, and spiritual services.'

  return (
    <footer className="bg-gray-50 border-t border-gray-200">

      {/* ── Main body ── */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Col 1 — Logo + Brand */}
          <div className="lg:col-span-1">
            {/* Logo + name */}
            <Link href="/" aria-label={siteName} className="inline-flex items-center gap-3 mb-4 group">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={siteName}
                  width={52}
                  height={52}
                  className="rounded-full border-2 border-cyan-400 object-cover transition-transform duration-200 group-hover:scale-105"
                />
              ) : (
                <div className="w-[52px] h-[52px] rounded-full bg-gradient-to-br from-cyan-100 to-sky-100 border-2 border-cyan-400 flex items-center justify-center text-2xl select-none transition-transform duration-200 group-hover:scale-105">
                  ⛵
                </div>
              )}
              <span className="font-bold text-[18px] text-slate-900 tracking-[-0.02em]">{siteName}</span>
            </Link>

            <p className="text-[13px] text-gray-500 leading-relaxed mb-5 max-w-[220px]">
              {tagline}
            </p>

            {/* Social + external links */}
            <div className="flex items-center gap-2 flex-wrap">
              {settings?.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank" rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:border-cyan-400 hover:text-cyan-500 transition-all duration-200"
                >
                  <Facebook size={13} />
                </a>
              )}
              {settings?.youtube && (
                <a
                  href={settings.youtube}
                  target="_blank" rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:border-cyan-400 hover:text-cyan-500 transition-all duration-200"
                >
                  <Youtube size={13} />
                </a>
              )}
              {settings?.darulQuranUrl && (
                <a
                  href={settings.darulQuranUrl}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] font-medium text-gray-500 hover:text-cyan-600 bg-white border border-gray-200 hover:border-cyan-400 rounded-lg px-2.5 py-1.5 transition-all duration-200"
                >
                  Dar ul Quran <ExternalLink size={9} />
                </a>
              )}
            </div>
          </div>

          {/* Col 2 — Quick Links */}
          <div>
            <ColHeading>Quick Links</ColHeading>
            <ul className="space-y-2.5">
              {quickLinks.map(({ label, href }) => (
                <NavLink key={href} href={href}>{label}</NavLink>
              ))}
            </ul>
          </div>

          {/* Col 3 — Services */}
          <div>
            <ColHeading>Services</ColHeading>
            <ul className="space-y-2.5">
              {services.map(({ label, href }) => (
                <NavLink key={href} href={href}>{label}</NavLink>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact */}
          <div>
            <ColHeading>Contact Us</ColHeading>
            <ul className="space-y-3">
              {settings?.email && (
                <li>
                  <a href={`mailto:${settings.email}`}
                    className="flex items-center gap-2.5 text-[12.5px] text-gray-500 hover:text-cyan-600 transition-colors duration-150">
                    <Mail size={13} className="text-cyan-500 flex-shrink-0" />
                    {settings.email}
                  </a>
                </li>
              )}
              {settings?.phone && (
                <li>
                  <a href={`tel:${settings.phone}`}
                    className="flex items-center gap-2.5 text-[12.5px] text-gray-500 hover:text-cyan-600 transition-colors duration-150">
                    <Phone size={13} className="text-cyan-500 flex-shrink-0" />
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings?.whatsapp && (
                <li>
                  <a
                    href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-[12.5px] text-gray-500 hover:text-cyan-600 transition-colors duration-150"
                  >
                    <MessageCircle size={13} className="text-cyan-500 flex-shrink-0" />
                    WhatsApp: {settings.whatsapp}
                  </a>
                </li>
              )}
              {settings?.address && (
                <li className="flex items-start gap-2.5">
                  <MapPin size={13} className="text-cyan-500 flex-shrink-0 mt-0.5" />
                  <p className="text-[12.5px] text-gray-500 leading-relaxed whitespace-pre-line">
                    {settings.address}
                  </p>
                </li>
              )}
              {!settings?.email && !settings?.phone && !settings?.address && (
                <li className="text-[12px] text-gray-400 italic">
                  Add contact info in Sanity → Site Settings
                </li>
              )}
            </ul>

            <Link
              href="/donate"
              className="group inline-flex items-center gap-1.5 mt-5 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white text-[12px] font-semibold rounded-full
                shadow-[0_4px_14px_rgba(8,145,178,0.3)] hover:shadow-[0_6px_20px_rgba(8,145,178,0.42)]
                transition-all duration-200 hover:-translate-y-px"
            >
              Donate Now
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"
                className="group-hover:translate-x-0.5 transition-transform duration-150">
                <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[11.5px] text-gray-400">
            &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-gray-300">
            <Link href="/about"   className="px-2 text-[11.5px] text-gray-400 hover:text-gray-700 transition-colors">About</Link>
            <span>·</span>
            <Link href="/contact" className="px-2 text-[11.5px] text-gray-400 hover:text-gray-700 transition-colors">Contact</Link>
            <span>·</span>
            <Link href="/donate"  className="px-2 text-[11.5px] text-gray-400 hover:text-gray-700 transition-colors">Donate</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
