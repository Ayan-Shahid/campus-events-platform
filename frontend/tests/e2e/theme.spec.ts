import { expect, test } from '@playwright/test';
import {
  DEV_UI,
  expectTheme,
  getTheme,
  oppositeTheme,
  themeToggle,
  waitForHydration,
} from './helpers';

test.describe('theme', () => {
  test('persists across a reload', async ({ page }) => {
    await page.goto(DEV_UI);
    await waitForHydration(page);

    const initial = await getTheme(page);
    const toggled = oppositeTheme(initial);

    await themeToggle(page).click();
    await expectTheme(page, toggled);

    await page.reload();
    await waitForHydration(page);

    await expectTheme(page, toggled);
  });

  // next-themes writes the choice to localStorage and listens for the `storage` event, which
  // the browser fires in *other* tabs of the same origin, so this needs no app code of ours.
  test('syncs to a second tab in the same browser context', async ({ page, context }) => {
    const otherTab = await context.newPage();

    await page.goto(DEV_UI);
    await otherTab.goto(DEV_UI);
    await waitForHydration(page);
    await waitForHydration(otherTab);

    const initial = await getTheme(page);
    const toggled = oppositeTheme(initial);
    expect(await getTheme(otherTab)).toBe(initial);

    await themeToggle(page).click();

    await expectTheme(page, toggled);
    await expectTheme(otherTab, toggled);
  });
});
