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

Stack reference lives in **`techstack.md`** — not duplicated in rules.

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
- **Styling:** `02-tailwind-design-system` — `brand-*` tokens, `@utility` in `globals.css`
- **CMS fields:** use migrated names (`faqItems`, `seo`, `ctaPrimaryLabel`) — see `03-sanity-cms`
- **Routes:** `/posts` not `/articles`; search at `/search`
