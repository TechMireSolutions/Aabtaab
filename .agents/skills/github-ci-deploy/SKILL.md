---
name: github-ci-deploy
description: >-
  Configures and troubleshoots Aabtaab GitHub Actions CI and deploy to Hetzner
  VPS. Use when editing .github/workflows/, deploy secrets, or CI failures.
disable-model-invocation: true
---

# GitHub CI & Deploy

**Reference:** `techstack.md` § Production & infrastructure

## Workflows

| File | Trigger | Purpose |
|------|---------|---------|
| `.github/workflows/ci.yml` | PR + push to `main` | lint, test, build, Playwright E2E |
| `.github/workflows/deploy.yml` | push to `main` | SSH deploy to Hetzner |

## CI pipeline (`ci.yml`)

1. `npm ci` (Node from `.nvmrc` — 24.17.0)
2. `npm run lint`
3. `npm run test` (Vitest)
4. `npm run build`
5. Install Playwright Chromium
6. `npm run test:e2e` (smoke tests against prod server on port 3000)

CI env placeholders: `NEXT_PUBLIC_SANITY_PROJECT_ID=ci-placeholder`, `NEXT_PUBLIC_SANITY_DATASET=production`.

## Deploy pipeline (`deploy.yml`)

Remote SSH via `appleboy/ssh-action@v1.2.5`:

1. `cd /var/www/aabtaab_next`
2. `git fetch origin main && git reset --hard origin/main`
3. `npm ci`
4. `npm run build`
5. `pm2 startOrRestart ecosystem.config.cjs --update-env && pm2 save`

## Required GitHub secrets (deploy only)

| Secret | Purpose |
|--------|---------|
| `SERVER_HOST` | VPS IP/hostname |
| `SERVER_USER` | SSH user |
| `SSH_PRIVATE_KEY` | Deploy key |

## CI vs deploy gaps

| Step | CI | Deploy |
|------|-----|--------|
| `npm run migrate:sanity` | ❌ | ❌ (manual on server when needed) |
| `npm run test` / E2E | ✅ | ❌ |

After CMS field migrations, run manually on server:

```bash
npm run migrate:sanity:dry && npm run migrate:sanity
```

See skill `deploy-production` for full manual flow.

## Pre-merge checklist (local)

```bash
npm run lint
npm run test
NEXT_PUBLIC_SANITY_PROJECT_ID=... NEXT_PUBLIC_SANITY_DATASET=production npm run build
```

## Rollback note

Deploy uses `git reset --hard origin/main` on server — local hotfixes do not survive pull.
