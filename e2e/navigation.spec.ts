import { test, expect, type Page } from "@playwright/test";

async function openMainNav(page: Page) {
  const desktopNav = page.locator("header nav[aria-label='Main navigation']");
  if (await desktopNav.isVisible()) {
    return desktopNav;
  }

  await page.getByRole("button", { name: /open navigation menu/i }).click();
  const mobileNav = page.getByRole("navigation", { name: /main navigation/i });
  await expect(mobileNav).toBeVisible();
  return mobileNav;
}

test.describe("navigation", () => {
  test("main nav exposes primary destinations", async ({ page }) => {
    await page.goto("/");
    const nav = await openMainNav(page);
    const links = nav.getByRole("link");
    await expect(links.first()).toBeVisible();
    expect(await links.count()).toBeGreaterThanOrEqual(3);

    // Stable across CMS overrides — at least one catalog destination
    await expect(
      nav.getByRole("link", { name: /services|online|courses|classes/i }).first(),
    ).toBeVisible();
  });

  test("header brand link returns home", async ({ page }) => {
    await page.goto("/about");
    await page.locator("header a[href='/']").first().click();
    await expect(page).toHaveURL("/");
    await expect(page.locator("#main-content")).toBeVisible();
  });

  test("footer legal links resolve", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await footer.getByRole("link", { name: /privacy policy/i }).click();
    await expect(page).toHaveURL(/privacy-policy/);
    await expect(page.locator("#main-content")).toBeVisible();

    await page.goto("/");
    await page
      .locator("footer")
      .getByRole("link", { name: /terms/i })
      .click();
    await expect(page).toHaveURL(/terms-of-service/);
    await expect(page.locator("#main-content")).toBeVisible();
  });
});
