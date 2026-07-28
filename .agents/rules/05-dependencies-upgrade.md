---
trigger: glob
glob: {package.json,package-lock.json,.github/**,.nvmrc,ecosystem.config.cjs,server.config.cjs}
description: Upgrade dependencies and tech stack to latest compatible versions safely
---

# Dependencies & Stack Upgrades

**Goal:** Keep the stack on **latest stable, compatible** versions — not bleeding-edge canaries.

Apply when upgrading deps, touching `package.json`, CI, or Node engine constraints.

## Stack targets (keep aligned)

| Layer | Target |
|-------|--------|
| Runtime | Node **24.18** (`.nvmrc`; `engines` ≥22.12) |
| Framework | Next.js **16.2.12** |
| UI | React **19.2.8** + React Compiler **1.0** |
| CMS | Sanity **6.7** + `next-sanity` **13.2** + `@sanity/client` **7.25** |
| CSS | Tailwind **4.3.3** + `@tailwindcss/postcss` |
| Language | TypeScript **7.0.2** (`experimental.useTypeScriptCli`) |
| Lint | ESLint **10.8** + custom flat config (`@next/eslint-plugin-next`) |

## Upgrade workflow

1. **Audit:** `npm outdated` — list stale packages.
2. **Preview:** `npx npm-check-updates` (no `-u` yet) — review major bumps.
3. **Upgrade in groups:** framework → CMS → styling → dev tooling (not everything at once).
4. **Install:** `npm install` — commit lockfile changes with the upgrade.
5. **Security:** `npm audit` — use `npm audit fix`; never `--force` if it downgrades `next` or `sanity`.
6. **Verify:** `npm run lint`, `npm run test`, then `npm run build` (Sanity env vars required).

## Version policy

- App dependencies: **`^`** semver range (not exact pins unless required).
- Pin **only** when a known incompatibility exists — add a one-line comment in `package.json` or here.
- Do **not** reintroduce `eslint-config-next` until it supports TypeScript 7 (see Known constraints).
- Upgrade **peer-dependent** packages together (e.g. `@types/react` with `react`).

## Known constraints (this repo)

| Package | Constraint |
|---------|------------|
| **ESLint** | Custom flat config (`@next/eslint-plugin-next`, react, hooks, jsx-a11y). Do **not** reintroduce `eslint-config-next` until it drops `typescript-eslint` or TS 7.1 lands |
| **TypeScript** | **7.0.2** — keep `experimental.useTypeScriptCli: true` in `next.config.ts` |
| **legacy-peer-deps** | `.npmrc` sets `legacy-peer-deps=true` for `eslint-plugin-react` vs ESLint 10 |
| **Sanity audit fixes** | Transitive `js-yaml`/`uuid`/`adm-zip` — use `overrides`; do not downgrade Sanity |
| **sharp** | Override **0.35.0** until Next pins a patched libvips bundle |
| **minimatch / brace-expansion** | Override `minimatch` **^10.2.5** + `brace-expansion` **^5.0.8** (do not override brace-expansion alone — breaks older minimatch) |
| **PM2 deploy** | Always `pm2 delete` then `pm2 start` — `startOrRestart` can keep stale `args` |
| **Next build TS** | `typescript.ignoreBuildErrors: true` — CI `typecheck` is authoritative; green build ≠ type-safe |
| **Production port** | Change only `server.config.cjs` (`PRODUCTION_PORT = 3000`) |
| **Studio** | `sanity`, `@sanity/vision`, `next-sanity` must stay on Sanity 6 matrix |

## After upgrading

- Update GitHub Actions pins in `.github/workflows/ci.yml` (`actions/checkout@v5`, `actions/setup-node@v5`).
- Run `npm run migrate:sanity:dry` if Sanity schema/field APIs changed.
- Re-run `npm run sync:agents` only if agent config files changed — not for every dep bump.
- After Next/React security advisories (esp. RSC/framework CVEs): bump patch within the current minor promptly; re-run lint, typecheck, test, e2e, and build even if the app has no Server Actions.

## PM2 & Hetzner Deployment

* Use Node.js version defined in `.nvmrc` (currently Node **24.18.0**).
* PM2 runs in **fork** mode (`instances: 1` via `ecosystem.config.cjs`).
* Entry: `deploy/runtime.cjs` → `next start` on port **3000** (`server.config.cjs`).
* On deploy: always **`pm2 delete aabtaab-next`** then **`pm2 start ecosystem.config.cjs --update-env`** — do **not** use `startOrRestart` or `pm2 reload` (stale `args` risk).
* Keep app processes free of durable local state (sessions, queues). Rate limits: prefer Redis in production; memory fallback is local/dev only (see `09-security`).
* Do not expose port 3000 directly to the public internet; use Hetzner firewall rules to restrict traffic to Cloudflare origin IP addresses.
* Run the Node application process under a restricted system user rather than `root`.

## CI/CD Workflow

GitHub Actions must run and pass the following checks before any code is deployed:
1. Dependency installation (`npm ci`).
2. Node.js version verification.
3. Linting (`npm run lint`).
4. TypeScript compilation/type-checking.
5. Unit tests (`npm run test`).
6. Production build (`npm run build`).
7. E2E tests (`npx playwright install --with-deps chromium` then `npm run test:e2e`).

Protect the `main` branch. Avoid direct commits to `main` (always use pull requests). Rollback procedures must be kept current.

## Dependency Policy

* Review package maintenance, license, and bundle size impact before installing new dependencies.
* Use existing dependencies before adding new ones; do not install duplicate packages (e.g. two slider or date-formatting libraries).
* Keep packages pinned via `package-lock.json` and use `npm ci` on production servers.
* Prefer well-maintained packages with clear security posture; avoid abandoned libs for security-sensitive paths (auth, crypto, parsing).
* After upgrades, skim release notes for breaking changes (Next, React, Sanity, Zod majors especially).
* Optional Dependabot/Renovate PRs: still run the full verify group; do not auto-merge framework majors.

## Avoid

- Mixing unrelated major upgrades in one change (hard to bisect failures).
- Upgrading studio/CMS packages without checking Sanity 6 release notes.
- Committing `.env`, tokens, or secrets.
- Removing `package-lock.json` — always use lockfile-driven installs (`npm ci` on server).
- Bypassing CI/CD checks for production deployment.
- `npm audit fix --force` when it downgrades `next`, `react`, or `sanity`.
- Installing packages globally in CI or on the VPS for app runtime.
