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

1. Read `app/globals.css` for current `@theme` / `@utility` definitions.
2. Search components for an existing pattern before adding classes.
3. Replace arbitrary values and `cyan-*` with tokens / `brand-*`.
4. Add new `@utility` in `globals.css` only when a pattern repeats 2+ times.
5. Run `npm run lint` after CSS or widespread class changes.

## Quick reference

`container-page` · `section-y` · `text-eyebrow` · `heading-section` · `btn-primary` · `input-field` · `card-interactive`

See rule file for full utility table and examples.
