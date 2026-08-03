"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import dynamic from "next/dynamic";
import NavLinks from "@/components/layout/NavLinks";
import MobileNavSidebarLoader from "@/components/layout/MobileNavSidebarLoader";
import SiteBrandLogo from "@/components/layout/SiteBrandLogo";
import { DEFAULT_SITE_NAME } from "@/lib/constants";
import type { NavItem } from "@/types/site-navigation";

const SearchPalette = dynamic(() => import("@/components/layout/SearchPalette"), {
  ssr: false,
});

interface HeaderProps {
  siteName?: string;
  logoUrl?: string | null;
  /** Pre-resolved on the server via `buildHeaderNavLinks`. */
  navLinks: NavItem[];
}

export default function Header({
  siteName = DEFAULT_SITE_NAME,
  logoUrl,
  navLinks,
}: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const desktopNavLinks = navLinks.filter((item) => !/donate/i.test(item.label));

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
        className={`sticky top-0 z-50 border-b border-gray-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 shadow-header backdrop-blur-md transition-all duration-300 ${scrolled ? "py-0.5 bg-white/96 dark:bg-slate-950/96" : ""
          }`}
      >
        <div
          className={`container-page flex items-center gap-2 lg:gap-8 transition-all duration-300 ${scrolled ? "h-14" : "h-header"
            }`}
        >
          <Link
            href="/"
            aria-label={siteName}
            className="group flex shrink-0 items-center gap-3"
          >
            <SiteBrandLogo
              siteName={siteName}
              logoUrl={logoUrl}
              variant="header"
              priority
            />
          </Link>

          <MobileNavSidebarLoader
            siteName={siteName}
            logoUrl={logoUrl}
            navLinks={navLinks}
            onSearchClick={() => setSearchOpen(true)}
          />



          <nav
            aria-label="Main navigation"
            className="hidden flex-1 items-center justify-center gap-7 lg:flex"
          >
            <NavLinks links={desktopNavLinks} variant="desktop" />
          </nav>

          <Link
            href="/donate"
            className="ml-auto hidden items-center gap-2 rounded-full bg-brand-600 px-5 py-2 text-sm-plus font-semibold text-white shadow-brand-sm animate-donate-glow transition-all duration-200 hover:bg-brand-700 hover:shadow-brand-lg hover:scale-105 active:scale-95 lg:inline-flex"
          >
            Donate
          </Link>

          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            className="hidden lg:flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-slate-600 transition-colors hover:border-gray-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-700"
          >
            <Search className="size-5" aria-hidden="true" />
          </button>
        </div>
      </header>
      <SearchPalette isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
