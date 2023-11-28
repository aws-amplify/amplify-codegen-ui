call lerna run build --scope @aws-amplify/codegen-ui-test-generator
call robocopy packages\integ-test-template-v6\integration-test-templates packages\integration-test /E
set DEPENDENCIES="{\"aws-amplify\": \"6.0.0\"}"
call node packages/test-generator/dist/generators/GenerateTestApp.js
