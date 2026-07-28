# dependencies upgrade

> Upgrade dependencies and tech stack to latest compatible versions safely

**Scope:** `{package.json,package-lock.json,.github/**,.nvmrc,ecosystem.config.cjs,server.config.cjs}`

# Dependencies & Stack Upgrades

**Goal:** Keep the stack on **latest stable, compatible** versions — not bleeding-edge canaries.

Apply when upgrading deps, touching `package.json`, CI, or Node engine constraints.

## Stack targets (keep aligned)

| Layer | Target |
|-------|--------|
| Runtime | Node **24.17** (`.nvmrc`; `engines` ≥22.12) |
| Framework | Next.js **16.2.12** (match `eslint-config-next`) |
| UI | React **19.2.8** + React Compiler **1.0** |
| CMS | Sanity **6.7** + `next-sanity` **13.2** + `@sanity/client` **7.25** |
| CSS | Tailwind **4.3.3** + `@tailwindcss/postcss` |
| Language | TypeScript **6.0.3** (primary) + **7.0.2** alias `typescript-7` |

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
- Keep **`eslint-config-next`** version aligned with **`next`**.
- Upgrade **peer-dependent** packages together (e.g. `@types/react` with `react`).

## Known constraints (this repo)

| Package | Constraint |
|---------|------------|
| **ESLint** | **10.x** OK with `settings.react.version` in `eslint.config.mjs` (workaround for `eslint-plugin-react` until it supports ESLint 10) |
| **TypeScript** | Primary **6.0.3** for ESLint/`typescript-eslint` (peer `<6.1`). Optional **7.0.2** via `typescript-7` alias — do not replace primary until TS 7.1 API |
| **Sanity audit fixes** | Transitive `js-yaml`/`uuid`/`adm-zip` — use `overrides`; do not downgrade Sanity |
| **sharp** | Override **0.35.0** until Next pins a patched libvips bundle |
| **minimatch / brace-expansion** | Override `minimatch` **^10.2.5** + `brace-expansion` **^5.0.8** (do not override brace-expansion alone — breaks ESLint minimatch 3) |
| **PM2 deploy** | Always `pm2 delete` then `pm2 start` — `startOrRestart` can keep stale `args` |
| **Production port** | Change only `server.config.cjs` (`PRODUCTION_PORT = 3000`) |
| **Studio** | `sanity`, `@sanity/vision`, `next-sanity` must stay on Sanity 6 matrix |

## After upgrading

- Update GitHub Actions pins in `.github/workflows/ci.yml` (`actions/checkout@v5`, `actions/setup-node@v5`).
- Run `npm run migrate:sanity:dry` if Sanity schema/field APIs changed.
- Re-run `npm run sync:agents` only if agent config files changed — not for every dep bump.

## PM2 & Hetzner Deployment

* Use Node.js version defined in `.nvmrc` (currently Node **24.17.0**).
* PM2 runs in **fork** mode (`instances: 1` via `ecosystem.config.cjs`).
* Processes must remain completely stateless: do not store sessions, rate limits, or message queues in local process memory.
* Do not expose port 3000 directly to the public internet; use Hetzner firewall rules to restrict traffic to Cloudflare origin IP addresses.
* Run the Node application process under a restricted system user rather than `root`.
* Perform zero-downtime reloads (`pm2 reload`) where supported.

## CI/CD Workflow

GitHub Actions must run and pass the following checks before any code is deployed:
1. Dependency installation (`npm ci`).
2. Node.js version verification.
3. Linting (`npm run lint`).
4. TypeScript compilation/type-checking.
5. Unit tests (`npm run test`).
6. Production build (`npm run build`).
7. E2E smoke tests (`npm run test:e2e`).

Protect the `main` branch. Avoid direct commits to `main` (always use pull requests). Rollback procedures must be kept current.

## Dependency Policy

* Review package maintenance, license, and bundle size impact before installing new dependencies.
* Use existing dependencies before adding new ones; do not install duplicate packages (e.g. two slider or date-formatting libraries).
* Keep packages pinned via `package-lock.json` and use `npm ci` on production servers.

## Avoid

- Mixing unrelated major upgrades in one change (hard to bisect failures).
- Upgrading studio/CMS packages without checking Sanity 6 release notes.
- Committing `.env`, tokens, or secrets.
- Removing `package-lock.json` — always use lockfile-driven installs (`npm ci` on server).
- Bypassing CI/CD checks for production deployment.

