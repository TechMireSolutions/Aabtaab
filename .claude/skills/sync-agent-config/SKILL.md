---
name: sync-agent-config
description: >-
  Maintains mirrored agent rules and skills across Cursor, Antigravity, and
  Claude Code. Use when editing .cursor/rules/, .cursor/skills/, AGENTS.md,
  CLAUDE.md, or running npm run sync:agents.
disable-model-invocation: true
---

# Sync Agent Config

## Source of truth

Edit **only**:
- `.cursor/rules/*.mdc`
- `.cursor/skills/*/SKILL.md`

Then run:

```bash
npm run sync:agents
```

Update **`AGENTS.md`** and **`CLAUDE.md`** when adding/removing rules or skills.

Stack reference lives in **`techstack.md`**. Rules may include a short version summary aligned with techstack — when versions change, update **techstack first**, then `00` / `05`.

## Mirror targets

| Tool | Rules | Skills |
|------|-------|--------|
| Cursor | `.cursor/rules/` | `.cursor/skills/` |
| Antigravity | `.agents/rules/` | `.agents/skills/` |
| Claude Code | `.claude/rules/` | `.claude/skills/` |

## Script behavior

`scripts/sync-agent-config.mjs`:
- Converts `.mdc` → `.md` (Antigravity trigger/glob frontmatter, Claude headers)
- Copies skills verbatim
- Deletes stale mirrored rule files
- Regenerates `.agents/rules/.cursorrules` and `.geminirules` as index

## Do not edit directly

`.agents/`, `.claude/` mirrored files — changes will be overwritten on sync.

## Index files

| File | Purpose |
|------|---------|
| `AGENTS.md` | Cross-tool rule/skill index |
| `CLAUDE.md` | Claude Code entry point |
| `techstack.md` | Full stack, deps, SEO, production |

## Conflict resolution (canonical)

When rules and skills disagree, follow this order:

1. **`techstack.md`** — factual stack and architecture
2. **Rules (`.cursor/rules/`)** — coding standards and constraints
3. **Skills (`.cursor/skills/`)** — task-specific workflows (must align with rules)

Key resolved policies:
- **Caching:** only `sanity/lib/fetch.ts` uses `unstable_cache`; pages use `sanityFetch` + `lib/cms/queries.ts`
- **Mutations:** Route Handlers under `app/api/` — do not invent Server Actions without an explicit PR
- **React Compiler:** enabled — avoid routine `useMemo` / `useCallback` / `memo`
- **CSP:** `Content-Security-Policy-Report-Only` in `next.config.ts` until enforce is intentional
- **Styling:** `02-tailwind-design-system` — `brand-*` / `gold-*` tokens, `@utility` in `globals.css`
- **CMS fields:** use migrated names (`faqItems`, `seo`, `ctaPrimaryLabel`) — see `03-sanity-cms`
- **Routes:** `/posts` not `/articles`; search at `/search`
- **DRY:** extract UI/CSS/fallbacks at **2+**; use SSOT table in `08-dry-policy`
- **Shells:** `CatalogDarkHero`, `ArticleDetailShell`, `LegalPageShell`, `SiteContactFooter`, `SiteBrandLogo`
- **Footer SSOT:** `lib/fallbacks/footer-nav.ts` + `footer-*` utilities; do not hardcode footer copy/links in `Footer.tsx`
- **External links:** `EXTERNAL_LINK_PROPS` + `OpensInNewTab` / `mapsUrl` / `whatsappUrl` in `lib/urls.ts`
- **Rate limit:** Upstash Redis optional but **strongly recommended** in production; memory fallback for local / Redis errors — see `09-security` / `techstack.md`
- **Secrets:** compare webhook/preview secrets with timing-safe equality when tightening auth; never ship write tokens to the client
- **A11y:** WCAG 2.2 AA intent; one `h1`; `notFound()` for missing CMS detail docs (no soft 404)
- **Mobile / UI UX:** rules `13-mobile-first-responsive` + `14-ui-ux-best-practices`; skill `mobile-responsive-ux`
- **Responsive SSOT:** mobile-first; Tailwind `sm:640` / `md:768` / `lg:1024` / `xl:1280`; fluid layouts; no horizontal page scroll; nav drawer below `md`; verify **375 / 768 / 1440**
- **Error UI:** `app/(site)/{error,not-found,loading}.tsx` exist — extend; keep Sentry on boundaries when DSN set
- **Turnstile:** contact **and** review verify when keys set (`verifyTurnstileOrSkip`)
- **Revalidation:** `revalidateTag` + `CACHE_TAGS` only (no drive-by `revalidatePath`)
- **PM2:** `pm2 delete` then `pm2 start` (never `startOrRestart` / `reload` for this app)
- **Types:** `npm run typecheck` is authoritative (`ignoreBuildErrors` on `next build`)
- **Tests:** Vitest colocated + Playwright `e2e/` (desktop + mobile) — see `12-testing`
- **Skill-first:** read the matching skill before implementing; skills must not contradict rules/techstack

## After editing rules or skills

1. Keep descriptions accurate (skill frontmatter `description` drives discovery).
2. Update **`AGENTS.md`** / **`CLAUDE.md`** if you add/remove a rule or skill.
3. Run `npm run sync:agents`.
4. Prefer additive, actionable guidance — do not invent stack features (PPR, Server Actions, middleware) unless product adopts them.

Stack **versions** live in **`techstack.md`**. Rules `00` / `05` may keep a short aligned summary — update techstack first when versions change.
