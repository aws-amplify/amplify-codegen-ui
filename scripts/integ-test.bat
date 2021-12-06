chdir packages\integration-test
start npm start
call npx --no-install wait-on http://localhost:3000
call npx --no-install cypress run -C cypress.json
