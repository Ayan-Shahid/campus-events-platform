import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { DEV_UI, setTheme, waitForHydration, type Theme } from './helpers';

const ENGINE_TIMEOUT = 20_000; // the engine chunk is fetched lazily, and dev compiles on demand

const backgroundCanvas = (page: Page) => page.locator('[data-slot="shader-background"] canvas');
const cardCanvases = (page: Page) => page.locator('[data-slot="surface-card"] canvas');
const fallbackGradient = (page: Page) =>
  page.locator('[data-slot="shader-background"] > div').first();

/** A cheap fingerprint of what is currently painted in a 2D canvas. */
function fingerprint(canvas: Locator): Promise<string> {
  return canvas.evaluate((element) => {
    const data = (element as HTMLCanvasElement).toDataURL('image/png');
    let hash = 0;
    for (let index = 0; index < data.length; index++) {
      hash = (Math.imul(hash, 31) + data.charCodeAt(index)) | 0;
    }
    return `${data.length}:${hash}`;
  });
}

async function browserHasWebGL2(page: Page): Promise<boolean> {
  return page.evaluate(() => Boolean(document.createElement('canvas').getContext('webgl2')));
}

async function openShowcase(page: Page) {
  await page.goto(DEV_UI);
  await waitForHydration(page);
}

async function expectBackgroundReady(page: Page, state: 'running' | 'static') {
  await expect(backgroundCanvas(page)).toHaveAttribute('data-shader-state', state, {
    timeout: ENGINE_TIMEOUT,
  });
  await expect(backgroundCanvas(page)).toHaveAttribute('data-shader-ready', 'true', {
    timeout: ENGINE_TIMEOUT,
  });
}

test.describe('shader: animated (WebGL2 works, motion allowed)', () => {
  test('draws, fades in over the gradient, and keeps animating', async ({ page }) => {
    await openShowcase(page);
    test.skip(!(await browserHasWebGL2(page)), 'This browser has no WebGL2.');

    await expectBackgroundReady(page, 'running');
    await expect(backgroundCanvas(page)).toHaveCSS('opacity', '1');

    const first = await fingerprint(backgroundCanvas(page));
    await expect
      .poll(() => fingerprint(backgroundCanvas(page)), { timeout: 5_000 })
      .not.toBe(first);
  });

  test('draws card surfaces once they scroll into view, on one shared context', async ({
    page,
  }) => {
    await openShowcase(page);
    test.skip(!(await browserHasWebGL2(page)), 'This browser has no WebGL2.');

    const card = cardCanvases(page).first();
    await card.scrollIntoViewIfNeeded();
    await expect(card).toHaveAttribute('data-shader-ready', 'true', { timeout: ENGINE_TIMEOUT });
    // Rendered at a reduced resolution (0.6x), then upscaled by CSS.
    const { backing, shown } = await card.evaluate((element) => ({
      backing: (element as HTMLCanvasElement).width,
      shown: element.getBoundingClientRect().width,
    }));
    expect(backing).toBeLessThan(shown);
  });
});

test.describe('shader: static (reduced motion or Save-Data)', () => {
  test.describe('prefers-reduced-motion: reduce', () => {
    test.use({ reducedMotion: 'reduce' });

    test('draws one frame and then stops', async ({ page }) => {
      await openShowcase(page);
      test.skip(!(await browserHasWebGL2(page)), 'This browser has no WebGL2.');

      await expectBackgroundReady(page, 'static');

      const first = await fingerprint(backgroundCanvas(page));
      await page.waitForTimeout(1_200);
      expect(await fingerprint(backgroundCanvas(page))).toBe(first);
    });
  });

  test('Save-Data draws one frame and then stops', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'connection', {
        configurable: true,
        value: { saveData: true, addEventListener() {}, removeEventListener() {} },
      });
    });
    await openShowcase(page);
    test.skip(!(await browserHasWebGL2(page)), 'This browser has no WebGL2.');

    await expectBackgroundReady(page, 'static');

    const first = await fingerprint(backgroundCanvas(page));
    await page.waitForTimeout(1_200);
    expect(await fingerprint(backgroundCanvas(page))).toBe(first);
  });
});

