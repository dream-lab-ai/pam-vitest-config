const react = require('@vitejs/plugin-react');

const vitestReactTestingLibraryConfig = {
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
};

module.exports = vitestReactTestingLibraryConfig;
