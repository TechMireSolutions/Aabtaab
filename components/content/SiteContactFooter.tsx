import type { SiteSettings } from "@/types/site-settings";
import { buildFooterContactItems } from "@/lib/fallbacks/footer-nav";

interface SiteContactFooterProps {
  site: SiteSettings | null | undefined;
}

/** Compact email/phone row for course & service CTA bands (light surfaces). */
export default function SiteContactFooter({ site }: SiteContactFooterProps) {
  const items = buildFooterContactItems(site).filter(
    (item) =>
      (item.kind === "email" || item.kind === "phone") && Boolean(item.href),
  );

  if (!items.length) return null;

  return (
    <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm-plus text-slate-500">
      {items.map((item) => {
        const Icon = item.Icon;
        return (
          <li key={item.kind}>
            <a
              href={item.href}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-sm transition-colors hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
            >
              <Icon size={12} className="text-slate-600" aria-hidden="true" />
              <span>{item.value}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
