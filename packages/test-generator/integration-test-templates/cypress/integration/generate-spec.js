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
const EXPECTED_INVALID_INPUT_CASES = new Set([
  'ComponentMissingProperties',
  'ComponentMissingType',
  'InvalidTheme',
  'CardWithInvalidChildComponentType',
]);
const EXPECTED_INTERNAL_ERROR_CASES = new Set([]);

const TARGET_GENERATORS = ['ES2016_TSX', 'ES2016_JSX', 'ES5_TSX', 'ES5_JSX'];

describe('Generate Components', () => {
  it('Loads the page', () => {
    cy.visit('http://localhost:3000/generate-tests');
  });

  it('Can generate all expected rows successfully', () => {
    cy.visit('http://localhost:3000/generate-tests');
    cy.get('.generateTest').each(($element) => {
      const className = $element.attr('id').replace('generateTest', '');
      cy.wrap($element).within(() => {
        cy.get('button').click();
        TARGET_GENERATORS.forEach((targetName) => {
          if (EXPECTED_INVALID_INPUT_CASES.has(className)) {
            cy.get(`.${targetName}`).contains('❌');
            cy.get(`.${targetName}`).contains('InvalidInputError');
          } else if (EXPECTED_INTERNAL_ERROR_CASES.has(className)) {
            cy.get(`.${targetName}`).contains('❌');
            cy.get(`.${targetName}`).contains('InternalError');
          } else {
            cy.get(`.${targetName}`).contains('✅');
          }
        });
      });
    });
  });
});
