---
trigger: glob
glob: **/*.{tsx,css}
description: Tailwind v4 design system — tokens, @utility classes, pure utility styling
---

# Tailwind Design System

**Source of truth:** `app/globals.css` (`@theme` + `@utility`). Read it before adding or changing styles.

## Non-negotiable

1. **Pure Tailwind utilities** in components — no CSS modules, no styled-components.
2. **`brand-*` for brand UI** — not raw `cyan-*`. **`gold-*`** for donate/sacred accent UI — not `amber-*`.
3. **No arbitrary values** (`text-[13px]`, `w-[180px]`, `top-[68px]`, `shadow-[…]`, `scale-[1.06]`) when a token or `@utility` exists.
4. **No inline `style={}`** for colors, typography, shadows, or animation delays — use `animate-delay-*` utilities.
5. **Extend `globals.css` first** for patterns used **2+ times** — add `@theme` or `@utility`, not copy-paste classes.
6. **Use shadow tokens** — `shadow-card`, `shadow-card-hover`, `shadow-brand-*` — not raw `shadow-sm` / `shadow-md` / `shadow-lg` on site UI.
7. **Use container utilities** — never `max-w-7xl mx-auto px-4 sm:px-6` inline.

## Layout & sections

| Utility | Use for |
|---------|---------|
| `container-page` | Default page width (`max-w-7xl`) |
| `container-narrow` | Wider content blocks (`max-w-5xl`) |
| `container-content` | Article/prose width (`max-w-3xl`) |
| `container-wide` | Contact-style grids (`max-w-6xl`) |
| `container-hero` | Centered course hero shell |
| `section-y` | Standard section padding (`py-8 sm:py-12`) |
| `section-muted` | Muted background section |
| `section-y-lg` | Carousel / article bands (`py-10 md:py-16`) |
| `section-y-xl` | Large homepage bands (`py-14 md:py-20`) |
| `section-y-cta` | Dark CTA bands (`py-16 sm:py-20`) |
| `section-header-py` | Page header vertical padding |
| `h-header` / `scroll-mt-header` | Header height & anchor offset |
| `sticky-below-header` | Sticky bars under header (posts, events) |
| `pb-fab-safe` | Main padding when WhatsApp FAB is visible |
| `fab-safe` | Fixed FAB position with safe-area |
| `min-h-catalog` / `min-h-hero*` | Hero & catalog min-heights |

## Typography

| Utility | Use for |
|---------|---------|
| `text-eyebrow` + `eyebrow-line` | Brand section labels |
| `text-eyebrow-gold` + `eyebrow-line-gold` | Donate / sacred accent labels |
| `heading-page` / `heading-section` / `heading-section-lg` | Page & section titles |
| `heading-col` | Footer / contact column labels |
| `text-lead` / `text-body-muted` / `text-caption` | Subtitles & supporting copy |
| `link-brand` | Inline “view all” links |
| `max-w-copy` | Standard `max-w-2xl` prose width |
| `max-w-hero-copy` / `max-w-hero-lead` / `max-w-tagline` | Hero & footer widths |

**Scale tokens:** `text-2xs`, `text-xs-plus`, `text-sm-plus`, `text-base-plus`, `text-lg-plus`, `text-hero`  
**Tracking:** `tracking-eyebrow`, `tracking-kicker`, `tracking-heading`

## Buttons & forms

| Utility | Use for |
|---------|---------|
| `btn-primary` / `btn-secondary` | Standard CTAs |
| `btn-pill-accent` / `btn-pill-ghost` | Dark hero CTAs |
| `btn-paypal` | PayPal donate (third-party brand hex — exception) |
| `btn-search-submit` | Header/drawer search submit |
| `input-field` | All text inputs & search fields |

## Surfaces & cards

| Utility | Use for |
|---------|---------|
| `card-surface` | Static cards, panels, floating badges |
| `card-interactive` | Hover-lift catalog cards |
| `card-hover-lift` | Subtle lift on `card-surface` (donate causes) |
| `card-contact` | Contact info rows |
| `card-quote` | Donate quote block |
| `table-shell` | Pricing tables wrapper |
| `badge-pill` | Category/status pills |
| `badge-enrolling` | Hero “Enrolling now” chip |
| `badge-hero` / `badge-hero-muted` | Course/service hero meta |
| `badge-trust` | Trust checkmark badge |
| `empty-state` | Empty search/catalog states |

## Media & imagery

| Utility | Use for |
|---------|---------|
| `media-hero` | Post/event featured images (`aspect-video`) |
| `media-frame` | Square CMS images (Why Us) |
| `media-placeholder` | Missing image placeholder |
| `hover-scale-image` | Card image hover zoom |
| `opacity-hero-image` | Dark hero background images |
| `size-logo` / `size-logo-lg` | Header/footer logos |
| `w-carousel-card*` | Carousel card widths |

## Chrome & misc

| Utility | Use for |
|---------|---------|
| `icon-btn-subtle` | Footer social icon buttons |
| `chip-outline` / `chip-outline-sm` | Footer/contact text chips |
| `check-icon-sm` | Why-us checklist icons |
| `link-underline` | Header nav active/hover |
| `bg-dot-grid` / `bg-hero-glow` / `hero-glow-offset` | Decorative backgrounds |
| `w-mobile-drawer` / `z-drawer` / `z-drawer-overlay` / `ease-drawer` | Mobile menu |
| `size-fab` / `bg-whatsapp` / `shadow-whatsapp` | WhatsApp FAB |
| `animate-fade-up` + `animate-delay-*` | Staggered hero entrance (no inline delay) |

## Class order

layout → spacing → typography → visual (bg/border/shadow) → interactive (hover/focus)

## Accepted exceptions

| Pattern | Reason |
|---------|--------|
| `PreviewBanner` `amber-*` | Dev-only draft banner |
| ContactForm `-left-[9999px]` | Honeypot a11y standard |
| `btn-paypal` hex colors | PayPal brand requirement |
| Semantic status colors (`red-*` cancelled badge) | Meaning, not brand |

## Examples

```tsx
// ❌ BAD — arbitrary, wrong palette, inline delay
<div className="max-w-2xl mx-auto px-4 py-16 shadow-md" style={{ animationDelay: "200ms" }}>
  <p className="text-[13px] tracking-[0.18em] text-cyan-600" />

// ✅ GOOD
<div className="container-content section-y-cta">
  <p className="text-eyebrow motion-safe:animate-fade-up motion-safe:animate-delay-200 flex items-center gap-2">
    <span className="eyebrow-line" />Label
  </p>
```

```tsx
// ❌ BAD — raw card + shadow
<div className="rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md" />

// ✅ GOOD
<div className="card-surface card-hover-lift" />
```
