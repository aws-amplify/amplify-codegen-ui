call lerna run build --scope @aws-amplify/codegen-ui-test-generator
call robocopy packages\integ-test-template-v5\integration-test-templates packages\integration-test /E
call node packages/test-generator/dist/generators/GenerateTestApp.js
