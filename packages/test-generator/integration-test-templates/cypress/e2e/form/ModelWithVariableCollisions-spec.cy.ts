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

import { getInputByLabel } from '../../utils/form';

describe('FormTests - DSModelWithVariableCollisions', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/form-tests/DSModelWithVariableCollisions');
  });

  specify(
    'update form for model with field whose name ' +
      'is lower-case-first version of model name should ' +
      'render existing record values',
    () => {
      cy.get('#DataStoreFormUpdateModelWithVariableCollisions').within(() => {
        const originalValue = 'test';
        const updatedValue = 'test2';

        getInputByLabel('Model with variable collisions').should('have.value', originalValue);

        getInputByLabel('Model with variable collisions').type(updatedValue);

        cy.contains('Submit').click();

        getInputByLabel('Model with variable collisions').should('have.value', originalValue + updatedValue);
        cy.contains(`UpdatedField= ${originalValue}${updatedValue}`);
      });
    },
  );
});
