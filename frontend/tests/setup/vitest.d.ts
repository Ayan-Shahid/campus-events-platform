import 'vitest-axe/extend-expect';
import type { AxeMatchers } from 'vitest-axe/matchers';
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

declare module 'vitest' {
  export interface Assertion<T = never>
    extends AxeMatchers, TestingLibraryMatchers<typeof expect.stringContaining, T> {}
  export interface AsymmetricMatchersContaining
    extends AxeMatchers, TestingLibraryMatchers<typeof expect.stringContaining, never> {}
}
