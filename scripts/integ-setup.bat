:: clean workspace and build 
call npm run integ:clean
call npm run build

:: create
chdir packages
call npx -y create-react-app integration-test --use-npm --template typescript
chdir ..

:: add files
call npm run integ:templates

:: install
call lerna bootstrap
call lerna add --scope integration-test aws-amplify@^5.0.0
call lerna add --scope integration-test @aws-amplify/ui-react@^5.0.0
call lerna add --scope integration-test @aws-amplify/datastore@^4.0.0
call lerna add --scope integration-test @aws-amplify/codegen-ui
call lerna add --scope integration-test @aws-amplify/codegen-ui-react
call lerna add --scope integration-test @aws-amplify/codegen-ui-test-generator
call lerna add --no-ci --scope integration-test react-router-dom
call lerna add --no-ci --scope integration-test @types/react-router-dom
call lerna add --no-ci --dev --scope integration-test cypress@13.0.0
call lerna add --no-ci --dev --scope integration-test wait-on
call lerna add --no-ci --scope integration-test os-browserify
call lerna add --no-ci --scope integration-test path-browserify
call lerna add --no-ci --scope integration-test @types/node
call lerna add --no-ci --scope integration-test react-app-rewired

chdir packages\integration-test
call jq ".scripts.start = \"react-app-rewired start\" | .scripts.build = \"react-app-rewired build\" | .scripts.test = \"react-app-rewired test\"" package.json > tmp.json
move tmp.json package.json
