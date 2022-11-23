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

import { getArrayFieldButtonByLabel, clickAddToArray, removeArrayItem } from '../utils/form';

describe('UpdateForms', () => {
  before(() => {
    cy.visit('http://localhost:3000/update-form-tests');
  });

  describe('DataStoreFormUpdateAllSupportedFormFields', () => {
    it('should display current values and save to DataStore', () => {
      cy.get('#dataStoreFormUpdateAllSupportedFormFields').within(() => {
        // TODO: check current values on all fields and change

        removeArrayItem('John Lennon');

        getArrayFieldButtonByLabel('Has one user').click();
        cy.get(`.amplify-autocomplete`).within(() => {
          cy.get('input').type(`Paul McCartney{downArrow}{enter}`);
        });
        clickAddToArray();

        cy.contains('Submit').click();

        cy.contains(/My string/).then((recordElement) => {
          const record = JSON.parse(recordElement.text());

          expect(record.HasOneUser.firstName).to.equal('Paul');
        });
      });
    });
  });
});
