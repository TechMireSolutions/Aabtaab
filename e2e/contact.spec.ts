import { test, expect } from "@playwright/test";

test.describe("contact form validation", () => {
  test("blocks empty submit via native required fields", async ({ page }) => {
    await page.goto("/contact");

    const form = page.locator("#main-content form");
    const firstName = form.getByRole("textbox", { name: /first name/i });
    await expect(firstName).toBeVisible();

    await form.getByRole("button", { name: /send message/i }).click();

    const invalid = await firstName.evaluate(
      (el) => (el as HTMLInputElement).validity.valueMissing,
    );
    expect(invalid).toBe(true);
    await expect(page).toHaveURL(/\/contact/);
  });

  test("flags invalid email before submit", async ({ page }) => {
    await page.goto("/contact");
    const form = page.locator("#main-content form");

    await form.getByRole("textbox", { name: /first name/i }).fill("Ali");
    await form.locator("input[name='email']").fill("not-an-email");
    await form.getByRole("textbox", { name: /phone/i }).fill("+15550100");
    await form.getByRole("textbox", { name: /country/i }).fill("USA");
    await form.getByRole("textbox", { name: /city/i }).fill("Chicago");
    await form
      .getByRole("textbox", { name: /message/i })
      .fill("Please tell me more about your courses.");

    await form.getByRole("button", { name: /send message/i }).click();

    const valid = await form
      .locator("input[name='email']")
      .evaluate((el) => (el as HTMLInputElement).validity.valid);
    expect(valid).toBe(false);
    await expect(page).toHaveURL(/\/contact/);
  });

  test("purpose radios are selectable", async ({ page }) => {
    await page.goto("/contact");
    const group = page.getByRole("radiogroup", { name: /purpose/i });
    await expect(group).toBeVisible();

    await group.getByRole("radio", { name: /course enrollment/i }).click();
    await expect(
      group.getByRole("radio", { name: /course enrollment/i }),
    ).toHaveAttribute("aria-checked", "true");
  });
});
