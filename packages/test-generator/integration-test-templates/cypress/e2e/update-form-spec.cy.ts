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
  clickAddToArray,
  removeArrayItem,
  typeInAutocomplete,
} from '../utils/form';

describe('UpdateForms', () => {
  beforeEach(() => {
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
        typeInAutocomplete(`Paul McCartney{downArrow}{enter}`);
        clickAddToArray();

        // Belongs to update
        removeArrayItem('John');
        getArrayFieldButtonByLabel('Belongs to owner').click();
        typeInAutocomplete(`George{downArrow}{enter}`);
        clickAddToArray();

        // Many to many update
        removeArrayItem('Red');
        removeArrayItem('Blue');

        getArrayFieldButtonByLabel('Many to many tags').click();
        typeInAutocomplete(`Or{downArrow}{enter}`);
        clickAddToArray();

        getArrayFieldButtonByLabel('Many to many tags').click();
        typeInAutocomplete(`Gr{downArrow}{enter}`);
        clickAddToArray();

        // Has many update
        removeArrayItem('David');
        removeArrayItem('Jessica');

        getArrayFieldButtonByLabel('Has many students').click();
        typeInAutocomplete(`{downArrow}{enter}`);
        clickAddToArray();

        getArrayFieldButtonByLabel('Has many students').click();
        typeInAutocomplete(`Sar{downArrow}{enter}`);
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

    it('should remove hasOne and belongsTo relationships', () => {
      // reset state
      cy.reload();

      cy.get('#dataStoreFormUpdateAllSupportedFormFields').within(() => {
        // hasOne
        removeArrayItem('John Lennon');

        // belongsTo
        removeArrayItem('John');

        cy.contains('Submit').click();

        cy.contains(/My string/).then((recordElement: JQuery) => {
          const record = JSON.parse(recordElement.text());

          expect('HasOneUser' in record).to.equal(false);
          expect('BelongsToOwner' in record).to.equal(false);
        });
      });
    });
  });

  // this model & related models all use CPK
  describe('DataStoreFormUpdateCPKTeacher', () => {
    it('should display current values and save to DataStore', () => {
      cy.get('#dataStoreFormUpdateCPKTeacher').within(() => {
        // hasOne
        removeArrayItem('Harry');
        getArrayFieldButtonByLabel('Cpk student').click();
        typeInAutocomplete('Her{downArrow}{enter}');
        clickAddToArray();

        // manyToMany
        removeArrayItem('Math');
        getArrayFieldButtonByLabel('Cpk classes').click();
        typeInAutocomplete('English{downArrow}{enter}');
        clickAddToArray();

        // hasMany
        removeArrayItem('Figure 8');
        getArrayFieldButtonByLabel('Cpk projects').click();
        typeInAutocomplete('Either{downArrow}{enter}');
        clickAddToArray();

        cy.contains('Submit').click();

        cy.contains(/mySpecialTeacherId/).then((recordElement: JQuery) => {
          const record = JSON.parse(recordElement.text());

          expect(record.cPKTeacherCPKStudentSpecialStudentId).to.equal('Hermione');
          expect(record.CPKStudent.specialStudentId).to.equal('Hermione');
          expect(record.CPKClasses.length).to.equal(1);
          expect(record.CPKClasses[0].specialClassId).to.equal('English');
          expect(record.CPKProjects.length).to.equal(1);
          expect(record.CPKProjects[0].specialProjectId).to.equal('Either/Or');
        });
      });
    });
  });

  // this model & related models all use composite keys
  describe('DataStoreFormUpdateCompositeDog', () => {
    it('should display current values and save to DataStore', () => {
      cy.get('#dataStoreFormUpdateCompositeDog').within(() => {
        // composite keys should be readonly
        getInputByLabel('Name').should('have.attr', 'readonly');
        getInputByLabel('Description').should('have.attr', 'readonly');

        // hasOne
        removeArrayItem('round - xs');
        getArrayFieldButtonByLabel('Composite bowl').click();
        typeInAutocomplete('round - xl{downArrow}{enter}');
        clickAddToArray();

        // belongsTo
        removeArrayItem('Cooper - Dale');
        getArrayFieldButtonByLabel('Composite owner').click();
        typeInAutocomplete('Cooper - Gordon{downArrow}{enter}');
        clickAddToArray();

        // manyToMany
        removeArrayItem('chew - green');
        getArrayFieldButtonByLabel('Composite toys').click();
        typeInAutocomplete('chew - red{downArrow}{enter}');
        clickAddToArray();

        // hasMany
        removeArrayItem('Dentistry - Seattle');
        getArrayFieldButtonByLabel('Composite vets').click();
        typeInAutocomplete('Dentistry - Los Angeles{downArrow}{enter}');
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
    });
  });
});
