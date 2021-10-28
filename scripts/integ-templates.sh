#!/bin/bash

lerna run build
cp -r packages/test-generator/integration-test-templates/. packages/integration-test
node packages/test-generator/dist/generators/GenerateTestApp.js
