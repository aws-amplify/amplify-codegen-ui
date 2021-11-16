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

Until this package is public and publishes to NPM, we have a slightly complicated release process (though mostly automated).

There are 3 keys steps, first you need to create a new tagged release version of the packages which will be used by our dependencies to consume the latest code. After that you'll need to update the CLI repo to point to this new version, and then execute an import script in StudioUI to pull the latest external code into their service.

#### Versioning

1. Create new branch: `git checkout -b new-release`
1. Run version command: `npm run version`
1. Create new PR with the new branch to mainline: `gh pr create`
1. Squash and merge PR after approval.
   Ensure the commit message follows the pattern: `chore(release): v{version_number}`.
   The Release GitHub workflow will not work if the commit message is not formated correctly.
1. Wait for the [Release GithHub workflow](https://github.com/aws-amplify/amplify-codegen-ui-staging/actions/workflows/release.yml) to complete.

\*\*N.B. Ensure that your release has a tag, manually creating if necessary. Only major/minor updates seem to automatically generate tags, but you can create one yourself with the [git-tag](https://git-scm.com/docs/git-tag) command.

#### Amplify CLI

1. Navigate to the Studio Category repo's [configuration file](https://github.com/johnpc/amplify-category-studio/blob/master/.github/variables/codegenVersion.env) for the codegen version, and update this to point to the version you've just published.
1. Create new PR for the release with `gh pr create`
1. Ask the CLI team to merge the PR after approval.

#### Studio UI

1. Pull down the necessary packages to integrate into studio UI.
1. Execute the 'update-codegen.sh' script, providing the newly created tag.
1. Ensure review and merge of the CR, after manual verification testing.
