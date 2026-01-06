# PAM Vitest Config - AI Agent Instructions

## Project Identity

**Type**: Shareable Vitest configuration package for Pam AI projects

**Stack**: Node.js 22.x (CommonJS modules), Vitest 4.x, React Testing Library (optional)

**Architecture**: Preset-based configuration system with automatic React detection

**Purpose**: Provide standardized Vitest testing configurations that automatically detect React projects and apply appropriate testing environment settings

---

## Critical Context

### Node.js Version & Module System

- **Node.js**: 22.14.0 (see `.nvmrc` - strict requirement, must use `nvm use`)
- **Module System**: CommonJS (no `"type": "module"` in package.json)
- **Import Style**: Use `require()` and `module.exports` - this is a CommonJS package
- **Package Manager**: npm only - No yarn, pnpm, or other package managers

### Distribution Method

- **Published via**: GitHub (not npm registry)
- **Installation**: `"@dream-lab-ai/pam-vitest-config": "github:dream-lab-ai/pam-vitest-config"`
- **Versioning**: Git tags (e.g., `v1.0.0`) - consumers can reference specific tags
- **Public Repository**: Changes are immediately available to all consuming projects

---

## Development Environment

### Initial Setup

```bash
# Use correct Node version
nvm use  # reads from .nvmrc (v22.14.0)

# Install dependencies
npm install

# Initialize Husky hooks
npm run prepare
```

### Development Commands

```bash
npm test           # Run tests (if any - currently basic tests)
npm run test:ui    # Open Vitest UI
npm run coverage   # Run tests with coverage
npm run lint       # Run ESLint with auto-fix
npm run format     # Format all files with Prettier
npm run debug      # Run index.js to test auto-detection logic
npm run build      # No-op (exits immediately, kept for CI compatibility)
npm run npm-audit  # Run security audit
```

### No Comprehensive Test Suite

- This package has minimal tests (mostly for demonstration)
- Real testing happens by consuming it in actual projects
- Changes should be tested in at least one consuming project before release

---

## Testing Strategy

### Manual Testing Approach

