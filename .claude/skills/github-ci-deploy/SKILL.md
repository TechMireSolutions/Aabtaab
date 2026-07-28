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
| `.github/workflows/deploy.yml` | after CI on `main` + manual | SSH deploy to Hetzner |

## CI pipeline (`ci.yml`)

1. `npm ci` (Node from `.nvmrc` — 24.17.0)
2. `npm run lint`
3. `npm run typecheck`
4. `npm run test` (Vitest)
5. `npm run build`
6. `npm audit --audit-level=high`
7. Install Playwright Chromium
8. `npm run test:e2e` (smoke tests via `scripts/run-next.mjs start` on port 3000)

CI env placeholders: `NEXT_PUBLIC_SANITY_PROJECT_ID=ci-placeholder`, `NEXT_PUBLIC_SANITY_DATASET=production`.

## Deploy pipeline (`deploy.yml`)

1. Verify secrets + validate SSH key (`ssh-keygen -y`)
2. Write key to `~/.ssh/deploy_key`, verify with native `ssh`, then run `scripts/deploy-remote.sh` on the VPS
3. On server: `git pull`, `npm ci`, `npm run build`, `pm2 startOrRestart`

## Required GitHub secrets (deploy only)

| Secret | Purpose |
|--------|---------|
| `SERVER_HOST` | VPS IP/hostname only (no `https://`) |
| `SERVER_USER` | SSH user |
| `SSH_PRIVATE_KEY_B64` | **Recommended** — base64-encoded private key (single line) |
| `SSH_PRIVATE_KEY` | Alternative — full PEM multiline private key |

Generate base64 secret on Mac (paste into `SSH_PRIVATE_KEY_B64`):

```bash
base64 -i ~/.ssh/aabtaab_deploy | tr -d '\n' | pbcopy
```

Or paste full PEM from `cat ~/.ssh/aabtaab_deploy` into `SSH_PRIVATE_KEY`.

If deploy logs show `ssh: no key found` or invalid PEM, re-create the secret using base64 above.

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
