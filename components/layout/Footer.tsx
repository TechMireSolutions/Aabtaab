import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import type { FooterService, NavItem } from "@/types/site-navigation";
import type { SiteSettings } from "@/types/sanity";
import { resolveSiteName } from "@/lib/constants";
import { FacebookIcon, YoutubeIcon } from "@/components/icons/SocialIcons";
import { whatsappUrl } from "@/lib/urls";

interface FooterProps {
  settings?: SiteSettings;
  logoUrl?: string | null;
  footerServices?: FooterService[];
}

const FALLBACK_QUICK_LINKS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Online Classes", href: "/online-courses" },
  { label: "Services", href: "/services" },
  { label: "Events", href: "/events" },
  { label: "Articles", href: "/posts" },
  { label: "Donate", href: "/donate" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const FALLBACK_SERVICES: FooterService[] = [
  { _id: "1", title: "Niyabat Ziarat", slug: "niyabat-ziarat" },
  { _id: "2", title: "Zakat", slug: "zakat" },
  { _id: "3", title: "Khums", slug: "khums" },
  { _id: "4", title: "Ijara", slug: "ijara" },
  { _id: "5", title: "Expiation", slug: "expiation" },
  { _id: "6", title: "Sacrifice", slug: "sacrifice" },
];

function ColHeading({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h3 id={id} className="heading-col">
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
        className="group flex min-h-11 items-center gap-0 rounded-sm text-sm-plus text-gray-500 hover:text-brand-600 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 sm:min-h-0"
      >
        <span className="inline-block w-0 overflow-hidden group-hover:w-3 transition-all duration-150 text-brand-500 text-xs-plus leading-none">
          ›
        </span>
        {children}
      </Link>
    </li>
  );
}

export default function Footer({
  settings,
  logoUrl,
  footerServices,
}: FooterProps) {
  const siteName = resolveSiteName(settings);
  const tagline =
    settings?.tagline ||
    "Spreading the light of Ahlul Bayt (A.S.) through education, authentic content, and spiritual services.";
  const quickLinks = FALLBACK_QUICK_LINKS;
  const services = footerServices?.length
    ? footerServices.map((s) => ({
        label: s.title,
        href: `/services/${s.slug}`,
      }))
    : FALLBACK_SERVICES.map((s) => ({
        label: s.title,
        href: `/services/${s.slug}`,
      }));

  return (
    <footer className="section-deferred bg-gray-50 border-t border-gray-200">
      {/* ── Main body ── */}
      <div className="container-page py-6 sm:py-10 lg:py-12">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6 sm:gap-8 lg:gap-10">
          {/* Col 1 — Logo + Brand (full width on mobile) */}
          <div className="col-span-2 lg:col-span-1">
            <Link
              href="/"
              aria-label={siteName}
              className="inline-flex items-center gap-2.5 mb-3 group"
            >
            {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt=""
                  width={40}
                  height={40}
                  className="size-10 rounded-full border-2 border-brand-400 object-cover transition-transform duration-200 group-hover:scale-105 sm:size-logo-lg"
                />
              ) : (
                <div className="size-10 rounded-full bg-linear-to-br from-brand-100 to-brand-50 border-2 border-brand-400 flex items-center justify-center text-xl sm:size-logo-lg sm:text-2xl select-none transition-transform duration-200 group-hover:scale-105">
                  ⛵
                </div>
              )}
              <span className="font-bold text-base-plus sm:text-lg-plus text-slate-900 tracking-heading">
                {siteName}
              </span>
            </Link>

            <p className="text-body-muted mb-3 sm:mb-5 max-w-tagline line-clamp-2 sm:line-clamp-none">
              {tagline}
            </p>

            {/* Social + external links */}
            <div className="flex items-center gap-2 flex-wrap">
              {settings?.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook (opens in new tab)"
                  className="icon-btn-subtle"
                >
                  <FacebookIcon />
                </a>
              )}
              {settings?.youtube && (
                <a
                  href={settings.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube (opens in new tab)"
                  className="icon-btn-subtle"
                >
                  <YoutubeIcon />
                </a>
              )}
              {settings?.darulQuranUrl && (
                <a
                  href={settings.darulQuranUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Dar ul Quran (opens in new tab)"
                  className="chip-outline-sm"
                >
                  Dar ul Quran{" "}
                  <ExternalLink size={9} aria-hidden="true" />
                </a>
              )}
            </div>
          </div>

          {/* Col 2 — Quick Links */}
          <nav aria-labelledby="footer-quick-links">
            <ColHeading id="footer-quick-links">Quick Links</ColHeading>
            <ul className="space-y-1.5 sm:space-y-2.5">
              {quickLinks.map(({ label, href }) => (
                <NavLink key={href} href={href}>
                  {label}
                </NavLink>
              ))}
            </ul>
          </nav>

          {/* Col 3 — Services */}
          <nav aria-labelledby="footer-services">
            <ColHeading id="footer-services">Services</ColHeading>
            <ul className="space-y-1.5 sm:space-y-2.5">
              {services.map(({ label, href }) => (
                <NavLink key={href} href={href}>
                  {label}
                </NavLink>
              ))}
            </ul>
          </nav>

          {/* Col 4 — Contact (full width on mobile) */}
          <div className="col-span-2 lg:col-span-1">
            <ColHeading>Contact Us</ColHeading>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-x-4 gap-y-2 sm:gap-y-3">
              {settings?.email && (
                <li>
                  <a
                    href={`mailto:${settings.email}`}
                    className="flex min-h-11 items-center gap-2 rounded-sm text-sm-plus text-gray-500 hover:text-brand-600 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 sm:min-h-0"
                  >
                    <Mail size={12} className="text-brand-500 shrink-0" aria-hidden="true" />
                    <span className="truncate">{settings.email}</span>
                  </a>
                </li>
              )}
              {settings?.phone && (
                <li>
                  <a
                    href={`tel:${settings.phone}`}
                    className="flex min-h-11 items-center gap-2 rounded-sm text-sm-plus text-gray-500 hover:text-brand-600 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 sm:min-h-0"
                  >
                    <Phone size={12} className="text-brand-500 shrink-0" aria-hidden="true" />
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings?.whatsapp && (
                <li>
                  <a
                    href={whatsappUrl(settings.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-11 items-center gap-2 rounded-sm text-sm-plus text-gray-500 hover:text-brand-600 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 sm:min-h-0"
                  >
                    <MessageCircle
                      size={12}
                      className="text-brand-500 shrink-0"
                      aria-hidden="true"
                    />
                    WhatsApp: {settings.whatsapp}
                    <span className="sr-only"> (opens in new tab)</span>
                  </a>
                </li>
              )}
              {settings?.address && (
                <li className="flex items-start gap-2">
                  <MapPin size={12} className="text-brand-500 shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-sm-plus text-gray-500 leading-relaxed whitespace-pre-line">
                    {settings.address}
                  </p>
                </li>
              )}
              {!settings?.email && !settings?.phone && !settings?.address && (
                <li className="text-sm-plus text-gray-500 italic">
                  Add contact info in Sanity → Site Settings
                </li>
              )}
            </ul>

            <Link href="/donate" className="btn-primary group mt-4 sm:mt-5">
              Donate Now
              <ArrowRight
                size={12}
                strokeWidth={2}
                className="group-hover:translate-x-0.5 transition-transform duration-150"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-gray-200 bg-white">
        <div className="container-page py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-caption">
            &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-gray-300">
            <Link
              href="/about"
              className="text-caption rounded-sm px-2 text-gray-500 hover:text-gray-700 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
            >
              About
            </Link>
            <span aria-hidden="true">·</span>
            <Link
              href="/contact"
              className="text-caption rounded-sm px-2 text-gray-500 hover:text-gray-700 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
            >
              Contact
            </Link>
            <span aria-hidden="true">·</span>
            <Link
              href="/donate"
              className="text-caption rounded-sm px-2 text-gray-500 hover:text-gray-700 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
            >
              Donate
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
