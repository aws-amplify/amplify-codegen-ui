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
      name: 'Name is required',
      age: 'Age must be greater than 0',
      validEmail: 'The value must be a valid email address',
      customValidation: 'All dog emails are yahoo emails',
    };
    cy.get('#customFormCreateDog').within(() => {
      const blurField = () => cy.contains('Register your dog').click();

      // should validate on submit
      cy.contains('Submit').click();
      cy.contains(ErrorMessageMap.name);
      cy.contains(ErrorMessageMap.age);
      cy.contains(ErrorMessageMap.validEmail);

      // validates on change & extends with onValidate prop
      cy.get('input').eq(0).type('Spot');
      blurField();
      cy.get('input').eq(1).type('3');
      blurField();
      cy.get('input').eq(2).type('spot@gmail.com');
      blurField();
      cy.contains(ErrorMessageMap.name).should('not.exist');
      cy.contains(ErrorMessageMap.age).should('not.exist');
      cy.contains(ErrorMessageMap.validEmail).should('not.exist');
      cy.contains(ErrorMessageMap.customValidation);

      // clears and submits
      cy.contains('Clear').click();
      cy.get('input').eq(0).type('Spot');
      blurField();
      cy.get('input').eq(1).type('3');
      blurField();
      cy.get('input').eq(2).type('spot@yahoo.com');
      blurField();
      cy.contains('Submit').click();
      cy.contains('name: Spot');
      cy.contains('age: 3');
      cy.contains('email: spot@yahoo.com');
    });
  });
});
