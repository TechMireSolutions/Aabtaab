"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/types/site-navigation";

function isActive(pathname: string, href: string): boolean {
  return (
    href !== "#" &&
    (pathname === href || (href !== "/" && pathname.startsWith(`${href}/`)))
  );
}

interface NavLinksProps {
  links: NavItem[];
  variant: "desktop" | "mobile";
}

export default function NavLinks({ links, variant }: NavLinksProps) {
  const pathname = usePathname();
  const visibleLinks = links.filter((item) => item.href !== "#");

  if (variant === "mobile") {
    return (
      <>
        {visibleLinks.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              aria-current={active ? "page" : undefined}
              className={`mb-0.5 flex items-center rounded-xl px-3 py-3 text-sm-plus font-medium transition-all duration-150 ${
                active
                  ? "bg-brand-50 text-brand-700"
                  : "text-gray-700 hover:bg-gray-50 hover:text-slate-900"
              }`}
            >
              {item.label}
              {item.external && (
                <span className="sr-only"> (opens in new tab)</span>
              )}
            </Link>
          );
        })}
      </>
    );
  }

  return (
    <>
      {visibleLinks.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.label}
            href={item.href}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noopener noreferrer" : undefined}
            aria-current={active ? "page" : undefined}
            className={`link-underline text-sm-plus font-medium whitespace-nowrap transition-colors duration-150 ${
              active
                ? "text-brand-600 active"
                : "text-gray-600 hover:text-slate-900"
            }`}
          >
            {item.label}
            {item.external && (
              <span className="sr-only"> (opens in new tab)</span>
            )}
          </Link>
        );
      })}
    </>
  );
}
