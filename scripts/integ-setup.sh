#!/bin/bash

npm run integ:clean
npm run build

# create
(cd packages && npx create-react-app integration-test --use-npm --template typescript)

# add files
npm run integ:templates

# install
lerna bootstrap
lerna add --scope integration-test aws-amplify
lerna add --scope integration-test @aws-amplify/ui-react@actions
lerna add --scope integration-test @aws-amplify/datastore
lerna add --scope integration-test @aws-amplify/codegen-ui
lerna add --scope integration-test @aws-amplify/codegen-ui-react
lerna add --scope integration-test @aws-amplify/codegen-ui-test-generator
lerna add --no-ci --scope integration-test react-router-dom
lerna add --no-ci --scope integration-test @types/react-router-dom
lerna add --no-ci --dev --scope integration-test cypress
lerna add --no-ci --dev --scope integration-test wait-on
lerna add --no-ci --scope integration-test os-browserify
lerna add --no-ci --scope integration-test path-browserify
lerna add --no-ci --scope integration-test react-app-rewired

(cd packages/integration-test && \
  jq '.scripts.start = "react-app-rewired start" | .scripts.build = "react-app-rewired build" | .scripts.test = "react-app-rewired test"' package.json > tmp.json && \
  mv tmp.json package.json \
)
