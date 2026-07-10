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
- **Image Optimization:** Never use standard `<img>` tags. Always map Sanity images to the `next/image` component to ensure automatic WebP/AVIF conversion, lazy loading, and explicit width/height attributes (preventing Cumulative Layout Shift).
- Always specify explicit `width` and `height`, or use `fill` with aspect ratios to prevent Layout Shifts (CLS).
- Provide correct `sizes` definitions. If an image is hidden on mobile viewports (e.g. `hidden md:block`), restrict mobile sizes explicitly to prevent download payload overhead:

```tsx
<Image
  src={imageUrl}
  alt={altText}
  fill
  className="object-cover"
  sizes="(max-width: 768px) 0px, 55vw"
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
- For hydration-dependent widgets (e.g. countdown timers), render stable skeleton boxes of the exact same dimensions when not mounted to prevent visual jumps on load.
- **Font Loading:** Use `next/font` for local or Google fonts to ensure CSS is inlined and zero layout shift occurs during font loading. Ensure fonts are preloaded with `display: swap` in the root layout.
- **Route Prefetching:** Utilize the `<Link>` component for all internal navigation to leverage Next.js's automatic background prefetching for faster perceived page loads.


## Verification
- [ ] LCP images have `priority` enabled.
- [ ] No layout shift visible during loading or hydration states.
- [ ] Bundle size analyzed for dynamic imports.
