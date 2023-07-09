#!/bin/bash
set -e

lerna run build --scope @aws-amplify/codegen-ui-test-generator
cp -r packages/test-generator/integration-test-templates/. packages/integration-test
node packages/test-generator/dist/generators/GenerateTestApp.js
