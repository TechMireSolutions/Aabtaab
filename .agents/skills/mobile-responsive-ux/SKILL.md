---
name: mobile-responsive-ux
description: >-
  Mobile-first responsive layout and modern UI/UX workflows for Aabtaab. Use when
  building or refactoring pages, components, navigation, forms, or CSS for small
  viewports, touch targets, hierarchy, or feedback states. Rules: 13-mobile-first-responsive,
  14-ui-ux-best-practices, 02-tailwind-design-system.
---

# Mobile-First Responsive UI/UX

**Rules:** `.cursor/rules/13-mobile-first-responsive.mdc` · `.cursor/rules/14-ui-ux-best-practices.mdc`  
**Styling:** skill `tailwind-ui` · **Source:** `app/globals.css`

## Workflow

1. **Read** existing page/shell/section before inventing layout — compose `PageHeader`, heroes, content sections, footers.
2. **Style mobile first** (base = `< 640px`), then layer `sm:` (640) → `md:` (768) → `lg:` (1024) → `xl:` (1280).
3. **Fluid only** — no fixed px page widths; use `container-*`, `%`/`rem`/`max-w-*`, Grid/Flex, `min-w-0`.
4. **Nav:** below `md` use hamburger + drawer (`mobile-nav-*`); desktop bar from `md:` when that is the Header pattern.
5. **Touch:** ≥44×44px targets; inputs ≥16px (`input-field`); safe areas for FAB/header.
6. **UX:** one job per section, one primary CTA, full feedback states, labels + focus.
7. **Verify** at **375 / 768 / 1440** (+ Playwright `mobile-chrome`).

## Breakpoints (quick ref)

| Prefix | Min-width | Role |
|--------|-----------|------|
| _(base)_ | `< 640px` | Default mobile |
| `sm:` | `640px` | Large phone / small tablet |
| `md:` | `768px` | Tablet; desktop nav threshold |
| `lg:` | `1024px` | Laptop |
| `xl:` | `1280px` | Large desktop |

## Quick checklist

### Responsive layout
- [ ] No horizontal page overflow (`max-w-full`, `min-w-0`, no `w-[1200px]`-style chrome)
- [ ] Columns stack on base; multi-column from `md:` / `lg:` only when needed
- [ ] Containers from `@utility` — not ad-hoc `max-w-* mx-auto px-*`
- [ ] Sticky header / FAB don’t cover CTAs (`scroll-mt-header`, `pb-fab-safe`)
- [ ] Tables: `table-shell` / `overflow-x-auto` **or** card reflow on small screens
- [ ] Images/video constrained (`max-w-full` / `next/image` + aspect utilities)

### Touch & a11y
- [ ] Tap targets ≥ 44×44px on mobile
- [ ] Inputs ≥16px (`input-field`)
- [ ] Nav < 768px is drawer/hamburger — not crushed desktop links
- [ ] Keyboard + Escape for drawers/menus; `aria-label` on icon buttons
- [ ] `prefers-reduced-motion` / `motion-safe:` for decorative motion

### UI/UX
- [ ] One `h1`; clear hierarchy; one primary CTA per section
- [ ] Idle / loading / success / error / empty handled without layout jump
- [ ] Essential content not hidden on mobile
- [ ] Empty states offer a next step
- [ ] No text overlap/clip at 375 / 768 / 1440

## Common fixes

| Problem | Fix |
|---------|-----|
| Desktop-first grid crushed on phone | Base `grid-cols-1`; `md:grid-cols-2` / `lg:grid-cols-3` |
| Fixed `w-[1200px]` overflow | `w-full max-w-*` / `container-*` |
| Hover-only reveal | Always-visible control or tap toggle |
| iOS input zoom | Ensure `input-field` / ≥16px font |
| FAB covers footer CTA | `pb-fab-safe` on `<main>`; footer Stay-connected band also uses `pb-fab-safe` under the CTA on small screens |
| Wide table blows layout | `table-shell` + `overflow-x-auto` or stacked cards |
| Competing primary buttons | One `btn-primary`; rest secondary/ghost |
| Soft empty page | Real empty state + links (`SearchEmptyState` / `empty-state`) |
| Dense footer link rows | `footer-nav-link` / `footer-contact-link` (`min-h-11` on mobile) |

## Related skills

- `tailwind-ui` — tokens and `@utility` authoring
- `content-sections` — compose CMS sections/shells
- `contact-form-api` — form feedback + validation UX
- `testing-vitest-playwright` — desktop + Pixel 7 E2E

## Verify

```bash
npm run lint
npm run test:e2e   # includes mobile-chrome
```

Manual: **375px**, **768px**, **1440px** — no horizontal scrollbar, no clipped text, touch-usable controls.
