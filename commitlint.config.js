const {
  utils: { getPackages },
} = require('@commitlint/config-lerna-scopes');

module.exports = {
  extends: ['@commitlint/config-conventional', '@commitlint/config-lerna-scopes'],
  rules: {
    'scope-enum': async (context) => [2, 'always', [...(await getPackages(context)), 'release']],
  },
};
