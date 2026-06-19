---
name: deploy-production
description: >-
  Deploy Aabtaab to Hetzner VPS via GitHub Actions and PM2 on port 3000. Use
  when deploying, PM2, ecosystem.config, or production server setup.
disable-model-invocation: true
---

# Deploy Production

Full stack and env reference: **`techstack.md`**

## Config

| Item | Value |
|------|-------|
| Server path | `/var/www/aabtaab_next` |
| PM2 app | `aabtaab-next` |
| Port | **3000** (`server.config.cjs`) |
| CI | `.github/workflows/deploy.yml` (push to `main`) |

## Manual deploy

```bash
cd /var/www/aabtaab_next
git pull && npm ci
npm run migrate:sanity:dry && npm run migrate:sanity   # if CMS migrations pending
npm run build
pm2 startOrRestart ecosystem.config.cjs --update-env && pm2 save
```

## Pre-deploy local check

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=... NEXT_PUBLIC_SANITY_DATASET=production npm run build
npm run lint
npm run test
```

## Cloudflare (optional CDN)

| Step | Action |
|------|--------|
| DNS | A/AAAA → Hetzner IP, **proxied** (orange cloud) |
| SSL | Cloudflare **Full (strict)**; origin on port 3000 or nginx → 3000 |
| IPs | App reads `cf-connecting-ip` for contact rate limits (`lib/request-ip.ts`) |
| Cache | Static assets cached via Next.js headers; HTML ISR via Sanity webhooks |

## Optional env (production)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SENTRY_DSN` | Server/client error reporting (prod only when set) |
| `SANITY_PREVIEW_SECRET` | Draft preview entry at `/api/draft?secret=…` |
| `UPSTASH_REDIS_*` | Distributed contact form rate limiting |
| `RESEND_API_KEY` | Contact notification email |

