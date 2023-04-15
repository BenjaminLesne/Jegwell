import { test, expect } from "@playwright/test";
import { PRODUCTS_PAGE_URL } from "./constants";

test.describe("the products page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PRODUCTS_PAGE_URL);
  });
  test("products page snapshot", async ({ page }) => {
    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot();
  });

  test("display right products based on filter selected", async ({ page }) => {
    //  await page.pause();
  });
});
