---
name: content-sections
description: >-
  Composes CMS-driven page sections from shared components/content/ building
  blocks. Use when adding course/service detail sections, FAQ, CTA bands, or
  portable text page blocks.
---

# Content Sections

**Styling:** skill `tailwind-ui` · **CMS fields:** rule `03-sanity-cms` · **DRY:** rule `08-dry-policy`

## Section library (`components/content/`)

| Component | Typical use |
|-----------|-------------|
| `CatalogDarkHero` | Shared dark media hero shell (SSOT) |
| `CourseHeroSection` / `ServiceHeroSection` | Detail heroes (compose `CatalogDarkHero`) |
| `WhyUsImageSection` | Image + bullet list |
| `CommitmentSection` | Numbered commitments |
| `HowItWorksSection` | Step list |
| `FeatureCardGrid` | Check/numbered feature cards |
| `CoursePricingSection` | Pricing tables |
| `CenteredTextSection` | Centered heading + body |
| `CtaBandSection` | Dark CTA band (primary + WhatsApp); optional `footer`; external CTAs use `EXTERNAL_LINK_PROPS` + `OpensInNewTab` |
| `SiteContactFooter` | Email/phone under CTA (courses **and** services) — built from `buildFooterContactItems` |
| `FaqAccordionSection` | FAQ accordion (`chevron` or `plus` icon) |
| `PortableTextPageSection` | CMS portable text body |
| `NestedChildrenGrid` | Parent catalog child cards |
| `NestedBreadcrumbs` | Breadcrumb nav + JSON-LD |
| `SearchEmptyState` | Empty search + quick links (`lib/fallbacks/nav.ts`) |

## Layout shells (`components/layout/`)

| Component | Typical use |
|-----------|-------------|
| `Header` / `Footer` | Site chrome — data from `getSiteLayoutData()`; footer copy/links from `lib/fallbacks/footer-nav.ts` |
| `SiteBrandLogo` | Shared header/footer brand mark (`variant="header" \| "footer"`) |
| `PageHeader` | Catalog/CMS page headers (`above` slot for donate verse, etc.) |
| `ArticleDetailShell` | Posts + events detail chrome (back + article) |
| `LegalPageShell` / `LegalSection` | Privacy + terms |
| `DetailBackButton` | Sticky back link (used by article shell) |
| `CatalogPageLayout` | Listing pages |

## Typical detail page stack

**Course:** Hero → centered text → features → pricing → how-it-works → portable text → FAQ → CTA (`SiteContactFooter`)

**Service:** Hero → why us → commitment → how-it-works → CTA (`SiteContactFooter`) → portable text → FAQ

**Post / event:** `ArticleDetailShell` → title/meta → media → prose → FAQ (posts)

## CMS field mapping (current names)

`faqItems`, `faqHeading`, `ctaPrimaryLabel`, `ctaSecondaryLabel`, `ctaHeading`, `ctaSubtitle`, `heroSubtitle`, `heroBody`, `whyUsItems`, `commitmentItems`, `howItWorksSteps`

## CTA pattern

Primary → `/contact` or external URL. Secondary → WhatsApp via `whatsappUrl(settings.whatsapp)`.  
External primary/secondary links: spread `EXTERNAL_LINK_PROPS` and render `OpensInNewTab`.  
Pass `footer={<SiteContactFooter site={site} />}` on course **and** service CTA bands.

## Site footer (do not reimplement)

- **Presentation:** `components/layout/Footer.tsx` — compose only.
- **SSOT data/copy:** `lib/fallbacks/footer-nav.ts` (`FALLBACK_QUICK_LINKS`, `FOOTER_CTA`, `FOOTER_LEGAL_LINKS`, `buildFooterServiceNavLinks`, `buildFooterContactItems`, `buildFooterSocialLinks`, `resolveFooterTagline`, …).
- **Layout fetch:** `getSiteLayoutData()` applies `resolveFooterNavForLayout`.
- **Styles:** `footer-*` utilities in `app/globals.css` (forced-dark chrome).

## Adding a new section

1. Check if an existing section or shell fits with new props
2. If new, place in `components/content/` or `components/layout/`; use design-system utilities
3. Wire CMS fields in schema + GROQ fragment + page component
4. Keep section null-safe (`if (!items?.length) return null`)
5. Prefer fallbacks in `lib/fallbacks/` over hard-coded page copy
6. One job per section: one heading + short support copy; compose rather than mega-sections
7. Extract at **2+** uses (`08-dry-policy`); match `tailwind-ui` utilities
8. Verify keyboard/`aria` for interactive sections (FAQ accordion, etc.)
