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

import {
  clickAddToArray,
  getArrayFieldButtonByLabel,
  getInputByLabel,
  removeArrayItem,
  typeInAutocomplete,
} from '../../utils/form';

describe('FormTests - DSBidirectionalOwner', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/form-tests/DSBidirectionalOwner');
  });
  specify(
    'create form for the parent of bidirectional 1:1 ' +
      'should throw when connecting to child of another parent ' +
      'if parent requires child',
    () => {
      cy.get('#DataStoreFormCreateBidirectionalOwner').within(() => {
        getInputByLabel('Name').type('New Fluffy Owner');
        getArrayFieldButtonByLabel('Bi directional dog').click();
        typeInAutocomplete('F{downArrow}{enter}');
        clickAddToArray();

        cy.contains('Submit').click();
        cy.contains(
          'cannot be linked to BiDirectionalOwner because it is already linked to another BiDirectionalOwner',
        );
      });
    },
  );
  specify(
    'update form for the parent of bidirectional 1:1 ' +
      'should throw when connecting to child of another parent ' +
      'if parent requires child',
    () => {
      cy.get('#DataStoreFormUpdateBidirectionalOwner').within(() => {
        removeArrayItem('Fluffy');
        getArrayFieldButtonByLabel('Bi directional dog').click();
        typeInAutocomplete('M{downArrow}{enter}');
        clickAddToArray();

        cy.contains('Submit').click();
        cy.contains(
          'cannot be linked to BiDirectionalOwner because it is already linked to another BiDirectionalOwner',
        );
      });
    },
  );
});
