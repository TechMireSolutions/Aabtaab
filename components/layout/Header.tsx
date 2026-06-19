"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Search, Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
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

export default function Header({
  darulQuranUrl,
  siteName = DEFAULT_SITE_NAME,
  logoUrl,
  navItems,
  searchPlaceholder = "Search the site…",
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", fn, { passive: true });
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const navLinks: NavItem[] = (() => {
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
  })();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
      setMenuOpen(false);
      setSearchOpen(false);
    }
  }

  return (
    <>
      {/* ── Desktop header ── */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-transparent bg-white/95 shadow-header backdrop-blur-md"
            : "bg-white border-b border-gray-200"
        }`}
      >
        <div className="container-page flex h-header items-center gap-2 lg:gap-8">
          {/* Mobile menu — left */}
          <button
            type="button"
            className="lg:hidden flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100"
            onClick={() => {
              setMenuOpen(true);
              setSearchOpen(false);
            }}
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <Menu size={20} />
          </button>

          {/* Logo + site name */}
          <Link
            href="/"
            aria-label={siteName}
            className="shrink-0 flex items-center gap-3 group"
          >
            <div className="size-logo rounded-full overflow-hidden border-2 border-brand-400 shrink-0 transition-transform duration-200 group-hover:scale-105">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={siteName}
                  width={42}
                  height={42}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-brand-100 to-brand-50 flex items-center justify-center text-lg select-none">
                  ⛵
                </div>
              )}
            </div>
            <span className="hidden text-lg-plus font-bold tracking-heading text-slate-900 md:block">
              {siteName}
            </span>
          </Link>

          {/* Nav */}
          <nav className="hidden lg:flex flex-1 items-center justify-center gap-7">
            {navLinks.map(({ label, href, external }) => {
              const isActive =
                href !== "#" &&
                (pathname === href ||
                  (href !== "/" && pathname.startsWith(href + "/")));
              return (
                <Link
                  key={label}
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className={`link-underline text-sm-plus font-medium whitespace-nowrap transition-colors duration-150
                    ${isActive ? "text-brand-600 active" : "text-gray-600 hover:text-slate-900"}`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Search — desktop */}
          <div className="hidden lg:flex items-center ml-auto">
            {searchOpen ? (
              <form
                onSubmit={handleSearch}
                className="animate-scale-in flex items-center overflow-hidden rounded-full border border-brand-400 shadow-focus-brand"
              >
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onBlur={() => {
                    if (!query) setSearchOpen(false);
                  }}
                  placeholder={searchPlaceholder}
                  className="w-search-input bg-white px-4 py-2 text-sm-plus text-slate-700 outline-none placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="btn-search-submit px-3 py-2"
                >
                  <Search size={13} className="text-white" strokeWidth={2.5} />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Open search"
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-brand-400 hover:text-brand-600 transition-all duration-200"
              >
                <Search size={15} strokeWidth={2} />
              </button>
            )}
          </div>

          {/* Mobile search */}
          <div className="lg:hidden ml-auto flex items-center">
            <button
              type="button"
              onClick={() => {
                setSearchOpen((open) => !open);
                setMenuOpen(false);
              }}
              aria-label="Open search"
              aria-expanded={searchOpen}
              className="flex h-11 w-11 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100"
            >
              <Search size={20} />
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="lg:hidden border-t border-gray-100 px-4 py-3 bg-white">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <input
                autoFocus
                type="search"
                enterKeyHint="search"
                inputMode="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                aria-label="Search articles"
                className="input-field flex-1 rounded-xl border-gray-200 focus:border-brand-400 focus:ring-brand-400/20"
              />
              <button
                type="submit"
                aria-label="Search"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500 text-white transition-colors hover:bg-brand-600"
              >
                <Search size={16} strokeWidth={2.5} />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* ── Mobile menu ── */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-drawer-overlay bg-slate-900/50 backdrop-blur-sm lg:hidden
          transition-opacity duration-300
          ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />

      {/* Slide-in panel (from left) */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-mobile-drawer z-drawer bg-white lg:hidden flex flex-col
        shadow-2xl transition-transform duration-300 ease-drawer
        ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2.5"
          >
            <div className="size-logo rounded-full overflow-hidden border-2 border-brand-400">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={siteName}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-brand-100 to-brand-50 flex items-center justify-center select-none">
                  ⛵
                </div>
              )}
            </div>
            <span className="text-base font-bold tracking-heading text-slate-900">
              {siteName}
            </span>
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="w-11 h-11 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          {navLinks.map(({ label, href, external }: NavItem) => {
            const isActive =
              href !== "#" &&
              (pathname === href ||
                (href !== "/" && pathname.startsWith(href + "/")));
            return (
              <Link
                key={label}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                onClick={() => setMenuOpen(false)}
                className={`mb-0.5 flex items-center rounded-xl px-3 py-3 text-sm-plus font-medium transition-all duration-150
                  ${
                    isActive
                      ? "bg-brand-50 text-brand-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-slate-900"
                  }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile search */}
        <div className="px-5 pb-8 pt-3 border-t border-gray-100 shrink-0">
          <form
            onSubmit={handleSearch}
            className="flex items-center overflow-hidden rounded-xl border border-gray-200 transition-all duration-200 focus-within:border-brand-500 focus-within:shadow-focus-brand"
          >
            <input
              type="search"
              enterKeyHint="search"
              inputMode="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              aria-label="Search articles"
              className="flex-1 px-4 py-3 text-base outline-none text-slate-700 placeholder:text-gray-400 bg-white"
            />
            <button
              type="submit"
              aria-label="Search"
              className="btn-search-submit min-touch px-4 py-3"
            >
              <Search size={14} className="text-white" strokeWidth={2.5} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
