import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import eslintConfigPrettier from 'eslint-config-prettier';
import pluginQuery from '@tanstack/eslint-plugin-query';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import testingLibrary from 'eslint-plugin-testing-library';
import jestDom from 'eslint-plugin-jest-dom';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // 1. TanStack Query
  pluginQuery.configs['flat/recommended'],

  // 2. Accessibility Rules
  {
    rules: {
      ...jsxA11y.configs.recommended.rules,
    },
  },

  // 3. Import Boundaries & Quality Rules

  {
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/*/*'],
              message:
                'Deep imports into features are forbidden. Import from the feature entry point instead (e.g., @/features/events).',
            },
          ],
        },
      ],
    },
  },

  // 4. Forbit importing anything from features into components or lib.
  {
    files: ['src/components/**', 'src/lib/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/*/*'],
              message:
                'Deep imports into features are forbidden. Import from the feature entry point instead (e.g., @/features/events).',
            },
            {
              group: ['@/features/**'],
              message: 'Shared code must never depend on business code.',
            },
          ],
        },
      ],
    },
  },

  // 5. General Quality Rules
  {
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  // 6. Unit tests only: Testing Library (React) + jest-dom rules
  {
    files: ['**/*.test.{ts,tsx}'],
    extends: [testingLibrary.configs['flat/react'], jestDom.configs['flat/recommended']],
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),

  eslintConfigPrettier,
]);

export default eslintConfig;
