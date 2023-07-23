import { test, expect } from "@playwright/test";
import { testPageScreenshotMatch, waitLoadingEnds } from "e2e/utils";
import { PRODUCTS_ROUTE, SINGLE_PRODUCT_ROUTE } from "~/lib/constants";

test.describe("single product page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PRODUCTS_ROUTE);
    await page.getByRole("link", { name: "Bruz" }).first().click();
  });
  test("snapshot", async ({ page }) => {
    await testPageScreenshotMatch({ page });
  });

  test("product informaiton displayed", async ({ page }) => {
    await expect(page.getByRole("img", { name: "Bruz" })).toBeVisible();
    await page.getByRole("button", { name: "• 2" }).click();
    await expect(page.getByRole("img", { name: "Bruz Vert" })).toBeVisible();
    await expect(page.getByText("13,99 €")).toBeVisible();
    await expect(
      page.locator("span").filter({ hasText: "Bruz" })
    ).toBeVisible();
    await expect(
      page.getByText(
        "Decription opas ouf Lorem Ipsum is simply dummy text of the printing and typeset"
      )
    ).toBeVisible();
  });
  test.describe("add to basket", () => {
    test("option button", async ({ page }) => {
      await page.getByRole("button", { name: "Option: Aucune" }).click();
      await expect(
        page.getByRole("button").filter({ hasText: "Original" })
      ).toBeVisible();
      await page.getByRole("button").filter({ hasText: "Vert" }).click();
      await page.getByRole("button", { name: "Confirmer" }).click();
      const optionButton = page.getByRole("button", { name: "Option: Vert" });

      await expect(optionButton).toBeVisible();
      await optionButton.click();
      await page.getByRole("button", { name: "Annuler" }).click();

      await expect(
        page.getByRole("button", { name: "Confirmer" })
      ).toBeHidden();

      await page
        .getByRole("button", { name: "Ajouter au panier Ajouté ✓" })
        .click();
      await page.getByTestId("basket icon").click();
      await expect(page.getByRole("heading", { name: "Bruz" })).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Option: Vert" })
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Quantité: 1" })
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
