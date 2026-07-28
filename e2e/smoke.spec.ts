import { test, expect } from "@playwright/test";

test.describe("public site smoke", () => {
  test("homepage loads with main content and skip link", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#main-content")).toBeVisible();
    await expect(
      page.getByRole("link", { name: /skip to main/i }),
    ).toBeVisible();
  });

  test("contact page loads with form fields", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator("#main-content")).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: /first name/i }),
    ).toBeVisible();
    await expect(
      page.locator("#main-content form input[name='email']"),
    ).toBeVisible();
    await expect(
      page.getByRole("radiogroup", { name: /purpose/i }),
    ).toBeVisible();
  });

  test("events page loads", async ({ page }) => {
    await page.goto("/events");
    await expect(page.locator("#main-content")).toBeVisible();
  });

  test("online courses catalog loads", async ({ page }) => {
    await page.goto("/online-courses");
    await expect(page.locator("#main-content")).toBeVisible();
  });

  test("services catalog loads", async ({ page }) => {
    await page.goto("/services");
    await expect(page.locator("#main-content")).toBeVisible();
  });

  test("dar ul quran page loads", async ({ page }) => {
    await page.goto("/dar-ul-quran");
    await expect(page.locator("#main-content")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /dar ul quran reader/i }),
    ).toBeVisible();
  });

  test("about, donate, and articles pages load", async ({ page }) => {
    for (const path of ["/about", "/donate", "/posts"]) {
      await page.goto(path);
      await expect(page.locator("#main-content")).toBeVisible();
    }
  });

  test("search page loads", async ({ page }) => {
    await page.goto("/search");
    await expect(page.locator("#main-content")).toBeVisible();
  });
});
