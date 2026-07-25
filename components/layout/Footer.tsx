import Link from "next/link";
import Image from "next/image";
import {
  Clock,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  ExternalLink
} from "lucide-react";
import type { FooterNav, FooterService, NavItem } from "@/types/site-navigation";
import type { SiteSettings } from "@/types/sanity";
import { resolveSiteName } from "@/lib/constants";
import { FacebookIcon, YoutubeIcon } from "@/components/icons/SocialIcons";
import { whatsappUrl } from "@/lib/urls";

interface FooterProps {
  settings?: SiteSettings;
  logoUrl?: string | null;
  footerNav?: FooterNav;
  footerServices?: FooterService[];
}

const FALLBACK_QUICK_LINKS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Online Courses", href: "/online-courses" },
  { label: "Our Scholars", href: "/scholars" },
  { label: "Donate", href: "/donate" },
  { label: "FAQs", href: "/faqs" },
  { label: "Contact", href: "/contact" },
];

const FALLBACK_SERVICES: FooterService[] = [
  { _id: "1", title: "Niyabat Ziarat", slug: "niyabat-ziarat" },
  { _id: "2", title: "Zakat", slug: "zakat" },
  { _id: "3", title: "Khums", slug: "khums" },
  { _id: "4", title: "Istikhara", slug: "istikhara" },
  { _id: "5", title: "All Services", slug: "" },
];

function ColHeading({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h3 id={id} className="text-sm font-bold uppercase tracking-wider text-white mb-5">
      {children}
    </h3>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="group relative flex items-center py-1.5 text-sm text-slate-400 hover:text-brand-400 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
      >
        <span className="transition-transform duration-200 group-hover:translate-x-1">
          {children}
        </span>
      </Link>
    </li>
  );
}

const CONTACT_LINK_CLASS =
  "flex items-start gap-3 py-2 text-sm text-slate-400 hover:text-brand-400 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400";

