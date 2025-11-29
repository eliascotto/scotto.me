import { test, expect } from "@playwright/test";

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

test.describe("Blog E2E", () => {
  test("home links to the blog and sections render", async ({ page }) => {
    await page.goto("/");

    const navigation = page.getByRole("navigation");
    await expect(navigation.getByRole("link", { name: "Home" })).toBeVisible();
    await navigation.getByRole("link", { name: "Blog" }).click();

    await expect(page).toHaveURL(/\/blog\/?$/);
    await page.waitForLoadState("networkidle");
    await expect(page.locator('h2.title-heading').filter({ hasText: 'Articles' })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('h2.title-heading').filter({ hasText: 'Reviews' })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('h2.title-heading').filter({ hasText: 'Tech' })).toBeVisible({ timeout: 10000 });
  });

  test("latest posts widget shows five items and links to posts", async ({ page }) => {
    await page.goto("/");

    const latestPosts = page.locator('h2:has-text("Latest posts") ~ div div.my-2');
    await expect(latestPosts).toHaveCount(5);

    const firstPostTitle = (await latestPosts.first().locator("a").textContent())?.trim() ?? "";
    await latestPosts.first().locator("a").click();

    const safeTitle = escapeRegExp(firstPostTitle);
    await expect(page.getByRole("heading", { level: 1, name: new RegExp(safeTitle, "i") })).toBeVisible();
  });

  test("tech articles open and show metadata", async ({ page }) => {
    await page.goto("/blog/");
    await page.waitForLoadState("networkidle");

    const techHeading = page.locator('h2.title-heading').filter({ hasText: 'Tech' });
    await expect(techHeading).toBeVisible({ timeout: 10000 });
    const techSection = techHeading.locator('..').locator('+ div');
    const techLinks = techSection.locator('a.font-title');
    await expect(techLinks).not.toHaveCount(0);

    const firstTechTitle = (await techLinks.first().textContent())?.trim() ?? "";
    await techLinks.first().click();

    const safeTitle = escapeRegExp(firstTechTitle);
    await expect(page.getByRole("heading", { level: 1, name: new RegExp(safeTitle, "i") })).toBeVisible();
    await expect(page.locator("article time")).not.toHaveText("");
    await expect(page.locator("article .post")).not.toHaveText("");
  });

  test("translated articles switch languages", async ({ page }) => {
    await page.goto("/blog/");
    await page.waitForLoadState("networkidle");

    const articleLink = page.locator('a.font-title').filter({ hasText: 'Time Out of Joint' }).first();
    await expect(articleLink).toBeVisible({ timeout: 10000 });
    await articleLink.click();
    
    const italianLink = page.locator('a:has-text("Versione italiana")');
    await expect(italianLink).toBeVisible();

    await italianLink.click();
    await expect(page).toHaveURL(/\/ita\/?$/);
    await expect(page.locator('a:has-text("English version")')).toBeVisible();
  });

  test("tags page surfaces posts for a tag", async ({ page }) => {
    await page.goto("/tags/");
    await page.waitForLoadState("networkidle");

    await page.waitForSelector("main a", { timeout: 10000 });
    const firstTag = page.locator("main a").first();
    const tagLabel = (await firstTag.textContent())?.trim() ?? "";
    await firstTag.click();

    const normalizedTag = tagLabel.replace(/^#/, "");
    const safeTag = escapeRegExp(normalizedTag);
    // The h1 may contain a "/" decoration and newlines before the tag name
    await expect(page.locator(`h1:has-text("#${normalizedTag}")`)).toBeVisible();

    const taggedPosts = page.locator("div:has(> a.font-title)");
    expect(await taggedPosts.count()).toBeGreaterThan(0);
  });
});
