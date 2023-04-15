import { test, expect } from "@playwright/test";
import { HOME_PAGE_URL } from "./constants";

test.describe("the header navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(HOME_PAGE_URL);
  });

  test("open navigation menu on burger button click", async ({ page }) => {
    await page.locator("#burger-button").click();
    const links = [
      { name: "Accueil", href: "/" },
      { name: "Nos Créations", href: "/creations" },
      { name: "Catégories", href: "/#categories" },
      { name: "Panier", href: "/panier" },
    ];

    for (const link of links) {
      const { name, href } = link;
      const domLink = page.getByRole("link", { name });
      const domHref = await domLink.getAttribute("href");

      await expect(domLink).toBeInViewport();
      expect(domHref).toBe(href);
    }
  });
  test("close navigation menu on cross button click", async ({ page }) => {
    const domLink = page.getByRole("link", { name: "Accueil" });
    await page.locator("#burger-button").click();
    await page.locator("#main-menu-close-button").click();
    await expect(domLink).not.toBeInViewport();
  });

  test("basket icon has right link", async ({ page }) => {
    const basketLink = page.locator(".basket-icon-wrapper");
    const expectedHref = "/panier";
    const currentHref = await basketLink.getAttribute("href");
    expect(currentHref).toBe(expectedHref);
  });
});
