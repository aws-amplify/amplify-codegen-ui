# Contributing

See [AWS Amplify Contributing Guidelines](https://github.com/aws-amplify/.github/blob/master/CONTRIBUTING.md).

## Development

### Getting Started

1. Fork & Clone this repo
1. [`nvm install`](https://github.com/nvm-sh/nvm)
1. [`nvm use`](https://github.com/nvm-sh/nvm)

### Building

```sh
# To run a full build
npm run setup-dev

# Or, if you'd like to run steps manually
npm install
lerna bootstrap
lerna run build
```

### Unit Testing

Unit test are written with [Jest](https://jestjs.io/).

```sh
# Run tests in all packages
npm test
```

### Integration Testing

Integration tests are done using a [React app](https://github.com/facebook/create-react-app) with
[Cypress](https://www.cypress.io/).

The integraiton tests verify:

- The correctness of the generated components.
- The generate functionality in the browser environment.

The `integration-test` GitHub workflow performs these integration tests in CI.

To run integration tests locally, execute the following:

```sh
npm run integ
```

| Command                       | Description                                                       |
| ----------------------------- | ----------------------------------------------------------------- |
| npm run integ:setup           | Setup integration tests but do not run the tests.                 |
| npm run integ:test            | Run integration tests on an existing integration setup.           |
| npm run integ:templates       | Reload integration templates from test-generator.                 |
| npm run integ:templates:watch | Watch for changes to integration templates and reload on changes. |

### Release Process

There are 3 keys steps, first you need to create a new tagged release version of the packages which will be used by our dependencies to consume the latest code.
After that you'll need to update the CLI repo to point to this new version.
Then execute an import script in StudioUI to pull the latest external code into their service.

#### Publish a Release

1. Ensure you've pulled main, including tags: `git fetch origin && git checkout main && git pull`
1. Ensure you have the latest tags: `git pull --tags -f`
1. Create new branch: `git checkout -b new-release`
1. Run version command: `npm run version`
1. Create new PR with the new branch to mainline: `gh pr create`
1. Squash and merge PR after approval.
   Ensure the commit message follows the pattern: `chore(release): v{version_number}`.
   The Release GitHub workflow will not work if the commit message is not formated correctly.
1. Wait for the [Release GithHub workflow](https://github.com/aws-amplify/amplify-codegen-ui/actions/workflows/release.yml) to complete and verify the correct verify the correct release artifacts were created.
1. `github-release` will create a new release on [the releases
   page](https://github.com/aws-amplify/amplify-codegen-ui/releases).
1. `npm-release` will publish the packages to the public NPM registry.


    * https://www.npmjs.com/package/@aws-amplify/codegen-ui
    * https://www.npmjs.com/package/@aws-amplify/codegen-ui-react

#### Update Amplify CLI

Codegen UI is consumed in the Amplify CLI through
[@aws-amplify/amplify-util-uibuilder](https://github.com/aws-amplify/amplify-cli/tree/master/packages/amplify-util-uibuilder).
Update the Codegen UI version number in
[package.json](https://github.com/aws-amplify/amplify-cli/blob/master/packages/amplify-util-uibuilder/package.json#L15-L16).

#### Update Studio UI

Studio UI does not yet consume Codegen UI from NPM and instead the Codegen UI source is copied to Studio UI.

1. Pull down the necessary packages to integrate into studio UI.
1. Execute the 'update-codegen.sh' script, providing the newly created tag.
1. Ensure review and merge the CR, after manual verification testing.

### Icons

The built-in iconset is genereted with `packages/scripts/generateBuiltInIconset.js`.
When icons are added or removed from `@aws-amplify/ui-react` run `npm run iconset` from the root of the repo to update the icons supported in codegen.