export default function Footer({
  settings,
  logoUrl,
  footerNav,
  footerServices,
}: FooterProps) {
  const siteName = resolveSiteName(settings);
  const tagline =
    settings?.tagline ||
    "Spreading the light of Ahlul Bayt (A.S.) through education, authentic content, and spiritual services. Join us in our mission to serve the Ummah.";

  const quickLinks =
    footerNav?.items?.length ? footerNav.items : FALLBACK_QUICK_LINKS;

  const services = footerServices?.length
    ? footerServices.map((s) => ({
      label: s.title,
      href: `/services/${s.slug}`,
    })).slice(0, 5)
    : FALLBACK_SERVICES.map((s) => ({
      label: s.title,
      href: s.slug ? `/services/${s.slug}` : "/services",
    }));

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-900 relative overflow-hidden">
      {/* Decorative top gradient border */}
      <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-brand-500/50 to-transparent" />
      
      {/* Newsletter Section */}
      <div className="border-b border-slate-900">
        <div className="container-page py-10 sm:py-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-slate-900/50 p-6 sm:p-10 rounded-2xl border border-slate-800/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 size-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-xl">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Subscribe to our Newsletter</h3>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                Stay connected with Aabtaab. Receive updates on new courses, spiritual events, and insightful articles directly in your inbox.
              </p>
            </div>
            <form action="#" className="relative z-10 flex w-full lg:max-w-md gap-2">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 sm:py-3.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                required
              />
              <button 
                type="button" 
                className="bg-brand-600 hover:bg-brand-500 text-white px-5 sm:px-6 py-3 sm:py-3.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center shrink-0 gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container-page py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-12">
          
          {/* Col 1 — Brand & Intro (4 cols) */}
          <div className="lg:col-span-4 flex flex-col">
            <Link
              href="/"
              className="inline-flex items-center gap-3 mb-6 group"
            >
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={siteName}
                  width={48}
                  height={48}
                  className="size-12 rounded-full border border-slate-800 object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="size-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl select-none transition-transform duration-300 group-hover:scale-105">
                  ⛵
                </div>
              )}
              <span className="font-bold text-xl text-white tracking-tight transition-colors duration-200 group-hover:text-brand-400">
                {siteName}
              </span>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed mb-8 max-w-sm">
              {tagline}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-auto">
              {settings?.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex size-10 items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all duration-200"
                >
                  <FacebookIcon />
                </a>
              )}
              {settings?.youtube && (
                <a
                  href={settings.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="flex size-10 items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all duration-200"
                >
                  <YoutubeIcon />
                </a>
              )}
              {settings?.darulQuranUrl && (
                <a
                  href={settings.darulQuranUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Dar ul Quran"
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-slate-900 border border-slate-800 px-4 text-sm font-medium text-slate-400 hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all duration-200"
                >
                  Dar ul Quran
                  <ExternalLink size={12} aria-hidden="true" />
                </a>
              )}
            </div>
          </div>

          {/* Col 2 — Quick Links (2 cols) */}
          <nav className="lg:col-span-2" aria-labelledby="footer-quick-links">
            <ColHeading id="footer-quick-links">Quick Links</ColHeading>
            <ul className="space-y-1">
              {quickLinks.map(({ label, href }) => (
                <NavLink key={href} href={href}>
                  {label}
                </NavLink>
              ))}
            </ul>
          </nav>

          {/* Col 3 — Services (2 cols) */}
          <nav className="lg:col-span-2" aria-labelledby="footer-services">
            <ColHeading id="footer-services">Services</ColHeading>
            <ul className="space-y-1">
              {services.map(({ label, href }) => (
                <NavLink key={href} href={href}>
                  {label}
                </NavLink>
              ))}
            </ul>
          </nav>

          {/* Col 4 — Contact Info (4 cols) */}
          <div className="lg:col-span-4">
            <ColHeading>Contact Information</ColHeading>
            <ul className="flex flex-col gap-3">
              {settings?.address && (
                <li>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={CONTACT_LINK_CLASS}
                    title="View on Google Maps"
                  >
                    <MapPin size={16} className="text-brand-500 shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="whitespace-pre-line leading-relaxed">{settings.address}</span>
                  </a>
                </li>
              )}
              {settings?.phone && (
                <li>
                  <a href={`tel:${settings.phone}`} className={CONTACT_LINK_CLASS}>
                    <Phone size={16} className="text-brand-500 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{settings.phone}</span>
                  </a>
                </li>
              )}
              {settings?.whatsapp && (
                <li>
                  <a
                    href={whatsappUrl(settings.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={CONTACT_LINK_CLASS}
                  >
                    <MessageSquare size={16} className="text-brand-500 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>WhatsApp: {settings.whatsapp}</span>
                  </a>
                </li>
              )}
              {settings?.email && (
                <li>
                  <a href={`mailto:${settings.email}`} className={CONTACT_LINK_CLASS}>
                    <Mail size={16} className="text-brand-500 shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="truncate">{settings.email}</span>
                  </a>
                </li>
              )}
              {settings?.workingHours && (
                <li className="flex items-start gap-3 py-2 text-sm text-slate-400">
                  <Clock size={16} className="text-brand-500 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{settings.workingHours}</span>
                </li>
              )}
              {!settings?.email && !settings?.phone && !settings?.address && (
                <li className="text-sm text-slate-500 italic py-2">
                  Please add contact info in Sanity → Site Settings
                </li>
              )}
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar — Copyright & Legal */}
      <div className="border-t border-slate-900 bg-slate-950">
        <div className="container-page py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 text-center md:text-left">
            &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
          <nav aria-label="Footer legal links">
            <div className="flex items-center justify-center md:justify-end gap-4 text-sm text-slate-500">
              <Link
                href="/privacy-policy"
                className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-brand-400 rounded-sm"
              >
                Privacy Policy
              </Link>
              <span aria-hidden="true" className="text-slate-800">|</span>
              <Link
                href="/terms-of-service"
                className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-brand-400 rounded-sm"
              >
                Terms &amp; Conditions
              </Link>
              <span aria-hidden="true" className="text-slate-800">|</span>
              <Link
                href="/faqs"
                className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-brand-400 rounded-sm"
              >
                FAQs
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </footer>
  );
}
