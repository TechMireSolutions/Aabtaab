"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface ActiveNavLinkProps {
  href: string;
  label: string;
  external?: boolean;
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
}

function isActive(pathname: string, href: string): boolean {
  return (
    href !== "#" &&
    (pathname === href || (href !== "/" && pathname.startsWith(`${href}/`)))
  );
}

export default function ActiveNavLink({
  href,
  label,
  external,
  variant = "desktop",
  onNavigate,
}: ActiveNavLinkProps) {
  const pathname = usePathname();
  const active = isActive(pathname, href);

  if (variant === "mobile") {
    return (
      <Link
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        onClick={onNavigate}
        className={`mb-0.5 flex items-center rounded-xl px-3 py-3 text-sm-plus font-medium transition-all duration-150 ${
          active
            ? "bg-brand-50 text-brand-700"
            : "text-gray-700 hover:bg-gray-50 hover:text-slate-900"
        }`}
      >
        {label}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`link-underline text-sm-plus font-medium whitespace-nowrap transition-colors duration-150 ${
        active
          ? "text-brand-600 active"
          : "text-gray-600 hover:text-slate-900"
      }`}
    >
      {label}
    </Link>
  );
}
