#!/bin/bash
set -e

npm run integ:clean
npm run build

npx nyc instrument --compact false packages packages/instrumented
rsync -av --delete packages/instrumented/codegen-ui/dist packages/codegen-ui/
rsync -av --delete packages/instrumented/codegen-ui-react/dist packages/codegen-ui-react/
rm -r packages/instrumented

# create
(cd packages && npx -y create-react-app integration-test --use-npm --template typescript)

# add files
npm run integ:templatesv6

# install
lerna bootstrap
lerna add --no-ci --scope integration-test typescript@4.4.4
lerna add --no-ci --scope integration-test aws-amplify@^6.0.0
lerna add --no-ci --scope integration-test @aws-amplify/ui-react@^6.0.0
lerna add --no-ci --scope integration-test @aws-amplify/datastore
lerna add --no-ci --scope integration-test @aws-amplify/codegen-ui
lerna add --no-ci --scope integration-test @aws-amplify/codegen-ui-react
lerna add --no-ci --scope integration-test @aws-amplify/codegen-ui-test-generator
lerna add --no-ci --scope integration-test react-router-dom
lerna add --no-ci --scope integration-test @types/react-router-dom
lerna add --no-ci --dev --scope integration-test cypress@13.0.0
lerna add --no-ci --dev --scope integration-test @cypress/code-coverage
lerna add --no-ci --dev --scope integration-test wait-on
lerna add --no-ci --dev --scope integration-test istanbul-lib-report
lerna add --no-ci --dev --scope integration-test istanbul-reports
lerna add --no-ci --scope integration-test os-browserify
lerna add --no-ci --scope integration-test path-browserify
lerna add --no-ci --scope integration-test react-app-rewired

(cd packages/integration-test && \
  jq '.scripts.start = "react-app-rewired start" | .scripts.build = "react-app-rewired build" | .scripts.test = "react-app-rewired test"' package.json > tmp.json && \
  mv tmp.json package.json \
)
