#!/bin/bash

# build components
npm run build

# add files
cp -r packages/test-generator/integration-test-templates/. packages/integration-test
node packages/test-generator/dist/generators/GenerateTestApp.js
