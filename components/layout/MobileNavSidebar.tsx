"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import NavLinks from "@/components/layout/NavLinks";
import SiteBrandLogo from "@/components/layout/SiteBrandLogo";
import {
  TW_MOBILE_CLOSE_BTN,
  TW_MOBILE_HEADER,
  TW_MOBILE_MENU_TRIGGER,
  TW_MOBILE_NAV_SCROLL,
} from "@/components/layout/mobile-nav-classes";
import type { NavItem } from "@/types/site-navigation";

interface MobileNavSidebarProps {
  siteName: string;
  logoUrl?: string | null;
  navLinks: NavItem[];
  onSearchClick?: () => void;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function MobileNavSidebar({
  siteName,
  logoUrl,
  navLinks,
  onSearchClick,
}: MobileNavSidebarProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerId = useId();
  const titleId = `${drawerId}-title`;
  const pathname = usePathname();

  const close = useCallback(() => setOpen(false), []);

  const closeAndFocusTrigger = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- dismiss overlay when route changes
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const scrollY = window.scrollY;
    document.body.classList.add("mobile-menu-open");
    document.body.style.top = `-${scrollY}px`;

    return () => {
      document.body.classList.remove("mobile-menu-open");
      document.body.style.top = "";
      window.scrollTo(0, scrollY);
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
    if (!open || !panelRef.current) return;

    const panel = panelRef.current;
    const focusTarget = panel.querySelector<HTMLElement>(FOCUSABLE);
    focusTarget?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);

      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    panel.addEventListener("keydown", onKeyDown);
    return () => panel.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="lg:hidden ml-auto flex items-center gap-2">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={drawerId}
        aria-haspopup="dialog"
        aria-label="Open navigation menu"
        onClick={() => setOpen(true)}
        className={TW_MOBILE_MENU_TRIGGER}
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="mobile-nav-overlay motion-reduce:transition-none"
            onClick={closeAndFocusTrigger}
          />

          <aside
            ref={panelRef}
            id={drawerId}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="mobile-nav-panel motion-reduce:transition-none"
          >
            <div className={TW_MOBILE_HEADER}>
              <Link
                href="/"
                onClick={closeAndFocusTrigger}
                className="group flex min-h-11 min-w-0 flex-1 items-center gap-2.5 rounded-lg pe-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              >
                <SiteBrandLogo
                  siteName={siteName}
                  logoUrl={logoUrl}
                  variant="mobile"
                  labelId={titleId}
                />
              </Link>
              <div className="flex items-center gap-2">
                {onSearchClick && (
                  <button
                    type="button"
                    onClick={() => {
                      close();
                      onSearchClick();
                    }}
                    aria-label="Search"
                    className="flex size-11 items-center justify-center rounded-full text-gray-500 dark:text-slate-400 transition-colors hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
                  >
                    <Search className="size-5" aria-hidden="true" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={closeAndFocusTrigger}
                  aria-label="Close navigation menu"
                  className={TW_MOBILE_CLOSE_BTN}
                >
                  <X className="size-4.5" aria-hidden="true" />
                </button>
              </div>
            </div>

            <nav aria-label="Main navigation" className={TW_MOBILE_NAV_SCROLL}>
              <NavLinks links={navLinks} variant="mobile" onNavigate={close} />
            </nav>
          </aside>
        </>
      )}
    </div>
  );
}
