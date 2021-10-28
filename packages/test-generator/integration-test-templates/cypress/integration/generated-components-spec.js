describe('Generated Components', () => {
  describe('Sanity Test', () => {
    it('Successfully opens the app', () => {
      cy.visit('http://localhost:3000/');
    });
  });

  describe('Basic Components', () => {
    it('Renders Badge component', () => {
      cy.visit('http://localhost:3000/component-tests');
      cy.get('#basic-components').contains('Basic Component Badge');
    });

    it('Renders View component', () => {
      cy.visit('http://localhost:3000/component-tests');
      cy.get('#basic-components').contains('Basic Component View');
    });

    it('Renders Button component', () => {
      cy.visit('http://localhost:3000/component-tests');
      cy.get('#basic-components').contains('Basic Component Button');
    });

    it('Renders Card component', () => {
      cy.visit('http://localhost:3000/component-tests');
      cy.get('#basic-components').contains('Basic Component Card');
    });

    it('Renders Collection component', () => {
      cy.visit('http://localhost:3000/component-tests');
      cy.get('#basic-components').find('p:contains("Basic Collection Card Text")').should('have.length', 2);
    });

    it('Renders Divider component', () => {
      cy.visit('http://localhost:3000/component-tests');
      cy.get('#basic-components').find('.amplify-divider');
    });

    it('Renders Flex component', () => {
      cy.visit('http://localhost:3000/component-tests');
      cy.get('#basic-components').find('.amplify-flex').contains('Basic Component Flex');
    });

    it('Renders Image component', () => {
      cy.visit('http://localhost:3000/component-tests');
      cy.get('#basic-components').find('img');
    });

    it('Renders Text component', () => {
      cy.visit('http://localhost:3000/component-tests');
      cy.get('#basic-components').contains('Basic Component Text');
    });

    it('Renders Custom component', () => {
      cy.visit('http://localhost:3000/component-tests');
      cy.get('#basic-components').find('.amplify-rating');
    });
  });

  describe('Generated Components', () => {
    describe('Concatenated Data', () => {
      it('Renders Button text as a concatenated, bound element', () => {
        cy.visit('http://localhost:3000/component-tests');
        cy.get('#concat-and-conditional').contains('Harry Callahan');
      });

      it('Renders Button text as a concatenated, bound element, with overrides', () => {
        cy.visit('http://localhost:3000/component-tests');
        cy.get('#concat-and-conditional').contains('Norm Gunderson');
      });
    });

    describe('Conditional Data', () => {
      it('Renders Button with one background when user is logged in', () => {
        cy.visit('http://localhost:3000/component-tests');
        cy.get('#concat-and-conditional').get('#conditional1').should('have.css', 'background-color', 'rgb(255, 0, 0)');
      });

      it('Renders Button with a different background when user is not logged in', () => {
        cy.visit('http://localhost:3000/component-tests');
        cy.get('#concat-and-conditional').get('#conditional2').should('have.css', 'background-color', 'rgb(0, 0, 255)');
      });

      it('Renders Button disabled when user is not logged in', () => {
        cy.visit('http://localhost:3000/component-tests');
        cy.get('#concat-and-conditional').get('#conditional2').get('[disabled]');
      });
    });
  });

  describe('Component Variants', () => {
    it('Renders Button disabled when user is not logged in', () => {
      cy.visit('http://localhost:3000/component-tests');
      cy.get('#variants').get('#variant1').should('have.css', 'font-size', '12px');
      cy.get('#variants').get('#variant2').should('have.css', 'font-size', '40px');
      cy.get('#variants').get('#variant3').should('have.css', 'width', '500px');
    });
  });

  describe('Data Binding', () => {
    describe('Simple Property Binding', () => {
      it('Renders the Bound property', () => {
        cy.visit('http://localhost:3000/component-tests');
        cy.get('#data-binding').get('#simplePropIsDisabled').get('[disabled]');
      });
    });

    describe('DataStore Binding Without Predicate', () => {
      it('Renders with and without overrides', () => {
        cy.visit('http://localhost:3000/component-tests');
        cy.get('#data-binding').get('#dataStoreBindingWithoutPredicateNoOverride').contains('Al');
        cy.get('#data-binding').get('#dataStoreBindingWithoutPredicateWithOverride').contains('Override Name');
      });
    });

    describe('DataStore Binding With Predicate', () => {
      it('Renders with and without overrides', () => {
        cy.visit('http://localhost:3000/component-tests');
        cy.get('#data-binding').get('#dataStoreBindingWithPredicateNoOverrideNoModel').contains('Buddy');
        cy.get('#data-binding').get('#dataStoreBindingWithPredicateWithOverride').contains('Override Name');
      });

      it('Renders with wired data model', () => {
        // TODO: Implement me.
      });
    });
  });

  describe('Action Binding', () => {
    // TODO: Write Action Binding Cases
  });

  describe('Collections', () => {
    // TODO: Write Collection Cases
  });
});

describe('Generated Themes', () => {
  it('Successfully decorates the app', () => {
    cy.visit('http://localhost:3000/component-tests');
    // amplify-ui theming converts hex color to rgb
    cy.get('p.amplify-text').should('have.css', 'color', 'rgb(0, 128, 128)');
  });
});
