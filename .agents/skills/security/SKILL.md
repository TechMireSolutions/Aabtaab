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
- Define environment schemas in `lib/env/` or on load using Zod:
```typescript
import { z } from "zod";

const serverEnvSchema = z.object({
  SANITY_API_TOKEN: z.string().min(1),
  SANITY_REVALIDATE_SECRET: z.string().min(1),
  RESEND_API_KEY: z.string().optional(),
});
```
- Never reference `process.env` directly outside configuration files or core load modules.

### 2. public form validation & protection
- Always define a Zod validator for public form payloads:
```typescript
import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(150),
  message: z.string().trim().min(5).max(1000),
  website: z.string().max(0).optional(), // Honeypot
});
```
- If the honeypot field (`website`) is not empty, silently reject or abort the submission to block bots without exposing the failure reason.

### 3. API rate limiting
- public API routes must be protected using `@upstash/ratelimit`.
- **Bot Whitelisting:** When implementing Upstash Redis rate limiting for your application routes, explicitly bypass or whitelist known search engine user agents (Googlebot, Bingbot) to prevent accidental crawl blocks.
- If Redis is unavailable, fallback to an in-memory or graceful allowance while logging a warning to Sentry.
- **Strict SSL/HTTPS:** Ensure Cloudflare's "Always Use HTTPS" is enabled. No page or asset should be served over HTTP.


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
