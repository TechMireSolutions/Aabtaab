"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import NavLinks from "@/components/layout/NavLinks";
import type { NavItem } from "@/types/site-navigation";

interface MobileNavSidebarProps {
  siteName: string;
  logoUrl?: string | null;
  navLinks: NavItem[];
  searchPlaceholder?: string;
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

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

export default function MobileNavSidebar({
  siteName,
  logoUrl,
  navLinks,
  searchPlaceholder = "Search the site…",
}: MobileNavSidebarProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerId = useId();
  const pathname = usePathname();

  const close = useCallback(() => setOpen(false), []);
  const openDrawer = useCallback(() => setOpen(true), []);

  const closeAndFocusTrigger = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus({ preventScroll: true });
  }, []);

  // Close drawer after client-side navigation (link clicks use onNavigate).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- dismiss overlay when route changes
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeAndFocusTrigger();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, closeAndFocusTrigger]);

  useEffect(() => {
    if (!open) return;
    const focusTarget = panelRef.current?.querySelector<HTMLElement>(
      'input[type="search"]',
    );
    focusTarget?.focus({ preventScroll: true });
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={drawerId}
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        onClick={() => (open ? closeAndFocusTrigger() : openDrawer())}
        className="flex h-11 w-11 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
      >
        {open ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="mobile-nav-overlay"
            onClick={closeAndFocusTrigger}
          />

          <aside
            ref={panelRef}
            id={drawerId}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="mobile-nav-panel"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-4 py-3.5 pt-[max(0.875rem,env(safe-area-inset-top))]">
              <Link
                href="/"
                onClick={closeAndFocusTrigger}
                className="group flex min-h-11 min-w-0 flex-1 items-center gap-2.5 rounded-lg pr-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              >
                <div className="size-10 shrink-0 overflow-hidden rounded-full border-2 border-brand-400 transition-transform duration-200 group-hover:scale-105">
                  {logoUrl ? (
                    <Image
                      src={logoUrl}
                      alt=""
                      width={40}
                      height={40}
                      sizes="40px"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-brand-100 to-brand-50 text-lg select-none">
                      ⛵
                    </div>
                  )}
                </div>
                <span className="truncate text-base font-bold tracking-heading text-slate-900">
                  {siteName}
                </span>
              </Link>
              <button
                type="button"
                onClick={closeAndFocusTrigger}
                aria-label="Close navigation menu"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
              >
                <CloseIcon className="size-5" />
              </button>
            </div>

            <div className="shrink-0 border-b border-gray-100 bg-slate-50/80 px-4 py-3">
              <form action="/search" method="get" role="search">
                <label htmlFor={`${drawerId}-search`} className="sr-only">
                  Search
                </label>
                <div className="relative">
                  <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-500" />
                  <input
                    id={`${drawerId}-search`}
                    type="search"
                    name="q"
                    enterKeyHint="search"
                    inputMode="search"
                    placeholder={searchPlaceholder}
                    autoComplete="off"
                    className="input-field w-full rounded-xl border-gray-200 bg-white py-3 pl-10 pr-4 focus:border-brand-600 focus:ring-brand-600/30"
                  />
                </div>
              </form>
            </div>

            <nav
              aria-label="Main navigation"
              className="flex-1 overflow-y-auto overscroll-contain px-3 py-3"
            >
              <NavLinks
                links={navLinks}
                variant="mobile"
                onNavigate={close}
              />
            </nav>

            <div className="shrink-0 border-t border-gray-100 bg-white px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <Link
                href="/donate"
                onClick={closeAndFocusTrigger}
                className="btn-primary w-full justify-center"
              >
                Donate
              </Link>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
