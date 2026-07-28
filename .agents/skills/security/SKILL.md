---
name: security
description: >-
  Universal security workflows for Aabtaab. Use when handling environment variables,
  public form writes, API rate-limiting, and validation schemas. Rule: 09-security.
---

# Security Workflow

**Rule:** `.cursor/rules/09-security.mdc`

## Implementation Steps

### 1. Environment variables
- Define schemas in **`lib/env.ts`** (public + server Zod schemas).
- Never reference `process.env` outside `lib/env.ts` / core load modules.
- Never put `SANITY_API_TOKEN`, `SANITY_PREVIEW_SECRET`, `SANITY_REVALIDATE_SECRET`, SMTP, or Redis tokens in client bundles.

### 2. Public form validation & protection
- Contact: `lib/contact/schema.ts` (`parseContactBody`) — purposes `general` | `course` | `service` | `other`.
- Honeypot `website` non-empty after trim → reject as `"Invalid submission"`.
- Prefer skill `contact-form-api` for the full contact flow.
- Mutations use **Route Handlers** (`app/api/*`), not Server Actions (unless explicitly adopted).

### 3. API rate limiting
- `checkContactRateLimit` in `lib/rate-limit.ts` on public writes.
- Prefer Upstash Redis in production (`UPSTASH_REDIS_*` — strongly recommended, optional per techstack).
- Memory fallback: local/dev + Redis errors (Sentry).
- Optional Origin allowlist for state-changing POSTs: `NEXT_PUBLIC_SITE_URL` + local hosts.

### 4. Cloudflare Turnstile
- Optional when keys are set. Load widget only if `NEXT_PUBLIC_TURNSTILE_SITE_KEY` exists.
- Verify server-side against `https://challenges.cloudflare.com/turnstile/v0/siteverify` when `TURNSTILE_SECRET_KEY` is set.
- Reset widget after success/error:
```typescript
const turnstile = (window as unknown as { turnstile?: { reset: () => void } }).turnstile;
if (turnstile) turnstile.reset();
```
- When tightening CSP (currently Report-Only), allow `https://challenges.cloudflare.com`.

### 5. Security headers
- Edit `next.config.ts` `headers()` only; verify after deploy.
- CSP is **`Content-Security-Policy-Report-Only`** today — do not claim enforce until flipped.
- Before enforce: Turnstile, Sentry, Sanity CDN/Studio; shrink unsafe-inline/eval where possible.
- Avoid COOP/COEP unless isolation is required.

### 6. Draft / revalidate secrets
- Prefer header `x-sanity-webhook-secret` over `?secret=` when changing webhook auth.
- Preview entry: `/api/draft?secret=…` — never expose preview secret to the client.

## Verification Checklist
- [ ] No server secrets / write tokens in the browser.
- [ ] Zod trim + length bounds on public bodies.
- [ ] Rate limits verified on write endpoints.
- [ ] Turnstile verified when keys configured.
- [ ] Form submissions record to Sanity via write client without leaking PII to logs/Sentry.
