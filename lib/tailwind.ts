/**
 * Composed Tailwind class strings for the mobile navigation drawer.
 * Panel/overlay utilities: `mobile-nav-panel`, `mobile-nav-overlay` in app/globals.css.
 */

export const TW_MOBILE_HEADER =
  "flex shrink-0 items-center justify-between border-b border-gray-100 px-5 pb-4 pt-[max(1rem,env(safe-area-inset-top))]";

export const TW_MOBILE_SEARCH_STRIP =
  "shrink-0 space-y-2 border-b border-gray-100 bg-slate-50/60 px-5 py-3";

export const TW_MOBILE_SEARCH_LABEL =
  "text-2xs font-bold uppercase tracking-kicker text-gray-400";

export const TW_SEARCH_FORM_MOBILE =
  "flex overflow-hidden rounded-xl border border-gray-200 bg-white focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-600/30";

export const TW_MOBILE_SEARCH_INPUT =
  "min-h-11 min-w-0 flex-1 border-0 bg-transparent px-3 text-sm-plus text-slate-700 outline-none placeholder:text-gray-400";

export const TW_MOBILE_SEARCH_SUBMIT = "btn-search-submit shrink-0";

export const TW_MOBILE_NAV_SCROLL =
  "flex-1 overflow-y-auto overscroll-contain px-3 py-3 pb-[max(1rem,env(safe-area-inset-bottom))]";

export const TW_MOBILE_NAV_ROW =
  "flex min-h-11 items-center gap-2 rounded-xl py-2.5 ps-3 pe-3 text-sm-plus font-medium text-gray-700 transition-colors duration-150 hover:bg-gray-50 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600";

export const TW_MOBILE_NAV_ROW_ACTIVE =
  "border-s-2 border-brand-600 bg-brand-50 font-semibold text-brand-800";

export const TW_MOBILE_CLOSE_BTN =
  "flex size-11 shrink-0 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2";

export const TW_MOBILE_MENU_TRIGGER =
  "flex size-11 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2";
