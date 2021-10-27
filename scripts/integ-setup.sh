#!/bin/bash

npm run integ:clean
npm run build

# create
(cd packages && npx create-react-app integration-test --use-npm --template typescript)

# add files
cp -r packages/test-generator/integration-test-templates/. packages/integration-test
node packages/test-generator/dist/generators/GenerateTestApp.js

# install
lerna bootstrap
lerna add --scope integration-test aws-amplify
lerna add --scope integration-test @aws-amplify/ui-react@next
lerna add --scope integration-test @aws-amplify/datastore
lerna add --scope integration-test @amzn/studio-ui-codegen-react
lerna add --scope integration-test @amzn/test-generator
lerna add --no-ci --scope integration-test react-router-dom
lerna add --no-ci --scope integration-test @types/react-router-dom
lerna add --no-ci --dev --scope integration-test cypress
lerna add --no-ci --dev --scope integration-test wait-on
