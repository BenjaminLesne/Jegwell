import { test, expect } from "@playwright/test";
import { CATEGORY, CATEGORY_TEST_ID, HOME_PAGE_URL } from "~/utils/constants";

test.describe("the header navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(HOME_PAGE_URL);
  });
  test("home match snapshot", async ({ page }) => {
    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot();
  });

  test("categories cards have right links", async ({ page, context }) => {
    await expect(page.getByTestId(CATEGORY_TEST_ID).first()).toBeVisible();
    const links = await page.getByTestId(CATEGORY_TEST_ID).all();
    expect(links.length).toBeGreaterThan(0);
    await page.pause();

    const pagePromise = context.waitForEvent("page");

    for (const link of links) {
      const name = await link.innerText();
      await link.click({ modifiers: ["Control"] });
      const newPage = await pagePromise;
      await newPage.waitForLoadState();

      const regex = new RegExp(encodeURIComponent(CATEGORY));

      await expect(newPage).toHaveURL(regex);
      const categorySelected = newPage.getByText(name);
      await categorySelected.waitFor();
      await expect(categorySelected).toBeVisible();
    }
  });
});
