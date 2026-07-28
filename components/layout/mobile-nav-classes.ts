/**
 * Composed Tailwind class strings for the mobile navigation drawer.
 * Panel/overlay utilities: `mobile-nav-panel`, `mobile-nav-overlay` in app/globals.css.
 */

export const TW_MOBILE_HEADER =
  "flex shrink-0 items-center justify-between border-b border-gray-100 dark:border-slate-800 px-5 pb-4 pt-[max(1rem,env(safe-area-inset-top))]";

export const TW_MOBILE_NAV_SCROLL =
  "flex-1 overflow-y-auto overscroll-contain px-3 py-3 pb-[max(1rem,env(safe-area-inset-bottom))]";

export const TW_MOBILE_NAV_ROW =
  "flex min-h-11 items-center gap-2 rounded-xl py-2.5 ps-3 pe-3 text-sm-plus font-medium text-gray-700 dark:text-slate-300 transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600";

export const TW_MOBILE_NAV_ROW_ACTIVE =
  "border-s-2 border-brand-600 bg-brand-50 dark:bg-brand-900/40 font-semibold text-brand-800 dark:text-brand-400";

export const TW_MOBILE_CLOSE_BTN =
  "flex size-11 shrink-0 items-center justify-center rounded-full text-gray-500 dark:text-slate-400 transition-colors hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2";

export const TW_MOBILE_MENU_TRIGGER =
  "flex size-11 items-center justify-center rounded-full text-gray-600 dark:text-slate-400 transition-colors hover:bg-gray-100 dark:hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2";
