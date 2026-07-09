---
name: testing-vitest-playwright
description: >-
  Vitest unit tests and Playwright E2E testing workflows. Use when writing, debugging, or
  running tests. Rule: 12-testing.
---

# Testing Workflow

**Rule:** `.cursor/rules/12-testing.mdc`

## Commands

| Action | Command |
|--------|---------|
| Run Unit Tests | `npm run test` |
| Watch Unit Tests | `npm run test:watch` |
| Run E2E Tests | `npm run test:e2e` |

## Writing Tests

### 1. Unit Tests (Vitest)
- Place tests in matching names (e.g. `schema.test.ts` for `schema.ts`).
- Focus on testing business functions, mappings, and schemas:
```typescript
import { describe, it, expect } from "vitest";
import { contactFormSchema } from "./schema";

describe("contactFormSchema", () => {
  it("validates correct fields", () => {
    // assert
  });
});
```

### 2. E2E Tests (Playwright)
- Write tests in `e2e/`. Focus on workflows like form inputs, buttons, and navigation.
- Desktop and mobile viewports are configured in `playwright.config.ts`.

## Checklist
- [ ] No flake/failing tests left unaddressed.
- [ ] Mocks used only where necessary (e.g. network requests).
- [ ] CI/CD pipeline compiles and runs all test suites successfully.
