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

describe('FormTests - DSCar', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/form-tests/DSCar');
  });

  specify(
    'update form for child in bidirectional 1:1 ' +
      'with `fields` specified on parent should display current values ' +
      'and save bidirectionally',
    () => {
      cy.get('#DataStoreFormUpdateCar').within(() => {
        removeArrayItem(/Oceans Fullerton/);
        getArrayFieldButtonByLabel('Dealership').click();
        typeInAutocomplete('Tustin Toyota{downArrow}{enter}');
        clickAddToArray();
        cy.contains('Submit').click();

        cy.contains('.results', /Tustin Toyota/).then((recordElement: JQuery) => {
          const record = JSON.parse(recordElement.text());

          expect(record.dealership.name).to.equal('Tustin Toyota');
          expect(record.newDealershipHasCar).to.equal(true);
          expect(record.prevDealershipDoesNotHaveCar).to.equal(true);
        });
      });
    },
  );
});
