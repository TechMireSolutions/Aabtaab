---
name: contact-form-api
description: >-
  Handles Aabtaab contact form submissions — Zod validation, honeypot, rate
  limiting, Sanity write, Resend or Gmail notification. Use when editing
  ContactForm, app/api/contact/route.ts, or email delivery.
---

# Contact Form API

## Flow

`ContactForm` (client) → `POST /api/contact` → rate limit → Zod + honeypot → Sanity `contactSubmission` → Resend or Gmail email.

## Key files

| File | Role |
|------|------|
| `app/(site)/contact/_components/ContactForm.tsx` | Client form + honeypot |
| `app/api/contact/route.ts` | Rate limit, validation, Sanity create |
| `lib/contact/schema.ts` | Zod schema + `parseContactBody` |
| `lib/contact/notify.ts` | Resend (preferred) or SMTP fallback |
| `lib/contact/email-html.ts` | HTML template + `escapeHtml` |
| `lib/rate-limit.ts` | Upstash Redis or in-memory limiter |
| `lib/request-ip.ts` | Client IP (`cf-connecting-ip` when behind Cloudflare) |
| `sanity/lib/writeClient.ts` | Write client for submissions |

## Env vars

| Variable | Purpose |
|----------|---------|
| `SANITY_API_TOKEN` | Write client (required for save) |
| `RESEND_API_KEY` | Resend API (preferred email) |
| `EMAIL_FROM` | Resend sender (verified domain) |
| `EMAIL_TO` | Notification recipient |
| `EMAIL_USER` / `EMAIL_PASS` | Gmail SMTP fallback |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Distributed rate limit (optional) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Turnstile public site key (optional) |
| `TURNSTILE_SECRET_KEY` | Turnstile server secret verification key (optional) |

Submissions save to Sanity even when email env is missing.

## Security

- Zod validation on all fields (including optional `token` field)
- Honeypot field `website` (must be empty)
- Spam protection: Cloudflare Turnstile verification (skipped dynamically if environment keys are missing)
- Rate limit: 5 requests / 15 min / IP
- IP from `lib/request-ip.ts` (Cloudflare-aware)
- HTML escaped in email template
- `429` too many requests · `400` validation · `500` server error

## Tests

- `lib/contact/schema.test.ts`
- `lib/contact/email-html.test.ts`
- `lib/request-ip.test.ts`

## Verify

```bash
npm run test
npm run lint
```
