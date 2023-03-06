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

import { getInputByLabel, typeInAutocomplete } from '../../utils/form';

describe('FormTests - CustomDog', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/form-tests/CustomDog');
  });

  specify('create form should validate, clear, and submit', () => {
    const ErrorMessageMap = {
      name: 'Name must be longer than 1 character',
      age: 'Age must be greater than 0',
      validEmail: 'The value must be a valid email address',
      customValidation: 'All dog emails are yahoo emails',
      ip: 'The value must be an IPv4 or IPv6 address',
    };
    cy.get('#CustomFormCreateDog').within(() => {
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

      getInputByLabel('Color').type('Blue');

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
      cy.contains('color: Red');
      getInputByLabel('Name').type('Spot');
      blurField();
      getInputByLabel('Age').type('3');
      blurField();
      getInputByLabel('Email').type('spot@yahoo.com');
      blurField();
      getInputByLabel('IP Address').type('192.0.2.146');
      blurField();
      typeInAutocomplete('Ret{downArrow}{enter}');
      cy.contains('Submit').click();
      cy.contains('submitted: true');
      cy.contains('name: Spot');
      cy.contains('age: 3');
      cy.contains('email: spot@yahoo.com');
      cy.contains('ip: 192.0.2.146');
      cy.contains('Retriever');
    });
  });
});
