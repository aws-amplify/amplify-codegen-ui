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
import { setupAuthAttributeIntercept } from '../utils/form';

describe('Action Bindings', () => {
  describe('Mutation Bindings', () => {
    beforeEach(() => {
      setupAuthAttributeIntercept();
      cy.visit('http://localhost:3000/action-binding-tests');
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(3000);
    });

    it('supports value bindings', () => {
      cy.get('#mutated-value').contains('Fixed Value').should('not.exist');
      cy.contains('Apply Fixed Property Mutation').click();
      cy.get('#mutated-value').contains('Fixed Value');
    });

    it('supports bound prop bindings', () => {
      cy.get('#mutated-value').contains('Bound Value').should('not.exist');
      cy.contains('Current Binding - Bound Value');
      cy.contains('Apply Bound Property Mutation').click();
      cy.get('#mutated-value').contains('Bound Value');
    });

    it('supports concat bindings', () => {
      cy.get('#mutated-value').contains('Concatenated Value').should('not.exist');
      cy.contains('Apply Concatenated Property Mutation').click();
      cy.get('#mutated-value').contains('Concatenated Value');
    });

    it('supports conditional bindings', () => {
      cy.get('#mutated-value').contains('Conditional Value').should('not.exist');
      cy.contains('Apply Conditional Property Mutation').click();
      cy.get('#mutated-value').contains('Conditional Value');
    });

    it('supports auth bindings', () => {
      cy.get('#mutated-value').contains('Auth Value').should('not.exist');
      cy.contains('Apply Auth Property Mutation').click();
      cy.get('#mutated-value').contains('Auth Value');
    });

    it('supports state bindings', () => {
      cy.get('#mutated-value').contains('State Value').should('not.exist');
      cy.contains('Apply State Property Mutation').click();
      cy.get('#mutated-value').contains('State Value');
    });
  });

  describe('DataStore Bindings', () => {
    beforeEach(() => {
      setupAuthAttributeIntercept();
      cy.visit('http://localhost:3000/action-binding-tests');
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(3000);
    });

    it('supports value bindings', () => {
      cy.get('#data-store-value').contains('Fixed Value').should('not.exist');
      cy.contains('Apply Fixed Property DataStoreUpdateItemAction').click();
      cy.get('#data-store-value').contains('Fixed Value');
    });

    it('supports bound prop bindings', () => {
      cy.get('#data-store-value').contains('Bound Value').should('not.exist');
      cy.contains('Apply Bound Property DataStoreUpdateItemAction').click();
      cy.get('#data-store-value').contains('Bound Value');
    });

    it('supports concat bindings', () => {
      cy.get('#data-store-value').contains('Concatenated Value').should('not.exist');
      cy.contains('Apply Concatenated Property DataStoreUpdateItemAction').click();
      cy.get('#data-store-value').contains('Concatenated Value');
    });

    it('supports conditional bindings', () => {
      cy.get('#data-store-value').contains('Conditional Value').should('not.exist');
      cy.contains('Apply Conditional Property DataStoreUpdateItemAction').click();
      cy.get('#data-store-value').contains('Conditional Value');
    });

    it('supports auth bindings', () => {
      cy.get('#data-store-value').contains('Auth Value').should('not.exist');
      cy.contains('Apply Auth Property DataStoreUpdateItemAction').click();
      cy.get('#data-store-value').contains('Auth Value');
    });

    it('supports state bindings', () => {
      cy.get('#data-store-value').contains('State Value').should('not.exist');
      cy.contains('Apply State Property DataStoreUpdateItemAction').click();
      cy.get('#data-store-value').contains('State Value');
    });
  });

  describe('Initial Value Bindings', () => {
    beforeEach(() => {
      setupAuthAttributeIntercept();
      cy.visit('http://localhost:3000/action-binding-tests');
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000);
    });

    it('supports fixed values', () => {
      cy.get('#fixed-value-initial-binding-section').within(() => {
        cy.contains('Fixed Value');
        cy.contains('Mutate').click();
        cy.contains('Mutated Value');
      });
    });

    it('supports bound values', () => {
      cy.get('#bound-value-initial-binding-section').within(() => {
        cy.contains('Bound Value');
        cy.contains('Mutate').click();
        cy.contains('Mutated Value');
      });
    });

    it('supports concat values', () => {
      cy.get('#concat-value-initial-binding-section').within(() => {
        cy.contains('Concat Value');
        cy.contains('Mutate').click();
        cy.contains('Mutated Value');
      });
    });

    it('supports conditional values', () => {
      cy.get('#conditional-value-initial-binding-section').within(() => {
        cy.contains('Conditional Value');
        cy.contains('Mutate').click();
        cy.contains('Mutated Value');
      });
    });

    it('supports auth values', () => {
      cy.get('#auth-value-initial-binding-section').within(() => {
        cy.contains('Auth Value');
        cy.contains('Mutate').click();
        cy.contains('Mutated Value');
      });
    });

    it('supports state values', () => {
      cy.get('#state-value-initial-binding-section').within(() => {
        cy.contains('State Value');
        cy.contains('Mutate').click();
        cy.contains('Mutated Value');
      });
    });

    it('supports values in text fields', () => {
      cy.get('#text-field-value-initial-binding-section').within(() => {
        cy.get('input').should('have.attr', 'value', 'Auth Value');
        cy.get('button').click();
        cy.get('input').should('have.attr', 'value', 'Mutated Value');
        cy.get('input').type(' with typing');
        cy.get('input').should('have.attr', 'value', 'Mutated Value with typing');
        cy.get('button').click();
        cy.get('input').should('have.attr', 'value', 'Mutated Value');
      });
    });
  });
});
