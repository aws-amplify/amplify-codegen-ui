module.exports = {
  ignorePatterns: [
    'build',
    'dist',
    'node_modules',
    'jest.config.js',
    '.eslintrc.js',
    'commitlint.config.js',
    'packages/integration-test',
    '*.md',
    '*.css',
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'airbnb-typescript/base',
    'prettier',
    'plugin:prettier/recommended',
  ],
  plugins: ['import', 'prettier', '@typescript-eslint', 'header'],
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    ecmaVersion: 6,
  },
  rules: {
    'max-len': ['error', 120, { ignoreTemplateLiterals: true }],
    'max-classes-per-file': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'header/header': [2, 'license-header.js'],
    // TODO: enable rules below and fix issues
    '@typescript-eslint/ban-types': 'off',
    'import/prefer-default-export': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'class-methods-use-this': 'off',
  },
  settings: {
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
