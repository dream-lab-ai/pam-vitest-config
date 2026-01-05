const vitestBaseConfig = {
  test: {
    testTimeout: 30000,
    globals: true,
    useAtomics: true,
    passWithNoTests: true,
    coverage: {
      reporter: ['json-summary', 'html', 'text', 'json'],
    },
  },
  logLevel: 'info',
  esbuild: {
    sourcemap: 'both',
  },
};

module.exports = vitestBaseConfig;
