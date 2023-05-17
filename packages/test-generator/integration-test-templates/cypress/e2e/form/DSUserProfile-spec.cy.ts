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

import { getStorageManagerByLabel, getInputByLabel } from '../../utils/form';

describe.only('FormTests - DSUserProfile', () => {
  const firstFile = 'amplify-logo.jpg';
  const secondFile = 'amplify-logo.svg';

  beforeEach(() => {
    cy.visit('http://localhost:3000/form-tests/DSUserProfile');
  });

  specify('Should be able to add and remove files on storage field', () => {
    cy.get('#CreateUserProfile > form').within(() => {
      getInputByLabel('Name').type('John Doe');
      getInputByLabel('Headline').type('Hello World');

      getStorageManagerByLabel('Image').within(() => {
        cy.get('input[type=file]').selectFile(`cypress/fixtures/${firstFile}`, { action: 'select', force: true });
        // File is found in the selected list
        cy.get('div.amplify-storagemanager__file__list > div.amplify-storagemanager__file').within(() => {
          // Remove file from selected list
          cy.contains(`Remove file ${firstFile}`).click();
        });
        // Removed file should not exist
        cy.get('div.amplify-storagemanager__file__list > div.amplify-storagemanager__file').should('not.exist');
      });
    });
  });

  specify('Should render error when uploading number of files that exceed maxFileCount limit', () => {
    cy.get('#CreateUserProfile > form').within(() => {
      getStorageManagerByLabel('Image').within(() => {
        // `image` field configured with maxFileCount = 1
        cy.get('input[type=file]').selectFile([`cypress/fixtures/${firstFile}`, `cypress/fixtures/${secondFile}`], {
          action: 'select',
          force: true,
        });

        cy.contains(/Cannot choose more than/).should('exist');
      });
    });
  });

  specify('Should be able to select multiple files on supported storage fields', () => {
    cy.get('#CreateUserProfile > form').within(() => {
      getStorageManagerByLabel('Additional images').within(() => {
        // `additionalImages` field configured with maxFileCount = 2
        cy.get('input[type=file]').selectFile([`cypress/fixtures/${firstFile}`, `cypress/fixtures/${secondFile}`], {
          action: 'select',
          force: true,
        });

        cy.contains(/Cannot choose more than/).should('not.exist');
      });
    });
  });

  specify('Should load with existing user profile and be able to unlink existing files from record', () => {
    // Check initial data
    cy.get('#UpdateUserProfile > #data-preview').within(() => {
      cy.get('p')
        .contains('name')
        .contains(/Jane Doe/);
      cy.get('p')
        .contains('headline')
        .contains(/Hello World/);
      cy.get('p')
        .contains('image')
        .contains(/"file1.jpg"/);
      cy.get('p')
        .contains('additionalImages')
        .contains(/["file2.jpg","file3.png"]/);
    });

    cy.get('#UpdateUserProfile > form').within(() => {
      getInputByLabel('Name').should('have.value', 'Jane Doe');
      getInputByLabel('Headline').should('have.value', 'Hello World');

      getStorageManagerByLabel('Image').within(() => {
        // There should be a file associated with the user on load
        cy.get('div.amplify-storagemanager__file__list > div.amplify-storagemanager__file').contains(/file1.jpg/);
      });

      getStorageManagerByLabel('Additional images').within(() => {
        // There should be multiple file associated with the user on load
        cy.get('div.amplify-storagemanager__file__list > div.amplify-storagemanager__file')
          .should('have.length', 2)
          .first()
          .within(() => {
            // remove the first file (file2.jpg)
            cy.contains(/file2.jpg/);
            cy.contains(/Remove file/).click();
          });
      });

      cy.contains(/Submit/).click();
    });

    // Check data send onSubmit
    cy.get('#UpdateUserProfile > #data-preview').within(() => {
      cy.get('p')
        .contains('name')
        .contains(/Jane Doe/);
      cy.get('p')
        .contains('headline')
        .contains(/Hello World/);
      cy.get('p')
        .contains('image')
        .contains(/"file1.jpg"/);
      cy.get('p')
        .contains('additionalImages')
        .contains(/["file3.png"]/);
    });
  });
});
