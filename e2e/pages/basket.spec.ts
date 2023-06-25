import { test, expect } from "@playwright/test";
import { BASKET_ROUTE, PRODUCTS_ROUTE } from "~/lib/constants";

test("basket page without items match snapshot", async ({ page }) => {
  await page.goto(BASKET_ROUTE);
  expect(await page.screenshot({ fullPage: true })).toMatchSnapshot();
});

test.describe("basket page with items added to basket", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PRODUCTS_ROUTE);
    await page.pause();
  });

  test("snapshot", async ({ page }) => {
    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot();
  });
  test.only("", async ({ page }) => {
    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot();
  });
});
