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

        // label should exist even if no input field displayed
        cy.contains('Has one user').should('exist');
        // should be able to hit edit and save
        // cypress does not populate value in ci w/out wait
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(8000);
        cy.contains('John Lennon').click();
        cy.contains('Save').click();
        cy.contains('John Lennon').should('exist');

        // should be able to change value
        removeArrayItem('John Lennon');
        getArrayFieldButtonByLabel('Has one user').click();
        cy.get(`.amplify-autocomplete`).within(() => {
          cy.get('input').type(`Paul McCartney{downArrow}{enter}`);
        });
        clickAddToArray();

        // Belongs to update
        removeArrayItem('John');
        getArrayFieldButtonByLabel('Belongs to owner').click();
        cy.get(`.amplify-autocomplete`).within(() => {
          cy.get('input').type(`George{downArrow}{enter}`);
        });
        clickAddToArray();

        // Many to many update
        removeArrayItem('Red');
        removeArrayItem('Blue');

        getArrayFieldButtonByLabel('Many to many tags').click();
        cy.get(`.amplify-autocomplete`).within(() => {
          cy.get('input').type(`Or{downArrow}{enter}`);
        });
        clickAddToArray();

        getArrayFieldButtonByLabel('Many to many tags').click();
        cy.get(`.amplify-autocomplete`).within(() => {
          cy.get('input').type(`Gr{downArrow}{enter}`);
        });
        clickAddToArray();

        // Many to many update
        removeArrayItem('David');
        removeArrayItem('Jessica');

        getArrayFieldButtonByLabel('Has many students').click();
        cy.get(`.amplify-autocomplete`).within(() => {
          cy.get('input').type(`{downArrow}{enter}`);
        });
        clickAddToArray();

        getArrayFieldButtonByLabel('Has many students').click();
        cy.get(`.amplify-autocomplete`).within(() => {
          cy.get('input').type(`Sar{downArrow}{enter}`);
        });
        clickAddToArray();

        cy.contains('Submit').click();

        cy.contains(/My string/).then((recordElement: JQuery) => {
          const record = JSON.parse(recordElement.text());

          expect(record.HasOneUser.firstName).to.equal('Paul');
          expect(record.ManyToManyTags[0].label).to.equal('Green');
          expect(record.ManyToManyTags[1].label).to.equal('Orange');
          expect(record.BelongsToOwner.name).to.equal('George');
          expect(record.HasManyStudents.length).to.equal(2);
          expect(record.HasManyStudents[0].name).to.equal('Matthew');
          expect(record.HasManyStudents[0].allSupportedFormFieldsID).to.equal(record.id);
          expect(record.HasManyStudents[1].name).to.equal('Sarah');
          expect(record.HasManyStudents[1].allSupportedFormFieldsID).to.equal(record.id);
        });
      });
    });
  });
});
