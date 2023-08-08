import { expect, test } from "@playwright/test";
import {
  addItemsToBasket,
  testPageScreenshotMatch,
  waitLoadingEnds,
} from "e2e/utils";
import { env } from "~/env.mjs";
import {
  DELIVERY_ROUTE,
  REQUIRED_TEXT,
  address1Message,
  cityMessage,
  deliveryOptionMessage,
  emailMessage,
  firstnameMessage,
  lastnameMessage,
  postalCodeMessage,
} from "~/lib/constants";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";

test.describe("the delivery page form", () => {
  test.beforeEach(async ({ page }) => {
    const header = page.getByText("Livraison").first();
    await page.goto(DELIVERY_ROUTE);
    await waitLoadingEnds({ page });
    await expect(header).toBeVisible();
  });

  test("match snapshot", async ({ page }) => {
    await waitLoadingEnds({ page });
    await testPageScreenshotMatch({ page });
  });

  test("does not submit with empty inputs", async ({ page }) => {
    const goToPaymentButton = page.getByRole("button", {
      name: "Passer au paiement",
    });
    const firstnameWithError = page.getByText(`Prénom${firstnameMessage}`);
    const lastnameWithError = page.getByText(`Nom${lastnameMessage}`);
    const emailWithError = page.getByText(`Email${emailMessage}`);
    const phoneWithErrorRequired = page.getByText(`Téléphone${REQUIRED_TEXT}`);
    const deliveryWithErrorRequired = page.getByText(deliveryOptionMessage);
    const address1WithErrorRequired = page.getByText(`Adresse${REQUIRED_TEXT}`);
    const cityWithError = page.getByText(`Ville${cityMessage}`);
    const postalCodeWithError = page.getByText(
      `Le code postal${postalCodeMessage}`
    );

    await goToPaymentButton.click();

    await expect(firstnameWithError).toBeVisible();
    await expect(lastnameWithError).toBeVisible();
    await expect(emailWithError).toBeVisible();
    await expect(phoneWithErrorRequired).toBeVisible();
    await expect(deliveryWithErrorRequired).toBeVisible();
    await expect(address1WithErrorRequired).toBeVisible();
    await expect(cityWithError).toBeVisible();
    await expect(postalCodeWithError).toBeVisible();
  });

  test("does not submit with wrong inputs", async ({ page }) => {
    const goToPaymentButton = page.getByRole("button", {
      name: "Passer au paiement",
    });

    // error messages
    const firstnameWithError = page.getByText(`Prénom${firstnameMessage}`);
    const lastnameWithError = page.getByText(`Nom${lastnameMessage}`);
    const emailWithError = page.getByText(`Email${emailMessage}`);
    const address1WithError = page.getByText(`Adresse${address1Message}`);
    const cityWithError = page.getByText(`Ville${cityMessage}`);
    const postalCodeWithError = page.getByText(
      `Le code postal${postalCodeMessage}`
    );
    // /error messages

    // inputs
    const firstnameInput = page.getByPlaceholder("Héloïse");
    const lastnameInput = page.getByPlaceholder("Dior");
    const emailInput = page.getByPlaceholder("exemple@jegwell.fr");
    const phoneInput = page.getByPlaceholder("0612345678");
    const expressOption = page.getByRole("radio", { name: "Express" });
    const address1Input = page.getByPlaceholder("16 rue de la Genetais");
    const cityInput = page.getByPlaceholder("Paris");
    const postalCodeInput = page.getByPlaceholder("35170");
    // /inputs

    await firstnameInput.click();
    await page.keyboard.type("O");

    await lastnameInput.click();
    await page.keyboard.type("A");

    await emailInput.click();
    await page.keyboard.type("not an email");

    await phoneInput.click();
    await page.keyboard.type("061245");

    await expressOption.click();

    await address1Input.click();
    await page.keyboard.type("16 a");

    await cityInput.click();
    await page.keyboard.type("B");

    await postalCodeInput.click();
    await page.keyboard.type("351");

    await goToPaymentButton.click();

    await expect(firstnameWithError).toBeVisible();
    await expect(lastnameWithError).toBeVisible();
    await expect(emailWithError).toBeVisible();
    await expect(address1WithError).toBeVisible();
    await expect(cityWithError).toBeVisible();
    await expect(postalCodeWithError).toBeVisible();
  });

  test("create an order and redirect to stripe on submit", async ({ page }) => {
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
  });
});
