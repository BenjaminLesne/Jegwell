import { expect, test } from "@playwright/test";
import { HOME_ROUTE } from "~/lib/constants";
import { testPageScreenshotMatch } from "./utils";

test.describe("the navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(HOME_ROUTE);
  });

  test.describe("on mobile", () => {
    test.skip(({ isMobile }) => isMobile === false, "Mobile only!");

    test("navigation drawer match snapshot", async ({ page }) => {
      const burgerButton = page.locator("#burger-button");
      await burgerButton.click();

      await testPageScreenshotMatch({
        page,
        animations: "disabled",
        fullPage: false,
      });
    });

    test("show right page after navigation", async ({ page }) => {
      const burgerButton = page.locator("#burger-button");

      await burgerButton.click();
      await page.getByRole("link", { name: "créations" }).click();
      await expect(
        page.getByRole("heading", { name: "NOS CRÉATIONS" })
      ).toBeVisible();

      await burgerButton.click();
      await page.getByRole("link", { name: "catégories" }).click();
      await expect(
        page.getByRole("heading", { name: "NOS CATÉGORIES" })
      ).toBeInViewport();

      await burgerButton.click();
      await page.getByRole("link", { name: "panier" }).click();
      const emptyBasketMessage = page.getByText(
        "Vous n'avez pas d'article dans votre panier."
      );
      await expect(emptyBasketMessage).toBeVisible();

      await page
        .getByRole("link", { name: "JEGWELL BIJOUX FAITS-MAIN" })
        .click();
      await page.getByTestId("basket icon").click();
      await expect(emptyBasketMessage).toBeVisible();
    });
  });

  test.describe("on desktop", () => {
    test.skip(({ isMobile }) => isMobile, "No mobile allowed!");
    test("show right page after navigation", async ({ page }) => {
      const productsLink = page.getByRole("link", {
        name: "Créations",
        exact: true,
      });
      const productsPageHeader = page.getByRole("heading", {
        name: "NOS CRÉATIONS",
      });

      const categoriesLink = page.getByRole("link", {
        name: "Catégories",
        exact: true,
      });
      const categoriesHeader = page.getByRole("heading", {
        name: "NOS CATÉGORIES",
      });

      const basketTextLink = page.getByRole("link", {
        name: "Panier",
        exact: true,
      });
      const basketPageHeader = page.getByText(
        "Vous n'avez pas d'article dans votre panier."
      );
      const basketIconLink = page.getByTestId("basket icon");

      const homeTextLink = page.getByRole("link", {
        name: "Accueil",
        exact: true,
      });
      const homeHeader = page.getByRole("heading", {
        name: "QUE FAISONS-NOUS ?",
      });
      const homeIconLink = page.getByRole("link", {
        name: "JEGWELL BIJOUX FAITS-MAIN",
      });

      await productsLink.click();
      await expect(productsPageHeader).toBeVisible();

      await categoriesLink.click();
      await expect(categoriesHeader).toBeInViewport();

      await basketTextLink.click();
      await expect(basketPageHeader).toBeVisible();

      await homeTextLink.click();
      await expect(homeHeader).toBeVisible();

      await basketIconLink.click();
      await expect(basketPageHeader).toBeVisible();

      await homeIconLink.click();
      await expect(homeHeader).toBeVisible();
    });
  });
});
