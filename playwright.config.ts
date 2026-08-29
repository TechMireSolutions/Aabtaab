import { defineConfig, devices } from "@playwright/test";

const PORT = process.env.PORT || "3005";
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "list",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chrome", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `node scripts/run-next.mjs start --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: false,
    timeout: 180_000,
    env: {
      NEXT_PUBLIC_SANITY_PROJECT_ID: "ci-placeholder",
      NEXT_PUBLIC_SANITY_DATASET: "production",
      NEXT_PUBLIC_SITE_URL: BASE_URL,
      SANITY_API_TOKEN: "mock-api-token",
      SANITY_REVALIDATE_SECRET: "mock-revalidate-secret",
      NODE_ENV: "production",
    },
  },
});
