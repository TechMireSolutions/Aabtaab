import type { NavItem } from "@/types/site-navigation";
import FooterNavLink from "@/components/layout/FooterNavLink";

interface FooterNavColumnProps {
  id: string;
  title: string;
  items: NavItem[];
}

/** Labeled destination list (quick links or services). */
export default function FooterNavColumn({
  id,
  title,
  items,
}: FooterNavColumnProps) {
  if (items.length === 0) return null;

  return (
    <nav className="lg:col-span-2" aria-labelledby={id}>
      <h3 id={id} className="footer-heading">
        {title}
      </h3>
      <ul className="grid grid-cols-2 gap-x-4 sm:block sm:space-y-1">
        {items.map(({ label, href, external }) => (
          <FooterNavLink key={href} href={href} external={external}>
            {label}
          </FooterNavLink>
        ))}
      </ul>
    </nav>
  );
}
