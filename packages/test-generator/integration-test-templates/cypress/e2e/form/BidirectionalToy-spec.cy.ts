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

import { clickAddToArray, getArrayFieldButtonByLabel, getInputByLabel, typeInAutocomplete } from '../../utils/form';

describe('FormTests - DSBidirectionalToy', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/form-tests/DSBidirectionalToy');
  });

  specify('Create Dog - should update toy connection to new dog', () => {
    cy.get('#DataStoreFormCreateBidirectionalDog').within(() => {
      getInputByLabel('Name').type('Spot');

      getArrayFieldButtonByLabel('Bi directional toys').click();
      typeInAutocomplete('F{downArrow}{enter}');
      clickAddToArray();

      cy.contains('Submit').click();

      cy.contains('Toy BiDirectionalDogId is connected to new dog');
      cy.contains('Toy biDirectionalDogBiDirectionalToysId is connected to new dog');
    });
  });
});
