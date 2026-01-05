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
