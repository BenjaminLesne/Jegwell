import { test, expect } from "@playwright/test";
import { HOME_PAGE_URL } from "./constants";

test.describe("the header navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(HOME_PAGE_URL);
  });
  test("home match snapshot", async ({ page }) => {
    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot();
  });

  test("categories cards have right links", async ({ page }) => {
    const links = [{ name: "boucle d'oreilles", href: "boucle d'oreilles" }];
    for (const link of links) {
      const { name, href } = link;
      const domLink = page.getByRole("link", { name });
      const domHref = await domLink.getAttribute("href");

      await expect(domLink).toBeVisible();
      expect(domHref).toBe(href);
    }
  });
});
