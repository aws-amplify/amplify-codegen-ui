# Getting Started

This is a monorepo for Amplify UI Code Generation packages.

# Development

To build the project, run the following commands:

```sh
# To run a full build
npm run setup-dev

# Or, if you'd like to run steps manually
npm install
lerna bootstrap
lerna run build

# To run tests in all packages
npm test
```

# How to use code generator

The react code generator defined in studio-ui-codegen-react package accepts JSON conforming to the Studio Component Model schema as input and then outputs React code either as in-memory string or in a file with the path specified in outputConfig.

```js
// Create a factory that can create a renderer for a specific platform (such as Amplify UI)
const rendererFactory = new StudioTemplateRendererFactory(
  (component: StudioComponent) => new AmplifyRenderer(component)
);

// Create a renderer manager with factory and output config as input parameter
const rendererManager = new StudioTemplateRendererManager(rendererFactory, outputConfig);

// Use the renderer to generate UI code
rendererManager.renderSchemaToTemplate(schema as any);
```

The test-generator package contains sample code that uses above pattern.
To run the sample app in test-generator package, after you have built the entire project successfully, use the following command.

```sh
node ./packages/test-generator/dist/index.js
```

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
