---
name: error-handling-telemetry
description: >-
  Error boundary setup, Sentry monitoring, and logging guidelines. Use when implementing
  error handling, logging, or Sentry tracking. Rule: 11-error-handling-observability.
---

# Error Handling & Telemetry Workflow

**Rule:** `.cursor/rules/11-error-handling-observability.mdc`

## Repo map

| Concern | Location |
|---------|----------|
| Sentry / instrumentation | `instrumentation.ts` + Sentry config files |
| Global crash UI | `app/global-error.tsx` (keep Sentry wired when DSN set) |
| Site segment errors | **Exists** — `app/(site)/error.tsx` |
| Branded 404 | **Exists** — `app/(site)/not-found.tsx` + `app/not-found.tsx` |
| Site loading | **Exists** — `app/(site)/loading.tsx` |
| API errors | `app/api/*/route.ts` → generic JSON + `Sentry.captureException` |
| Sanity fetch failures | `sanity/lib/fetch.ts` |
| Rate-limit Redis failures | `lib/rate-limit.ts` |

## Workflows

### 1. Error UI
- Use `global-error.tsx` for root crashes (must include its own `<html>` / `<body>`).
- **Extend** existing `app/(site)/error.tsx` / `not-found.tsx` — do not recreate. Keep Client Component + reset; no secrets.
- Branded `not-found.tsx` should keep skip link / main landmark patterns.
- Rethrow `notFound()` / `redirect()` control-flow errors — do not map them to generic 500s.

### 2. Sentry
```typescript
import * as Sentry from "@sentry/nextjs";

try {
  // logic
} catch (error) {
  Sentry.captureException(error, {
    tags: { category: "contact_submission" },
  });
}
```
- Scrub PII before send (no emails, phones, full form bodies). Filter crawler 404 noise when configured.
- Prefer `catch (error: unknown)` then narrow; preserve `cause` when wrapping.

### 3. API error format
```typescript
return NextResponse.json(
  { error: "Internal Server Error" },
  { status: 500 },
);
```
Use `400` validation, `429` rate limit, `404` not found — never `200` on failure. User-facing copy should be actionable.

## Verification
- [ ] No stack traces / secrets returned to clients
- [ ] Unexpected failures captured to Sentry without form payloads
- [ ] UI degrades gracefully (boundaries / null CMS handling)
- [ ] Control-flow errors (`notFound` / `redirect`) are not swallowed
