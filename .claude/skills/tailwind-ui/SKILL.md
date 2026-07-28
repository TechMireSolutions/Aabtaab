---
name: tailwind-ui
description: >-
  Applies Aabtaab Tailwind v4 design system when styling components or pages.
  Use when editing TSX/CSS, className strings, or app/globals.css. Rule:
  02-tailwind-design-system.
---

# Tailwind UI

**Rule:** `.cursor/rules/02-tailwind-design-system.mdc` · **Source:** `app/globals.css`

## Workflow

1. **Read** `app/globals.css` — all `@theme` tokens and `@utility` classes live here.
2. **Search** existing components for the pattern before inventing new class strings.
3. **Prefer utilities** from the tables in the rule file over composing raw Tailwind.
4. **Replace violations:**
   - `cyan-*` → `brand-*`
   - `amber-*` (brand UI) → `gold-*`
   - `max-w-*xl mx-auto px-*` → `container-*`
   - `shadow-sm/md/lg` on site UI → `shadow-card` / `shadow-card-hover`
   - `style={{ animationDelay }}` → `animate-delay-*` on the element
   - Arbitrary sizes → matching `@utility` or `@theme` token
5. **Add `@utility`** in `globals.css` only when the same class string appears **2+ times**.
6. **Run** `npm run lint` (and `npm run build` for widespread CSS changes).
7. **Sync** agent config if rules/skills changed: `npm run sync:agents`

## Pick the right utility

| You need… | Use |
|-----------|-----|
| Page shell width | `container-page` |
| Article / prose column | `container-content` + `max-w-copy` |
| Section vertical rhythm | `section-y`, `section-y-lg`, `section-y-xl`, `section-y-cta` |
| Page header block | `section-header-py` on container |
| Sticky back-nav under header | `sticky-below-header` |
| Standard card | `card-surface` |
| Hover card (catalog) | `card-interactive` |
| Subtle card lift | `card-hover-lift` on `card-surface` |
| Featured image (post/event) | `media-hero` |
| Square CMS image | `media-frame` / `media-placeholder` |
| Pricing table wrapper | `table-shell` |
| Footer social icon | `footer-social-btn` (always-dark footer) or `icon-btn-subtle` on light surfaces |
| Footer/contact text link | `footer-contact-link` / `footer-nav-link` / `footer-legal-link`; contact page chips: `chip-outline` |
| Dark hero badges | `badge-hero` / `badge-hero-muted` |
| Soft notice chip | `badge-notice` |
| Logo sizing | `size-logo` / `size-logo-lg` |
| Donate/sacred accent | `text-eyebrow-gold` + `eyebrow-line-gold` |
| Hero stagger animation | `motion-safe:animate-fade-up` + `motion-safe:animate-delay-*` |
| WhatsApp FAB | `whatsapp-fab` (self-contained) + `pb-fab-safe` on `<main>` |

Never add uncapped infinite animations on LCP content. Respect `prefers-reduced-motion`.

## A11y & contrast (when styling)

- Keep `brand-*` / `gold-*` text on surfaces at WCAG 2.2 AA contrast.
- Do not remove `focus-visible` styles from interactive utilities.
- Prefer logical properties (`ps`/`pe`) for RTL text islands.
- Hover affordances need keyboard/touch equivalents.
- Form inputs ≥16px on mobile (avoid iOS zoom).
- For layout/touch/UX checklists, use skill **`mobile-responsive-ux`** (rules `13` + `14`).

## When to extend `globals.css`

Add `@theme` for:
- New brand/spacing/color tokens used in multiple utilities
- Third-party brand colors (e.g. `--color-whatsapp`)

Add `@utility` for:
- Repeated multi-class patterns (cards, chips, media frames, section padding variants)
- Layout widths tied to design (`w-search-input`, `w-mobile-drawer`)

Do **not** add utilities for one-off layouts or single-page decorations.

**Animation authoring rules:**
- CSS `animation` wins over `transition` on the same property — exclude animated properties from `transition` lists and document why.
- Use `translate: 0 0` identity base on any element with a hover/focus `translate` change (prevents stacking-context jump).
- To animate `width`/`height` to `auto`, use `calc-size(max-content, size + Xrem)` with an `inline-size: auto` fallback; scope `interpolate-size: allow-keywords` to that element.

## Shadow & motion rules

- Site cards/panels: `shadow-card`, hover `shadow-card-hover`
- Brand CTAs: `shadow-brand-sm`, `shadow-brand-lg`, `shadow-brand-band`
- Avoid Tailwind defaults `shadow-sm` / `shadow-md` / `shadow-lg` on production UI
- Motion: `animate-fade-up`, `animate-scale-in`, `animate-delay-75` … `animate-delay-600`
- Image hover: `hover-scale-image` (not `scale-[1.06]`)

## Full utility index

See `.cursor/rules/02-tailwind-design-system.mdc` for the complete categorized table.  
Always treat `app/globals.css` as authoritative if the rule and code diverge.
