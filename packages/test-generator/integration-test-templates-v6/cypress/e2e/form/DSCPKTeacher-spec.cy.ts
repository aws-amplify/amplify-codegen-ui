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

describe('FormTests - DSCPKTeacher', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/form-tests/DSCPKTeacher');
  });

  specify(
    'create form for model with CPK and relationships to other models with CPK should create relationships',
    () => {
      cy.get('#DataStoreFormCreateCPKTeacher').within(() => {
        getInputByLabel('Special teacher id').type('Create1ID');

        // check error message shows on closed ArrayField
        cy.contains('Submit').click();
        cy.contains('CPKStudent is required');

        // hasOne
        getArrayFieldButtonByLabel('Cpk student').click();
        typeInAutocomplete('Her{downArrow}{enter}');
        clickAddToArray();

        // manyToMany
        getArrayFieldButtonByLabel('Cpk classes').click();
        typeInAutocomplete('English{downArrow}{enter}');
        clickAddToArray();

        // hasMany
        getArrayFieldButtonByLabel('Cpk projects').click();
        typeInAutocomplete('Either{downArrow}{enter}');
        clickAddToArray();

        cy.contains('Submit').click();

        cy.contains(/Create1ID/).then((recordElement: JQuery) => {
          const record = JSON.parse(recordElement.text());

          expect(record.cPKTeacherCPKStudentSpecialStudentId).to.equal('Hermione');
          expect(record.CPKStudent.specialStudentId).to.equal('Hermione');
          expect(record.CPKClasses.length).to.equal(1);
          expect(record.CPKClasses[0].specialClassId).to.equal('English');
          expect(record.CPKProjects.length).to.equal(1);
          expect(record.CPKProjects[0].specialProjectId).to.equal('Either/Or');
        });
      });
    },
  );

  specify(
    'update form for model with CPK and relationships ' +
      'to other models with CPK should display current values and update relationships',
    () => {
      cy.get('#DataStoreFormUpdateCPKTeacher').within(() => {
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

        cy.contains(/Update1ID/).then((recordElement: JQuery) => {
          const record = JSON.parse(recordElement.text());

          expect(record.cPKTeacherCPKStudentSpecialStudentId).to.equal('Hermione');
          expect(record.CPKStudent.specialStudentId).to.equal('Hermione');
          expect(record.CPKClasses.length).to.equal(1);
          expect(record.CPKClasses[0].specialClassId).to.equal('English');
          expect(record.CPKProjects.length).to.equal(1);
          expect(record.CPKProjects[0].specialProjectId).to.equal('Either/Or');
        });
      });
    },
  );
});
