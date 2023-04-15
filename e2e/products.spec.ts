import { test, expect } from "@playwright/test";
import { PRODUCTS_PAGE_URL } from "./constants";
import { getNames, getPrices, isSorted } from "./functions";

test.describe("the products page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PRODUCTS_PAGE_URL);
  });
  test("products page snapshot", async ({ page }) => {
    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot();
  });

  test.only("sort the products", async ({ page }) => {
    const names = await page.getByTestId("p.name").evaluateAll(getNames);
    const areNamesSorted = isSorted({ array: names, order: "asc" });
    expect(areNamesSorted).toBe(true);

    await page.getByText("Nom A-Z").nth(1).click();
    const ascPricesLabel = "prix le + bas";
    await page.getByRole("option", { name: ascPricesLabel }).click();
    const prices1 = await page.getByTestId("price").evaluateAll(getPrices);

    const arePrices1Sorted = isSorted({ array: prices1, order: "asc" });
    expect(arePrices1Sorted).toBe(true);

    // await page.pause;
    // i see repetition, function time :clap
    await page.getByText(ascPricesLabel).nth(1).click();
    await page.getByRole("option", { name: "prix le + haut" }).click();
    const prices2 = await page.getByTestId("price").evaluateAll(getPrices);

    const arePrices2Sorted = isSorted({ array: prices2, order: "desc" });
    expect(arePrices2Sorted).toBe(true);
  });

  // test.only("display right products based on filter selected", async ({
});
