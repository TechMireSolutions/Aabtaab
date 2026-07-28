# testing

> Testing rules — Vitest unit tests, Playwright E2E tests, and regression testing standards

**Scope:** `{**/*.{test,spec}.{ts,tsx},e2e/**,vitest.config.ts,playwright.config.ts}`

# Testing Rules

## Commands

| Suite | Command |
|-------|---------|
| Unit | `npm run test` (Vitest) |
| Unit watch | `npm run test:watch` |
| E2E | `npm run test:e2e` (Playwright) |

Config: `vitest.config.ts`, `playwright.config.ts`.

## 1. Unit Testing (Vitest)

Place tests next to the module (`schema.test.ts` beside `schema.ts`) or under the same domain folder.

**Prefer covering:**
* Zod schemas (`lib/contact/schema.ts`, env-related validation)
* Pure helpers (`lib/paths.ts`, `lib/urls.ts`, `lib/constants.ts`, `lib/request-ip.ts`)
* Email HTML builders (`lib/contact/email-html.ts`)
* SEO plain-text / metadata helpers (`lib/seo/portable-text-plain.ts`, `lib/seo/metadata.ts`)
* Catalog mappers (`lib/catalog/nested-children.ts`)
* Rate-limit memory path (`lib/rate-limit.ts` — mock Upstash/Sentry)
* Revalidation helpers (`lib/revalidate.ts` — mock `next/cache`)

**Rules:**
* Cover normal, boundary, and invalid inputs.
* Do not test framework internals (Next.js routing, React renderer).
* Mock network/CMS/image URL builders when they pull in Sanity clients.
* Keep tests deterministic — unique keys for rate-limit memory tests.

## 2. End-to-End Testing (Playwright)

**Projects:** `chromium` (Desktop Chrome) + `mobile-chrome` (Pixel 7) in `playwright.config.ts`.

**Suites in `e2e/`:**

| File | Focus |
|------|-------|
| `smoke.spec.ts` | Public pages load (`#main-content`) |
| `navigation.spec.ts` | Main/mobile nav, brand home, footer legal |
| `seo.spec.ts` | Title/canonical shape, `robots.txt`, 404 |
| `contact.spec.ts` | Native required/invalid email, purpose radios |

**Must remain covered:**
* Homepage + skip link
* Main navigation (open mobile menu when desktop nav is hidden)
* Contact form client validation (scope selectors to `#main-content form`)
* `robots.txt` disallows `/studio/`, `/api/`, `/search`
* Unknown routes return **404**
* Catalog listing pages (courses, services, events)

**Rules:**
* Prefer accessible selectors (role, label, text). Use `data-testid` only when needed.
* Do not assert CMS-specific nav labels that change in Studio — assert stable patterns (link count, Services/Courses).
* Canonical `href` is baked at **build** time from `NEXT_PUBLIC_SITE_URL` — assert absolute URL shape, not a hard-coded port.
* Avoid depending on live Sanity content for assertions.
* Free port **3000** before local E2E if a stale server is running; install browsers with `npx playwright install chromium` when missing.

## 3. Regression Requirements

* Every bug fix should include a regression test when practical.
* Do not reduce coverage or delete tests merely to make CI pass.
* Investigate flaky tests; do not paper over with retries alone.
* After substantive app changes, run `npm run test` and `npm run test:e2e`.
