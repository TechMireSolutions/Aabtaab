import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "list",
  use: {
    baseURL: "https://aabtaab.com",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "node scripts/start-production.cjs",
    url: "https://aabtaab.com",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      NEXT_PUBLIC_SANITY_PROJECT_ID: "ci-placeholder",
      NEXT_PUBLIC_SANITY_DATASET: "production",
      NEXT_PUBLIC_SITE_URL: "https://aabtaab.com",
      SANITY_API_TOKEN: "mock-api-token",
      SANITY_REVALIDATE_SECRET: "mock-revalidate-secret",
      NODE_ENV: "production",
    },
  },
});
