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
lerna add --scope integration-test @aws-amplify/ui-react@0.0.0-next-248121b-20211011203215
lerna add --scope integration-test @aws-amplify/datastore
lerna add --scope integration-test @amzn/studio-ui-codegen
lerna add --scope integration-test @amzn/studio-ui-codegen-react
lerna add --scope integration-test @amzn/test-generator
lerna add --no-ci --scope integration-test react-router-dom
lerna add --no-ci --scope integration-test @types/react-router-dom
lerna add --no-ci --dev --scope integration-test cypress
lerna add --no-ci --dev --scope integration-test wait-on
