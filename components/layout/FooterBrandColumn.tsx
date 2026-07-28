import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { FooterSocialLink } from "@/lib/fallbacks/footer-nav";
import { FOOTER_SECTION_LABELS } from "@/lib/fallbacks/footer-nav";
import { FacebookIcon, YoutubeIcon } from "@/components/icons/SocialIcons";
import SiteBrandLogo from "@/components/layout/SiteBrandLogo";
import OpensInNewTab from "@/components/ui/OpensInNewTab";
import { EXTERNAL_LINK_PROPS } from "@/lib/urls";

const SOCIAL_ICONS = {
  facebook: FacebookIcon,
  youtube: YoutubeIcon,
} as const;

interface FooterBrandColumnProps {
  siteName: string;
  logoUrl?: string | null;
  tagline: string;
  socialLinks: FooterSocialLink[];
}

/** Brand mark, tagline, and social / Dar ul Quran links. */
export default function FooterBrandColumn({
  siteName,
  logoUrl,
  tagline,
  socialLinks,
}: FooterBrandColumnProps) {
  return (
    <div className="flex flex-col lg:col-span-4">
      <Link
        href="/"
        className="group mb-4 inline-flex min-h-11 items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400 sm:mb-6"
      >
        <SiteBrandLogo siteName={siteName} logoUrl={logoUrl} variant="footer" />
      </Link>

      <p className="mb-6 max-w-sm text-pretty text-sm leading-relaxed text-slate-400 sm:mb-8">
        {tagline}
      </p>

      {socialLinks.length > 0 && (
        <ul
          className="mt-auto flex flex-wrap items-center gap-3"
          aria-label={FOOTER_SECTION_LABELS.social}
        >
          {socialLinks.map((link) => {
            if (link.variant === "pill") {
              return (
                <li key={link.key}>
                  <a
                    href={link.href}
                    {...EXTERNAL_LINK_PROPS}
                    className="footer-pill-link"
                  >
                    {link.label}
                    <ExternalLink size={12} aria-hidden="true" />
                    <OpensInNewTab />
                  </a>
                </li>
              );
            }

            const Icon = SOCIAL_ICONS[link.key as keyof typeof SOCIAL_ICONS];
            if (!Icon) return null;

            return (
              <li key={link.key}>
                <a
                  href={link.href}
                  {...EXTERNAL_LINK_PROPS}
                  aria-label={`${link.label} (opens in new tab)`}
                  className="footer-social-btn"
                >
                  <Icon />
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
