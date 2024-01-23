import { expect, type Page } from "@playwright/test";
import { env } from "~/env.mjs";
import {
  BASKET_ICON_TESTID,
  BASKET_ROUTE,
  DELIVERY_ROUTE,
  PRODUCTS_ROUTE,
} from "~/lib/constants";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";

type TestArgs = {
  page: Page;
  animations?: "disabled";
  fullPage?: boolean;
};
export const deliveryBeforeEach = async ({ page }: TestArgs) => {
  await addItemsToBasket({ page });

  await page.goto(DELIVERY_ROUTE);
  await waitLoadingEnds({ page });

  const header = page.getByText("Livraison").first();
  await expect(header).toBeVisible();
};

export const submitDeliveryForm = async ({ page }: TestArgs) => {
  const goToPaymentButton = page.getByRole("button", {
    name: "Passer au paiement",
  });
  const firstnameInput = page.getByPlaceholder("Héloïse");
  const lastnameInput = page.getByPlaceholder("Dior");
  const emailInput = page.getByPlaceholder("exemple@jegwell.fr");
  const phoneInput = page.getByPlaceholder("0612345678");
  const expressOption = page.getByRole("radio", { name: "Express" });
  const address1Input = page.getByPlaceholder("16 rue de la Genetais");
  const cityInput = page.getByPlaceholder("Paris");
  const postalCodeInput = page.getByPlaceholder("35170");
  const commentInput = page.getByPlaceholder("J'adore Jegwell !");

  await addItemsToBasket({ page });
  await page.getByRole("link", { name: "Passer la commande" }).click();
  await page.waitForURL(env.BASE_URL + DELIVERY_ROUTE);

  await firstnameInput.click();
  await page.keyboard.type("Héloise");

  await lastnameInput.click();
  await page.keyboard.type("Dior");

  await emailInput.click();
  await page.keyboard.type("bot@jegwell.fr");

  await phoneInput.click();
  await page.keyboard.type("0606060606");

  await expressOption.click();

  await address1Input.click();
  await page.keyboard.type("16 rue antoine");

  await cityInput.click();
  await page.keyboard.type("Paris");

  await postalCodeInput.click();
  await page.keyboard.type("35170");

  await commentInput.click();
  const datetime = new Date().toISOString();
  await page.keyboard.type(datetime);

  await goToPaymentButton.click();

  const stripeUrl = /https:\/\/checkout\.stripe\.com/;
  await page.waitForURL(stripeUrl);
  await expect(page).toHaveURL(stripeUrl);

  const caller = appRouter.createCaller({ prisma });
  const order = await caller.orders.getLast();

  expect(order?.comment).toBe(datetime);
};

export const waitLoadingEnds = async ({ page }: TestArgs) => {
  const progressBar = page.getByRole("progressbar").first();
  await progressBar.waitFor({ state: "visible" });

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
