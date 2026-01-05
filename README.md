<div align="center">
<h1>@dream-lab-ai/pam-vitest-config</h1>

<p>This package provides the shareable Pam AI vitest configuration with Vitest 4.0</p>
</div>

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Installation](#installation)
- [Usage](#usage)
  - [Vitest Configuration](#vitest-configuration)
  - [ESLint Configuration](#eslint-configuration)
  - [Prettier Configuration](#prettier-configuration)
- [Other configs](#other-configs)
- [Configuration Examples](#configuration-examples)
- [Versioning](#versioning)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Develop

### Pre Requisites

To install dependencies and activate pre commit hooks

```bash
npm install
npx husky install
```

### Debug

To run index.js and test the code in there

```bash
npm run debug
```

## Prerequisites

**Node.js**: >=22 (tested on v22.14.0)

**Required peer dependencies**:

- `vitest` >= 4.0.0

This package and its dependencies are installed directly from GitHub repositories. No special npm configuration is required.

## Installation

Add this package to your `package.json` as a `dependency`:

```json
{
  "dependencies": {
    "@dream-lab-ai/pam-vitest-config": "github:dream-lab-ai/pam-vitest-config"
  }
}
```

Or reference a specific version/tag:

```json
{
  "dependencies": {
    "@dream-lab-ai/pam-vitest-config": "github:dream-lab-ai/pam-vitest-config#v1.0.0"
  }
}
```

Then run `npm install`.

This package also includes linting and formatting configurations from `@dream-lab-ai/pam-eslint-config`.

## Usage

### Vitest Configuration

Create a vitest.config.ts file with following contents in the root folder of your project.

```javascript
/// <reference types="vitest" />

import { defineConfig } from 'vitest/config';
import pamVitestConfig from '@dream-lab-ai/pam-vitest-config';

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
  ...pamVitestConfig,
  test: {
    ...pamVitestConfig.test,
    exclude: excludes,
    coverage: {
      ...pamVitestConfig.test.coverage,
      exclude: excludes,
    },
  },
});
```

### ESLint Configuration

This package uses ESLint 9 with flat config format. Create an `eslint.config.js` file in your project root:

```javascript
module.exports = require('@dream-lab-ai/pam-eslint-config');
```

### Prettier Configuration

Create a `.prettierrc.js` file in your project root:

```javascript
module.exports = {
  ...require('@dream-lab-ai/pam-eslint-config/prettierConfig'),
};
```

## Other configs

**React** project are automatically detected by the base config, which also contains relevant rules and parameters.

This preset also exposes a few other configs that could be used separately.

- vitestBaseConfig
- vitestReactTestingLibraryConfig

You can use them standalone.

## Configuration Examples

Please check the examples section of this repository to find each type of possible configuration.

## Versioning

This is a public GitHub repository that is directly referenced by other projects. To create a new version:

1. **Update version in `package.json`**
2. **Commit your changes:**
   ```bash
   git add .
   git commit -m "v1.1.0: Description of changes"
   ```
3. **Create a git tag (optional but recommended):**
   ```bash
   git tag v1.1.0
   git push origin main --tags
   ```

Projects reference this repo in their `package.json`:

```json
{
  "dependencies": {
    "@dream-lab-ai/pam-vitest-config": "github:dream-lab-ai/pam-vitest-config#v1.1.0"
  }
}
```
