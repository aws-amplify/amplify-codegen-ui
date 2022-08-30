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

  it('CustomFormCreateDog', () => {
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
      cy.contains(ErrorMessageMap.validEmail);
      cy.contains('Clear').click();

      // validates on change & extends with onValidate prop
      cy.get('input').eq(0).type('S');
      blurField();
      cy.get('input').eq(1).type('-1');
      blurField();
      cy.get('input').eq(2).type('spot@gmail.com');
      blurField();
      cy.get('input').eq(3).type('invalid ip');
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
