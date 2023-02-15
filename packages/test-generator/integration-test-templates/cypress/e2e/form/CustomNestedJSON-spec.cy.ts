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

import { getInputByLabel } from '../../utils/form';

describe('FormTests - CustomNestedJSON', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/form-tests/CustomNestedJSON');
  });

  specify('create form should have a working ArrayField', () => {
    cy.get('#CustomFormCreateNestedJson').within(() => {
      cy.contains('Add item').click();
      getInputByLabel('Animals').type('String1');
      cy.contains('Add').click();
      cy.contains('Add item').click();
      getInputByLabel('Animals').type('String2');
      cy.contains('String1').should('exist');
    });
  });
});