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

interface NavItem     { label: string; href: string; external?: boolean }
interface FooterService { _id: string; title: string; slug: string }

interface FooterProps {
  settings?:       SiteSettings
  logoUrl?:        string | null
  navItems?:       NavItem[]
  footerServices?: FooterService[]
}

const FALLBACK_QUICK_LINKS: NavItem[] = [
  { label: 'Home',           href: '/' },
  { label: 'Online Classes', href: '/online-courses' },
  { label: 'Services',       href: '/services' },
  { label: 'Articles',       href: '/articles' },
  { label: 'Donate',         href: '/donate' },
  { label: 'About Us',       href: '/about' },
  { label: 'Contact',        href: '/contact' },
]

const FALLBACK_SERVICES: FooterService[] = [
  { _id: '1', title: 'Niyabat Ziarat', slug: 'niyabat-ziarat' },
  { _id: '2', title: 'Zakat',          slug: 'zakat' },
  { _id: '3', title: 'Khums',          slug: 'khums' },
  { _id: '4', title: 'Ijara',          slug: 'ijara' },
  { _id: '5', title: 'Expiation',      slug: 'expiation' },
  { _id: '6', title: 'Sacrifice',      slug: 'sacrifice' },
]

function ColHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2.5 sm:mb-4">
      {children}
    </h3>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="group flex items-center gap-0 text-[12px] sm:text-[13px] text-gray-500 hover:text-cyan-600 transition-colors duration-150"
      >
        <span className="inline-block w-0 overflow-hidden group-hover:w-3 transition-all duration-150 text-cyan-500 text-[11px] leading-none">
          ›
        </span>
        {children}
      </Link>
    </li>
  )
}

export default function Footer({ settings, logoUrl, navItems, footerServices }: FooterProps) {
  const siteName   = settings?.siteName || 'Aabtaab'
  const tagline    = settings?.tagline  || 'Spreading the light of Ahlul Bayt (A.S.) through education, authentic content, and spiritual services.'
  const quickLinks = navItems?.length       ? navItems       : FALLBACK_QUICK_LINKS
  const services   = footerServices?.length ? footerServices.map(s => ({ label: s.title, href: `/services/${s.slug}` })) : FALLBACK_SERVICES.map(s => ({ label: s.title, href: `/services/${s.slug}` }))

  return (
    <footer className="bg-gray-50 border-t border-gray-200">

      {/* ── Main body ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6 sm:gap-8 lg:gap-10">

          {/* Col 1 — Logo + Brand (full width on mobile) */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" aria-label={siteName} className="inline-flex items-center gap-2.5 mb-3 group">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={siteName}
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-cyan-400 object-cover transition-transform duration-200 group-hover:scale-105 sm:w-[52px] sm:h-[52px]"
                />
              ) : (
                <div className="w-10 h-10 sm:w-[52px] sm:h-[52px] rounded-full bg-gradient-to-br from-cyan-100 to-sky-100 border-2 border-cyan-400 flex items-center justify-center text-xl sm:text-2xl select-none transition-transform duration-200 group-hover:scale-105">
                  ⛵
                </div>
              )}
              <span className="font-bold text-[16px] sm:text-[18px] text-slate-900 tracking-[-0.02em]">{siteName}</span>
            </Link>

            <p className="text-[12px] sm:text-[13px] text-gray-500 leading-relaxed mb-3 sm:mb-5 max-w-[280px] line-clamp-2 sm:line-clamp-none">
              {tagline}
            </p>

            {/* Social + external links */}
            <div className="flex items-center gap-2 flex-wrap">
              {settings?.facebook && (
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:border-cyan-400 hover:text-cyan-500 transition-all duration-200">
                  <Facebook size={12} />
                </a>
              )}
              {settings?.youtube && (
                <a href={settings.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:border-cyan-400 hover:text-cyan-500 transition-all duration-200">
                  <Youtube size={12} />
                </a>
              )}
              {settings?.darulQuranUrl && (
                <a href={settings.darulQuranUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] font-medium text-gray-500 hover:text-cyan-600 bg-white border border-gray-200 hover:border-cyan-400 rounded-lg px-2 py-1 sm:px-2.5 sm:py-1.5 transition-all duration-200">
                  Dar ul Quran <ExternalLink size={9} />
                </a>
              )}
            </div>
          </div>

          {/* Col 2 — Quick Links */}
          <div>
            <ColHeading>Quick Links</ColHeading>
            <ul className="space-y-1.5 sm:space-y-2.5">
              {quickLinks.map(({ label, href }: any) => (
                <NavLink key={href} href={href}>{label}</NavLink>
              ))}
            </ul>
          </div>

          {/* Col 3 — Services */}
          <div>
            <ColHeading>Services</ColHeading>
            <ul className="space-y-1.5 sm:space-y-2.5">
              {services.map(({ label, href }: any) => (
                <NavLink key={href} href={href}>{label}</NavLink>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact (full width on mobile) */}
          <div className="col-span-2 lg:col-span-1">
            <ColHeading>Contact Us</ColHeading>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-x-4 gap-y-2 sm:gap-y-3">
              {settings?.email && (
                <li>
                  <a href={`mailto:${settings.email}`}
                    className="flex items-center gap-2 text-[12px] sm:text-[12.5px] text-gray-500 hover:text-cyan-600 transition-colors duration-150">
                    <Mail size={12} className="text-cyan-500 flex-shrink-0" />
                    <span className="truncate">{settings.email}</span>
                  </a>
                </li>
              )}
              {settings?.phone && (
                <li>
                  <a href={`tel:${settings.phone}`}
                    className="flex items-center gap-2 text-[12px] sm:text-[12.5px] text-gray-500 hover:text-cyan-600 transition-colors duration-150">
                    <Phone size={12} className="text-cyan-500 flex-shrink-0" />
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings?.whatsapp && (
                <li>
                  <a href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[12px] sm:text-[12.5px] text-gray-500 hover:text-cyan-600 transition-colors duration-150">
                    <MessageCircle size={12} className="text-cyan-500 flex-shrink-0" />
                    WhatsApp: {settings.whatsapp}
                  </a>
                </li>
              )}
              {settings?.address && (
                <li className="flex items-start gap-2">
                  <MapPin size={12} className="text-cyan-500 flex-shrink-0 mt-0.5" />
                  <p className="text-[12px] sm:text-[12.5px] text-gray-500 leading-relaxed whitespace-pre-line">
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
              className="group inline-flex items-center gap-1.5 mt-4 px-4 py-2 sm:mt-5 sm:px-5 sm:py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white text-[12px] font-semibold rounded-full
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
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
