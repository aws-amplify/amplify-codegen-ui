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

import { getInputByLabel, getArrayFieldButtonByLabel, clickAddToArray } from '../utils/form';

describe('CreateForms', () => {
  before(() => {
    cy.visit('http://localhost:3000/create-form-tests');
  });

  describe('CustomFormCreateDog', () => {
    it('should validate, clear, and submit', () => {
      const ErrorMessageMap = {
        name: 'Name must be longer than 1 character',
        age: 'Age must be greater than 0',
        validEmail: 'The value must be a valid email address',
        customValidation: 'All dog emails are yahoo emails',
        ip: 'The value must be an IPv4 or IPv6 address',
      };
      cy.get('#customFormCreateDog').within(() => {
        const blurField = () => cy.contains('Register your dog').click();

        // should not submit if required field empty
        cy.contains('Submit').click();
        cy.contains('submitted: false');

        // validates email
        getInputByLabel('Email').type('fdfdsfd');
        // does not validate onChange if no error
        cy.contains(ErrorMessageMap.validEmail).should('not.exist');
        // validates on blur
        blurField();
        cy.contains(ErrorMessageMap.validEmail);
        // validates onChange if error
        getInputByLabel('Email').type('jd@yahoo.com');
        cy.contains(ErrorMessageMap.validEmail).should('not.exist');

        cy.contains('Clear').click();

        // validates on blur & extends with onValidate prop
        getInputByLabel('Name').type('S');
        blurField();
        getInputByLabel('Age').type('-1');
        blurField();
        getInputByLabel('Email').type('spot@gmail.com');
        blurField();
        getInputByLabel('IP Address').type('invalid ip');
        blurField();
        cy.contains(ErrorMessageMap.name);
        cy.contains(ErrorMessageMap.age);
        cy.contains(ErrorMessageMap.validEmail).should('not.exist');
        cy.contains(ErrorMessageMap.customValidation);
        cy.contains(ErrorMessageMap.ip);

        // clears and submits
        cy.contains('Clear').click();
        getInputByLabel('Name').type('Spot');
        blurField();
        getInputByLabel('Age').type('3');
        blurField();
        getInputByLabel('Email').type('spot@yahoo.com');
        blurField();
        getInputByLabel('IP Address').type('192.0.2.146');
        blurField();
        cy.contains('Submit').click();
        cy.contains('submitted: true');
        cy.contains('name: Spot');
        cy.contains('age: 3');
        cy.contains('email: spot@yahoo.com');
        cy.contains('ip: 192.0.2.146');
      });
    });
  });

  describe('DataStoreFormCreateAllSupportedFormFields', () => {
    it('should save to DataStore', () => {
      cy.get('#dataStoreFormCreateAllSupportedFormFields').within(() => {
        getInputByLabel('String').type('MyString');

        // String array
        getArrayFieldButtonByLabel('String array').click();
        getInputByLabel('String array').type('String1');
        clickAddToArray();

        getInputByLabel('Int').type('40');
        getInputByLabel('Float').type('40.2');
        getInputByLabel('Aws date').type('2022-10-12');
        getInputByLabel('Aws time').type('10:12');
        getInputByLabel('Aws date time').type('2017-06-01T08:30');
        getInputByLabel('Aws timestamp').type('2017-06-01T08:30');
        getInputByLabel('Aws email').type('myemail@yahoo.com');
        getInputByLabel('Aws url').type('https://amazon.com');
        getInputByLabel('Aws ip address').type('192.0.2.146');
        cy.get('.amplify-switch-track').click();
        cy.get('textarea').type(JSON.stringify({ myKey: 'myValue' }), { parseSpecialCharSequences: false });
        getInputByLabel('Aws phone').type('714-234-4829');
        cy.get('select').select('San francisco');

        // HasOne Autocomplete
        getArrayFieldButtonByLabel('Has one user').click();
        cy.get(`.amplify-autocomplete`).within(() => {
          cy.get('input').type(`John Lennon{downArrow}{enter}`);
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

        cy.contains(/MyString/).then((recordElement: JQuery) => {
          const record = JSON.parse(recordElement.text());

          expect(record.string).to.equal('MyString');
          expect(record.int).to.equal(40);
          expect(record.float).to.equal(40.2);
          expect(record.awsDate).to.equal('2022-10-12');
          expect(record.awsTime).to.equal('10:12');
          expect(record.awsDateTime).to.equal('2017-06-01T08:30:00.000Z');
          expect(record.awsTimestamp).to.equal(1496305800000);
          expect(record.awsEmail).to.equal('myemail@yahoo.com');
          expect(record.awsUrl).to.equal('https://amazon.com');
          expect(record.awsIPAddress).to.equal('192.0.2.146');
          expect(record.awsJson.myKey).to.equal('myValue');
          expect(record.awsPhone).to.equal('714-234-4829');
          expect(record.enum).to.equal('SAN_FRANCISCO');
          expect(record.stringArray[0]).to.equal('String1');
          expect(record.HasOneUser.firstName).to.equal('John');
          expect(record.BelongsToOwner.name).to.equal('John');
          expect(record.ManyToManyTags[0].label).to.equal('Blue');
          expect(record.ManyToManyTags[1].label).to.equal('Green');
          expect(record.ManyToManyTags[2].label).to.equal('Red');
        });
      });
    });
  });

  describe('CustomFormCreateNestedJson', () => {
    it('should have a working ArrayField', () => {
      cy.get('#customFormCreateNestedJson').within(() => {
        cy.contains('Add item').click();
        getInputByLabel('Animals').type('String1');
        cy.contains('Add').click();
        cy.contains('Add item').click();
        getInputByLabel('Animals').type('String2');
        cy.contains('String1').should('exist');
      });
    });
  });
});
