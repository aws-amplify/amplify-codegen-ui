# Getting Started

This is a monorepo for Amplify UI Code Generation packages.

# Development

To build the project, run the following commands:

```js
lerna bootstrap
lerna run build
```

### Running the code generation test application

After you have built the entire project successfully, use the following command to run the test generator.

```sh
node ./packages/test-generator/dist/index.js
```

The above command will use JSON in '/packages/test-generator/lib' as input.

# Package Descriptions

## Test

_@amzn/test-generator_

This is a sample project that utilizes codegen to render components in a desired framework. This project is currently configured to codegen Amplify UI Wrapper components.

## Amplify Components Schema

_@amzn/amplify-ui-codegen-schema_

This package contains all of the Json schema definitions as Typescript types.

## CodeGen

_@amzn/studio-ui-codegen_

This packages contains all of the base classes for the codegen providers. This is currently geared to generating web components with JSX.

_@amzn/studio-ui-codegen-react_

This package contains the necessary codegen to render directly to Amplify Components from a Studio Schema.
