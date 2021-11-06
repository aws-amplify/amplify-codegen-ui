const EXPECTED_FAILURE_CASES = new Set(['ComponentMissingProperties', 'ComponentMissingType']);

const TARGET_GENERATORS = ['ES2016_TSX', 'ES2016_JSX', 'ES5_TSX', 'ES5_JSX'];

describe('Generate Components', () => {
  it('Loads the page', () => {
    cy.visit('http://localhost:3000/generate-tests');
  });

  it('Can generate all expected rows successfully', () => {
    cy.visit('http://localhost:3000/generate-tests');
    cy.get('.generateTest').each(($element) => {
      const className = $element.attr('id').replace('generateTest', '');
      cy.wrap($element).within(() => {
        cy.get('button').click();
        TARGET_GENERATORS.forEach((targetName) => {
          if (EXPECTED_FAILURE_CASES.has(className)) {
            cy.get(`.${targetName}`).contains('❌');
          } else {
            cy.get(`.${targetName}`).contains('✅');
          }
        });
      });
    });
  });
});
