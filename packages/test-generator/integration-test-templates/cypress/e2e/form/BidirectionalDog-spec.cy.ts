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

import { clickAddToArray, getArrayFieldButtonByLabel, removeArrayItem, typeInAutocomplete } from '../../utils/form';

describe('FormTests - DSBidirectionalDog', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/form-tests/DSBidirectionalDog');
  });

  specify(
    'Update form for child of bidirectional 1:1 should throw when disconnecting parent if parent requires child',
    () => {
      cy.get('#DataStoreFormUpdateBidirectionalDog').within(() => {
        removeArrayItem('Fluffys Owner');

        cy.contains('Submit').click();
        cy.contains('cannot be unlinked because BiDirectionalOwner requires BiDirectionalDog');
      });
    },
  );

  specify(
    'Update form for child of bidirectional 1:1 should throw when changing parent if parent requires child',
    () => {
      cy.get('#DataStoreFormUpdateBidirectionalDog').within(() => {
        removeArrayItem('Fluffys Owner');
        getArrayFieldButtonByLabel('Bi directional owner').click();
        typeInAutocomplete('M{downArrow}{enter}');
        clickAddToArray();

        cy.contains('Submit').click();
        cy.contains('cannot be unlinked because BiDirectionalOwner requires BiDirectionalDog');
      });
    },
  );

  specify(
    'Update form for parent of bidirectional 1:m should throw when disconnecting child if child requires parent',
    () => {
      cy.get('#DataStoreFormUpdateBidirectionalDog').within(() => {
        removeArrayItem('Bone');

        cy.contains('Submit').click();
        cy.contains(
          'cannot be unlinked from BiDirectionalDog because biDirectionalDogBiDirectionalToysId is a required field.',
        );
      });
    },
  );
});
