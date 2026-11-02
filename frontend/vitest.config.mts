import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { loadEnv } from 'vite';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    environment: 'jsdom',
    env: loadEnv(mode, process.cwd(), ''),
    setupFiles: ['./tests/setup/vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['tests/e2e/**', 'node_modules/**'],
    globals: false, // Explicit imports: describe, it, expect
    coverage: {
      provider: 'v8',
      include: ['src/**'],
      exclude: ['src/app/**', 'src/components/ui/**', '**/*.d.ts', 'src/shaders/**', '**/index.ts'],
      reporter: ['text', 'html'],
    },
  },
}));
