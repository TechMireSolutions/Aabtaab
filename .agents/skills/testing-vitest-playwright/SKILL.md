---
name: testing-vitest-playwright
description: >-
  Vitest unit tests and Playwright E2E testing workflows. Use when writing, debugging, or
  running tests. Rule: 12-testing.
---

# Testing Workflow

**Rule:** `.cursor/rules/12-testing.mdc`

## Commands

| Action | Command |
|--------|---------|
| Unit | `npm run test` |
| Unit watch | `npm run test:watch` |
| E2E | `npm run test:e2e` |
| Browsers (first time / after Playwright bump) | `npx playwright install chromium` (add `--with-deps` on Linux/CI) |

## Unit tests (Vitest)

- Colocate: `lib/contact/schema.test.ts` beside `schema.ts`.
- Include: `**/*.test.ts` via `vitest.config.ts` (`@/` alias).
- Current high-value modules: contact schema/email, paths, urls, constants, request-ip, rate-limit, revalidate, SEO helpers, catalog mappers.

```typescript
import { describe, it, expect } from "vitest";
import { parseContactBody } from "@/lib/contact/schema";

describe("parseContactBody", () => {
  it("accepts valid payload", () => {
    // assert
  });
});
```

## E2E tests (Playwright)

| File | Purpose |
|------|---------|
| `e2e/smoke.spec.ts` | Page load smoke |
| `e2e/navigation.spec.ts` | Nav + footer legal |
| `e2e/seo.spec.ts` | Metadata, robots, 404 |
| `e2e/contact.spec.ts` | Form validation UX |

Projects: **Desktop Chrome** + **Pixel 7** (`playwright.config.ts`).

Web server: `node scripts/run-next.mjs start --port 3000` (needs an existing `.next` build).

### Selector tips

- Scope contact fields to `#main-content form` (footer/other email inputs can collide).
- On mobile, open the menu via `Open navigation menu` before asserting main nav links.
- Prefer roles/labels over brittle CSS.

## Checklist

- [ ] Normal + boundary + invalid cases for unit logic (Arrange → Act → Assert)
- [ ] No flake left unaddressed; no retries-as-fix
- [ ] Mocks only where needed (Sanity image URLs, `next/cache`, Sentry, Upstash); reset between tests
- [ ] Accessible selectors; scope contact fields to `#main-content form`
- [ ] When adding `error.tsx` / `not-found.tsx`, extend E2E
- [ ] Security-critical helpers stay covered when touched (schema, rate-limit, revalidate, email HTML)
- [ ] CI runs unit + E2E (`npm run test`, `npm run test:e2e`)
- [ ] `npm run typecheck` passes (authoritative vs `next build`)
- [ ] E2E asserts behaviour, not brittle CMS copy or full-page snapshots
