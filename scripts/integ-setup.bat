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
:: Amplify UI 5 targets React 18, so the app's React runtime and type packages are pinned to 18
chdir packages\integration-test
call npm install react@^18 react-dom@^18 @types/react@^18 @types/react-dom@^18 aws-amplify@^5.0.0 @aws-amplify/ui-react@^5.0.0 @aws-amplify/datastore@^4.0.0 ..\codegen-ui ..\codegen-ui-react ..\test-generator react-router-dom @types/react-router-dom os-browserify path-browserify @types/node react-app-rewired
call npm install --save-dev cypress@13.0.0 wait-on
chdir ..\..

chdir packages\integration-test
call jq ".scripts.start = \"react-app-rewired start\" | .scripts.build = \"react-app-rewired build\" | .scripts.test = \"react-app-rewired test\"" package.json > tmp.json
move tmp.json package.json
