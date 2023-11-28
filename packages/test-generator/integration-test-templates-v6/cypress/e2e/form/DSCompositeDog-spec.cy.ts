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
  getInputByLabel,
  getArrayFieldButtonByLabel,
  typeInAutocomplete,
  clickAddToArray,
  removeArrayItem,
} from '../../utils/form';

describe('FormTests - DSCompositeDog', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/form-tests/DSCompositeDog');
  });

  specify(
    'create form for model with composite keys ' +
      'and relationships with other models with composite keys ' +
      'should save relationships',
    () => {
      cy.get('#DataStoreFormCreateCompositeDog').within(() => {
        getInputByLabel('Name').type('Cookie');
        getInputByLabel('Description').type('mogwai');

        // hasOne
        getArrayFieldButtonByLabel('Composite bowl').click();
        typeInAutocomplete('round-xl{downArrow}{enter}');
        clickAddToArray();

        // belongsTo
        getArrayFieldButtonByLabel('Composite owner').click();
        typeInAutocomplete('Cooper-Gordon{downArrow}{enter}');
        clickAddToArray();

        // manyToMany
        getArrayFieldButtonByLabel('Composite toys').click();
        typeInAutocomplete('chew-red{downArrow}{enter}');
        clickAddToArray();

        // hasMany
        getArrayFieldButtonByLabel('Composite vets').click();
        typeInAutocomplete('Dentistry-Los Angeles{downArrow}{enter}');
        clickAddToArray();

        cy.contains('Submit').click();

        cy.contains(/Cookie/).then((recordElement: JQuery) => {
          const record = JSON.parse(recordElement.text());

          expect(record.CompositeBowl.size).to.equal('xl');
          expect(record.CompositeOwner.firstName).to.equal('Gordon');
          expect(record.CompositeToys.length).to.equal(1);
          expect(record.CompositeToys[0].color).to.equal('red');
          expect(record.CompositeVets.length).to.equal(1);
          expect(record.CompositeVets[0].city).to.equal('Los Angeles');
        });
      });
    },
  );

  specify(
    'update form for model with composite keys and ' +
      'relationships with other models with composite keys ' +
      'should display current values and update relationships',
    () => {
      cy.get('#DataStoreFormUpdateCompositeDog').within(() => {
        // composite keys should be readonly
        getInputByLabel('Name').should('have.attr', 'readonly');
        getInputByLabel('Description').should('have.attr', 'readonly');

        // hasOne
        removeArrayItem('round-xs');
        getArrayFieldButtonByLabel('Composite bowl').click();
        typeInAutocomplete('round-xl{downArrow}{enter}');
        clickAddToArray();

        // belongsTo
        removeArrayItem('Cooper-Dale');
        getArrayFieldButtonByLabel('Composite owner').click();
        typeInAutocomplete('Cooper-Gordon{downArrow}{enter}');
        clickAddToArray();

        // manyToMany
        removeArrayItem('chew-green');
        getArrayFieldButtonByLabel('Composite toys').click();
        typeInAutocomplete('chew-red{downArrow}{enter}');
        clickAddToArray();

        // hasMany
        removeArrayItem('Dentistry-Seattle');
        getArrayFieldButtonByLabel('Composite vets').click();
        typeInAutocomplete('Dentistry-Los Angeles{downArrow}{enter}');
        clickAddToArray();

        cy.contains('Submit').click();

        cy.contains(/Yundoo/).then((recordElement: JQuery) => {
          const record = JSON.parse(recordElement.text());

          expect(record.CompositeBowl.size).to.equal('xl');
          expect(record.CompositeOwner.firstName).to.equal('Gordon');
          expect(record.CompositeToys.length).to.equal(1);
          expect(record.CompositeToys[0].color).to.equal('red');
          expect(record.CompositeVets.length).to.equal(1);
          expect(record.CompositeVets[0].city).to.equal('Los Angeles');
        });
      });
    },
  );

  specify('update form for model with composite keys should update relationships through the index fields', () => {
    cy.get('#DataStoreFormUpdateCompositeDogScalar').within(() => {
      // hasOne
      removeArrayItem('xs');
      getArrayFieldButtonByLabel('Composite dog composite bowl size').click();
      typeInAutocomplete('xl{downArrow}{enter}');
      clickAddToArray();

      // belongsTo
      removeArrayItem('Dale');
      getArrayFieldButtonByLabel('Composite dog composite owner first name').click();
      typeInAutocomplete('Gordon{downArrow}{enter}');
      clickAddToArray();

      cy.contains('Submit').click();

      cy.contains(/Yundoo/).then((recordElement: JQuery) => {
        const record = JSON.parse(recordElement.text());

        expect(record.CompositeBowl.size).to.equal('xl');
        expect(record.CompositeOwner.firstName).to.equal('Gordon');
      });
    });
  });

  specify('update form for model with composite key should load the record to update when user passes in keys', () => {
    cy.get('#DataStoreFormUpdateCompositeDogById').within(() => {
      getInputByLabel('Name').should('have.value', 'Yundoo');
      getInputByLabel('Description').should('have.value', 'tiny but mighty');
    });
  });
});
