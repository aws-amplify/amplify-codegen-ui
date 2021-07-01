module.exports = {
  ignorePatterns: [
    'lib',
    'build',
    'dist',
    'node_modules',
    '.eslintrc.js',
    'jest.config.js',
    'webpack.config.js',
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
    'max-len': ['error', 120, { ignoreTemplateLiterals: true }],
  },
};
