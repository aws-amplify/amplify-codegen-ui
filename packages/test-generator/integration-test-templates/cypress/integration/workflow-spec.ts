/*
  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License").
  You may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
 */
describe('Workflow', () => {
  before(() => {
    cy.visit('http://localhost:3000/workflow-tests');
  });

  describe('Events', () => {
    it('click event', () => {
      cy.get('#event')
        .find('.amplify-flex')
        .within(() => {
          const text = 'button clicked';
          cy.get('#button-clicked').should('not.have.text', text);
          cy.get('.amplify-button').click();
          cy.get('#button-clicked').should('have.text', text);
        });
    });

    it('text event', () => {
      cy.get('#event')
        .find('.amplify-flex')
        .within(() => {
          const text = 'text changed';
          cy.get('#text-changed').should('not.have.text', text);
          cy.get('.amplify-input').type(text);
          cy.get('#text-changed').should('have.text', text);
        });
    });
  });
});
