import Link from "next/link";
import Image from "next/image";
import NavLinks from "@/components/layout/NavLinks";
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
  if (!hasDarUlQuran) {
    base.push({
      label: "Dar ul Quran",
      href: darulQuranUrl || "#",
      external: Boolean(darulQuranUrl),
    });
  }
  return base;
}

function SiteLogo({
  siteName,
  logoUrl,
  compact = false,
}: {
  siteName: string;
  logoUrl?: string | null;
  compact?: boolean;
}) {
  const size = compact ? 40 : 42;

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
      {!compact && (
        <span className="hidden text-lg-plus font-bold tracking-heading text-slate-900 md:block">
          {siteName}
        </span>
      )}
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

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
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
        <details className="group relative lg:hidden">
          <summary
            className="flex h-11 w-11 list-none cursor-pointer items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 [&::-webkit-details-marker]:hidden"
            aria-label="Open menu"
          >
            <MenuIcon className="size-5" />
          </summary>

          <div className="absolute left-0 top-[calc(100%+0.5rem)] z-drawer w-mobile-drawer max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <Link href="/" className="group flex items-center gap-2.5">
                <SiteLogo siteName={siteName} logoUrl={logoUrl} compact />
                <span className="text-base font-bold tracking-heading text-slate-900">
                  {siteName}
                </span>
              </Link>
            </div>

            <nav className="max-h-[min(60vh,24rem)] overflow-y-auto px-3 py-3">
              <NavLinks links={navLinks} variant="mobile" />
            </nav>

            <div className="border-t border-gray-100 px-4 py-4">
              <form
                action="/search"
                method="get"
                className="flex items-center gap-2"
              >
                <input
                  type="search"
                  name="q"
                  enterKeyHint="search"
                  inputMode="search"
                  placeholder={searchPlaceholder}
                  aria-label="Search"
                  className="input-field flex-1 rounded-xl border-gray-200 focus:border-brand-400 focus:ring-brand-400/20"
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500 text-white transition-colors hover:bg-brand-600"
                >
                  <SearchIcon className="size-4" />
                </button>
              </form>
            </div>
          </div>
        </details>

        <Link
          href="/"
          aria-label={siteName}
          className="group flex shrink-0 items-center gap-3"
        >
          <SiteLogo siteName={siteName} logoUrl={logoUrl} />
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-7 lg:flex">
          <NavLinks links={navLinks} variant="desktop" />
        </nav>

        <form
          action="/search"
          method="get"
          className="ml-auto hidden items-center overflow-hidden rounded-full border border-gray-200 bg-white lg:flex"
        >
          <input
            type="search"
            name="q"
            placeholder={searchPlaceholder}
            aria-label="Search"
            className="w-search-input px-4 py-2 text-sm-plus text-slate-700 outline-none placeholder:text-gray-400"
          />
          <button
            type="submit"
            aria-label="Search"
            className="btn-search-submit px-3 py-2"
          >
            <SearchIcon className="size-3.5 text-white" />
          </button>
        </form>

        <Link
          href="/search"
          aria-label="Search"
          className="ml-auto flex h-11 w-11 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 lg:hidden"
        >
          <SearchIcon className="size-5" />
        </Link>
      </div>
    </header>
  );
}
