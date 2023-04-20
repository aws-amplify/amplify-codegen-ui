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

import { getArrayFieldButtonByLabel, typeInAutocomplete, clickAddToArray, removeArrayItem } from '../../utils/form';

describe('FormTests - DSDealership', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/form-tests/DSDealership');
  });

  specify(
    'update form for parent of bidirectional 1:m with `fields` ' +
      'defined on the relationship with child should display current values ' +
      'and save bidirectionally',
    () => {
      cy.get('#DataStoreFormUpdateDealership').within(() => {
        removeArrayItem(/Honda/);
        getArrayFieldButtonByLabel('Cars').click();
        typeInAutocomplete('Toyota{downArrow}{enter}');
        clickAddToArray();
        cy.contains('Submit').click();

        cy.contains('.results', /Toyota/).then((recordElement: JQuery) => {
          const record = JSON.parse(recordElement.text());

          expect(record.cars[0].name).to.equal('Toyota');
          expect(record.newCarBelongsToDealership).to.equal(true);
          expect(record.newCarBelongsToDealership).to.equal(true);
        });
      });
    },
  );
});
