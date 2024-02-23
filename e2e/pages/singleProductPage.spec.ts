import { test, expect } from "@playwright/test";
import { testPageScreenshotMatch } from "e2e/utils";
import {
  EVENT_SCENE_LOADED,
  NO_OPTION_TEXT,
  PRODUCTS_ROUTE,
} from "~/lib/constants";

declare global {
  interface Window {
    isSceneLoaded: boolean | Promise<unknown>;
  }
}

test.describe("single product page", () => {
  test.beforeEach(async ({ page, headless }) => {
    test.setTimeout(30_000 * 12);
    const isHeaded = headless === false;
    if (isHeaded) {
      await page.addInitScript(
        ({ EVENT_SCENE_LOADED }) => {
          let resolveSceneLoaded: (value?: unknown) => void = () => void {};
          window.isSceneLoaded = new Promise(
            (resolve) => (resolveSceneLoaded = resolve),
          );
          window.addEventListener(EVENT_SCENE_LOADED, () =>
            resolveSceneLoaded(),
          );
        },
        { EVENT_SCENE_LOADED },
      );
    }

    const productName = "Bruz";
    const quantity = page.getByTestId("quantity");

    await page.goto(PRODUCTS_ROUTE);

    await page.getByRole("link", { name: productName }).first().click();

    if (isHeaded) {
      await page.waitForFunction(() => window.isSceneLoaded);
    }

    await expect(quantity).toBeVisible();
  });

  test.only("snapshot", async ({ page }) => {
    await testPageScreenshotMatch({ page });
  });

  test("product informaiton displayed", async ({ page }) => {
    await expect(page.getByRole("img", { name: "Bruz" })).toBeVisible();
    await page.getByRole("button", { name: "• 2" }).click();
    await expect(page.getByRole("img", { name: "Bruz Vert" })).toBeVisible();
    await expect(page.getByText("13,99 €")).toBeVisible();
    await expect(
      page.locator("span").filter({ hasText: "Bruz" }),
    ).toBeVisible();
    await expect(
      page.getByText(
        "Decription opas ouf Lorem Ipsum is simply dummy text of the printing and typeset",
      ),
    ).toBeVisible();
  });
  test.describe("add to basket", () => {
    test("option button", async ({ page }) => {
      await page
        .getByRole("button", { name: `Option: ${NO_OPTION_TEXT}` })
        .click();
      await expect(
        page.getByRole("button").filter({ hasText: NO_OPTION_TEXT }),
      ).toBeVisible();
      await page.locator("button").filter({ hasText: "Vert" }).click();
      await page.getByRole("button", { name: "Confirmer" }).click();
      const optionButton = page.getByRole("button", { name: "Option: Vert" });

      await expect(optionButton).toBeVisible();
      await optionButton.click();
      await page.getByRole("button", { name: "Annuler" }).click();

      await expect(
        page.getByRole("button", { name: "Confirmer" }),
      ).toBeHidden();

      const addToBasketButton = page.getByRole("button", {
        name: "Ajouter au panier Ajouté ✓",
      });
      await addToBasketButton.waitFor({ state: "visible" });
      await addToBasketButton.click();
      await page.getByTestId("basket icon").click();
      await expect(page.getByRole("heading", { name: "Bruz" })).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Option: Vert" }),
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Quantité: 1" }),
      ).toBeVisible();
    });

    test("quantity button", async ({ page }) => {
      await page.getByRole("button", { name: "Quantité: 1" }).click();
      await page.getByRole("button", { name: "+" }).click();
      await page.getByRole("button", { name: "+" }).click();
      await page.getByRole("button", { name: "Confirmer" }).click();
      await page
        .getByRole("button", { name: "Ajouter au panier Ajouté ✓" })
        .click();
      await page.getByTestId("basket icon").click();
      await page.getByRole("button", { name: "Quantité: 3" }).click();
    });
  });
});
