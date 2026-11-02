import { defineConfig, devices } from '@playwright/test';

const isCI = Boolean(process.env.CI);

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  // Prevent accidental test.only from silently skipping the suite in CI
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: isCI ? [['github'], ['html', { open: 'never' }]] : 'html',

  use: {
    baseURL: 'http://localhost:3000',
    // Leave artifacts behind when a test fails so you have context to debug
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  // Run every spec across the three design breakpoint viewports (1440 / 834 / 390)
  projects: [
    {
      name: 'Desktop Chrome (1440×900)',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: 'Tablet (834×1194)',
      use: {
        ...devices['iPad Pro 11'],
        viewport: { width: 834, height: 1194 },
      },
    },
    {
      name: 'Mobile (390×844)',
      use: {
        ...devices['iPhone 14'],
        viewport: { width: 390, height: 844 },
      },
    },
  ],

  // Automatically boot the Next.js dev server so (dev)/dev/ui is reachable
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !isCI,
    timeout: 120 * 1000,
  },
});
