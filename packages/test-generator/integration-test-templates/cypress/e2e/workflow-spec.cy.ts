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
const TEST_ROUTE = 'http://localhost:3000/workflow-tests';

describe('Workflow', () => {
  beforeEach(() => {
    cy.url().then((url) => {
      if (url !== TEST_ROUTE) {
        cy.visit(TEST_ROUTE);
      }
    });
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

  describe('Actions', () => {
    describe('Navigation', () => {
      it('supports hard navigation events', () => {
        cy.visit(TEST_ROUTE);
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(3000);
        cy.url().should('include', '/workflow-tests');
        cy.get('#hard-navigate').click();
        cy.url().should('eq', 'https://www.amazon.com/');
        // This shouldn't be necessary given the `before` code, but that's not taking us back as expected
        cy.visit(TEST_ROUTE);
      });

      it('supports anchor navigation events', () => {
        cy.url().should('include', '/workflow-tests');
        cy.get('#anchor-navigate').click();
        cy.url().should('include', '/workflow-tests#about');
      });

      it('supports reload navigation events', () => {
        cy.get('#i-disappear').click();
        cy.get('#navigation').contains('I Disappear').should('not.exist');
        cy.get('#reload-page').click();
        cy.get('#navigation').contains('I Disappear');
      });
    });

    describe('Auth', () => {
      it('supports local sign out', () => {
        cy.get('#auth-state').contains('LoggedOutLocally').should('not.exist');
        cy.get('#sign-out-local').click();
        cy.get('#auth-state').contains('LoggedOutLocally');
      });

      it('supports global sign out', () => {
        cy.get('#auth-state').contains('LoggedOutGlobally').should('not.exist');
        cy.get('#sign-out-global').click();
        cy.get('#auth-state').contains('LoggedOutGlobally');
      });
    });

    describe('DataStore', () => {
      it('supports creating a datastore item, type-casting scalar values', () => {
        const expected = 'Din Djarin | age: 200 | isLoggedIn: true';
        cy.get('#user-collection').contains(expected).should('not.exist');
        cy.get('#create-item').click();
        cy.get('#user-collection').contains(expected);
      });

      it('supports updating a datastore item, type-casting scalar values', () => {
        const before = 'UpdateMe Me';
        const after = 'Moff Gideon | age: 200 | isLoggedIn: true';
        cy.get('#user-collection').contains(before);
        cy.get('#user-collection').contains(after).should('not.exist');
        cy.get('#update-item').click();
        cy.get('#user-collection').contains(before).should('not.exist');
        cy.get('#user-collection').contains(after);
      });

      it('supports deleting a datastore item', () => {
        cy.get('#user-collection').contains('DeleteMe Me');
        cy.get('#delete-item').click();
        cy.get('#user-collection').contains('DeleteMe Me').should('not.exist');
      });
    });

    describe('State & Mutations', () => {
      it('supports internal mutations', () => {
        cy.get('#color-changing-box').should('have.css', 'background-color', 'rgb(255, 0, 0)');
        cy.get('#update-box-color').click();
        cy.get('#color-changing-box').should('have.css', 'background-color', 'rgb(0, 0, 255)');
      });

      it('supports controlled components for a form', () => {
        cy.get('#user-collection').contains('vizsla123').should('not.exist');
        cy.get('#username-entry').type('123');
        cy.get('#submit-user-form').click();
        cy.get('#user-collection').contains('vizsla123');
      });

      it('supports synthetic props', () => {
        cy.get('#FooBarValue').contains('Baz');
        cy.get('#FooButton').click();
        cy.get('#FooBarValue').contains('Foo');
      });

      it('supports two components pointing to the same prop', () => {
        cy.get('#WithInitialTextDisplay').should('be.visible');
        cy.get('#WithInitialDisplayNoneButton').click();
        cy.get('#WithInitialTextDisplay').should('not.be.visible');
        cy.get('#WithInitialDisplayBlockButton').click();
        cy.get('#WithInitialTextDisplay').should('be.visible');
      });

      it('supports mutations without an initial value', () => {
        cy.get('#NoInitialTextDisplay').should('be.visible');
        cy.get('#NoInitialDisplayNoneButton').click();
        cy.get('#NoInitialTextDisplay').should('not.be.visible');
        cy.get('#NoInitialDisplayBlockButton').click();
        cy.get('#NoInitialTextDisplay').should('be.visible');
      });

      it('supports mutations on controlled components', () => {
        cy.get('#input-mutation-on-click').within(() => {
          cy.get('input').should('have.attr', 'value', '');
          cy.get('button').click();
          cy.get('input').should('have.attr', 'value', 'Razor Crest');
          cy.get('input').type(' blew up');
          cy.get('input').should('have.attr', 'value', 'Razor Crest blew up');
          cy.get('button').click();
          cy.get('input').should('have.attr', 'value', 'Razor Crest');
        });
      });

      it('supports conditional in mutation', () => {
        cy.get('#conditional-in-mutation').within(() => {
          cy.get('.amplify-text').should('have.text', 'Default Value');
          cy.get('button').click();
          cy.get('.amplify-text').should('have.text', 'Conditional Value');
        });
      });
    });

    describe('complex models', () => {
      it('can create models with nested objects and lists', () => {
        cy.get('#complex-model').within(() => {
          cy.get('button').click();
          cy.contains('"listElement":["a","b","c","1","2","3"]');
          cy.contains('"myCustomField":{"StringVal":"hi there","NumVal":7,"BoolVal":false}');
        });
      });
    });
  });
});
