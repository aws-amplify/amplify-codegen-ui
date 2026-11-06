#!/bin/bash
set -e

npm run integ:clean
npm run build

npx nyc instrument --compact false packages packages/instrumented
rsync -av --delete packages/instrumented/codegen-ui/dist packages/codegen-ui/
rsync -av --delete packages/instrumented/codegen-ui-react/dist packages/codegen-ui-react/
rm -r packages/instrumented

# create
(cd packages && npx -y create-react-app integration-test --use-npm --template typescript)

# add files
npm run integ:templatesv6

# install
# integration-test is not a workspace; local packages are linked from their package directories
(cd packages/integration-test && \
  npm install \
    typescript@4.4.4 aws-amplify@^6.0.0 @aws-amplify/ui-react@^6.0.0 @aws-amplify/datastore \
    ../codegen-ui ../codegen-ui-react ../test-generator \
    react-router-dom @types/react-router-dom os-browserify path-browserify react-app-rewired && \
  npm install --save-dev \
    cypress@13.0.0 @cypress/code-coverage@^3 wait-on istanbul-lib-report istanbul-reports \
)

(cd packages/integration-test && \
  jq '.scripts.start = "react-app-rewired start" | .scripts.build = "react-app-rewired build" | .scripts.test = "react-app-rewired test"' package.json > tmp.json && \
  mv tmp.json package.json \
)
