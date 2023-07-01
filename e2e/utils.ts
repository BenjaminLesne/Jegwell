import {
  ElementHandle,
  expect,
  type Locator,
  type Page,
} from "@playwright/test";

// export const waitLoadingEnds = async ({ page }: { page: Page }) => {
//   await page.getByRole("progressbar").waitFor({ state: "hidden" });
// };
export const waitLoadingEnds = async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  let progressBar: Locator | undefined = page.getByRole("progressbar").first();
  while (progressBar) {
    await progressBar.waitFor({ state: "hidden" });
    await expect(progressBar).toBeHidden();

    const newProgressBar = page.getByRole("progressbar").first();
    const newProgressBarIsVisble = await newProgressBar.isVisible();
    progressBar = newProgressBarIsVisble ? newProgressBar : undefined;
  }
};
