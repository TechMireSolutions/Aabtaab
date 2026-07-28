import type { FooterNav, FooterService } from "@/types/site-navigation";
import type { SiteSettings } from "@/types/site-settings";
import { resolveSiteName } from "@/lib/constants";
import {
  FALLBACK_QUICK_LINKS,
  FOOTER_SECTION_LABELS,
  buildFooterContactItems,
  buildFooterServiceNavLinks,
  buildFooterSocialLinks,
  resolveFooterTagline,
} from "@/lib/fallbacks/footer-nav";
import FooterBrandColumn from "@/components/layout/FooterBrandColumn";
import FooterContactColumn from "@/components/layout/FooterContactColumn";
import FooterCtaBand from "@/components/layout/FooterCtaBand";
import FooterLegalBar from "@/components/layout/FooterLegalBar";
import FooterNavColumn from "@/components/layout/FooterNavColumn";

interface FooterProps {
  settings?: SiteSettings;
  logoUrl?: string | null;
  footerNav?: FooterNav;
  footerServices?: FooterService[];
}

/**
 * Site footer — presentation only.
 * Data SSOT: `lib/fallbacks/footer-nav.ts` (+ layout via `getSiteLayoutData()`).
 */
export default function Footer({
  settings,
  logoUrl,
  footerNav,
  footerServices,
}: FooterProps) {
  const siteName = resolveSiteName(settings);
  const tagline = resolveFooterTagline(settings);
  // Layout already filtered via resolveFooterNavForLayout — trust items;
  // only fall back when footerNav is absent (do not revive empty filtered lists).
  const quickLinks = footerNav?.items ?? FALLBACK_QUICK_LINKS;
  const services = buildFooterServiceNavLinks(footerServices);
  const contactItems = buildFooterContactItems(settings);
  const socialLinks = buildFooterSocialLinks(settings);

  return (
    <footer className="footer-shell">
      <div
        className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-brand-500/50 to-transparent"
        aria-hidden="true"
      />

      <FooterCtaBand />

      <div className="container-page section-y lg:py-16">
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2 md:gap-y-10 lg:grid-cols-12 lg:gap-y-12">
          <FooterBrandColumn
            siteName={siteName}
            logoUrl={logoUrl}
            tagline={tagline}
            socialLinks={socialLinks}
          />

          <FooterNavColumn
            id="footer-quick-links"
            title={FOOTER_SECTION_LABELS.quickLinks}
            items={quickLinks}
          />

          <FooterNavColumn
            id="footer-services"
            title={FOOTER_SECTION_LABELS.services}
            items={services}
          />

          <FooterContactColumn items={contactItems} />
        </div>
      </div>

      <FooterLegalBar siteName={siteName} />
    </footer>
  );
}
