import { expect, type Page } from "@playwright/test";
import {
  BASKET_ICON_TESTID,
  BASKET_ROUTE,
  PRODUCTS_ROUTE,
} from "~/lib/constants";

type TestArgs = {
  page: Page;
  animations: "disabled";
  fullPage: boolean;
};

export const waitLoadingEnds = async ({ page }: TestArgs) => {
  const progressBar = page.getByRole("progressbar").first();
  let progressIsVisible = await progressBar.isVisible();

  while (progressIsVisible) {
    await progressBar.waitFor({ state: "hidden" });

    const newProgressBar = page.getByRole("progressbar").first();
    const newProgressBarIsVisble = await newProgressBar.isVisible();
    progressIsVisible = newProgressBarIsVisble;
  }

  await expect(progressBar).toBeHidden();
};

export async function testPageScreenshotMatch({ page, ...options }: TestArgs) {
  await expect(page).toHaveScreenshot({
    fullPage: true,
    ...options,
  });
}

export const addItemsToBasket = async ({ page }: TestArgs) => {
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

  await page.getByTestId(BASKET_ICON_TESTID).click();
  await page.waitForURL(BASKET_ROUTE);
  await waitLoadingEnds({ page });
};
