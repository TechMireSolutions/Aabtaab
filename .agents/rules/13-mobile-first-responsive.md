---
trigger: glob
glob: **/*.{tsx,css}
description: Mobile-first responsive layout — breakpoints, touch, safe areas, overflow, and viewport UX
---

# Mobile-First Responsive

**Tokens / utilities:** rule `02-tailwind-design-system` · **UX patterns:** rule `14-ui-ux-best-practices` · **Skill:** `mobile-responsive-ux`

Build **mobile first**, then enhance at `sm` / `md` / `lg` / `xl`. Never design desktop and “shrink”. Preserve Aabtaab shells and `@utility` classes — do not invent a parallel layout system.

## Breakpoints & layout

* Default styles = **phone** (~320–390 CSS px). Add complexity only at larger breakpoints.
* Prefer Tailwind responsive prefixes (`sm:`, `md:`, `lg:`) over custom media queries.
* Use `container-page` / `container-content` / `container-narrow` / `container-wide` / `container-hero` — never hand-roll `max-w-* mx-auto px-*`.
* Stack by default (`flex-col` / single column grids); introduce multi-column only from `md:` / `lg:` when content needs it.
* Avoid fixed widths that overflow small screens. Prefer `%`, `min-w-0`, `max-w-*`, and fluid type utilities (`heading-*`, `text-lead`).
* **No horizontal page scroll.** Tables/code/wide media: wrap in `overflow-x-auto` (e.g. `table-shell`) or reflow.

## Touch & interaction

* Interactive targets ≈ **44×44px** on mobile (`min-h-11` / `min-w-11` / `size-11` patterns already used in chips/icons).
* Space adjacent tap targets — avoid dense icon rows that cause mis-taps.
* Do not rely on hover alone; every hover affordance needs a touch/keyboard equivalent (visible focus, tap state, or always-visible control).
* Prefer tap-friendly controls over hover menus on small viewports (existing mobile drawer pattern: `mobile-nav-overlay` / `mobile-nav-panel`).
* Respect `safe-area-inset-*` for notches/home indicators — use existing `pb-fab-safe`, `scroll-mt-header`, FAB positioning, and header scroll padding.

## Typography & forms on small screens

* Body/UI text must remain readable without pinch-zoom.
* Form inputs/selects/textareas: **≥16px** on mobile (`input-field`) to prevent iOS focus zoom.
* Long words, emails, URLs: allow wrap (`break-words` / overflow strategies) — never clip essential copy.
* Keep line length comfortable in prose columns (`container-content`, `max-w-copy`).

## Media & performance on mobile

* Always set accurate `sizes` on `next/image`. Hidden-on-mobile images: `sizes="(max-width: 768px) 0px, …"`.
* Prefer full-bleed or container-width heroes with stable aspect utilities (`media-hero`, `min-h-hero*`) — reserve space to prevent CLS.
* One LCP image per route (`priority` + `fetchPriority="high"`); lazy-load the rest.
* Do not ship desktop-only carousels that trap horizontal scroll without clear affordances.

## Chrome, sticky UI & viewport

* Account for sticky header (`h-header`, `sticky-below-header`, `scroll-mt-header`) when placing in-page anchors.
* WhatsApp FAB: keep `pb-fab-safe` on `<main>` so CTAs/footer aren’t covered.
* Sticky bars must not obscure primary content or focusable controls.
* Drawers/modals: trap focus, Escape to close, restore focus; lock background scroll while open.

## Content priority

* Do **not** hide essential content on mobile (`display: none` of primary CTA, contact paths, legal links, or core nav destinations).
* Progressive disclosure is OK for secondary chrome (e.g. collapse nav into menu) — destinations must remain reachable.
* Prefer fewer, clearer sections on small screens over dense multi-widget first viewports.

## Verify

* Manually check ~375px and ~390px widths plus `md` / `lg`.
* Run Playwright **mobile-chrome** (Pixel 7) when UI/nav/forms change: `npm run test:e2e`.
* Confirm no horizontal overflow, usable tap targets, and keyboard path for open/close menus.
