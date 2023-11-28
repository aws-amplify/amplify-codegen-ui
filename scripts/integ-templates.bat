call lerna run build --scope @aws-amplify/codegen-ui-test-generator
call robocopy packages\test-generator\integration-test-templates-v5 packages\integration-test /E
call node packages/test-generator/dist/generators/GenerateTestApp.js
