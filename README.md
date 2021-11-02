# Getting Started

This is a monorepo for Amplify UI Code Generation packages.

# Development

## Getting Started

1. Fork & Clone this repo
1. [`nvm install`](https://github.com/nvm-sh/nvm)
1. [`nvm use`](https://github.com/nvm-sh/nvm)

## Building

```sh
# To run a full build
npm run setup-dev

# Or, if you'd like to run steps manually
npm install
lerna bootstrap
lerna run build
```

## Testing

```sh
# To run tests in all packages
npm test

# To run E2E Integration tests
npm run integ
```

For more information on integration testing, see [Integration Testing](#integration-testing) below.

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

This is a sample project that utilizes codegen to render components in a desired framework.

This project is currently configured to codegen Amplify UI components and themes, as well as provide templates which can be used in external projects to verify the correctness and usability of generated components.

### Integration Testing

Integration tests are done using a React app with Cypress.

The integraiton tests verify:

- The correctness of the generated components.
- The generate functionality in the browser environment.

The `integration-test` GitHub workflow performs these integration tests in CI.

To run integration tests locally, execute the following:

```sh
npm run setup-dev # If this is a newly cloned repo
npm run integ
```

| Command                       | Description                                                       |
| ----------------------------- | ----------------------------------------------------------------- |
| npm run integ:setup           | Setup integration tests but do not run the tests.                 |
| npm run integ:test            | Run integration tests on an existing integration setup.           |
| npm run integ:templates       | Reload integration templates from test-generator.                 |
| npm run integ:templates:watch | Watch for changes to integration templates and reload on changes. |

## CodeGen

_@amzn/studio-ui-codegen_

This packages contains all of the base classes for the codegen providers, and codegen schema for studio. This is currently geared to generating web components with JSX.

_@amzn/studio-ui-codegen-react_

This package contains the necessary codegen to render directly to Amplify Components from a Studio Schema.

## Versioning

Until this package is public and publishes to NPM, we have a slightly complicated release process (though mostly automated).

There are 3 keys steps, first you need to create a new tagged release version of the packages which will be used by our dependencies to consume the latest code. After that you'll need to update the CLI repo to point to this new version, and then execute an import script in StudioUI to pull the latest external code into their service.

### Codegen Repo Packages

1. Create new branch: `git checkout -b new-release`
1. Run version command: `npm run version`
1. Create new PR with the new branch to mainline: `gh pr create`
1. Squash and merge PR after approval.

\*\*N.B. Ensure that your release has a tag, manually creating if necessary. Only major/minor updates seem to automatically generate tags, but you can create one yourself with the [git-tag](https://git-scm.com/docs/git-tag) command.

### Amplify CLI

1. Navigate to the Studio Category repo's [configuration file](https://github.com/johnpc/amplify-category-studio/blob/master/.github/variables/codegenVersion.env) for the codegen version, and update this to point to the version you've just published.
1. Create new PR for the release with `gh pr create`
1. Ask the CLI team to merge the PR after approval.

### Studio UI

1. Pull down the necessary packages to integrate into studio UI.
1. Execute the 'update-codegen.sh' script, providing the newly created tag.
1. Ensure review and merge of the CR, after manual verification testing.
