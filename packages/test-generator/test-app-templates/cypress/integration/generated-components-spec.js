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
      // TODO: Integrate and finish test.
      // cy.get('#basic-components').contains('Basic Component Collection');
    });

    it('Renders Custom component', () => {
      cy.visit('http://localhost:3000');
      // TODO: Integrate and finish test.
      // cy.get('#basic-components').contains('Basic Custom Component');
    });

    it('Renders Divider component', () => {
      cy.visit('http://localhost:3000');
      // TODO: Integrate and finish test.
      // cy.get('#basic-components').contains('Basic Component Divider');
    });

    it('Renders Flex component', () => {
      cy.visit('http://localhost:3000');
      // TODO: Integrate and finish test.
      // cy.get('#basic-components').contains('Basic Component Flex');
    });

    it('Renders Image component', () => {
      cy.visit('http://localhost:3000');
      // TODO: Integrate and finish test.
      // cy.get('#basic-components').contains('Basic Component Image');
    });

    it('Renders Text component', () => {
      cy.visit('http://localhost:3000');
      cy.get('#basic-components').contains('Basic Component Text');
    });
  });

  describe('Conditional Data', () => {
    // TODO: Write Conditional Cases
  });

  describe('Concatenated Data', () => {
    // TODO: Get Concatenation Cases Working
    // it('Renders Button text as a concatenated, bound element', () => {
    //   cy.visit('http://localhost:3000');
    //   cy.contains('Harry Callahan')
    // });
    //
    // it('Renders Button text as a concatenated, bound element, with overrides', () => {
    //   cy.visit('http://localhost:3000');
    //   cy.contains('Norm Gunderson')
    // });
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
