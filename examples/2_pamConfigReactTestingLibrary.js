/// <reference types="vitest" />

import { defineConfig } from 'vitest/config';
import pamVitestconfig from '@pam/vitest-config';

const excludes = [
  '**/node_modules/**',
  '**/dist/**',
  '**/target/**',
  '**/build/**',
  './.husky/**',
  './.github/**',
];

// When testing with react testing library, create a setup file and add the import
export default defineConfig({
  ...pamVitestconfig,
  test: {
    ...pamVitestconfig.test,
    exclude: excludes,
    coverage: {
      ...pamVitestconfig.test.coverage,
      exclude: excludes,
    },
  },
  setup: '../path/to/your/setup.ts',
});

// Inside setup.ts
import '@testing-library/jest-dom';
