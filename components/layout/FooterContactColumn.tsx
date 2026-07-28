import Link from "next/link";
import type { FooterContactItem } from "@/lib/fallbacks/footer-nav";
import { FOOTER_SECTION_LABELS } from "@/lib/fallbacks/footer-nav";
import OpensInNewTab from "@/components/ui/OpensInNewTab";
import { EXTERNAL_LINK_PROPS } from "@/lib/urls";

interface FooterContactColumnProps {
  items: FooterContactItem[];
}

function ContactRowContent({ item }: { item: FooterContactItem }) {
  const Icon = item.Icon;
  return (
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
}

/** Contact channels column — data from `buildFooterContactItems`. */
export default function FooterContactColumn({ items }: FooterContactColumnProps) {
  const headingId = "footer-contact";

  return (
    <nav className="lg:col-span-4" aria-labelledby={headingId}>
      <h3 id={headingId} className="footer-heading">
        {FOOTER_SECTION_LABELS.contact}
      </h3>
      <ul className="flex flex-col gap-1 sm:gap-3">
        {items.map((item) => {
          if (!item.href) {
            return (
              <li key={item.kind} className="footer-contact-static">
                <ContactRowContent item={item} />
              </li>
            );
          }

          if (item.href.startsWith("/") && !item.external) {
            return (
              <li key={item.kind}>
                <Link href={item.href} className="footer-contact-link">
                  <ContactRowContent item={item} />
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
                <ContactRowContent item={item} />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
