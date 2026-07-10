import { test, expect } from "@playwright/test";

test.describe("public site smoke", () => {
  test("homepage loads with main content", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#main-content")).toBeVisible();
    await expect(page.getByRole("link", { name: /skip to main/i })).toBeVisible();
  });

  test("contact page loads", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator("#main-content")).toBeVisible();
    await expect(page.getByRole("textbox", { name: /first name/i })).toBeVisible();
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
    await expect(page.getByRole("heading", { name: /dar ul quran reader/i })).toBeVisible();
  });
});
