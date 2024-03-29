import { test, expect } from "@playwright/test";
import { addItemsToBasket, testPageScreenshotMatch } from "e2e/utils";
import {
  BASKET_ROUTE,
  PRICE_TESTID,
  QUANTITY_TESTID,
  SUBTOTAL_TESTID,
} from "~/lib/constants";

test.describe("basket page with no item added to basket", () => {
  test("snapshot", async ({ page }) => {
    await page.goto(BASKET_ROUTE);
    await page.getByRole("progressbar").waitFor({ state: "hidden" });
    await testPageScreenshotMatch({ page });
  });
});

test.describe("basket page with items added to basket", () => {
  test.beforeEach(addItemsToBasket);

  test("snapshot", async ({ page }) => {
    await page.getByRole("progressbar").waitFor({ state: "hidden" });
    await testPageScreenshotMatch({ page });
  });

  test("option change", async ({ page }) => {
    const orderedProducts = await page.getByRole("article").all();
    expect(orderedProducts).toHaveLength(7);

    let targetOptionName: string | null = null;
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

  test("quantity change", async ({ page }) => {
    const quantityButton = page.getByRole("button", { name: "Quantité: 3" });
    await quantityButton.click();

    const expectedQuantitiesAfterDecrement = ["3", "2", "1", "0", "0"];
    for (const expectedQuantityAfterDecrement of expectedQuantitiesAfterDecrement) {
      await expect(
        page
          .getByRole("alertdialog", { name: "Choisissez une quantité :" })
          .getByText(expectedQuantityAfterDecrement)
      ).toBeVisible();
      await page.getByRole("button").first().click();
    }

    const expectedQuantitiesAfterIncrement = ["0", "1", "2", "3", "4"] as const;
    for (const expectedQuantityAfterIncrement of expectedQuantitiesAfterIncrement) {
      await expect(
        page
          .getByRole("alertdialog", { name: "Choisissez une quantité :" })
          .getByText(expectedQuantityAfterIncrement)
      ).toBeVisible();
      await page.getByRole("button", { name: "+" }).click();
    }

    const afterDecrementLength = expectedQuantitiesAfterDecrement.length;
    const lastExpectedQuantityAfterIncrement =
      expectedQuantitiesAfterDecrement[afterDecrementLength] ??
      "THERE IS NOTHING IN YOUR ARRAY DUMBASS";

    await page.getByRole("button", { name: "Confirmer" }).click();
    await page
      .getByRole("button", {
        name: `Quantité: ${lastExpectedQuantityAfterIncrement}`,
      })
      .isVisible();
  });

  test("remove item", async ({ page }) => {
    const orderedProduct = page.getByRole("article").first();
    while (await orderedProduct.isVisible()) {
      const text = await orderedProduct.innerText();
      const removeButton = orderedProduct.getByRole("button").first();
      await removeButton.click();
      await expect(page.getByText(text)).toBeHidden();
    }
  });

  test("call to action redirect to delivery page", async ({ page }) => {
    await page.getByRole("link", { name: "Passer la commande" }).click();
    const header = page.getByText(/livraison/i).first();
    await expect(header).toBeVisible();
  });

  test("display right total price", async ({ page }) => {
    const displayedPriceRaw = await page
      .getByTestId(SUBTOTAL_TESTID)
      .innerText();
    const orderedProducts = await page.getByRole("article").all();
    let totalPrice = 0;

    for (const orderedProduct of orderedProducts) {
      const rawPrice = await orderedProduct
        .getByTestId(PRICE_TESTID)
        .innerText();
      const rawQuantity = await orderedProduct
        .getByTestId(QUANTITY_TESTID)
        .innerText();

      const quantity = rawQuantity
        .replaceAll(" ", "")
        .replaceAll("Quantité:", "");
      const price = rawPrice.replaceAll(/[\s€]/g, "").replace(",", ".");

      totalPrice += parseFloat(price) * parseInt(quantity);
    }
    const displayedPrice = displayedPriceRaw
      .replaceAll(/[\s€]/g, "")
      .replace(",", ".");

    expect(totalPrice.toFixed(2)).toBe(displayedPrice);
  });
});
