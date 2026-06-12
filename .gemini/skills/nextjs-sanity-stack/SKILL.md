---
name: Next.js + Sanity Stack Integration
description: Best practices and templates for integrating Next.js 15+ App Router with Sanity CMS.
---

# Next.js & Sanity Stack Skill

This skill provides context and functional references for building features using the Next.js 15 and Sanity CMS stack in this project.

## Core Principles

1. **Unstable Cache for Production**
   Sanity data fetches should be wrapped in `unstable_cache` for production. Do not cache during development so the local studio updates instantly.
2. **Graceful Degradation**
   Catch fetch errors in development to prevent Turbopack from crashing when the API is unreachable.

## Example: The `sanityFetch` Wrapper

```typescript
import { client } from "./client";
import { unstable_cache } from "next/cache";

export async function sanityFetch<T>({
  query,
  params = {},
  tags = [],
}): Promise<T> {
  // Development: No caching, graceful error handling
  if (process.env.NODE_ENV !== "production") {
    try {
      return await client.fetch<T>(query, params);
    } catch (e) {
      console.error("Sanity fetch failed:", e);
      return null as unknown as T;
    }
  }

  // Production: Cached and tagged for on-demand revalidation
  const cachedFetch = unstable_cache(
    async () => {
      try {
        return await client.fetch<T>(query, params);
      } catch {
        return null as unknown as T;
      }
    },
    [query, JSON.stringify(params)],
    { tags: ["sanity-all", ...tags], revalidate: 3600 },
  );

  return cachedFetch();
}
```

## GROQ Query Best Practices

- **Explicit Projections**: Only fetch the fields needed.
- **Reference Expansion**: Expand references like `author->{name, image}` inside the projection.
- **Image URLs**: Use `image { asset->{_ref} }` and resolve the URL on the client using `@sanity/image-url` builder.

## Handling Images

```tsx
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

export function SanityImage({ image, alt }) {
  if (!image) return null;

  const src = urlFor(image).width(800).url();

  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={600}
      className="object-cover"
    />
  );
}
```

When using `fill`, always define `sizes` reflecting the responsive widths to avoid Next.js performance warnings:

```tsx
<Image src={src} fill sizes="(max-width: 768px) 100vw, 50vw" />
```