test.describe('shader: fallback (no WebGL2, or the context is lost 3 times)', () => {
  test('no WebGL2: the gradient shows, the canvas stays hidden, cards are plain', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string) {
        if (type === 'webgl2' || type === 'webgl') return null;
        // eslint-disable-next-line prefer-rest-params
        return original.apply(this, arguments as never);
      } as typeof original;
    });
    await openShowcase(page);

    await expect(backgroundCanvas(page)).toHaveAttribute('data-shader-state', 'fallback', {
      timeout: ENGINE_TIMEOUT,
    });
    await expect(backgroundCanvas(page)).not.toHaveAttribute('data-shader-ready');
    await expect(backgroundCanvas(page)).toHaveCSS('opacity', '0');
    await expect(fallbackGradient(page)).toHaveCSS('background-image', /gradient/);

    // Cards never even mount a canvas when WebGL is unsupported.
    await expect(cardCanvases(page)).toHaveCount(0);
    await expect(
      page.locator('[data-slot="surface-card"][data-surface="shader"]').first(),
    ).toBeVisible();
  });

  test('context lost 3 times: recovers twice, then falls back for good', async ({ page }) => {
    await page.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string) {
        // eslint-disable-next-line prefer-rest-params
        const context = original.apply(this, arguments as never);
        if (type === 'webgl2' && context) {
          (window as unknown as { __glCanvas: HTMLCanvasElement }).__glCanvas = this;
        }
        return context;
      } as typeof original;
    });
    await openShowcase(page);
    test.skip(!(await browserHasWebGL2(page)), 'This browser has no WebGL2.');
    await expectBackgroundReady(page, 'running');

    // Keep the extension object: getExtension() returns null while the context is lost, which
    // would make restoreContext() a silent no-op.
    await page.evaluate(() => {
      const canvas = (window as unknown as { __glCanvas: HTMLCanvasElement }).__glCanvas;
      (window as unknown as { __loseExtension: unknown }).__loseExtension = canvas
        .getContext('webgl2')
        ?.getExtension('WEBGL_lose_context');
    });
    type LoseExtension = { loseContext(): void; restoreContext(): void };
    const loseContext = () =>
      page.evaluate(() => {
        (window as unknown as { __loseExtension: LoseExtension }).__loseExtension.loseContext();
      });
    const restoreContext = () =>
      page.evaluate(() => {
        (window as unknown as { __loseExtension: LoseExtension }).__loseExtension.restoreContext();
      });

    for (const loss of [1, 2]) {
      await loseContext();
      await restoreContext();
      // Drawing resumes after each recovery.
      const before = await fingerprint(backgroundCanvas(page));
      await expect
        .poll(() => fingerprint(backgroundCanvas(page)), {
          timeout: 10_000,
          message: `drawing should resume after loss #${loss}`,
        })
        .not.toBe(before);
      await expect(backgroundCanvas(page)).toHaveAttribute('data-shader-state', 'running');
    }

    await loseContext(); // the third loss: give up
    await expect(backgroundCanvas(page)).toHaveAttribute('data-shader-state', 'fallback');
    await expect(backgroundCanvas(page)).not.toHaveAttribute('data-shader-ready');
    await expect(backgroundCanvas(page)).toHaveCSS('opacity', '0');
    await expect(fallbackGradient(page)).toHaveCSS('background-image', /gradient/);
  });
});

test.describe('shader: server render / before JS', () => {
  test.use({ javaScriptEnabled: false });

  test('the CSS gradient is already there, and there is no canvas', async ({ page }) => {
    await page.goto(DEV_UI);

    await expect(fallbackGradient(page)).toHaveCSS('background-image', /gradient/);
    await expect(page.locator('canvas')).toHaveCount(0);
  });
});

test.describe('shader: accessibility (decorative in every path)', () => {
  const themes: Theme[] = ['dark', 'light'];

  for (const theme of themes) {
    test(`axe finds no violations with the shader running (${theme} theme)`, async ({ page }) => {
      await openShowcase(page);
      test.skip(!(await browserHasWebGL2(page)), 'This browser has no WebGL2.');
      await setTheme(page, theme);
      await expectBackgroundReady(page, 'running');

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      expect(results.violations).toEqual([]);
    });
  }

  test('every canvas is aria-hidden, inert and has no tabindex, role or name', async ({ page }) => {
    await openShowcase(page);
    test.skip(!(await browserHasWebGL2(page)), 'This browser has no WebGL2.');
    await expectBackgroundReady(page, 'running');
    await cardCanvases(page).first().scrollIntoViewIfNeeded();

    const problems = await page.evaluate(() =>
      [...document.querySelectorAll('canvas')].flatMap((canvas, index) => {
        const issues: string[] = [];
        if (canvas.getAttribute('aria-hidden') !== 'true') issues.push('not aria-hidden');
        if (!canvas.hasAttribute('inert')) issues.push('not inert');
        for (const attribute of ['tabindex', 'role', 'aria-label', 'aria-labelledby']) {
          if (canvas.hasAttribute(attribute)) issues.push(`has ${attribute}`);
        }
        return issues.map((issue) => `canvas #${index}: ${issue}`);
      }),
    );

    expect(problems).toEqual([]);
  });

  test('keyboard focus never lands on a canvas', async ({ page }) => {
    await openShowcase(page);
    test.skip(!(await browserHasWebGL2(page)), 'This browser has no WebGL2.');
    await expectBackgroundReady(page, 'running');

    for (let press = 0; press < 80; press++) {
      await page.keyboard.press('Tab');
      const focused = await page.evaluate(() => document.activeElement?.tagName ?? 'NONE');
      expect(focused, `Tab press #${press + 1}`).not.toBe('CANVAS');
    }
  });
});
