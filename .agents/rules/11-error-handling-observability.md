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
* When wrapping errors, preserve context via `Error` `cause` where helpful for Sentry — still scrub PII before reporting.
* **Rethrow** Next.js control-flow errors from `notFound()`, `redirect()`, and similar — do not convert them into generic 500s.
* Prefer actionable user copy (“Please try again” / field errors) over opaque “Error”.

## 2. App Router error UI (current state)

| Concern | Location / status |
|---------|-------------------|
| Global crash UI | `app/global-error.tsx` (keep Sentry wired when DSN set) |
| Site segment `error.tsx` | **Exists** — `app/(site)/error.tsx` (Client Component + reset; report to Sentry) |
| Branded 404 | **Exists** — `app/(site)/not-found.tsx` + root `app/not-found.tsx` |
| Site loading UI | **Exists** — `app/(site)/loading.tsx` (layout-stable skeleton) |
| API errors | Route handlers → generic JSON + `Sentry.captureException` |
| Sanity fetch failures | `sanity/lib/fetch.ts` (null + Sentry) |

Extend existing boundaries — do **not** recreate them from scratch. When changing `error.tsx`: keep Client Component + reset affordance; never render secrets or digests to end users beyond a safe generic reference if needed for support.

## 3. Telemetry and Sentry

* Configure Sentry via `instrumentation.ts` + Sentry config when `NEXT_PUBLIC_SENTRY_DSN` is set (optional).
* Log unexpected failures: contact, review, email, Sanity fetch, revalidate, rate-limit, env validation.
* Add operational context (route, feature, category, environment) without PII — no emails, phones, or full form bodies.
* Scrub tokens, passwords, and full form payloads before sending to Sentry.
* Prefer filtering crawler 404 noise in Sentry; use Search Console for crawl health.
* Sample rates: keep production noise manageable; do not disable error capture entirely to “fix” quotas.

## 4. Server Logging

* Use structured server logs with severity and request context where useful.
* Avoid logging complete request bodies, tokens, or credentials.
* Prefer deploy health checks via `scripts/deploy-remote.sh` / process uptime — do **not** add a public `/api/health` unless product requires it; if added, never expose secrets.
* Prefer few high-signal logs over verbose debug in production.
