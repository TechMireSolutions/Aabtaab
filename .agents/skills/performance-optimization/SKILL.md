---
name: performance-optimization
description: >-
  Performance optimization, CWV, caching, and bundle size workflows. Use when optimizing
  image components, fonts, layout shifts, or managing ISR/SSG pages. Rule: 10-performance.
---

# Performance Optimization Workflow

**Rule:** `.cursor/rules/10-performance.mdc`

## Key Workflows

### 1. Sizing Images (`next/image`)
- Always specify explicit `width` and `height`, or use `fill` with aspect ratios to prevent Layout Shifts (CLS).
- Provide correct `sizes` definitions:
```tsx
<Image
  src={imageUrl}
  alt={altText}
  fill
  className="object-cover"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  priority={isAboveFold}
/>
```

### 2. централизованный GROQ Fetching & Cache
- Centralise queries in `sanity/lib/queries/` and wrap fetches in React `cache()` and `sanityFetch`.
- Minimize transfer size by writing selective projections:
```groq
*[_type == "post"] {
  title,
  slug,
  mainImage
}
```

### 3. preventing Layout Shifts
- Reserve layout space using placeholder utilities or fallback skeletons while assets load.
- Ensure fonts are preloaded with `display: swap` in the root layout.

## Verification
- [ ] LCP images have `priority` enabled.
- [ ] No layout shift visible during loading state.
- [ ] Bundle size analyzed for dynamic imports.
