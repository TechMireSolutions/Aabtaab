# Aabtaab

Shia Islamic education and community website — **Next.js 16**, **React 19**, **Sanity CMS 6**, **Tailwind CSS v4**.

Full stack, dependencies, SEO, security, and production details: **[techstack.md](techstack.md)**.

## Quick start

```bash
cp .env.example .env.local   # fill Sanity + site URL
npm install
npm run dev                    # http://localhost:3000
```

### Required environment

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=              # contact form writes
SANITY_REVALIDATE_SECRET=      # webhook for on-demand ISR
NEXT_PUBLIC_SITE_URL=https://aabtaab.com
```

See [techstack.md](techstack.md) for optional env vars (email, Sentry, preview, rate limiting, Cloudflare).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run test` | Vitest unit tests |
| `npm run test:e2e` | Playwright smoke tests (requires `npm run build` first in CI) |
| `npm run migrate:sanity:dry` | Preview CMS field migrations |
| `npm run migrate:sanity` | Apply CMS field migrations |
| `npm run sync:agents` | Mirror `.cursor/` rules to other agent tools |
| `node scripts/generate-og-default.mjs` | Regenerate `public/og-default.png` |

## Project layout

```
app/(site)/     Public pages (about, courses, services, posts, events, search, contact)
app/api/        Route handlers (contact, revalidate, draft preview)
sanity/         CMS schemas + GROQ queries
lib/cms/        Cached Sanity reads + metadata builders
components/     Shared UI (layout, content sections, cards)
types/          Shared TypeScript types
```

Agent rules and skills: `.cursor/rules/`, `.cursor/skills/` — see `AGENTS.md`.

## Deploy

See [techstack.md](techstack.md) for production setup, Cloudflare, and deploy commands.

## License

MIT — see [LICENSE](LICENSE).