1. **Make changes** to presets or configuration
2. **Commit changes** (don't push yet)
3. **Test in consuming project**:
   ```bash
   cd ../pam-tekion-integration  # Or another project
   npm install  # Re-installs from GitHub
   npm test     # Test that tests run correctly
   npm run coverage  # Test coverage reporting
   ```
4. **Verify**:
   - Tests run successfully
   - Coverage reports generated correctly
   - UI works with `npm run test:ui`
   - React Testing Library setup works (if React project)
5. **Iterate** if needed
6. **Push to GitHub** when confident

### What to Test Manually

- ✅ Vitest runs tests in Node environment (non-React projects)
- ✅ Vitest runs tests in jsdom environment (React projects)
- ✅ Coverage reports generate correctly (`coverage-summary.json`, HTML)
- ✅ React Testing Library integration works
- ✅ Test UI (`--ui`) opens and displays tests
- ✅ Auto-detection correctly identifies React projects

---

## Code Quality & Formatting

### Linting

```bash
npm run lint  # ESLint with auto-fix
```

- **Config**: Uses `@dream-lab-ai/pam-eslint-config` (self-consuming)
- **Pre-commit**: Husky + lint-staged runs lint + format automatically

### Formatting

```bash
npm run format  # Prettier with auto-fix
```

- **Config**: Uses Prettier config from `@dream-lab-ai/pam-eslint-config`
- **Pre-commit**: Runs on all staged files

### Pre-commit Hooks

- **Tool**: Husky v9
- **Config**: `lint-staged` in package.json
- **Triggers**: `npm run lint` and `npm run format` on staged files
- **Setup**: `npm run prepare` (runs after npm install)

---

## Architecture Patterns

### Preset System Architecture

```
index.js                                    → Main entry point, automatic preset detection
presets/
  ├── vitestBaseConfig.js                   → Base Vitest config (Node environment)
  └── vitestReactTestingLibraryConfig.js    → React Testing Library config (jsdom environment)
examples/                                    → Usage examples for consumers
  ├── 1_pamConfig.js                        → Automatic configuration
  ├── 2_pamConfigReactTestingLibrary.js     → React + Testing Library
  └── 3_pamIndividualConfigs.js             → Manual preset selection
package.json                                 → Package metadata, exports configuration
```

### Main Entry Point Pattern (`index.js`)

```javascript
// Automatic preset composition based on consumer's dependencies
const fs = require('fs');
const merge = require('lodash.merge');

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const dependencies = packageJson.dependencies || {};

const insertIf = (condition, ...configs) => condition && configs;

const pamVitestConfig = [
  'vitestBaseConfig',
  insertIf(
    Object.prototype.hasOwnProperty.call(dependencies, 'react'),
    'vitestReactTestingLibraryConfig'
  ),
]
  .filter(Boolean)
  .map((link) => `./presets/${link}`)
  .map(require)
  .reduce(merge);

module.exports = pamVitestConfig;
```

**Key Pattern**: Uses `lodash.merge` to deep merge configs, allowing React config to override base config

### Base Config Pattern (`presets/vitestBaseConfig.js`)

```javascript
const vitestBaseConfig = {
  test: {
    testTimeout: 30000, // 30 second timeout for slow tests
    globals: true, // Enable global test APIs (describe, it, expect)
    useAtomics: true, // Use Atomics for better performance
    passWithNoTests: true, // Don't fail if no tests found
    coverage: {
      reporter: ['json-summary', 'html', 'text', 'json'], // Multiple formats
    },
  },
  logLevel: 'info', // Console logging level
  esbuild: {
    sourcemap: 'both', // Generate inline and external source maps
  },
};

module.exports = vitestBaseConfig;
```

**Philosophy**: Sensible defaults that work for most Node.js projects

### React Testing Library Config Pattern (`presets/vitestReactTestingLibraryConfig.js`)

```javascript
const vitestReactTestingLibraryConfig = {
  test: {
    environment: 'jsdom', // Browser-like environment for React
    globals: true,
    setupFiles: ['@testing-library/jest-dom'], // Extended matchers
  },
};

module.exports = vitestReactTestingLibraryConfig;
```

**Key Difference**: Changes `environment` to `jsdom` and adds Testing Library setup

### Package Exports Pattern

```json
{
  "exports": {
    ".": "./index.js", // Main entry (auto-detect)
    "./vitestBaseConfig": "./presets/vitestBaseConfig.js", // Manual: Base only
    "./vitestReactTestingLibraryConfig": "./presets/vitestReactTestingLibraryConfig.js", // Manual: React
    "./package.json": "./package.json" // Allow inspection
  }
}
```

---

## Configuration Presets

### Base Preset (`presets/vitestBaseConfig.js`)

**Purpose**: Core Vitest configuration for Node.js projects

**Key Settings**:

- **Test Timeout**: 30 seconds (accommodates slow tests, network calls)
- **Globals**: Enabled (no need to import `describe`, `it`, `expect`)
- **Pass With No Tests**: True (useful for directories without tests yet)
- **Coverage Reporters**: Multiple formats for different use cases
- **Source Maps**: Both inline and external for debugging

**Use Case**: Any Node.js project (APIs, CLI tools, serverless functions)

**Environment**: `node` (default)

### React Testing Library Preset (`presets/vitestReactTestingLibraryConfig.js`)

**Purpose**: Browser-like testing environment for React components

**Key Settings**:

- **Environment**: `jsdom` (simulates browser DOM)
- **Setup Files**: `@testing-library/jest-dom` (extended matchers like `toBeInTheDocument`)
- **Inherits**: All settings from base config (via `lodash.merge`)

**Use Case**: React applications, Next.js projects, React component libraries

**Environment**: `jsdom` (browser simulation)

---

## Consumer Usage Patterns

### Automatic Configuration (Recommended)

**In consumer's `vitest.config.js`:**

```javascript
/// <reference types="vitest" />

import { defineConfig } from 'vitest/config';
import pamVitestConfig from '@dream-lab-ai/pam-vitest-config';

const excludes = [
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/coverage/**',
  './.github/**',
];

export default defineConfig({
  ...pamVitestConfig,
  test: {
    ...pamVitestConfig.test,
    exclude: excludes,
    // setupFiles: ['./test/unit/setup.js'],  // Add if needed
    coverage: {
      ...pamVitestConfig.test.coverage,
      all: true,
      include: ['handlers/**/*.js', 'services/**/*.js', 'utils/**/*.js'],
      exclude: excludes,
    },
  },
});
```

**What happens**:

- Automatically uses base config
- If React is installed, merges React Testing Library config

### Manual Preset Selection

**In consumer's `vitest.config.js`:**

```javascript
import { defineConfig } from 'vitest/config';
import vitestBaseConfig from '@dream-lab-ai/pam-vitest-config/vitestBaseConfig';

export default defineConfig({
  ...vitestBaseConfig,
  test: {
    ...vitestBaseConfig.test,
    environment: 'node', // Explicit environment
    exclude: ['**/node_modules/**'],
  },
});
```

**When to use**: Need explicit control, unusual project structure, or troubleshooting

### React Project Example

**In consumer's `vitest.config.js`:**

```javascript
import { defineConfig } from 'vitest/config';
import pamVitestConfig from '@dream-lab-ai/pam-vitest-config';

export default defineConfig({
  ...pamVitestConfig, // Auto-detects React, uses jsdom
  test: {
    ...pamVitestConfig.test,
    environment: pamVitestConfig.test.environment || 'jsdom',
    coverage: {
      ...pamVitestConfig.test.coverage,
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      exclude: ['src/**/*.test.{js,jsx,ts,tsx}'],
    },
  },
});
```

---

## Code Style & Conventions

### File Naming

- **Presets**: camelCase.js (e.g., `vitestBaseConfig.js`, `vitestReactTestingLibraryConfig.js`)
- **Main Entry**: `index.js`
- **Examples**: `1_pamConfig.js`, `2_pamConfigReactTestingLibrary.js`

### Module Structure

- **CommonJS**: Use `require()` and `module.exports`
- **No ESM**: Don't use `import`/`export` syntax in this package
- **Consumer Uses ESM**: Consumers can use ESM to import this package

### Preset Organization

```javascript
// Each preset follows this structure:
const configName = {
  test: {
    // Test-specific settings
    testTimeout: 30000,
    globals: true,
  },
  // Top-level Vitest settings
  logLevel: 'info',
  esbuild: {
    // Build settings
  },
};

module.exports = configName;
```

### Configuration Philosophy

- **Sensible Defaults**: Work for 80% of projects without customization
- **Overridable**: Consumers can spread and override any setting
- **Minimal**: Only essential settings, avoid over-configuration
- **Documented**: Complex settings have inline comments

---

## Common Patterns & Recipes

### Adding a New Preset

1. Create file in `presets/` directory (e.g., `presets/vitestNewPreset.js`)
2. Export configuration object:
   ```javascript
   const vitestNewPreset = {
     test: {
       /* ... */
     },
   };
   module.exports = vitestNewPreset;
   ```
3. Add to `package.json` exports:
   ```json
   {
     "exports": {
       "./newPreset": "./presets/vitestNewPreset.js"
     }
   }
   ```
4. Optionally add auto-detection in `index.js`:
   ```javascript
   insertIf(
     Object.prototype.hasOwnProperty.call(dependencies, 'target-package'),
     'vitestNewPreset'
   );
   ```
5. Create example in `examples/` directory
6. Update README.md
7. Test in consuming project

### Modifying Coverage Settings

**Common customization**: Adjusting coverage thresholds

```javascript
// In preset file:
coverage: {
  reporter: ['json-summary', 'html', 'text', 'json'],
  // Optional: Add thresholds
  thresholds: {
    lines: 80,
    functions: 80,
    branches: 80,
    statements: 80,
  },
}
```

**Note**: Thresholds NOT included by default (too restrictive for some projects)

### Adding Test Environment Options

```javascript
// For jsdom environment:
test: {
  environment: 'jsdom',
  environmentOptions: {
    jsdom: {
      resources: 'usable',  // Load external resources
      url: 'http://localhost',
    },
  },
}
```

### Debugging Consumer Configuration

```bash
# In consuming project
npx vitest --version           # Check Vitest version
npx vitest --config            # Show resolved config
npx vitest --help              # Show all options
```

---

## Dependencies Strategy

### Peer Dependencies

- **vitest**: `^4.0.0` - Consumer must install Vitest

### Bundled Dependencies

- **@testing-library/jest-dom**: `^6.4.2` - Extended matchers
- **@vitest/coverage-v8**: `^4.0.0` - Coverage provider
- **@vitest/ui**: `^4.0.0` - UI for test visualization
- **lodash.merge**: `^4.6.2` - Deep merge utility
- **@dream-lab-ai/pam-eslint-config**: GitHub - Linting and formatting

**Why bundled?**: Consumers don't need to install these separately

### Development Dependencies

- **eslint**: `^9.0.0` - For linting
- **husky**: `^9.0.11` - Git hooks
- **lint-staged**: `^15.2.2` - Staged file linting
- **vitest**: `^4.0.0` - For testing this package

---

## Deployment & Versioning

### Release Process

1. **Make changes** and test in consuming project
2. **Update version** in `package.json`:
   ```json
   {
     "version": "1.1.0"
   }
   ```
3. **Commit changes**:
   ```bash
   git add .
   git commit -m "v1.1.0: Add new coverage threshold preset"
   ```
4. **Create git tag**:
   ```bash
   git tag v1.1.0
   git push origin main --tags
   ```
5. **Update consuming projects**: They can now reference `v1.1.0`

### Versioning Strategy

- **Semantic Versioning**: `MAJOR.MINOR.PATCH`
- **Major**: Breaking changes (Vitest 4 → 5, removed presets, incompatible config changes)
- **Minor**: New features (new presets, new settings)
- **Patch**: Bug fixes (config adjustments, dependency updates)

### Consumer Update Pattern

**In consumer's `package.json`:**

```json
{
  "devDependencies": {
    "@dream-lab-ai/pam-vitest-config": "github:dream-lab-ai/pam-vitest-config#v1.1.0"
  }
}
```

**Or use main branch (latest):**

```json
{
  "devDependencies": {
    "@dream-lab-ai/pam-vitest-config": "github:dream-lab-ai/pam-vitest-config"
  }
}
```

---

## Documentation

### README.md

- **Audience**: Developers consuming this package
- **Content**: Installation, usage examples, available presets
- **Keep Updated**: When adding presets or changing usage patterns

### AGENTS.md (This File)

- **Audience**: AI agents and developers maintaining this package
- **Content**: Architecture, patterns, development workflow
- **Keep Updated**: When changing internal patterns or adding features

### Examples Directory

- **Purpose**: Show common usage patterns
- **Files**:
  - `1_pamConfig.js` - Basic automatic config
  - `2_pamConfigReactTestingLibrary.js` - React project config
  - `3_pamIndividualConfigs.js` - Manual preset selection
- **Keep Updated**: When adding new presets

---

## Agent Permissions & Boundaries

### Allowed Actions (No Approval Required)

- ✅ Read any file in the repository
- ✅ List directory contents
- ✅ Search codebase
- ✅ Run linter: `npm run lint`
- ✅ Run formatter: `npm run format`
- ✅ Run tests: `npm test`
- ✅ View package dependencies: `cat package.json`
- ✅ Read documentation files
- ✅ Run debug script: `npm run debug`

### Actions Requiring Approval

- ⚠️ Install/remove npm packages
- ⚠️ Modify `package.json` (dependencies, version, exports)
- ⚠️ Create/delete preset files in `presets/` directory
- ⚠️ Modify preset configurations
- ⚠️ Git operations: commit, push, tag
- ⚠️ Change versioning or release process

### Strictly Prohibited

- 🚫 Commit breaking changes without major version bump
- 🚫 Delete presets without migration guide
- 🚫 Force push to main
- 🚫 Modify git tags
- 🚫 Change distribution method (GitHub to npm)
- 🚫 Remove peer dependency on vitest

---

## Troubleshooting

### Common Issues

#### "Cannot find module '@dream-lab-ai/pam-vitest-config'"

- **Cause**: Consumer hasn't installed package or npm install failed
- **Fix**: Run `npm install` in consumer project

#### Tests not detecting React components

- **Cause**:
  - React not listed in consumer's dependencies
  - Auto-detection failed
- **Fix**:
  1. Verify `react` in consumer's `package.json`
  2. Run `npm install` to re-trigger auto-detection
  3. Or manually use React preset:
     ```javascript
     import reactConfig from '@dream-lab-ai/pam-vitest-config/vitestReactTestingLibraryConfig';
     ```

#### Coverage reports not generating

- **Cause**:
  - `@vitest/coverage-v8` not installed (should be bundled)
  - Coverage paths exclude all files
- **Fix**:
  ```javascript
  coverage: {
    ...pamVitestConfig.test.coverage,
    all: true,
    include: ['src/**/*.js'],  // Adjust to your structure
  }
  ```

#### "ReferenceError: describe is not defined"

- **Cause**: `globals: true` not working
- **Fix**: Add to test file top:
  ```javascript
  import { describe, it, expect } from 'vitest';
  ```
  Or ensure config includes:
  ```javascript
  test: {
    globals: true,
  }
  ```

#### Changes not reflected in consumer project

- **Cause**: npm hasn't re-fetched from GitHub
- **Fix**:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

### Where to Look for Help

1. **This file** (`AGENTS.md`) - Development context and patterns
2. **README.md** - Consumer-facing documentation
3. **Examples directory** - Real usage patterns
4. **Preset files** (`presets/*.js`) - Configuration details
5. **Vitest documentation** - [https://vitest.dev/](https://vitest.dev/)
6. **Consuming projects** - See how this config is used in practice

---

## Project-Specific Terminology

- **Preset**: A configuration module that exports a Vitest config object
- **Consumer**: A project that depends on this package (e.g., pam-tekion-integration)
- **Auto-detection**: Automatic inclusion of React config based on consumer's dependencies
- **Deep Merge**: Using `lodash.merge` to combine nested configuration objects
- **jsdom**: Browser-like environment for testing DOM interactions
- **Coverage Reporter**: Tool that generates coverage reports in various formats
- **Setup Files**: Scripts run before tests (e.g., for global test utilities)
- **Globals**: Making test APIs (describe, it, expect) available without imports

---

## Quick Reference

### Most Common Commands

```bash
npm test            # Run tests
npm run test:ui     # Open test UI
npm run coverage    # Run tests with coverage
npm run lint        # Lint code
npm run format      # Format code
npm run debug       # Test auto-detection logic
```

### Most Important Files

- `index.js` - Main entry point with auto-detection
- `presets/vitestBaseConfig.js` - Base configuration (Node.js)
- `presets/vitestReactTestingLibraryConfig.js` - React configuration (jsdom)
- `package.json` - Package metadata, exports, dependencies
- `examples/` - Usage examples for consumers

### Key Directories

- `presets/` - Configuration presets
- `examples/` - Usage examples
- `node_modules/` - Dependencies (gitignored)

### Consuming Projects

- pam-tekion-integration (Serverless API)
- pam-eslint-config (Configuration package)
- Other Pam projects

---

**Last Updated**: 2026-01-06  
**Node Version**: 22.14.0  
**Vitest Version**: ^4.0.0  
**Current Package Version**: 1.0.0
