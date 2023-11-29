call lerna run build --scope @aws-amplify/codegen-ui-test-generator
call robocopy packages\test-generator\integration-test-templates-v6 packages\integration-test /E
set DEPENDENCIES="{\"aws-amplify\": \"6.0.0\"}"
call node packages/test-generator/dist/generators/GenerateTestApp.js
