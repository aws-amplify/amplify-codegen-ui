const EXPECTED_INVALID_INPUT_CASES = new Set(['ComponentMissingProperties', 'ComponentMissingType', 'InvalidTheme']);
const EXPECTED_INTERNAL_ERROR_CASES = new Set([]);

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
          if (EXPECTED_INVALID_INPUT_CASES.has(className)) {
            cy.get(`.${targetName}`).contains('❌');
            cy.get(`.${targetName}`).contains('InvalidInputError');
          } else if (EXPECTED_INTERNAL_ERROR_CASES.has(className)) {
            cy.get(`.${targetName}`).contains('❌');
            cy.get(`.${targetName}`).contains('InternalError');
          } else {
            cy.get(`.${targetName}`).contains('✅');
          }
        });
      });
    });
  });
});
