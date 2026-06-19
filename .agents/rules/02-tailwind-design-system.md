---
trigger: glob
glob: **/*.{tsx,css}
description: Tailwind v4 design system — tokens, @utility classes, pure utility styling
---

# Tailwind Design System

**Source of truth:** `app/globals.css` (`@theme` + `@utility`).

## Non-negotiable

1. **Pure Tailwind utilities** in components — no CSS modules, no styled-components.
2. **`brand-*` for brand UI** — not raw `cyan-*`.
3. **No arbitrary pixels** (`text-[13px]`, `tracking-[0.18em]`, `shadow-[0_4px_...]`) when a token or `@utility` exists.
4. **No inline `style={}`** for colors, typography, or shadows.
5. **Extend `globals.css` first** for patterns used 2+ times — add `@theme` or `@utility`, not copy-paste classes.

## Prefer these utilities

| Category | Classes |
|----------|---------|
| Layout | `container-page`, `container-narrow`, `container-content`, `section-y`, `section-muted`, `h-header`, `scroll-mt-header` |
| Type | `text-eyebrow`, `eyebrow-line`, `heading-page`, `heading-section`, `text-lead`, `text-body-muted`, `text-caption`, `link-brand` |
| UI | `btn-primary`, `btn-secondary`, `input-field`, `card-interactive`, `badge-pill`, `empty-state` |
| FX | `bg-dot-grid`, `bg-hero-glow`, `link-underline`, `shadow-brand-sm` |

## Typography tokens

`text-2xs`, `text-xs-plus`, `text-sm-plus`, `text-base-plus`, `text-lg-plus`, `text-hero`
`tracking-eyebrow`, `tracking-kicker`, `tracking-heading`

## Class order

layout → spacing → typography → visual (bg/border/shadow) → interactive (hover/focus)

## UI tone (matches existing site)

- Clean, readable, mobile-first — not glassmorphism-heavy or one-off animation spam.
- Motion: use theme animations (`animate-fade-up`, `animate-delay-*`) or existing hover utilities on buttons/cards.

## Examples

```tsx
// ❌ BAD
<p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-cyan-600">

// ✅ GOOD
<p className="text-eyebrow flex items-center gap-2">
  <span className="eyebrow-line" />Label
</p>
```
