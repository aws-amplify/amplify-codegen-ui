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
    // TODO: Write Data Binding Cases
  });

  describe('Action Binding', () => {
    // TODO: Write Action Binding Cases
  });

  describe('Collections', () => {
    // TODO: Write Collection Cases
  });

  describe('Default Value', () => {
    it('Renders simple property binding default value', () => {
      cy.get('#default-value')
        .get('#bound-simple-binding-default')
        .invoke('text')
        .then((text) => {
          expect(text.trim()).equal('Default Binding Property');
        });
    });

    it('Overrides simple property binding default value', () => {
      cy.get('#default-value')
        .get('#bound-simple-binding-override')
        .invoke('text')
        .then((text) => {
          expect(text.trim()).equal('Override Simple Binding');
        });
    });

    it('Renders bound default value', () => {
      cy.get('#default-value')
        .get('#bound-default')
        .invoke('text')
        .then((text) => {
          expect(text.trim()).equal('Bound Default');
        });
    });

    it('Overrides bound default value', () => {
      cy.get('#default-value')
        .get('#bound-override')
        .invoke('text')
        .then((text) => {
          expect(text.trim()).equal('Override Bound');
        });
    });

    it('Renders simple default value when simple and bound', () => {
      cy.get('#default-value')
        .get('#simple-and-bound-default')
        .invoke('text')
        .then((text) => {
          expect(text.trim()).equal('Simple Double Default');
        });
    });

    it('Overrides simple and bound default value', () => {
      cy.get('#default-value')
        .get('#simple-and-bound-override')
        .invoke('text')
        .then((text) => {
          expect(text.trim()).equal('Override Simple And Bound');
        });
    });
  });
});

describe('Generated Themes', () => {
  it('Successfully decorates the app', () => {
    cy.visit('http://localhost:3000/component-tests');
    // amplify-ui theming converts hex color to rgb
    cy.get('p.amplify-text').should('have.css', 'color', 'rgb(0, 128, 128)');
  });
});
