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
  onNavigate?: () => void;
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <path d="M15 3h6v6M10 14 21 3" />
    </svg>
  );
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
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-11 items-center gap-2 rounded-xl border-l-[3px] px-3 py-2.5 text-sm-plus font-medium transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 ${
                  active
                    ? "border-brand-600 bg-brand-50 text-brand-800"
                    : "border-transparent text-gray-700 hover:bg-gray-50 hover:text-slate-900"
                }`}
              >
                <span className="flex-1">{item.label}</span>
                {item.external && (
                  <>
                    <ExternalLinkIcon className="size-3.5 shrink-0 text-gray-400" />
                    <span className="sr-only"> (opens in new tab)</span>
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
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noopener noreferrer" : undefined}
            aria-current={active ? "page" : undefined}
            className={`link-underline text-sm-plus font-medium whitespace-nowrap transition-colors duration-150 ${
              active
                ? "text-brand-700 active"
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
