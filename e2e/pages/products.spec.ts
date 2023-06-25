import { test, expect } from "@playwright/test";
import {
  getNames,
  getPrices,
  isSorted,
  type isSortedProps,
} from "~/lib/helpers/helpers";
import { PRODUCTS_ROUTE } from "~/lib/constants";

test.describe("the products page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PRODUCTS_ROUTE);
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
        filterLabel: "Prix croissant",
        elementTestId: "price",
        getFn: getPrices,
        order: "asc",
      },
      {
        filterLabel: "Prix décroissant",
        elementTestId: "price",
        getFn: getPrices,
        order: "desc",
      },
    ] as const;
    type Index = 0 | 1 | 2 | 3;
    for (
      let index: Index = 0;
      (index as Index) < filters.length;
      (index as Index)++
    ) {
      const previousFilter = index - 1 >= 0 ? filters[index - 1] : null;
      const previousFilterLabel = previousFilter?.filterLabel;
      const filter = filters[index];
      const props =
        typeof previousFilterLabel === "string"
          ? { ...filter, previousFilterLabel }
          : filter;
      await testFilter(props);
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
      previousFilterLabel = "Prix croissant",
      elementTestId,
      getFn,
      order,
    }: TestFilterProps) {
      await page
        .getByRole("combobox")
        .filter({ hasText: previousFilterLabel })
        .click();
      await page.getByRole("option", { name: filterLabel }).click();

      const array = await page.getByTestId(elementTestId).evaluateAll(getFn);
      const isArraySorted = isSorted({ array, order });
      expect(isArraySorted).toBe(true);
    }
  });

  test("display right products based on category selected", async ({
    page,
  }) => {
    const categories = ["Toutes", "boucle d'oreilles", "bagues"] as const;
    type Category = (typeof categories)[number];
    type Index = 0 | 1 | 2;
    for (
      let index: Index = 0;
      (index as Index) < categories.length;
      (index as Index)++
    ) {
      const previousCategory = index - 1 > 0 ? categories[index - 1] : null;
      const category = categories[index];
      const props =
        typeof previousCategory === "string"
          ? { category, previousCategory }
          : { category };
      await testCategory(props);
      await page.waitForTimeout(1500);
    }

    type TestCategory = {
      category: Category;
      previousCategory?: Category;
    };
    async function testCategory({
      previousCategory = categories[0],
      category,
    }: TestCategory) {
      await page
        .getByRole("combobox")
        .filter({ hasText: previousCategory })
        .click();
      await page.getByRole("option", { name: category }).click();

      const images = await page.getByRole("img").all();
      for (const image of images) {
        expect(await image.screenshot()).toMatchSnapshot();
      }
    }
  });
});
