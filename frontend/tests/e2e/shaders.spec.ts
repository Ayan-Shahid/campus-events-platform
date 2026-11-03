import { expect, test, type Page } from '@playwright/test';
import { DEV_UI, setTheme, waitForHydration } from './helpers';

const ENGINE_TIMEOUT = 20_000;

const backgroundCanvas = (page: Page) => page.locator('[data-slot="shader-background"] canvas');

async function openShowcase(page: Page) {
  await page.goto(DEV_UI);
  await waitForHydration(page);
}

async function browserHasWebGL2(page: Page): Promise<boolean> {
  return page.evaluate(() => Boolean(document.createElement('canvas').getContext('webgl2')));
}

/** Average brightness (0-255) of the pixels currently painted in the background canvas. */
function averageBrightness(page: Page): Promise<number> {
  return backgroundCanvas(page).evaluate((element) => {
    const source = element as HTMLCanvasElement;
    const probe = document.createElement('canvas');
    probe.width = 32;
    probe.height = 32;
    const context = probe.getContext('2d');
    if (!context) throw new Error('no 2d context');
    context.drawImage(source, 0, 0, probe.width, probe.height);
    const { data } = context.getImageData(0, 0, probe.width, probe.height);
    let total = 0;
    for (let index = 0; index < data.length; index += 4) {
      total += (data[index]! + data[index + 1]! + data[index + 2]!) / 3;
    }
    return total / (data.length / 4);
  });
}

test.describe('shaders in a real browser', () => {
  test('compile and run without any console error', async ({ page }) => {
    const problems: string[] = [];
    page.on('console', (message) => {
      if (message.type() !== 'error') return;
      // The project has no favicon yet, so browsers log a 404 for it. Not a shader problem.
      if (message.location().url.endsWith('/favicon.ico')) return;
      problems.push(`console: ${message.text()}`);
    });
    page.on('pageerror', (error) => problems.push(`pageerror: ${error.message}`));

    await openShowcase(page);
    test.skip(!(await browserHasWebGL2(page)), 'This browser has no WebGL2.');

    await expect(backgroundCanvas(page)).toHaveAttribute('data-shader-state', 'running', {
      timeout: ENGINE_TIMEOUT,
    });
    await expect(backgroundCanvas(page)).toHaveAttribute('data-shader-ready', 'true');
    // A few frames, so a late draw-time error would show up too. A compile error would have
    // flipped the state to "fallback" and logged a ShaderCompileError.
    await page.waitForTimeout(1_000);
    await expect(backgroundCanvas(page)).toHaveAttribute('data-shader-state', 'running');

    expect(problems).toEqual([]);
  });

  test.describe('theme', () => {
    // Reduced motion gives one still frame, so any change is down to the palette, not animation.
    test.use({ reducedMotion: 'reduce' });

    test('switching the theme repaints the background with the other palette', async ({ page }) => {
      await openShowcase(page);
      test.skip(!(await browserHasWebGL2(page)), 'This browser has no WebGL2.');

      await setTheme(page, 'dark');
      await expect(backgroundCanvas(page)).toHaveAttribute('data-shader-state', 'static', {
        timeout: ENGINE_TIMEOUT,
      });
      await expect(backgroundCanvas(page)).toHaveAttribute('data-shader-ready', 'true');
      const dark = await averageBrightness(page);

      await setTheme(page, 'light');
      await expect
        .poll(() => averageBrightness(page), {
          timeout: 10_000,
          message: 'the canvas should repaint after the theme changes',
        })
        .toBeGreaterThan(dark + 40);
    });
  });
});
