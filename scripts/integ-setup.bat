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
:: integration-test is not a workspace; local packages are linked from their package directories
chdir packages\integration-test
call npm install aws-amplify@^5.0.0 @aws-amplify/ui-react@^5.0.0 @aws-amplify/datastore@^4.0.0 ..\codegen-ui ..\codegen-ui-react ..\test-generator react-router-dom @types/react-router-dom os-browserify path-browserify @types/node react-app-rewired
call npm install --save-dev cypress@13.0.0 wait-on
chdir ..\..

chdir packages\integration-test
call jq ".scripts.start = \"react-app-rewired start\" | .scripts.build = \"react-app-rewired build\" | .scripts.test = \"react-app-rewired test\"" package.json > tmp.json
move tmp.json package.json
