import '@testing-library/jest-dom/vitest';
import * as axeMatchers from 'vitest-axe/matchers';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
// import { server } from '@tests/mocks/server';

// ---------------------------------------------------------------------------
// 1. Matchers
// ---------------------------------------------------------------------------
// Register vitest-axe matchers so `expect(...).toHaveNoViolations()` exists
expect.extend(axeMatchers);

// ---------------------------------------------------------------------------
// 2. Cleanup
// ---------------------------------------------------------------------------
// With `globals: false`, clean up rendered components after each test to avoid DOM leakage
afterEach(() => {
  cleanup();
});

// ---------------------------------------------------------------------------
// 3. Browser API Stubs for jsdom
// ---------------------------------------------------------------------------

// window.matchMedia — needed by next-themes and useMediaQuery / reduced-motion hooks
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string): MediaQueryList => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

// ResizeObserver — needed by Radix/Base-UI popovers, Select, Tooltip positioning
if (typeof window !== 'undefined' && !window.ResizeObserver) {
  window.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// Element.prototype.scrollIntoView — needed when keyboard navigating Radix Select / Combobox
if (typeof Element !== 'undefined' && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}

// Element.prototype.hasPointerCapture & releasePointerCapture — Radix Select & Slider pointer events
if (typeof Element !== 'undefined') {
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = () => false;
  }
  if (!Element.prototype.releasePointerCapture) {
    Element.prototype.releasePointerCapture = () => {};
  }
}

// HTMLCanvasElement.prototype.getContext — stub returning null so SurfaceCard
// immediately tests its plain/no-WebGL fallback path under jsdom
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = (() =>
    null) as unknown as typeof HTMLCanvasElement.prototype.getContext;
}

// ---------------------------------------------------------------------------
// 4. MSW Server Lifecycle
// ---------------------------------------------------------------------------
// beforeAll(() => {
//   // onUnhandledRequest: 'error' prevents unmocked API calls from silently hanging
//   server.listen({ onUnhandledRequest: 'error' });
// });
//
// afterEach(() => {
//   // Reset any runtime/per-test handlers so overrides don't leak into subsequent tests
//   server.resetHandlers();
// });
//
// afterAll(() => {
//   // Clean up and shut down the mock server
//   server.close();
// });
