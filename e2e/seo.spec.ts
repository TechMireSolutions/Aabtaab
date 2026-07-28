import { test, expect } from "@playwright/test";

test.describe("seo and robots", () => {
  test("homepage has title and canonical metadata", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/aabtaab/i);
    const canonical = page.locator('link[rel="canonical"]');
    // NEXT_PUBLIC_SITE_URL is baked at build time — assert absolute URL shape only
    await expect(canonical).toHaveAttribute("href", /^https?:\/\//);
  });

  test("robots.txt disallows studio, api, and search", async ({ request }) => {
    const res = await request.get("/robots.txt");
    expect(res.ok()).toBeTruthy();
    const body = await res.text();
    expect(body).toMatch(/Disallow:\s*\/studio\//i);
    expect(body).toMatch(/Disallow:\s*\/api\//i);
    expect(body).toMatch(/Disallow:\s*\/search/i);
    expect(body).toMatch(/Sitemap:\s*https?:\/\/.+\/sitemap\.xml/i);
  });

  test("unknown route returns 404", async ({ page }) => {
    const res = await page.goto(
      `/this-page-does-not-exist-${Date.now()}`,
    );
    expect(res?.status()).toBe(404);
    await expect(page.locator("body")).toBeVisible();
  });
});
