---
trigger: glob
glob: **/*.{test,spec}.{ts,tsx}
description: Testing rules — Vitest unit tests, Playwright E2E tests, and regression testing standards
---

# Testing Rules

## 1. Unit Testing with Vitest

Write unit tests for pure-logic utilities, data validators, and formatting helpers. Specifically:
* Zod schemas (e.g. contact form schema, environment schemas)
* Data transformation utilities
* URL and slug utilities
* Metadata and JSON-LD generation
* GROQ query result mapping
* Rate-limit helpers
* Email payload construction
* Security-sensitive utility functions

Rules:
* Tests must cover normal, boundary, and invalid inputs.
* Do not write tests for framework internals (e.g., Next.js routing, React rendering engines).
* Configured via `vitest.config.ts`. Run unit tests with `npm run test`.

## 2. End-to-End Testing with Playwright

Maintain Playwright coverage for critical user flows:
* Homepage loads successfully.
* Main navigation and mobile navigation work.
* Course and service detail pages render correctly.
* Contact form validation works, and successful contact submission completes in a controlled environment.
* Invalid contact submissions are rejected.
* Rate-limit responses are handled gracefully.
* Critical metadata and SEO elements exist.
* Missing pages return a correct `404` status/layout.
* Studio and preview routes are not publicly indexable.
* Primary CTA links work.

Rules:
* Test both desktop and mobile viewport configurations.
* Avoid tests that depend on unstable or frequently changing production content.
* Use stable test identifiers (`data-testid`) only when accessible selectors (e.g., text, labels, roles) are insufficient.
* Run E2E tests using `npm run test:e2e` (configured via `playwright.config.ts`).

## 3. Regression Requirements

* Every bug fix should include a regression test when practical.
* Do not reduce test coverage or remove tests merely to make CI pass.
* Flaky tests must be investigated and corrected, not repeatedly retried without resolution.
