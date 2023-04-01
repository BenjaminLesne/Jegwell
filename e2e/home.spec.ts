import { test, expect } from "@playwright/test";
import { BASE_URL } from "./constants";

test.describe("the header navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });
  test("home match snapshot", async ({ page }) => {
    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot();
  });

  test.only("categories cards have right links", async ({ page }) => {
    const links = [
      { name: "Books", href: "books" },
      { name: "Movies", href: "movies" },
      { name: "Music", href: "music" },
      { name: "Food", href: "food" },
      { name: "Travel", href: "travel" },
      { name: "family", href: "family" },
    ];
    for (const link of links) {
      const { name, href } = link;
      const domLink = page.getByRole("link", { name });
      const domHref = await domLink.getAttribute("href");

      await expect(domLink).toBeVisible();
      expect(domHref).toBe(href);
    }
  });
});
