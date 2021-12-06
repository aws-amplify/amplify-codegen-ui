:: clean workspace and build 
call npm run integ:clean
call npm run build

:: create
chdir packages
call npx create-react-app integration-test --use-npm --template typescript
chdir ..

:: add files
call npm run integ:templates

:: install
call lerna bootstrap
call lerna add --scope integration-test aws-amplify
call lerna add --scope integration-test @aws-amplify/ui-react
call lerna add --scope integration-test @aws-amplify/datastore
call lerna add --scope integration-test @aws-amplify/codegen-ui
call lerna add --scope integration-test @aws-amplify/codegen-ui-react
call lerna add --scope integration-test @aws-amplify/codegen-ui-test-generator
call lerna add --no-ci --scope integration-test react-router-dom
call lerna add --no-ci --scope integration-test @types/react-router-dom
call lerna add --no-ci --dev --scope integration-test cypress
call lerna add --no-ci --dev --scope integration-test wait-on
