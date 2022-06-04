#!/bin/bash

(cd packages/integration-test && (
  (npm start &> /dev/null & npx --no-install wait-on http://localhost:3000) &&
  npx --no-install cypress run -C cypress.config.ts
  kill -9 `lsof -t -i :3000 -s`
))
