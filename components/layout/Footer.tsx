import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { FooterNav, FooterService } from "@/types/site-navigation";
import type { SiteSettings } from "@/types/site-settings";
import { resolveSiteName } from "@/lib/constants";
import {
  FOOTER_CTA,
  FOOTER_LEGAL_LINKS,
  buildFooterContactItems,
  buildFooterServiceNavLinks,
  buildFooterSocialLinks,
  formatFooterCopyright,
  resolveFooterQuickLinks,
  resolveFooterTagline,
} from "@/lib/fallbacks/footer-nav";
import { FacebookIcon, YoutubeIcon } from "@/components/icons/SocialIcons";
import SiteBrandLogo from "@/components/layout/SiteBrandLogo";
import OpensInNewTab from "@/components/ui/OpensInNewTab";
import { EXTERNAL_LINK_PROPS } from "@/lib/urls";

interface FooterProps {
  settings?: SiteSettings;
  logoUrl?: string | null;
  footerNav?: FooterNav;
  footerServices?: FooterService[];
}

const SOCIAL_ICONS = {
  facebook: FacebookIcon,
  youtube: YoutubeIcon,
} as const;

function ColHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h3 id={id} className="footer-heading">
      {children}
    </h3>
  );
}

function NavLink({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        {...(external ? EXTERNAL_LINK_PROPS : {})}
        className="footer-nav-link group"
      >
        <span className="motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:translate-x-1">
          {children}
        </span>
        {external ? <OpensInNewTab /> : null}
      </Link>
    </li>
  );
}

export default function Footer({
  settings,
  logoUrl,
  footerNav,
  footerServices,
}: FooterProps) {
  const siteName = resolveSiteName(settings);
  const tagline = resolveFooterTagline(settings);
  const quickLinks = resolveFooterQuickLinks(footerNav?.items);
  const services = buildFooterServiceNavLinks(footerServices);
  const contactItems = buildFooterContactItems(settings);
  const socialLinks = buildFooterSocialLinks(settings);

  return (
    <footer className="footer-shell">
      <div
        className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-brand-500/50 to-transparent"
        aria-hidden="true"
      />

      <div className="border-b border-slate-900">
        <div className="container-page pt-6 pb-fab-safe sm:pt-10 lg:pt-12 lg:pb-12">
          <div className="footer-cta-band">
            <div
              className="pointer-events-none absolute top-0 right-0 -mt-20 -mr-20 size-64 rounded-full bg-brand-500/10 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative z-10 max-w-xl">
              <h2 className="mb-2 text-xl font-bold text-white sm:text-2xl">
                {FOOTER_CTA.title}
              </h2>
              <p className="text-sm leading-relaxed text-slate-400 sm:text-base">
                {FOOTER_CTA.body}
              </p>
            </div>
            <div className="relative z-10 flex w-full lg:max-w-md">
              <Link
                href={FOOTER_CTA.actionHref}
                className="btn-primary w-full justify-center lg:w-auto"
              >
                {FOOTER_CTA.actionLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container-page section-y lg:py-16">
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2 md:gap-y-10 lg:grid-cols-12 lg:gap-y-12">
          <div className="flex flex-col lg:col-span-4">
            <Link
              href="/"
              className="group mb-4 inline-flex items-center gap-3 sm:mb-6"
            >
              <SiteBrandLogo
                siteName={siteName}
                logoUrl={logoUrl}
                variant="footer"
              />
            </Link>

            <p className="mb-6 max-w-sm text-sm leading-relaxed text-slate-400 sm:mb-8">
              {tagline}
            </p>

            {socialLinks.length > 0 && (
              <div className="mt-auto flex flex-wrap items-center gap-3">
                {socialLinks.map((link) => {
                  if (link.variant === "pill" || link.key === "darulQuran") {
                    return (
                      <a
                        key={link.key}
                        href={link.href}
                        {...EXTERNAL_LINK_PROPS}
                        className="footer-pill-link"
                      >
                        {link.label}
                        <ExternalLink size={12} aria-hidden="true" />
                        <OpensInNewTab />
                      </a>
                    );
                  }

                  const Icon = SOCIAL_ICONS[link.key];
                  return (
                    <a
                      key={link.key}
                      href={link.href}
                      {...EXTERNAL_LINK_PROPS}
                      aria-label={`${link.label} (opens in new tab)`}
                      className="footer-social-btn"
                    >
                      <Icon />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {quickLinks.length > 0 && (
            <nav className="lg:col-span-2" aria-labelledby="footer-quick-links">
              <ColHeading id="footer-quick-links">Quick Links</ColHeading>
              <ul className="space-y-0 sm:space-y-1">
                {quickLinks.map(({ label, href, external }) => (
                  <NavLink key={href} href={href} external={external}>
                    {label}
                  </NavLink>
                ))}
              </ul>
            </nav>
          )}

          {services.length > 0 && (
            <nav className="lg:col-span-2" aria-labelledby="footer-services">
              <ColHeading id="footer-services">Services</ColHeading>
              <ul className="space-y-0 sm:space-y-1">
                {services.map(({ label, href }) => (
                  <NavLink key={href} href={href}>
                    {label}
                  </NavLink>
                ))}
              </ul>
            </nav>
          )}

          <nav className="lg:col-span-4" aria-labelledby="footer-contact">
            <ColHeading id="footer-contact">Contact Information</ColHeading>
            <ul className="flex flex-col gap-1 sm:gap-3">
              {contactItems.map((item) => {
                const Icon = item.Icon;
                const content = (
                  <>
                    <Icon
                      size={16}
                      className="mt-0.5 shrink-0 text-brand-500"
                      aria-hidden="true"
                    />
                    <span className={item.valueClassName}>
                      {item.value}
                      {item.external ? <OpensInNewTab /> : null}
                    </span>
                  </>
                );

                if (!item.href) {
                  return (
                    <li key={item.kind} className="footer-contact-static">
                      {content}
                    </li>
                  );
                }

                if (item.href.startsWith("/") && !item.external) {
                  return (
                    <li key={item.kind}>
                      <Link href={item.href} className="footer-contact-link">
                        {content}
                      </Link>
                    </li>
                  );
                }

                return (
                  <li key={item.kind}>
                    <a
                      href={item.href}
                      {...(item.external ? EXTERNAL_LINK_PROPS : {})}
                      className="footer-contact-link"
                      title={item.title}
                    >
                      {content}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

      <div className="border-t border-slate-900 bg-slate-950">
        <div className="container-page flex flex-col items-center justify-between gap-4 py-5 sm:py-6 md:flex-row">
          <p className="text-center text-sm text-slate-500 md:text-left">
            {formatFooterCopyright(siteName)}
          </p>
          <nav aria-label="Footer legal links">
            <div className="flex items-center justify-center gap-1 md:justify-end md:gap-4">
              {FOOTER_LEGAL_LINKS.map((link, index) => (
                <span key={link.href} className="contents">
                  {index > 0 && (
                    <span aria-hidden="true" className="text-slate-800">
                      |
                    </span>
                  )}
                  <Link href={link.href} className="footer-legal-link">
                    {link.label}
                  </Link>
                </span>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </footer>
  );
}
