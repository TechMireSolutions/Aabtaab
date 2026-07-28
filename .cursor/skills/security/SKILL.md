---
name: security
description: >-
  Universal security workflows for Aabtaab. Use when handling environment variables,
  public form writes, API rate-limiting, and validation schemas. Rule: 09-security.
---

# Security Workflow

**Rule:** `.cursor/rules/09-security.mdc`

## Implementation Steps

### 1. Environment Variables Validation
- Define environment schemas in **`lib/env.ts`** using Zod (public + server schemas).
- Never reference `process.env` directly outside `lib/env.ts` or core load modules.

### 2. Public form validation & protection
- Use `lib/contact/schema.ts` (`parseContactBody`) — purposes: `general` | `course` | `service` | `other`.
- If the honeypot field (`website`) is non-empty after trim, reject as `"Invalid submission"`.
- Prefer skill `contact-form-api` for the full flow.

### 3. API rate limiting
- Protect public write routes via `checkContactRateLimit` in `lib/rate-limit.ts`.
- Prefer **Upstash Redis** in production (`UPSTASH_REDIS_*` — strongly recommended, optional per techstack). Memory fallback is for local/dev and Redis errors (Sentry).
- **Bot Whitelisting:** bypass known crawlers on crawl-facing rate-limited routes when appropriate.
- **Strict SSL/HTTPS:** Cloudflare “Always Use HTTPS” + **Full (strict)** SSL.


### 4. Cloudflare Turnstile Verification
- Add `token` optional string field to Zod validation schema.
- In components, load Turnstile API script and render widget dynamically only if site key is configured. Get token via `cf-turnstile-response` form data.
- Reset the widget state after handling success or error states using type-safe window casting:
```typescript
const turnstile = (window as unknown as { turnstile?: { reset: () => void } }).turnstile;
if (turnstile) turnstile.reset();
```
- In the Route Handler, verify the token by posting to `https://challenges.cloudflare.com/turnstile/v0/siteverify` if secret key is present in environment variables. Reject invalid submissions.

## Verification Checklist
- [ ] No server-side secrets or write tokens exported to the browser.
- [ ] Zod schema handles string trimming and length bounds.
- [ ] Rate limits verified on the endpoint.
- [ ] Form submission records correctly to Sanity via write client.
