import { test, expect } from "@playwright/test";
import { BASKET_ROUTE, PRODUCTS_ROUTE } from "~/lib/constants";


test.describe("basket page with no item added to basket", () => {
  test("snapshot", async ({ page }) => {
    await page.goto(BASKET_ROUTE);
    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot();
  });
});

test.describe("basket page with items added to basket", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PRODUCTS_ROUTE);
    await page
      .getByRole("listitem")
      .filter({ hasText: "test31 €Ajouter au panierAjouté ✓" })
      .getByRole("button", { name: "Ajouter au panier Ajouté ✓" })
      .click();
    await page
      .getByRole("listitem")
      .filter({ hasText: "test10 €Ajouter au panierAjouté ✓" })
      .getByRole("button", { name: "Ajouter au panier Ajouté ✓" })
      .dblclick();
    await page
      .getByRole("listitem")
      .filter({ hasText: "test220 €Ajouter au panierAjouté ✓" })
      .getByRole("button", { name: "Ajouter au panier Ajouté ✓" })
      .click();
    await page
      .getByRole("listitem")
      .filter({ hasText: "Test435 €Ajouter au panierAjouté ✓" })
      .getByRole("button", { name: "Ajouter au panier Ajouté ✓" })
      .click();
    await page
      .getByRole("listitem")
      .filter({ hasText: "Paris55,55 €Ajouter au panierAjouté ✓" })
      .getByRole("button", { name: "Ajouter au panier Ajouté ✓" })
      .click();
    await page
      .getByRole("listitem")
      .filter({ hasText: "Rennes77,77 €Ajouter au panierAjouté ✓" })
      .getByRole("button", { name: "Ajouter au panier Ajouté ✓" })
      .click();
    await page
      .getByRole("listitem")
      .filter({ hasText: "Bruz88,99 €Ajouter au panierAjouté ✓" })
      .getByRole("button", { name: "Ajouter au panier Ajouté ✓" })
      .click();
    await page
      .getByRole("listitem")
      .filter({ hasText: "Paris55,55 €Ajouter au panierAjouté ✓" })
      .getByRole("button", { name: "Ajouter au panier Ajouté ✓" })
      .dblclick();
    await page.locator("a:nth-child(5)").click();
    await page.waitForURL(BASKET_ROUTE);
    await page
      .getByRole("progressbar")
      .locator("div")
      .waitFor({ state: "hidden" });
  });

  test("snapshot", async ({ page }) => {
    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot();
  });

  test("option change", async ({ page }) => {
    const orderedProducts = await page.getByRole("article").all();
    expect(orderedProducts.length).toBe(7);

    let targetOptionName: string | null = null;
    await page.pause();
    for (const orderedProduct of orderedProducts) {
      await orderedProduct
        .getByRole("button")
        .filter({ hasText: "Option" })
        .click();

      const options = await page.getByRole("list").getByRole("button").all();
      const targetOption = options[1];
      if (targetOption) {
        targetOptionName = await targetOption.innerText();
        await targetOption.click();
        break;
      } else {
        await page.getByRole("button", { name: "Annuler" }).click();
        continue;
      }
    }

    expect(targetOptionName).toBeTruthy();

    await page
      .getByRole("button")
      .filter({
        hasText: targetOptionName ?? "did not find an extra option man",
      })
      .click();
    await page.getByRole("button", { name: "Confirmer" }).click();
  });

  test.only("quantity change", async ({ page }) => {
    await page.pause();
    // expect(await page.screenshot({ fullPage: true })).toMatchSnapshot();
  });
  test("remove item", async ({ page }) => {
    // expect(await page.screenshot({ fullPage: true })).toMatchSnapshot();
  });
});
