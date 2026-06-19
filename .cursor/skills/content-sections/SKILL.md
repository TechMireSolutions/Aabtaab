---
name: content-sections
description: >-
  Composes CMS-driven page sections from shared components/content/ building
  blocks. Use when adding course/service detail sections, FAQ, CTA bands, or
  portable text page blocks.
---

# Content Sections

**Styling:** skill `tailwind-ui` · **CMS fields:** rule `03-sanity-cms`

## Section library (`components/content/`)

| Component | Typical use |
|-----------|-------------|
| `CourseHeroSection` / `ServiceHeroSection` | Detail page hero |
| `WhyUsImageSection` | Image + bullet list |
| `CommitmentSection` | Numbered commitments |
| `HowItWorksSection` | Step list |
| `FeatureCardGrid` | Check/numbered feature cards |
| `CoursePricingSection` | Pricing tables |
| `CenteredTextSection` | Centered heading + body |
| `CtaBandSection` | Dark CTA band (primary + WhatsApp) |
| `FaqAccordionSection` | FAQ accordion (`chevron` or `plus` icon) |
| `PortableTextPageSection` | CMS portable text body |
| `NestedChildrenGrid` | Parent catalog child cards |
| `NestedBreadcrumbs` | Breadcrumb nav + JSON-LD |

## Typical detail page stack

**Course:** Hero → centered text → features → pricing → how-it-works → portable text → FAQ → CTA

**Service:** Hero → why us → commitment → how-it-works → portable text → FAQ → CTA

## CMS field mapping (current names)

`faqItems`, `faqHeading`, `ctaPrimaryLabel`, `ctaSecondaryLabel`, `ctaHeading`, `ctaSubtitle`, `heroSubtitle`, `heroBody`, `whyUsItems`, `commitmentItems`, `howItWorksSteps`

## CTA pattern

Primary → `/contact` or external URL. Secondary → WhatsApp via `whatsappUrl(settings.whatsapp)`.

## Adding a new section

1. Check if existing section fits with new props
2. If new component needed, place in `components/content/`, use design system utilities
3. Wire CMS fields in schema + GROQ fragment + page component
4. Keep section null-safe (`if (!items?.length) return null`)
