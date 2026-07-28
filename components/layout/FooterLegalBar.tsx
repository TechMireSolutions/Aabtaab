import Link from "next/link";
import {
  FOOTER_LEGAL_LINKS,
  FOOTER_SECTION_LABELS,
  formatFooterCopyright,
} from "@/lib/fallbacks/footer-nav";

interface FooterLegalBarProps {
  siteName: string;
}

/** Copyright + privacy/terms bar. */
export default function FooterLegalBar({ siteName }: FooterLegalBarProps) {
  return (
    <div className="footer-legal-bar">
      <div className="container-page flex flex-col items-center justify-between gap-4 py-5 sm:py-6 md:flex-row">
        <p className="text-center text-sm text-slate-500 md:text-left">
          {formatFooterCopyright(siteName)}
        </p>
        <nav aria-label={FOOTER_SECTION_LABELS.legal}>
          <ul className="flex flex-wrap items-center justify-center divide-x divide-slate-800 md:justify-end">
            {FOOTER_LEGAL_LINKS.map((link) => (
              <li key={link.href} className="flex items-center px-2 first:ps-0 last:pe-0 sm:px-3">
                <Link href={link.href} className="footer-legal-link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
