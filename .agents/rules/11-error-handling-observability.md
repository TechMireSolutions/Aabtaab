---
trigger: glob
glob: {app,components,lib,sanity,scripts}/**/*.{ts,tsx,mjs,cjs}
description: Error handling & observability rules — error boundaries, user-friendly errors, Sentry logging, and health checks
---

# Error Handling & Observability Rules

## 1. Error Handling

* **Never ignore caught errors silently.**
* Catch errors only when the code can add context, recover, clean up, or return a controlled response.
* Provide user-friendly production error messages. Do not display stack traces, database details, environment values, or provider responses to users.
* Return appropriate HTTP status codes from API handlers (never return `200` for failed operations).
* Distinguish clearly between: validation, auth, rate-limit, external service, not-found (`notFound()`), unexpected server errors.

## 2. App Router error UI (current state)

| Concern | Location / status |
|---------|-------------------|
| Global crash UI | `app/global-error.tsx` (exists; wire Sentry) |
| Segment `error.tsx` | **Missing** — prefer `app/(site)/error.tsx` when improving UX resilience |
| Custom `not-found.tsx` | **Missing** — branded 404 when touching SEO/UX; E2E already asserts status 404 |
| API errors | Route handlers → generic JSON + `Sentry.captureException` |
| Sanity fetch failures | `sanity/lib/fetch.ts` (null + Sentry) |

Do not assume segment `error.tsx` / `not-found.tsx` already exist.

## 3. Telemetry and Sentry

* Configure Sentry via `instrumentation.ts` + Sentry config when `NEXT_PUBLIC_SENTRY_DSN` is set (optional).
* Log unexpected failures: contact, review, email, Sanity fetch, revalidate, rate-limit, env validation.
* Add operational context (route, feature, category, environment) without PII.
* Scrub tokens, passwords, and full form payloads before sending to Sentry.
* Prefer filtering crawler 404 noise in Sentry; use Search Console for crawl health.

## 4. Server Logging

* Use structured server logs with severity and request context where useful.
* Avoid logging complete request bodies, tokens, or credentials.
* Prefer deploy health checks via `scripts/deploy-remote.sh` / process uptime — do **not** add a public `/api/health` unless product requires it; if added, never expose secrets.
