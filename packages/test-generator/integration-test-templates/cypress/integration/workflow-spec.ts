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
describe('Workflow', () => {
  before(() => {
    cy.visit('http://localhost:3000/workflow-tests');
  });

  const defaultText = '✅';

  describe('Synthetic Events', () => {
    it('click', () => {
      cy.get('#clicked').should('not.have.text', defaultText);
      cy.get('#click').click();
      cy.get('#clicked').should('have.text', defaultText);
    });

    it('doubleclick', () => {
      cy.get('#doubleclicked').should('not.have.text', defaultText);
      cy.get('#doubleclick').dblclick();
      cy.get('#doubleclicked').should('have.text', defaultText);
    });

    it('mousedown', () => {
      cy.get('#mouseddown').should('not.have.text', defaultText);
      cy.get('#mousedown').trigger('mousedown');
      cy.get('#mouseddown').should('have.text', defaultText);
    });

    it('mouseenter', () => {
      cy.get('#mouseentered').should('not.have.text', defaultText);
      cy.get('#mouseenter').click(); // Implicit mouseenter, trigger doesn't seem to work in cypress here
      cy.get('#mouseentered').should('have.text', defaultText);
    });

    it('mouseleave', () => {
      cy.get('#mouseleft').should('not.have.text', defaultText);
      cy.get('#mouseleave').click();
      cy.get('#mouseenter').click(); // Implicit mouseleave, trigger doesn't seem to work in cypress here
      cy.get('#mouseleft').should('have.text', defaultText);
    });

    it('mousemove', () => {
      cy.get('#mousemoved').should('not.have.text', defaultText);
      cy.get('#mousemove').trigger('mousemove');
      cy.get('#mousemoved').should('have.text', defaultText);
    });

    it('mouseout', () => {
      cy.get('#mousedout').should('not.have.text', defaultText);
      cy.get('#mouseout').trigger('mouseout');
      cy.get('#mousedout').should('have.text', defaultText);
    });

    it('mouseover', () => {
      cy.get('#mousedover').should('not.have.text', defaultText);
      cy.get('#mouseover').trigger('mouseover');
      cy.get('#mousedover').should('have.text', defaultText);
    });

    it('mouseup', () => {
      cy.get('#mousedup').should('not.have.text', defaultText);
      cy.get('#mouseup').trigger('mouseup');
      cy.get('#mousedup').should('have.text', defaultText);
    });

    it('change', () => {
      cy.get('#changed').should('not.have.text', defaultText);
      cy.get('#change').clear().type(defaultText);
      cy.get('#changed').should('have.text', defaultText);
    });

    it('input', () => {
      cy.get('#inputted').should('not.have.text', defaultText);
      cy.get('#input').clear().type(defaultText);
      cy.get('#inputted').should('have.text', defaultText);
    });

    it('focus', () => {
      cy.get('#focused').should('not.have.text', defaultText);
      cy.get('#focus').click();
      cy.get('#focused').should('have.text', defaultText);
    });

    it('blur', () => {
      cy.get('#blurred').should('not.have.text', defaultText);
      cy.get('#blur').click();
      cy.get('#blurred').should('not.have.text', defaultText);
      cy.get('#focus').click();
      cy.get('#blurred').should('have.text', defaultText);
    });

    it('keydown', () => {
      cy.get('#keyeddown').should('not.have.text', defaultText);
      cy.get('#keydown').type(defaultText);
      cy.get('#keyeddown').should('have.text', defaultText);
    });

    it('keypress', () => {
      cy.get('#keypressed').should('not.have.text', defaultText);
      cy.get('#keypress').type(defaultText);
      cy.get('#keypressed').should('have.text', defaultText);
    });

    it('keyup', () => {
      cy.get('#keyedup').should('not.have.text', defaultText);
      cy.get('#keyup').type(defaultText);
      cy.get('#keyedup').should('have.text', defaultText);
    });
  });
});
