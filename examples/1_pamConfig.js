/// <reference types="vitest" />

import { defineConfig } from 'vitest/config';
import pamVitestconfig from '@pam/vitest-config';

// This configuration should be enough for most of the cases
// it will automatically detect if react is installed,
// and return an object configured for react testing library to be used as the testing suite

// Create an excludes array, to exclude folders from being tested and from coverage to be collected from them
const excludes = [
  '**/node_modules/**',
  '**/dist/**',
  '**/target/**',
  '**/build/**',
  './.husky/**',
  './.github/**',
];

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
});
