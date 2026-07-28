---
name: performance-optimization
description: >-
  Performance optimization, CWV, caching, and bundle size workflows. Use when optimizing
  image components, fonts, layout shifts, or managing ISR/SSG pages. Rule: 10-performance.
---

# Performance Optimization Workflow

**Rule:** `.cursor/rules/10-performance.mdc`

## Key Workflows

### 1. Images (`next/image`)
- Never use raw `<img>` for CMS/media — use `next/image` + Sanity helpers.
- Explicit dimensions or `fill` + stable aspect ratio (CLS).
- Correct `sizes`; hidden-on-mobile images: `sizes="(max-width: 768px) 0px, …"`.
- LCP hero: `priority` + `fetchPriority="high"` — **one** primary LCP image per route.

```tsx
<Image
  src={imageUrl}
  alt={altText}
  fill
  className="object-cover"
  sizes="100vw"
  priority
  fetchPriority="high"
/>
```

### 2. Centralized GROQ fetching & cache
- Queries in `sanity/lib/queries/`; app reads via `lib/cms/queries.ts` + `sanityFetch`.
- Selective projections only — never fetch whole documents for a card.
- Do not add `unstable_cache` outside `sanity/lib/fetch.ts`.
- PPR / `"use cache"` are **not** used — do not enable without an explicit migration plan.

### 3. Preventing layout shifts
- Reserve space with aspect utilities (`media-hero`, skeletons matching final size).
- Hydration widgets: same-dimension placeholders before mount.
- Fonts: `next/font` + `display: "swap"` in root layout only.
- Internal nav: `<Link>` prefetch.

### 4. CWV check (practical)
| Metric | Check |
|--------|--------|
| LCP | One prioritized hero; no client-only hero text |
| CLS | Reserved media; no late banners above content |
| INP | Short handlers; carousel/search work off critical path |
| Streaming | Selective Suspense; don’t delay header/hero |

Prefer Lighthouse / field tools on staging — don’t guess from desktop-only.

### 5. Bundles
- Leaf client islands; `next/dynamic` only for large non-LCP chunks.
- React Compiler on — skip routine `useMemo` / `useCallback`.

## Verification
- [ ] LCP image has `priority` + `fetchPriority="high"`
- [ ] No visible CLS on load/hydration
- [ ] No new `unstable_cache` outside `sanityFetch`
- [ ] Bundle impact reviewed for new client deps
