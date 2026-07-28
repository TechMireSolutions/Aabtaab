import Link from "next/link";
import OpensInNewTab from "@/components/ui/OpensInNewTab";
import { EXTERNAL_LINK_PROPS } from "@/lib/urls";

interface FooterNavLinkProps {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}

/** Shared destination row for footer quick links and services. */
export default function FooterNavLink({
  href,
  children,
  external,
}: FooterNavLinkProps) {
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
