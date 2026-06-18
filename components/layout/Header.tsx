"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Search, Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

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
  { label: "Articles", href: "/articles" },
  { label: "Donate", href: "/donate" },
  { label: "About", href: "/about" },
];

export default function Header({
  darulQuranUrl,
  siteName = "Aabtaab",
  logoUrl,
  navItems,
  searchPlaceholder = "Search articles…",
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

  const navLinks: NavItem[] = navItems?.length
    ? navItems
    : [
        ...FALLBACK_NAV,
        { label: "Dar ul Quran", href: darulQuranUrl || "#", external: true },
      ];

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/articles?q=${encodeURIComponent(query.trim())}`);
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
            ? "bg-white/95 backdrop-blur-md shadow-[0_2px_20px_rgba(0,0,0,0.07)] border-b border-transparent"
            : "bg-white border-b border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-[68px] flex items-center gap-8">
          {/* Logo + site name */}
          <Link
            href="/"
            aria-label={siteName}
            className="shrink-0 flex items-center gap-3 group"
          >
            <div className="w-[42px] h-[42px] rounded-full overflow-hidden border-2 border-cyan-400 shrink-0 transition-transform duration-200 group-hover:scale-105">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={siteName}
                  width={42}
                  height={42}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-cyan-100 to-sky-100 flex items-center justify-center text-lg select-none">
                  ⛵
                </div>
              )}
            </div>
            <span className="font-bold text-[17px] text-slate-900 tracking-[-0.02em] hidden md:block">
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
                  className={`link-underline text-[13.5px] font-medium whitespace-nowrap transition-colors duration-150
                    ${isActive ? "text-cyan-600 active" : "text-gray-600 hover:text-slate-900"}`}
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
                className="flex items-center rounded-full overflow-hidden border border-cyan-400 shadow-[0_0_0_3px_rgba(8,145,178,0.12)] animate-scale-in"
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
                  className="px-4 py-2 text-[13px] outline-none w-[180px] text-slate-700 placeholder:text-gray-400 bg-white"
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="bg-cyan-500 hover:bg-cyan-600 transition-colors px-3 py-2 flex items-center self-stretch"
                >
                  <Search size={13} className="text-white" strokeWidth={2.5} />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Open search"
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-cyan-400 hover:text-cyan-600 transition-all duration-200"
              >
                <Search size={15} strokeWidth={2} />
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden ml-auto w-9 h-9 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* ── Mobile menu ── */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm lg:hidden
          transition-opacity duration-300
          ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />

      {/* Slide-in panel (from right) */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-[300px] z-[70] bg-white lg:hidden flex flex-col
        shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2.5"
          >
            <div className="w-[40px] h-[40px] rounded-full overflow-hidden border-2 border-cyan-400">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={siteName}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-cyan-100 to-sky-100 flex items-center justify-center select-none">
                  ⛵
                </div>
              )}
            </div>
            <span className="font-bold text-[16px] text-slate-900 tracking-[-0.02em]">
              {siteName}
            </span>
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
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
                className={`flex items-center px-3 py-3 rounded-xl text-[14.5px] font-medium transition-all duration-150 mb-0.5
                  ${
                    isActive
                      ? "bg-cyan-50 text-cyan-700"
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
            className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-cyan-500 focus-within:shadow-[0_0_0_3px_rgba(8,145,178,0.12)] transition-all duration-200"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="flex-1 px-4 py-3 text-[14px] outline-none text-slate-700 placeholder:text-gray-400 bg-white"
            />
            <button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-600 transition-colors px-4 py-3 flex items-center self-stretch"
            >
              <Search size={14} className="text-white" strokeWidth={2.5} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
