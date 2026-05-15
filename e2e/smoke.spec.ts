import { test, expect } from "@playwright/test";

const caseStudies = [
  "keycloak-theme",
  "handyman-services",
  "adoreal-platform",
  "just-juice",
];

test("landing page renders all sections", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /sheldon pierce/i })).toBeVisible();
  await expect(page.locator("#featured")).toBeVisible();
  await expect(page.locator("#work")).toBeVisible();
  await expect(page.locator("#about")).toBeVisible();
  await expect(page.locator("#contact")).toBeVisible();
});

test("contact email link is correct", async ({ page }) => {
  await page.goto("/");
  const email = page.getByRole("link", { name: /pierce55@icloud.com/i });
  await expect(email).toHaveAttribute("href", "mailto:pierce55@icloud.com");
});

for (const slug of caseStudies) {
  test(`case study /work/${slug} renders`, async ({ page }) => {
    const res = await page.goto(`/work/${slug}`);
    expect(res?.status()).toBe(200);
    await expect(page.locator("main")).toBeVisible();
  });
}

test("404 on unknown case study", async ({ page }) => {
  const res = await page.goto("/work/does-not-exist");
  expect(res?.status()).toBe(404);
});
