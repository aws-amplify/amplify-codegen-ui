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

[Install jq](https://stedolan.github.io/jq/download/) before running the integration tests.

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

### Testing updates to CLI

This process is pretty ugly today, and seems fairly fragile at the moment. We should work to improve this long-term, but we also have automation that tests this in the pipeline, so you're almost certainly fine not running these tests manually today.

The following steps assume you're testing with no a priori repo for CLI or Codegen, which is probably not right. adjust your steps as necessary.

```sh
# Clone repos
git clone git@github.com:aws-amplify/amplify-codegen-ui.git
git clone git@github.com:aws-amplify/amplify-cli.git
# Build and package latest codegen
(cd amplify-codegen-ui && npm ci && lerna bootstrap && npm run build && lerna exec npm pack)
# Build and load codegen tarballs into cli
(cd amplify-cli && yarn setup-dev)
(cd amplify-cli/packages/amplify-util-uibuilder && npm install ../../../amplify-codegen-ui/packages/codegen-ui/aws-amplify-codegen-ui-*.tgz && npm install ../../../amplify-codegen-ui/packages/codegen-ui-react/aws-amplify-codegen-ui-react-*.tgz)
(cd amplify-cli/packages/amplify-util-uibuilder && npm test)
# Create and pull down test app
npx create-react-app e2e-test-app
cd e2e-test-app
npm i aws-amplify @aws-amplify/ui-react
amplify-dev pull --appId <YOUR_APP_ID> --envName <YOUR_APP_ENV_NAME>
# Start app and test
npm start
# Note: you'll need to actually import your components, etc. in your app.
```

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

   - https://www.npmjs.com/package/@aws-amplify/codegen-ui
   - https://www.npmjs.com/package/@aws-amplify/codegen-ui-react

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

### Pre-Release

A pre-release is automatically published to NPM when the following cirteria are met:

- A commit is pushed to then `main` or `develop` branch.
- The commit is not a release commit (i.e. `chore(release): v...`).

The pre-release will increment the patch version of each package and append meta information including the short commit hash.
These changes will **NOT** be pushed back to the GitHub repo.

Example:

```
 - @aws-amplify/codegen-ui-react => 1.1.1-2baaca9.0
 - @aws-amplify/codegen-ui => 1.1.1-2baaca9.0
```

The pre-release will be published under the `next` dist tag.

```
npm install @aws-amplify/codegen-ui-react@next
```

See [lerna publish docs](https://github.com/lerna/lerna/tree/main/commands/publish) for further detail.

### Tagged Release

A tagged release is used to release emergent or prototype changes without merging into `main`.
To create a tagged release create a pull request or push directly to a branch with the prefix `tagged-release/`.
(Ex. `tagged-release/fix-properties`).
The branch name must not contain any additional forward slashes after `tagged-release/`.
The tagged release will use the same versioning process as the pre-release except:

- the preid will inlcude the branch name with `tagged-release/` removed. (Ex. `1.1.1-fix-properties-2baaca9.0`)
- the release will be published with the dist tag as the tagged release name. (Ex. `fix-properties`)
