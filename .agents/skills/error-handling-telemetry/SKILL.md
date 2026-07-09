---
name: error-handling-telemetry
description: >-
  Error boundary setup, Sentry monitoring, and logging guidelines. Use when implementing
  error handling, logging, or Sentry tracking. Rule: 11-error-handling-observability.
---

# Error Handling & Telemetry Workflow

**Rule:** `.cursor/rules/11-error-handling-observability.mdc`

## Workflows

### 1. error Boundaries
- Wrap components inside React error boundary components.
- In Next.js App Router, implement layout/page-level handlers in `error.tsx` or `global-error.tsx`.

### 2. sentry Telemetry
- Log server exceptions using `@sentry/nextjs`:
```typescript
import * as Sentry from "@sentry/nextjs";

try {
  // logic
} catch (error) {
  Sentry.captureException(error, {
    tags: { category: "contact_submission" },
  });
}
```
- Ensure sensitive client data is scrubbed before submission.

### 3. API Error Format
- Return consistent error shapes:
```typescript
return NextResponse.json(
  { error: "Internal Server Error" },
  { status: 500 }
);
```

## Verification
- [ ] No internal credentials or stack traces returned to client.
- [ ] UI doesn't crash on unhandled sub-component errors (graceful degradation).
