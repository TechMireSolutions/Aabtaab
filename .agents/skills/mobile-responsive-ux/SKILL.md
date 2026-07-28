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
2. **Style mobile first** (base classes), then layer `sm:` / `md:` / `lg:`.
3. **Use design-system utilities** (`container-*`, `section-y*`, `btn-*`, `input-field`, `card-*`, `pb-fab-safe`) — see rule `02`.
4. **Check touch:** ~44px targets, no hover-only actions, safe areas for FAB/header.
5. **Check UX:** one job per section, one primary CTA, full feedback states, labels + focus.
6. **Verify** at ~375px width and with Playwright `mobile-chrome`.

## Quick checklist

### Responsive layout
- [ ] No horizontal page overflow
- [ ] Columns stack on small screens; multi-column from `md:`/`lg:` only when needed
- [ ] Containers from `@utility` — not ad-hoc `max-w-* mx-auto px-*`
- [ ] Sticky header / FAB don’t cover CTAs (`scroll-mt-header`, `pb-fab-safe`)
- [ ] Tables/media scroll or reflow safely (`table-shell`, `overflow-x-auto`)

### Touch & a11y
- [ ] Tap targets ≈ 44×44px on mobile
- [ ] Inputs ≥16px (`input-field`)
- [ ] Keyboard + Escape for drawers/menus; `aria-label` on icon buttons
- [ ] `prefers-reduced-motion` / `motion-safe:` for decorative motion

### UI/UX
- [ ] One `h1`; clear hierarchy; one primary CTA per section
- [ ] Idle / loading / success / error / empty handled without layout jump
- [ ] Essential content not hidden on mobile
- [ ] Empty states offer a next step

## Common fixes

| Problem | Fix |
|---------|-----|
| Desktop-first grid crushed on phone | Base `grid-cols-1`; `md:grid-cols-2` / `lg:grid-cols-3` |
| Hover-only reveal | Always-visible control or tap toggle |
| iOS input zoom | Ensure `input-field` / ≥16px font |
| FAB covers footer CTA | `pb-fab-safe` on `<main>` |
| Competing primary buttons | One `btn-primary`; rest secondary/ghost |
| Soft empty page | Real empty state + links (`SearchEmptyState` / `empty-state`) |

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
