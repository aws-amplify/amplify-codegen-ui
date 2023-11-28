#!/bin/bash
set -e

lerna run build --scope @aws-amplify/codegen-ui-test-generator
cp -r packages/test-generator/integration-test-templates/. packages/integration-test
DEPENDENCIES='{"aws-amplify": "5.0.0"}' node packages/test-generator/dist/generators/GenerateTestApp.js
