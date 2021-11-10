describe('Primitives', () => {
  describe('Sanity Test', () => {
    it('Successfully opens the app', () => {
      cy.visit('http://localhost:3000/primitives-tests');
    });
  });

  describe('Alert', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
    });
  });

  describe('Badge', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
    });
  });

  describe('Button', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
    });
  });

  describe('ButtonGroup', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
    });
  });

  describe('Card', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
    });
  });

  describe('CheckboxField', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
    });
  });

  describe('Collection', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
    });
  });

  describe('Divider', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
    });
  });

  describe('Flex', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
    });
  });

  describe('Grid', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
    });
  });

  describe('Heading', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
    });
  });

  describe('Icon', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
    });
  });

  describe('Image', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
    });
  });

  describe('Input', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
    });
  });

  describe('Label', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
    });
  });

  describe('Link', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
    });
  });

  describe('Loader', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
    });
  });

  describe('Pagination', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
    });
  });

  describe('PasswordField', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
    });
  });

  describe('PhoneNumberField', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
    });
  });

  describe('Placeholder', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
    });
  });

  describe('Radio', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
    });
  });

  describe('RadioGroup', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
    });
  });

  describe('Rating', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
    });
  });

  describe('ScrollView', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
    });
  });

  describe('SearchField', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
    });
  });

  describe('StepperField', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
    });
  });

  describe('SwitchField', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
    });
  });

  describe('Tabs', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
    });
  });

  describe('Text', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
    });
  });

  describe('TextField', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
      cy.get('#text-field')
        .find('.amplify-textfield')
        .within(() => {
          cy.get('.amplify-label').contains('Name');
          cy.get('.amplify-text').contains('Please enter valid name');
          cy.get('.amplify-input').should('have.attr', 'placeholder', 'Holden');
        });
    });
  });

  describe('ToggleButton', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
    });
  });

  describe('ToggleButtonGroup', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
    });
  });

  describe('View', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
    });
  });

  describe('VisuallyHidden', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
    });
  });
});
