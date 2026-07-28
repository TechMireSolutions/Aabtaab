---
name: contact-form-api
description: >-
  Handles Aabtaab contact form submissions — Zod validation, honeypot, rate
  limiting, Sanity write, Resend or Nodemailer notification. Use when editing
  ContactForm, app/api/contact/route.ts, or email delivery.
---

# Contact Form API

## Flow

`ContactForm` (client) → `POST /api/contact` → rate limit → Zod + honeypot → Sanity `contactSubmission` → Resend or Nodemailer SMTP email.

## Key files

| File | Role |
|------|------|
| `app/(site)/contact/_components/ContactForm.tsx` | Client form + honeypot + Turnstile |
| `app/api/contact/route.ts` | Rate limit, validation, Sanity create |
| `lib/contact/schema.ts` | Zod schema + `parseContactBody` |
| `lib/contact/notify.ts` | Resend (preferred) or SMTP fallback |
| `lib/contact/email-html.ts` | HTML template + `escapeHtml` |
| `lib/rate-limit.ts` | Upstash Redis (preferred) or in-memory fallback |
| `lib/request-ip.ts` | Client IP (`cf-connecting-ip` when behind Cloudflare) |
| `lib/constants.ts` | `CONTACT_PURPOSE_LABELS` |
| `sanity/lib/writeClient.ts` | Write client for submissions |

## Purpose enum (SSOT)

`general` | `course` | `service` | `other` — keep Zod (`contactPurposeSchema`), form radios, and `ContactPurpose` type aligned.

## Env vars

| Variable | Purpose |
|----------|---------|
| `SANITY_API_TOKEN` | Write client (required for save) |
| `RESEND_API_KEY` | Resend API (preferred email) |
| `EMAIL_FROM` | Resend sender (verified domain) |
| `EMAIL_TO` | Notification recipient |
| `EMAIL_USER` / `EMAIL_PASS` | Nodemailer SMTP fallback (e.g. Gmail app password) |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Distributed rate limit (**strongly recommended in production**; optional) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Turnstile public site key (optional) |
| `TURNSTILE_SECRET_KEY` | Turnstile server secret (optional) |

Submissions save to Sanity even when email env is missing.

## Security

- Zod validation on all fields (including optional `token`)
- Honeypot field `website` (must be empty / whitespace-only)
- Cloudflare Turnstile when keys are configured
- Rate limit: **5 requests / 15 min / IP**
- HTML escaped in email template
- Statuses: `429` rate limit · `400` validation · `500` server error

## Tests

| Suite | File |
|-------|------|
| Unit | `lib/contact/schema.test.ts`, `email-html.test.ts`, `lib/request-ip.test.ts`, `lib/rate-limit.test.ts` |
| E2E | `e2e/contact.spec.ts` (required fields, invalid email, purpose radios) |

## Verify

```bash
npm run test
npm run test:e2e
npm run lint
```
