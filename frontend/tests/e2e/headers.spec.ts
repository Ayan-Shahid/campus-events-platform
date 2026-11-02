import { expect, test } from '@playwright/test';
import { DEV_UI, waitForHydration } from './helpers';

const STATIC_HEADERS: Record<string, string> = {
  'x-frame-options': 'DENY',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  'cross-origin-opener-policy': 'same-origin',
};

const getNonce = (csp: string) => /'nonce-([^']+)'/.exec(csp)?.[1];

test.describe('security headers', () => {
  test('every static header is present with the right value', async ({ request }) => {
    const headers = (await request.get('/')).headers();

    for (const [name, value] of Object.entries(STATIC_HEADERS)) {
      expect(headers[name], name).toBe(value);
    }
    expect(headers['x-powered-by']).toBeUndefined();
  });

  test('HSTS is sent in production only', async ({ request }) => {
    const headers = (await request.get('/')).headers();
    const isDevServer = headers['content-security-policy']?.includes("'unsafe-eval'");

    if (isDevServer) {
      expect(headers['strict-transport-security']).toBeUndefined();
    } else {
      expect(headers['strict-transport-security']).toBe('max-age=63072000; includeSubDomains');
    }
  });

  test('the CSP has the right directives and a nonce, fresh on every request', async ({
    request,
  }) => {
    const first = (await request.get('/')).headers()['content-security-policy'] ?? '';
    const second = (await request.get('/')).headers()['content-security-policy'] ?? '';

    const nonce = getNonce(first);
    expect(nonce, 'nonce in script-src').toBeTruthy();
    expect(getNonce(second)).not.toBe(nonce);

    for (const directive of [
      "default-src 'self'",
      `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      "connect-src 'self' ",
      "worker-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ]) {
      expect(first, directive).toContain(directive);
    }

    const scriptSrc = /script-src ([^;]*)/.exec(first)?.[1] ?? '';
    expect(scriptSrc).not.toContain("'unsafe-inline'");
  });

  test('the nonce in the header is the one on the page scripts', async ({ request }) => {
    const response = await request.get('/');
    const nonce = getNonce(response.headers()['content-security-policy'] ?? '');

    expect(await response.text()).toContain(`nonce="${nonce}"`);
  });
});

test.describe('CSP violations', () => {
  for (const path of [DEV_UI, '/']) {
    test(`${path} loads and hydrates without CSP violations`, async ({ page }) => {
      const consoleMessages: string[] = [];
      page.on('console', (message) => consoleMessages.push(message.text()));
      await page.addInitScript(() => {
        const violations: string[] = [];
        (window as unknown as { __csp: string[] }).__csp = violations;
        document.addEventListener('securitypolicyviolation', (event) => {
          violations.push(`${event.violatedDirective} blocked=${event.blockedURI}`);
        });
      });

      const response = await page.goto(path);
      test.skip(response?.status() === 404, `${path} does not exist in this build`);

      await waitForHydration(page);

      const violations = await page.evaluate(
        () => (window as unknown as { __csp: string[] }).__csp,
      );
      const cspMessages = consoleMessages.filter((text) =>
        /content security policy|refused to (load|execute|apply|connect)/i.test(text),
      );

      expect(violations).toEqual([]);
      expect(cspMessages).toEqual([]);
    });
  }
});
