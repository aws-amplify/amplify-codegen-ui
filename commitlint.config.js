const path = require('path');

// Allowed scopes are the workspace package names without their npm scope
// (e.g. `@aws-amplify/codegen-ui-react` -> `codegen-ui-react`).
const getPackages = () =>
  require('./package.json').workspaces.map((workspace) => {
    const { name } = require(path.join(__dirname, workspace, 'package.json'));
    return name.startsWith('@') ? name.split('/')[1] : name;
  });

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [2, 'always', [...getPackages(), 'release', 'deps', 'deps-dev']],
    'header-max-length': [2, 'always', 200],
  },
};
