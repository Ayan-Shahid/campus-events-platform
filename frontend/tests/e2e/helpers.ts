import { expect, type Page } from '@playwright/test';

/** The dev-only component showcase. */
export const DEV_UI = '/dev/ui';

export type Theme = 'light' | 'dark';

/**
 * The top nav's theme toggle. Scoped to the top nav because the showcase renders a second
 * toggle further down the page, which would otherwise trip Playwright's strict mode.
 */
export function themeToggle(page: Page) {
  return page.locator('[data-slot="top-nav"]').first().locator('[data-slot="theme-toggle"]');
}

/**
 * ThemeToggle renders an inert placeholder until React has hydrated, so the real toggle
 * appearing is a reliable "the page is interactive" signal.
 */
export async function waitForHydration(page: Page) {
  await expect(themeToggle(page)).toBeVisible();
}

const classPattern = (theme: Theme) => new RegExp(`(^|\\s)${theme}(\\s|$)`);

/** next-themes is configured with `attribute="class"`, so the active theme is a class on <html>. */
export async function getTheme(page: Page): Promise<Theme> {
  const className = (await page.locator('html').getAttribute('class')) ?? '';
  return classPattern('dark').test(className) ? 'dark' : 'light';
}

export async function expectTheme(page: Page, theme: Theme) {
  await expect(page.locator('html')).toHaveClass(classPattern(theme));
}

export function oppositeTheme(theme: Theme): Theme {
  return theme === 'dark' ? 'light' : 'dark';
}

/** Switch to `theme` through the UI (not by poking localStorage), if it isn't active already. */
export async function setTheme(page: Page, theme: Theme) {
  await waitForHydration(page);
  if ((await getTheme(page)) !== theme) {
    await themeToggle(page).click();
  }
  await expectTheme(page, theme);
}
