import Link from "next/link";
import Image from "next/image";
import NavLinks from "@/components/layout/NavLinks";
import MobileNavSidebarLoader from "@/components/layout/MobileNavSidebarLoader";
import MobileSearchButton from "@/components/layout/MobileSearchButton";
import { DEFAULT_SITE_NAME } from "@/lib/constants";
import type { NavItem } from "@/types/site-navigation";

interface HeaderProps {
  darulQuranUrl?: string;
  siteName?: string;
  logoUrl?: string | null;
  navItems?: NavItem[];
  searchPlaceholder?: string;
}

const FALLBACK_NAV: NavItem[] = [
  { label: "Online Classes", href: "/online-courses" },
  { label: "Services", href: "/services" },
  { label: "Events", href: "/events" },
  { label: "Articles", href: "/posts" },
  { label: "Donate", href: "/donate" },
  { label: "About", href: "/about" },
];

function buildNavLinks(
  navItems: NavItem[] | undefined,
  darulQuranUrl?: string,
): NavItem[] {
  const base = navItems?.length ? [...navItems] : [...FALLBACK_NAV];
  const hasDarUlQuran = base.some((item) =>
    /dar\s*ul\s*quran/i.test(item.label),
  );
  if (!hasDarUlQuran && darulQuranUrl) {
    base.push({
      label: "Dar ul Quran",
      href: darulQuranUrl,
      external: true,
    });
  }
  return base;
}

function SiteLogo({
  siteName,
  logoUrl,
}: {
  siteName: string;
  logoUrl?: string | null;
}) {
  const size = 42;

  return (
    <>
      <div className="size-logo shrink-0 overflow-hidden rounded-full border-2 border-brand-400 transition-transform duration-200 group-hover:scale-105">
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt=""
            width={size}
            height={size}
            sizes={`${size}px`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-brand-100 to-brand-50 text-lg select-none">
            ⛵
          </div>
        )}
      </div>
      <span className="hidden text-lg-plus font-bold tracking-heading text-slate-900 md:block">
        {siteName}
      </span>
    </>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3-3" />
    </svg>
  );
}

export default function Header({
  darulQuranUrl,
  siteName = DEFAULT_SITE_NAME,
  logoUrl,
  navItems,
  searchPlaceholder = "Search the site…",
}: HeaderProps) {
  const navLinks = buildNavLinks(navItems, darulQuranUrl);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 shadow-header backdrop-blur-md">
      <div className="container-page flex h-header items-center gap-2 lg:gap-8">
        <MobileNavSidebarLoader
          siteName={siteName}
          logoUrl={logoUrl}
          navLinks={navLinks}
        />

        <Link
          href="/"
          aria-label={siteName}
          className="group flex shrink-0 items-center gap-3"
        >
          <SiteLogo siteName={siteName} logoUrl={logoUrl} />
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden flex-1 items-center justify-center gap-7 lg:flex"
        >
          <NavLinks links={navLinks} variant="desktop" />
        </nav>

        <form
          action="/search"
          method="get"
          role="search"
          className="ml-auto hidden items-center overflow-hidden rounded-full border border-gray-200 bg-white lg:flex"
        >
          <label htmlFor="header-search" className="sr-only">
            Search
          </label>
          <input
            id="header-search"
            type="search"
            name="q"
            placeholder={searchPlaceholder}
            aria-label="Search"
            className="w-search-input px-4 py-2 text-sm-plus text-slate-700 outline-none placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-brand-600/30"
          />
          <button
            type="submit"
            aria-label="Search"
            className="btn-search-submit px-3 py-2"
          >
            <SearchIcon className="size-3.5 text-white" />
          </button>
        </form>

        <MobileSearchButton searchPlaceholder={searchPlaceholder} />
      </div>
    </header>
  );
}
