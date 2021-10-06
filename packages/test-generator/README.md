# `test-renderer`

This package can be used to render out sample files using the renderers provided in `studio-ui-codegen-react`.

## Usage

Test components will be rendered with both source and usage docs to STDOUT as markdown.

```sh
# Build the package from repo root.
lerna bootstrap
lerna run build
# And either render to STDOUT or a file
node packages/test-generator/dist/index.js
node packages/test-generator/dist/index.js > test-generator-output.md
```
