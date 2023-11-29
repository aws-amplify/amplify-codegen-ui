#!/bin/bash
set -e

lerna run build --scope @aws-amplify/codegen-ui-test-generator
cp -r packages/test-generator/integration-test-templates-v6/. packages/integration-test
DEPENDENCIES='{"aws-amplify": "6.0.0"}' node packages/test-generator/dist/generators/GenerateTestApp.js
