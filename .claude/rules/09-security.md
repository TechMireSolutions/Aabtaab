# security

> Security rules — HTTPS, environment variables, input validation, form protection, email security, and Cloudflare

**Scope:** `{app,components,lib,sanity,scripts}/**/*.{ts,tsx,mjs,cjs}`

# Security Rules

## 1. General Security

* HTTPS must remain enabled in production.
* **Strict SSL/HTTPS:** Ensure Cloudflare's "Always Use HTTPS" is enabled. No page or asset should be served over HTTP. Cloudflare SSL/TLS must use **Full (strict)** mode.
* Never treat HTTPS alone as proof that the application is secure.
* Never expose secrets, API keys, tokens, SMTP credentials, or Sanity write tokens to the browser.
* Only variables intentionally safe for browsers may use the `NEXT_PUBLIC_` prefix.
* Never commit `.env` files containing secrets.
* Keep production, staging, local, and test credentials separate.
* Never log passwords, access tokens, form contents containing sensitive information, or private user data.

## 2. Environment Variables

* Validate required environment variables during application startup.
* Use a central environment configuration module (`lib/env.ts`).
* Use Zod to validate environment variables.
* Fail clearly when a required production variable is missing.
* Never access `process.env` throughout unrelated components and utilities.
* Separate public and server-only environment schemas.

## 3. Security Headers

Configure headers in **`next.config.ts` `headers()`** (and avoid conflicting Cloudflare duplicates).

Current production set includes HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, frame protections, and **CSP as `Content-Security-Policy-Report-Only`** (not enforcing yet).

Rules:
* Treat CSP as **Report-Only** until explicitly flipped to enforce — do not document it as enforcing CSP.
* Before enforce: allow Turnstile (`https://challenges.cloudflare.com`), Sentry ingest, Sanity CDN/Studio needs; shrink `'unsafe-eval'` / `'unsafe-inline'` where possible.
* Do not use unrestricted `*` sources without justification.
* Do **not** enable COOP/COEP / cross-origin isolation unless a feature requires it — they break Turnstile/Studio embeds.
* Enable HSTS only for production HTTPS domains.
* Change Next.js **or** Cloudflare header sets one at a time; verify Studio + contact form after changes.

## 4. Input Validation

All external input is untrusted. Validate the following with Zod on the server:

* Contact / review form bodies (Route Handlers)
* URL parameters and query parameters
* Webhook payloads (Sanity revalidate)
* Environment variables (`lib/env.ts`)
* Third-party API responses where practical
* Server Action inputs **only if** Server Actions are explicitly adopted later

*Client-side validation is for UX only. Server-side validation is mandatory.*

Normalise data before use:
* Trim text.
* Normalise email addresses.
* Restrict maximum lengths.
* Reject unexpected fields where appropriate.
* Validate enumerated values.
* Validate URLs — allow only expected schemes (`http:`, `https:`, `mailto:`, `tel:`); no open redirects to untrusted hosts.
* Reject malformed or oversized payloads (enforce body size limits on write routes).

## 5. Form and API Protection

Every public write endpoint must include:
* Server-side Zod validation.
* Rate limiting.
* Request size limits.
* Safe error responses.
* Origin or request-context checks where applicable.
* Protection against automated abuse (e.g., honeypot fields where forms are public).
* Cloudflare Turnstile **when keys are configured** — verify `token` via `https://challenges.cloudflare.com/turnstile/v0/siteverify` on endpoints that collect it (contact). Routes without Turnstile widgets (e.g. `/api/review`) still require Zod + rate limiting.

* Prefer **Upstash Redis** for abuse-sensitive routes (`lib/rate-limit.ts`). Set `UPSTASH_REDIS_*` in production when possible (**strongly recommended**; optional per `techstack.md`).
* In-memory fallback is for local/dev when Redis is unset, and as a careful fallback when Redis errors (log to Sentry).
* **Bot Whitelisting:** When rate-limiting crawl-facing routes, bypass or whitelist known search engine user agents (Googlebot, Bingbot) where appropriate.
* **Cross-site POST:** Cookie-less JSON POSTs (`/api/contact`, `/api/review`) still need rate limit + honeypot + Turnstile (when configured). When adding Origin checks, allow only `NEXT_PUBLIC_SITE_URL` (and local dev hosts); reject mismatched `Origin` on state-changing routes.
* Prefer header secret over query string for webhook auth when changing `/api/revalidate`.
* Compare webhook / preview secrets with **`crypto.timingSafeEqual`** on equal-length buffers — do not use `===` alone for secret comparison when tightening auth.
* Do not reveal whether a particular email address, account, or private resource exists.
* Least privilege: Sanity write token only on the write client; preview token only for draft mode.

## 6. Sanity Security

* Never send a Sanity write token (`SANITY_API_TOKEN`) to the client.
* Use public read access only for content intended to be public.
* Use server-only authenticated clients for preview, draft, or write operations.
* Do not render arbitrary raw HTML from Sanity.
* Render Portable Text through approved components.
* Whitelist supported block, mark, image, and link types.
* Validate external links before rendering them.
* Add `rel="noopener noreferrer"` to external links.
* Keep preview and draft-mode access protected.

## 7. Email Security

* Validate all email form data before sending.
* Prevent header injection.
* Do not allow users to control email headers.
* Do not place raw user input into the email subject without sanitisation.
* Escape or safely render user-provided HTML in email templates.
* Use plain text alongside HTML email where practical.
* Resend is the primary provider; Nodemailer is the fallback only.
* Prevent duplicate delivery when the primary provider succeeds but returns an unexpected response.
* Record provider failures without logging sensitive message contents.
* Use generic user-facing failure messages.

## 8. Sentry and Privacy

* Report unexpected server errors to Sentry.
* Do not send passwords, tokens, private messages, or complete form submissions to Sentry.
* Scrub sensitive request headers.
* Add useful operational context (route, feature, error category, deployment environment).
* Do not expose internal stack traces to production users.

## 9. Supply chain & secrets hygiene

* Keep `package-lock.json` committed; install with `npm ci` in CI and on the VPS.
* Never commit `.env*`, private keys, or webhook secrets.
* Rotate `SANITY_REVALIDATE_SECRET` / preview secrets if leaked; update Sanity webhook + GitHub/server env together.
* Treat dependency upgrades that touch parsers, auth, or crypto as security-sensitive (see `05-dependencies-upgrade`).

## 10. Cloudflare Rules

* Keep SSL/TLS in Full (strict) mode.
* Use Cloudflare caching for public static assets.
* Do **not** cache:
  * Admin or Studio pages (`/studio`)
  * Preview content
  * Form submissions
  * Authenticated responses
  * Personalised content
* Preserve correct client IP headers for rate limiting and logs. Trust forwarded headers only through the approved proxy path (`cf-connecting-ip` via `lib/request-ip.ts`).
* Configure WAF and Cloudflare rate rules for high-risk routes where appropriate.
* Do not create Cloudflare rules that conflict with Next.js caching behaviour.
* Purge or revalidate content intentionally after CMS updates.
