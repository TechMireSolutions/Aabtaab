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
| Node on VPS | **≥22.12** via nvm + `.nvmrc` (24.17.0) — deploy script loads nvm automatically |
| PM2 | `deploy/runtime.cjs`, fork, `instances: 1`, `max_memory_restart: 1G` |
| CI | `.github/workflows/ci.yml` |
| Deploy | `.github/workflows/deploy.yml` (after CI on `main`, or manual) |
| Remote script | `scripts/deploy-remote.sh` (health check + PM2 restart) |

### GitHub secrets

| Secret | Required | Purpose |
|--------|----------|---------|
| `SERVER_HOST` | Yes | VPS IP or hostname (no `https://`) |
| `SERVER_USER` | Yes | SSH user (e.g. `root`) |
| `SSH_PRIVATE_KEY_B64` | Yes* | Base64 deploy key (recommended) |
| `SSH_KNOWN_HOSTS` | No | Pin host key; else `ssh-keyscan` at deploy time |

\* Or `SSH_PRIVATE_KEY` (raw PEM).

Optional: create a **production** environment in GitHub (Settings → Environments) for approval rules.

## Manual deploy

On the VPS (same steps as `scripts/deploy-remote.sh`):

```bash
cd /var/www/aabtaab_next
export DEPLOY_SHA=origin/main
./scripts/deploy-remote.sh
```

Or step-by-step:

```bash
cd /var/www/aabtaab_next
git pull && npm ci
npm run migrate:sanity:dry && npm run migrate:sanity   # if CMS migrations pending
npm run build
pm2 delete aabtaab-next >/dev/null 2>&1 || true
pm2 start ecosystem.config.cjs --update-env && pm2 save
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

