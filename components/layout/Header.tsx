"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import dynamic from "next/dynamic";
import NavLinks from "@/components/layout/NavLinks";
import MobileNavSidebarLoader from "@/components/layout/MobileNavSidebarLoader";

import { DEFAULT_SITE_NAME } from "@/lib/constants";
import type { NavItem } from "@/types/site-navigation";

const SearchPalette = dynamic(() => import("@/components/layout/SearchPalette"), {
  ssr: false,
});

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
  { label: "Dar ul Quran", href: "/dar-ul-quran" },
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
      href: darulQuranUrl || "/dar-ul-quran",
      external: !!darulQuranUrl,
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
            priority
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-brand-100 to-brand-50 text-lg select-none">
            ⛵
          </div>
        )}
      </div>
      <span className="hidden text-lg-plus font-bold tracking-heading text-slate-900 dark:text-slate-50 md:block">
        {siteName}
      </span>
    </>
  );
}



export default function Header({
  darulQuranUrl,
  siteName = DEFAULT_SITE_NAME,
  logoUrl,
  navItems,
}: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navLinks = buildNavLinks(navItems, darulQuranUrl);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    
    function handleScroll() {
      setScrolled(window.scrollY > 15);
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b border-gray-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 shadow-header backdrop-blur-md transition-all duration-300 ${
          scrolled ? "py-0.5 shadow-md bg-white/96 dark:bg-slate-950/96" : ""
        }`}
      >
        <div
          className={`container-page flex items-center gap-2 lg:gap-8 transition-all duration-300 ${
            scrolled ? "h-14" : "h-header"
          }`}
        >
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

          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="ml-auto hidden items-center justify-between overflow-hidden rounded-full border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-sm-plus text-gray-400 dark:text-slate-500 lg:flex hover:border-gray-300 dark:hover:border-slate-700 w-search-input cursor-pointer"
          >
            <span>Search...</span>
            <kbd className="text-2xs rounded bg-slate-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-1.5 py-0.5">⌘K</kbd>
          </button>

          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            className="ml-auto flex h-11 w-11 items-center justify-center rounded-full text-gray-600 dark:text-slate-400 transition-colors hover:bg-gray-100 dark:hover:bg-slate-900 focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 lg:hidden cursor-pointer"
          >
            <Search className="size-5" aria-hidden="true" />
          </button>
        </div>
      </header>
      <SearchPalette isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
