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

import { getArrayFieldButtonByLabel, clickAddToArray, typeInAutocomplete } from '../../utils/form';

describe('FormTests - DSAllSupportedFormFieldsScalar', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/form-tests/DSAllSupportedFormFieldsScalar');
  });

  specify('scalar relationship labels should be hyphenated like model fields', () => {
    cy.get('#DataStoreFormCreateAllSupportedFormFieldsScalar').within(() => {
      // cypress does not populate value in ci w/out wait
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(3000);
      getArrayFieldButtonByLabel('All supported form fields has one user id').click();
      typeInAutocomplete(`P{downArrow}{enter}`);
      clickAddToArray();
      cy.contains('Paul - ').should('exist');

      getArrayFieldButtonByLabel('All supported form fields belongs to owner id').click();
      typeInAutocomplete(`J{downArrow}{enter}`);
      clickAddToArray();
      cy.contains('John - ').should('exist');
    });
  });
});
