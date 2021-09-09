module.exports = {
  ignorePatterns: [
    'build',
    'dist',
    'node_modules',
    'jest.config.js',
    '.eslintrc.js',
    'commitlint.config.js',
    'packages/ui-react-types',
    'packages/amplify-ui-codegen-schema',
    'ui-components',
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'airbnb-typescript/base',
    'prettier',
    'plugin:prettier/recommended',
  ],
  plugins: ['import', 'prettier', '@typescript-eslint'],
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    ecmaVersion: 6,
  },
  rules: {
    'max-len': ['error', 120, 2],
    'react/prop-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    // TODO: enable rules below and fix issues
    '@typescript-eslint/no-shadow': 'off',
    '@typescript-eslint/ban-types': 'off',
    'import/prefer-default-export': 'off',
    'no-restricted-syntax': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'class-methods-use-this': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
  },
};
