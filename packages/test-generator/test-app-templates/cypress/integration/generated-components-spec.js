describe('Generated Components', () => {
  describe('Sanity Test', () => {
    it('Successfully opens the app', () => {
      cy.visit('http://localhost:3000');
    });
  });

  describe('Basic Components', () => {
    it('Renders Box with Button, and text inside', () => {
      cy.visit('http://localhost:3000');
      cy.get('button').contains('Text in Button');
    });

    it('Renders Text component', () => {
      cy.visit('http://localhost:3000');
      cy.contains('Custom Text Value');
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
