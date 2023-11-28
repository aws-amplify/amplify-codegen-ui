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

import { getArrayFieldButtonByLabel, typeInAutocomplete, clickAddToArray } from '../../utils/form';

describe('FormTests - DSCompositeToy', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/form-tests/DSCompositeToy');
  });

  specify('update form for child of 1:m relationship should update the secondary indices linking it to parent', () => {
    cy.get('#DataStoreFormUpdateCompositeToy').within(() => {
      // cypress does not populate value in ci w/out wait
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(3000);
      getArrayFieldButtonByLabel('Composite dog composite toys name').click();
      typeInAutocomplete('Yundoo{downArrow}{enter}');
      clickAddToArray();

      getArrayFieldButtonByLabel('Composite dog composite toys description').click();
      typeInAutocomplete('tiny but mighty{downArrow}{enter}');
      clickAddToArray();

      cy.contains('Submit').click();

      cy.contains(/chew/).then((recordElement: JQuery) => {
        const record = JSON.parse(recordElement.text());

        expect(record.compositeDogCompositeToysName).to.equal('Yundoo');
        expect(record.compositeDogCompositeToysDescription).to.equal('tiny but mighty');
      });
    });
  });
});
