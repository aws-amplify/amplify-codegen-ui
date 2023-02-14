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
  getTextAreaByLabel,
  clickAddToArray,
  removeArrayItem,
  typeInAutocomplete,
} from '../../utils/form';

describe('FormTests - DSAllSupportedFormFields', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/form-tests/DSAllSupportedFormFields');
  });

  specify('create form should save to DataStore with blank values in non-required fields', () => {
    cy.get('#DataStoreFormCreateAllSupportedFormFields').within(() => {
      getInputByLabel('String').type('Create1String');

      cy.contains('Submit').click();

      cy.contains(/Create1String/).then((recordElement: JQuery) => {
        const record = JSON.parse(recordElement.text());

        expect(record.string).to.equal('Create1String');
      });
    });
  });

  specify('create form should save to DataStore', () => {
    cy.get('#DataStoreFormCreateAllSupportedFormFields').within(() => {
      getInputByLabel('String').type('Create1String');

      // String array
      getArrayFieldButtonByLabel('String array').click();
      getInputByLabel('String array').type('String1');
      clickAddToArray();

      getInputByLabel('Int').type('40');
      getInputByLabel('Float').type('40.2');
      getInputByLabel('Aws date').type('2022-10-12');
      getInputByLabel('Aws time').type('10:12');
      getInputByLabel('Aws date time').type('2017-06-01T08:30');
      getInputByLabel('Aws timestamp').type('1669854600000');

      getInputByLabel('Aws email').type('myemail@yahoo.com');
      getInputByLabel('Aws url').type('https://amazon.com');
      getInputByLabel('Aws ip address').type('192.0.2.146');
      cy.get('.amplify-switch-track').click();
      getTextAreaByLabel('Aws json').type(JSON.stringify({ myKey: 'myValue' }), { parseSpecialCharSequences: false });
      getTextAreaByLabel('Non model field').type(JSON.stringify({ StringVal: 'myValue' }), {
        parseSpecialCharSequences: false,
      });

      getArrayFieldButtonByLabel('Non model field array').click();
      getTextAreaByLabel('Non model field array').type(JSON.stringify({ StringVal: 'index1StringValue' }), {
        parseSpecialCharSequences: false,
      });
      clickAddToArray();

      getInputByLabel('Aws phone').type('714-234-4829');
      cy.get('select').select('San francisco');

      // HasOne Autocomplete
      getArrayFieldButtonByLabel('Has one user').click();
      cy.get(`.amplify-autocomplete`).within(() => {
        cy.get('input').type(`John Lennon{downArrow}{enter}`);
      });
      clickAddToArray();

      // HasMany Autocomplete
      getArrayFieldButtonByLabel('Has many students').click();
      cy.get(`.amplify-autocomplete`).within(() => {
        cy.get('input').type(`{downArrow}{enter}`);
      });
      clickAddToArray();

      getArrayFieldButtonByLabel('Has many students').click();
      cy.get(`.amplify-autocomplete`).within(() => {
        cy.get('input').type(`Sa{downArrow}{enter}`);
      });
      clickAddToArray();

      // BelongsTo Autocomplete
      getArrayFieldButtonByLabel('Belongs to owner').click();
      cy.get(`.amplify-autocomplete`).within(() => {
        cy.get('input').type(`John{downArrow}{enter}`);
      });
      clickAddToArray();

      // ManyToMany Autocomplete
      getArrayFieldButtonByLabel('Many to many tags').click();
      cy.get(`.amplify-autocomplete`).within(() => {
        cy.get('input').type(`Red{downArrow}{enter}`);
      });
      clickAddToArray();
      getArrayFieldButtonByLabel('Many to many tags').click();
      cy.get(`.amplify-autocomplete`).within(() => {
        cy.get('input').type(`B{downArrow}{enter}`);
      });
      clickAddToArray();
      getArrayFieldButtonByLabel('Many to many tags').click();
      cy.get(`.amplify-autocomplete`).within(() => {
        cy.get('input').type(`Gr{downArrow}{enter}`);
      });
      clickAddToArray();

      cy.contains('Submit').click();

      cy.contains(/Create1String/).then((recordElement: JQuery) => {
        const record = JSON.parse(recordElement.text());

        expect(record.string).to.equal('Create1String');
        expect(record.int).to.equal(40);
        expect(record.float).to.equal(40.2);
        expect(record.awsDate).to.equal('2022-10-12');
        expect(record.awsTime).to.equal('10:12');
        expect(record.awsDateTime).to.equal('2017-06-01T08:30:00.000Z');
        expect(record.awsTimestamp).to.equal(1669854600000);
        expect(record.awsEmail).to.equal('myemail@yahoo.com');
        expect(record.awsUrl).to.equal('https://amazon.com');
        expect(record.awsIPAddress).to.equal('192.0.2.146');
        expect(record.awsJson.myKey).to.equal('myValue');
        expect(record.nonModelField.StringVal).to.equal('myValue');
        expect(record.nonModelFieldArray[0].StringVal).to.equal('index1StringValue');
        expect(record.awsPhone).to.equal('714-234-4829');
        expect(record.enum).to.equal('SAN_FRANCISCO');
        expect(record.stringArray[0]).to.equal('String1');
        expect(record.HasOneUser.firstName).to.equal('John');
        expect(record.HasManyStudents.length).to.equal(2);
        expect(record.HasManyStudents?.[0].name).to.equal('David');
        expect(record.HasManyStudents?.[0].allSupportedFormFieldsID).to.equal(record.id);
        expect(record.HasManyStudents?.[1].name).to.equal('Sarah');
        expect(record.HasManyStudents?.[1].allSupportedFormFieldsID).to.equal(record.id);
        expect(record.BelongsToOwner.name).to.equal('John');
        expect(record.ManyToManyTags[0].label).to.equal('Blue');
        expect(record.ManyToManyTags[1].label).to.equal('Green');
        expect(record.ManyToManyTags[2].label).to.equal('Red');
      });
    });
  });

  specify('update form should display current values and save to DataStore', () => {
    cy.get('#DataStoreFormUpdateAllSupportedFormFields').within(() => {
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

      // HasMany
      removeArrayItem('Jessica');

      getArrayFieldButtonByLabel('Has many students').click();
      typeInAutocomplete(`Ma{downArrow}{enter}`);
      clickAddToArray();

      getArrayFieldButtonByLabel('Has many students').click();
      typeInAutocomplete(`Sar{downArrow}{enter}`);
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

      cy.contains('Submit').click();

      cy.contains(/Update1String/).then((recordElement: JQuery) => {
        const record = JSON.parse(recordElement.text());

        expect(record.HasOneUser.firstName).to.equal('Paul');
        expect(record.ManyToManyTags[0].label).to.equal('Green');
        expect(record.ManyToManyTags[1].label).to.equal('Orange');
        expect(record.BelongsToOwner.name).to.equal('George');
        expect(record.HasManyStudents.length).to.equal(3);
        expect(record.HasManyStudents[0].name).to.equal('David');
        expect(record.HasManyStudents[0].allSupportedFormFieldsID).to.equal(record.id);
        expect(record.HasManyStudents[1].name).to.equal('Sarah');
        expect(record.HasManyStudents[1].allSupportedFormFieldsID).to.equal(record.id);
        expect(record.HasManyStudents[2].name).to.equal('Matthew');
        expect(record.HasManyStudents[2].allSupportedFormFieldsID).to.equal(record.id);
      });
    });
  });

  specify('update form should remove hasOne and belongsTo relationships', () => {
    cy.get('#DataStoreFormUpdateAllSupportedFormFields').within(() => {
      // hasOne
      removeArrayItem('John Lennon');

      // belongsTo
      removeArrayItem('John');

      cy.contains('Submit').click();

      cy.contains(/Update1String/).then((recordElement: JQuery) => {
        const record = JSON.parse(recordElement.text());

        expect('HasOneUser' in record).to.equal(false);
        expect('BelongsToOwner' in record).to.equal(false);
      });
    });
  });

  specify('update form should show existing values, update them and save to DataStore', () => {
    cy.get('#DataStoreFormUpdateAllSupportedFormFields').within(() => {
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(3000);

      const stringField = getInputByLabel('String');
      stringField.should('have.value', 'Update1String');
      stringField.type('X');
      stringField.should('have.value', 'Update1StringX');

      cy.contains('String1').should('exist');
      getArrayFieldButtonByLabel('String array').click();
      getInputByLabel('String array').type('String2');
      clickAddToArray();
      cy.contains('String2').should('exist');

      const intField = getInputByLabel('Int');
      intField.should('have.value', 10);
      intField.type('123');
      intField.should('have.value', 10123);

      const floatField = getInputByLabel('Float');
      floatField.should('have.value', 4.3);
      floatField.type('456');
      floatField.should('have.value', 4.3456);

      const awsDateField = getInputByLabel('Aws date');
      awsDateField.should('have.value', '2022-11-22');
      awsDateField.type('2023-02-13');
      awsDateField.should('have.value', '2023-02-13');

      const awsTimeField = getInputByLabel('Aws time');
      awsTimeField.should('have.value', '10:20:30.111');
      awsTimeField.type('12:34:56.789');
      awsTimeField.should('have.value', '12:34:56.789');

      const awsDateTimeField = getInputByLabel('Aws date time');
      awsDateTimeField.should('have.value', '2022-11-22T10:20');
      awsDateTimeField.type('2023-01-13T11:11');
      awsDateTimeField.should('have.value', '2023-01-13T11:11');

      const awsTimestampField = getInputByLabel('Aws timestamp');
      awsTimestampField.should('have.value', 100000000);
      awsTimestampField.type('1');
      awsTimestampField.should('have.value', 1000000001);

      const awsEmailField = getInputByLabel('Aws email');
      awsEmailField.should('have.value', 'myemail@amazon.com');
      awsEmailField.type('{backspace}{backspace}{backspace}org');
      awsEmailField.should('have.value', 'myemail@amazon.org');

      const awsUrlField = getInputByLabel('Aws url');
      awsUrlField.should('have.value', 'https://www.amazon.com');
      awsUrlField.type('{selectall}{backspace}https://www.google.com');
      awsUrlField.should('have.value', 'https://www.google.com');

      const awsIPAddressField = getInputByLabel('Aws ip address');
      awsIPAddressField.should('have.value', '123.12.34.56');
      awsIPAddressField.type('{backspace}{backspace}78');
      awsIPAddressField.should('have.value', '123.12.34.78');

      // Boolean
      cy.contains('Boolean').children('[data-checked="true"]').should('exist');
      cy.contains('Boolean').click();
      cy.contains('Boolean').children('[data-checked="false"]').should('exist');

      const awsJsonField = getTextAreaByLabel('Aws json');
      awsJsonField.should('have.value', JSON.stringify({ myKey: 'myValue' }));
      awsJsonField.type('{backspace},"secondKey":"secondValue"}');
      awsJsonField.should('have.value', JSON.stringify({ myKey: 'myValue', secondKey: 'secondValue' }));

      const awsPhoneField = getInputByLabel('Aws phone');
      awsPhoneField.should('have.value', '713 343 5938');
      awsPhoneField.type('{backspace}{backspace}{backspace}{backspace}5678');
      awsPhoneField.should('have.value', '713 343 5678');

      // Enum
      cy.get('select').should('have.value', 'NEW_YORK');
      cy.get('select').select('Austin');
      cy.get('select').should('have.value', 'AUSTIN');

      const nonModelField = getTextAreaByLabel('Non model field');
      nonModelField.should('have.value', JSON.stringify({ StringVal: 'myValue' }));
      nonModelField.type('{backspace},"secondKey":"secondValue"}');
      nonModelField.should('have.value', JSON.stringify({ StringVal: 'myValue', secondKey: 'secondValue' }));

      getArrayFieldButtonByLabel('Non model field array').click();
      getTextAreaByLabel('Non model field array').type(JSON.stringify({ StringVal: 'index1StringValue' }), {
        parseSpecialCharSequences: false,
      });
      clickAddToArray();

      cy.contains('Submit').click();

      cy.contains(/Update1String/).then((recordElement: JQuery) => {
        const record = JSON.parse(recordElement.text());

        expect(record.string).to.equal('Update1StringX');
        expect(record.stringArray).to.deep.equal(['String1', 'String2']);
        expect(record.int).to.equal(10123);
        expect(record.float).to.equal(4.3456);
        expect(record.awsDate).to.equal('2023-02-13');
        expect(record.awsTime).to.equal('12:34:56.789');
        expect(record.awsDateTime).to.equal('2023-01-13T11:11:00.000Z');
        expect(record.awsTimestamp).to.equal(1000000001);
        expect(record.awsEmail).to.equal('myemail@amazon.org');
        expect(record.awsUrl).to.equal('https://www.google.com');
        expect(record.awsIPAddress).to.equal('123.12.34.78');
        expect(record.boolean).to.equal(false);
        expect(record.awsJson).to.deep.equal({ myKey: 'myValue', secondKey: 'secondValue' });
        expect(record.awsPhone).to.equal('713 343 5678');
        expect(record.enum).to.equal('AUSTIN');
        expect(record.nonModelField).to.deep.equal({ StringVal: 'myValue', secondKey: 'secondValue' });
        expect(record.nonModelFieldArray[0].StringVal).to.equal('index1StringValue');
      });
    });
  });
});
