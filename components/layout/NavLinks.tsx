"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink } from "lucide-react";
import {
  TW_MOBILE_NAV_ROW,
  TW_MOBILE_NAV_ROW_ACTIVE,
} from "@/components/layout/mobile-nav-classes";
import type { NavItem } from "@/types/site-navigation";
import OpensInNewTab from "@/components/ui/OpensInNewTab";
import { EXTERNAL_LINK_PROPS } from "@/lib/urls";

function isActive(pathname: string, href: string): boolean {
  return (
    href !== "#" &&
    (pathname === href || (href !== "/" && pathname.startsWith(`${href}/`)))
  );
}

interface NavLinksProps {
  links: NavItem[];
  variant: "desktop" | "mobile";
  onNavigate?: () => void;
}

export default function NavLinks({ links, variant, onNavigate }: NavLinksProps) {
  const pathname = usePathname();
  const visibleLinks = links.filter((item) => item.href !== "#");

  if (variant === "mobile") {
    return (
      <ul className="space-y-0.5" role="list">
        {visibleLinks.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.label}>
              <Link
                href={item.href}
                onClick={onNavigate}
                {...(item.external ? EXTERNAL_LINK_PROPS : {})}
                aria-current={active ? "page" : undefined}
                className={`${TW_MOBILE_NAV_ROW} ${
                  active
                    ? TW_MOBILE_NAV_ROW_ACTIVE
                    : "border-s-2 border-transparent"
                }`}
              >
                <span className="flex-1">{item.label}</span>
                {item.external && (
                  <>
                    <ExternalLink className="size-3.5 shrink-0 text-gray-400" />
                    <OpensInNewTab />
                  </>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
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
            {...(item.external ? EXTERNAL_LINK_PROPS : {})}
            aria-current={active ? "page" : undefined}
            className={`link-underline text-sm-plus font-medium whitespace-nowrap transition-colors duration-150 ${
              active
                ? "text-brand-700 dark:text-brand-400 active"
                : "text-gray-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {item.label}
            {item.external ? <OpensInNewTab /> : null}
          </Link>
        );
      })}
    </>
  );
}
