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
describe('Forms', () => {
  before(() => {
    cy.visit('http://localhost:3000/form-tests');
  });

  const getInputByLabel = (label) => {
    return cy.contains('label', label).parent().find('input');
  };

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
        cy.get('input').eq(2).type('fdfdsfd');
        // does not validate onChange if no error
        cy.contains(ErrorMessageMap.validEmail).should('not.exist');
        // validates on blur
        blurField();
        cy.contains(ErrorMessageMap.validEmail);
        // validates onChange if error
        cy.get('input').eq(2).type('jd@yahoo.com');
        cy.contains(ErrorMessageMap.validEmail).should('not.exist');

        cy.contains('Clear').click();

        // validates on blur & extends with onValidate prop
        cy.get('input').eq(0).type('S');
        blurField();
        cy.get('input').eq(1).type('-1');
        blurField();
        cy.get('input').eq(2).type('spot@gmail.com');
        blurField();
        cy.get('input').eq(3).type('invalid ip');
        blurField();
        cy.contains(ErrorMessageMap.name);
        cy.contains(ErrorMessageMap.age);
        cy.contains(ErrorMessageMap.validEmail).should('not.exist');
        cy.contains(ErrorMessageMap.customValidation);
        cy.contains(ErrorMessageMap.ip);

        // clears and submits
        cy.contains('Clear').click();
        cy.get('input').eq(0).type('Spot');
        blurField();
        cy.get('input').eq(1).type('3');
        blurField();
        cy.get('input').eq(2).type('spot@yahoo.com');
        blurField();
        cy.get('input').eq(3).type('192.0.2.146');
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
        cy.contains('Add item').click();
        getInputByLabel('String array').type('String1');
        cy.contains('Add').click();

        getInputByLabel('Int').type('40');
        getInputByLabel('Float').type('40.2');
        getInputByLabel('Aws date').type('2022-10-12');
        getInputByLabel('Aws time').type('10:12');
        getInputByLabel('Aws date time').type('2022-12-06T00:00');
        getInputByLabel('Aws timestamp').type('2022-12-01T10:30');
        getInputByLabel('Aws email').type('myemail@yahoo.com');
        getInputByLabel('Aws url').type('https://amazon.com');
        getInputByLabel('Aws ip address').type('192.0.2.146');
        cy.get('.amplify-switch-track').click();
        cy.get('textarea').type(JSON.stringify({ myKey: 'myValue' }), { parseSpecialCharSequences: false });
        getInputByLabel('Aws phone').type('714-234-4829');
        cy.get('select').select('San francisco');

        cy.contains('Submit').click();

        cy.contains(/MyString/).then((recordElement) => {
          const record = JSON.parse(recordElement.text());

          expect(record.string).to.equal('MyString');
          expect(record.int).to.equal(40);
          expect(record.float).to.equal(40.2);
          expect(record.awsDate).to.equal('2022-10-12');
          expect(record.awsTime).to.equal('10:12');
          expect(record.awsDateTime).to.equal('2022-12-06T00:00:00.000Z');
          expect(record.awsTimestamp).to.equal(1669919400000);
          expect(record.awsEmail).to.equal('myemail@yahoo.com');
          expect(record.awsUrl).to.equal('https://amazon.com');
          expect(record.awsIPAddress).to.equal('192.0.2.146');
          expect(record.awsJson.myKey).to.equal('myValue');
          expect(record.awsPhone).to.equal('714-234-4829');
          expect(record.enum).to.equal('SAN_FRANCISCO');
          expect(record.stringArray[0]).to.equal('String1');
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
