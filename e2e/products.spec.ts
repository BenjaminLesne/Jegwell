import { test, expect } from "@playwright/test";
import { PRODUCTS_PAGE_URL } from "./constants";
import { getNames, getPrices, isSorted, isSortedProps } from "./functions";

test.describe("the products page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PRODUCTS_PAGE_URL);
  });
  test("products page snapshot", async ({ page }) => {
    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot();
  });

  test("sort the products", async ({ page }) => {
    const filters = [
      {
        filterLabel: "Nom A-Z",
        elementTestId: "p.name",
        getFn: getNames,
        order: "asc",
      },
      {
        filterLabel: "Nom Z-A",
        elementTestId: "p.name",
        getFn: getNames,
        order: "desc",
      },
      {
        filterLabel: "prix le + bas",
        elementTestId: "price",
        getFn: getPrices,
        order: "asc",
      },
      {
        filterLabel: "prix le + haut",
        elementTestId: "price",
        getFn: getPrices,
        order: "desc",
      },
    ] as const;

    for (let index = 0; index < filters.length; index++) {
      const previousFilter = index - 1 > 0 ? filters[index - 1] : null;
      const previousFilterLabel = previousFilter?.filterLabel;
      const filter = filters[index];
      const props =
        typeof previousFilterLabel === "string"
          ? { ...filter, previousFilterLabel }
          : filter;
      testFilter(props);
      await page.waitForTimeout(1500);
    }
    type TestFilterHelper = Pick<isSortedProps, "array" | "order">;
    type TestFilterProps = {
      filterLabel: string;
      previousFilterLabel?: string;
      elementTestId: string;
      getFn: (
        elements: (SVGElement | HTMLElement)[]
      ) => TestFilterHelper["array"];
      order: TestFilterHelper["order"];
    };
    async function testFilter({
      filterLabel,
      previousFilterLabel = "Nom A-Z",
      elementTestId,
      getFn,
      order,
    }: TestFilterProps) {
      await page.getByText(previousFilterLabel).nth(1).click();
      await page.getByRole("option", { name: filterLabel }).click();
      const array = await page.getByTestId(elementTestId).evaluateAll(getFn);

      const isArraySorted = isSorted({ array, order });
      expect(isArraySorted).toBe(true);
    }
  });

  test("display right products based on category selected", async ({
    page,
  }) => {
    type Categories = "Toutes" | "boucle d'oreilles" | "bague";
    const categories = ["Toutes", "boucle d'oreilles", "bague"] as const;

    for (let index = 0; index < categories.length; index++) {
      const previousCategory = index - 1 > 0 ? categories[index - 1] : null;
      const category = categories[index];
      const props =
        typeof previousCategory === "string"
          ? { category, previousCategory }
          : { category };
      testCategory(props);
      await page.waitForTimeout(1500);
    }

    type TestCategory = {
      category: Categories;
      previousCategory?: Categories;
    };
    async function testCategory({
      previousCategory = categories[0],
      category,
    }: TestCategory) {
      await page.getByText(previousCategory).nth(1).click();
      await page.getByRole("option", { name: category }).click();
      const images = await page.getByRole("img").all();
      for (const image of images) {
        expect(await image.screenshot()).toMatchSnapshot();
      }
    }
  });
});
