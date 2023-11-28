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
describe('Expander', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/view-tests');
  });

  it('renders expander with component slot', () => {
    cy.get('#expanderWithSlot').within(() => {
      const description = 'ut labore et dolore magna aliqua. Ut enim ad minim veniam';
      cy.contains(description).should('not.exist');
      // Open expander item to show description
      cy.contains('Quiet Cottage').click();
      cy.contains(description);
    });
  });

  it('renders expander with predicateOverride prop', () => {
    cy.get('#expanderWithPredicateOverride').within(() => {
      // predicateOverride filters out all items but one.
      cy.get(`[data-testid=expander-item]`).should('have.length', 1);
    });
  });
});
