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
export const getInputByLabel = (label) => {
  return cy.contains('label', label).parent().find('input');
};

export const getTextAreaByLabel = (label) => {
  return cy.contains('label', label).parent().find('textarea');
};

export const getArrayFieldButtonByLabel = (label) => {
  return cy.contains(label).next('button');
};

export const getDecoratedLabelSibling = (label) => {
  return cy.contains(label).parent().next();
};

export const clickAddToArray = (container?: Cypress.Chainable<any>) => {
  if (container) {
    container.within(() => {
      cy.get('.amplify-button--link').contains('Add').click();
    });
  } else {
    cy.get('.amplify-button--link').contains('Add').click();
  }
};

export const removeArrayItem = (itemLabel: string) => {
  // cypress clicks parent w/out the wait
  // open issue: https://github.com/cypress-io/cypress/issues/20527
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(8000);
  cy.contains(itemLabel).within(() => {
    cy.get('svg').trigger('mouseover').trigger('click', { force: true });
  });
};

export const typeInAutocomplete = (content: string) => {
  cy.get(`.amplify-autocomplete`)
    .first()
    .within(() => {
      cy.get('input').type(content);
    });
};
