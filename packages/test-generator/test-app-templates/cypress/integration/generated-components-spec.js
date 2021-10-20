describe('Generated Components', () => {
  describe('Sanity Test', () => {
    it('Successfully opens the app', () => {
      cy.visit('http://localhost:3000');
    });
  });

  describe('Basic Components', () => {
    it('Renders Badge component', () => {
      cy.visit('http://localhost:3000');
      cy.get('#basic-components').contains('Basic Component Badge');
    });

    it('Renders View component', () => {
      cy.visit('http://localhost:3000');
      cy.get('#basic-components').contains('Basic Component View');
    });

    it('Renders Button component', () => {
      cy.visit('http://localhost:3000');
      cy.get('#basic-components').contains('Basic Component Button');
    });

    it('Renders Card component', () => {
      cy.visit('http://localhost:3000');
      cy.get('#basic-components').contains('Basic Component Card');
    });

    it('Renders Collection component', () => {
      cy.visit('http://localhost:3000');
      cy.get('#basic-components').find('p:contains("Basic Collection Card Text")').should('have.length', 2);
    });

    it('Renders Divider component', () => {
      cy.visit('http://localhost:3000');
      cy.get('#basic-components').find('.amplify-divider');
    });

    it('Renders Flex component', () => {
      cy.visit('http://localhost:3000');
      cy.get('#basic-components').find('.amplify-flex').contains('Basic Component Flex');
    });

    it('Renders Image component', () => {
      cy.visit('http://localhost:3000');
      cy.get('#basic-components').find('img');
    });

    it('Renders Text component', () => {
      cy.visit('http://localhost:3000');
      cy.get('#basic-components').contains('Basic Component Text');
    });

    it('Renders Custom component', () => {
      cy.visit('http://localhost:3000');
      cy.get('#basic-components').find('.amplify-rating');
    });
  });

  describe('Conditional Data', () => {
    it('Renders Button disabled when user is not logged in', () => {
      cy.visit('http://localhost:3000');
      cy.get('[label="Disabled Conditional Button"]').get('[disabled]');
    });

    it('Renders May vote when user old enough', () => {
      cy.visit('http://localhost:3000');
      cy.get('[label="May Vote Conditional Button"]').get('[prompt="May Vote, cast your vote."]');
    });

    it('Renders May not vote when user too young', () => {
      cy.visit('http://localhost:3000');
      cy.get('[label="May Not Vote Conditional Button"]').get('[prompt="Sorry you cannot vote"]');
    });
  });

  // TODO: We should be rendering the element as a text child, but concat doesn't seem to support that yet.
  describe('Concatenated Data', () => {
    it('Renders Button text as a concatenated, bound element', () => {
      cy.visit('http://localhost:3000');
      cy.get('[label="Harry Callahan"]');
    });

    it('Renders Button text as a concatenated, bound element, with overrides', () => {
      cy.visit('http://localhost:3000');
      cy.get('[label="Norm Gunderson"]');
    });
  });

  describe('Component Variants', () => {
    // TODO: Write Variant Cases
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
});

describe('Generated Themes', () => {
  it('Successfully decorates the app', () => {
    cy.visit('http://localhost:3000');
    // TODO: Write theming test
  });
});
