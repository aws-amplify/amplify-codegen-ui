describe('Primitives', () => {
  describe('Sanity Test', () => {
    it('Successfully opens the app', () => {
      cy.visit('http://localhost:3000/primitives-tests');
    });
  });

  describe('Alert', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
      cy.get('#alert')
        .find('.amplify-alert')
        .within(() => {
          cy.get('div').contains('Alert Text');
        });
    });
  });

  describe('Badge', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
      cy.get('#badge').find('.amplify-badge').contains('Error Found');
    });
  });

  describe('Button', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
      cy.get('#button').within(() => {
        cy.get('.amplify-button').should('have.text', 'Hello world!');
        cy.get('.amplify-button').should('have.attr', 'type', 'button');
        cy.get('.amplify-button').should('have.attr', 'data-variation', 'primary');
      });
    });
  });

  describe('ButtonGroup', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
      cy.get('#button-group').within(() => {
        cy.get('.amplify-button').should('have.attr', 'data-variation', 'primary');
      });
    });
  });

  describe('Card', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
      cy.get('#card').within(() => {
        cy.get('.amplify-card').find('div').should('have.attr', 'style', 'padding: 1rem;');
      });
    });
  });

  describe('CheckboxField', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
      cy.get('#checkbox-field').within(() => {
        cy.get('.amplify-checkboxfield').get('.amplify-checkbox__label').should('have.text', 'Subscribe');
      });
    });
  });

  describe('Collection', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
      cy.get('#collection').find('.amplify-card').eq(0).should('have.text', 'Cozy BungalowLorem ipsum dolor sit amet');
    });
  });

  describe('Divider', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
      cy.get('#divider').find('.amplify-divider');
    });
  });

  describe('Expander', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
      cy.get('#expander')
        .find('.amplify-expander')
        .within(() => {
          cy.get('.amplify-expander__item')
            .eq(0)
            .within(() => {
              cy.get('.amplify-expander__trigger').should('have.text', 'title1');
              cy.get('.amplify-expander__trigger').click();
              cy.get('.amplify-expander__content__text').should('have.text', 'ExpanderItem1Content');
            });
          cy.get('.amplify-expander__item')
            .eq(1)
            .within(() => {
              cy.get('.amplify-expander__trigger').should('have.text', 'title2');
              cy.get('.amplify-expander__trigger').click();
              cy.get('.amplify-expander__content__text').should('have.text', 'ExpanderItem2Content');
            });
        });
    });
  });

  describe('Flex', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
      cy.get('#flex').within(() => {
        cy.get('.amplify-text').eq(0).should('have.text', 'Hello');
        cy.get('.amplify-text').eq(1).should('have.text', 'world');
      });
    });
  });

  describe('Grid', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
      cy.get('#grid')
        .get('.amplify-grid')
        .within(() => {
          cy.get('div').eq(0).should('have.attr', 'style', 'background-color: var(--amplify-colors-blue-10);');
          cy.get('div').eq(1).should('have.attr', 'style', 'background-color: var(--amplify-colors-blue-20);');
          cy.get('div').eq(2).should('have.attr', 'style', 'background-color: var(--amplify-colors-blue-40);');
          cy.get('div').eq(3).should('have.attr', 'style', 'background-color: var(--amplify-colors-blue-60);');
        });
    });
  });

  describe('Heading', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
      cy.get('#heading').find('.amplify-heading').eq(1).should('have.text', 'Hello world!');
    });
  });

  describe('Icon', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
      cy.get('#icon')
        .get('.amplify-icon')
        .within(() => {
          cy.get('path').should(
            'have.attr',
            'd',
            'M11 7H13V9H11V7ZM11 11H13V17H11V11ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z',
          );
        });
    });
  });

  describe('Image', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
      cy.get('#image').get('.amplify-image').should('have.attr', 'src', '/road-to-milford-new-zealand-800w.jpg');
    });
  });

  describe('Link', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
      cy.get('#link').get('.amplify-link').should('have.text', 'My Link');
      cy.get('#link').get('.amplify-link').should('have.attr', 'href', '/primitives-tests');
    });
  });

  describe('Loader', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
      cy.get('#loader').get('.amplify-loader').should('have.attr', 'data-size', 'large');
    });
  });

  describe('Pagination', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
      cy.get('#pagination')
        .get('.amplify-pagination')
        .get('ol')
        .within(() => {
          cy.get('li').eq(1).should('have.text', 'Current Page:1');
          cy.get('li').eq(2).should('have.text', '2');
          cy.get('li').eq(6).should('have.text', '…');
          cy.get('li').eq(7).should('have.text', '10');
        });
    });
  });

  describe('PasswordField', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
      cy.get('#password-field').find('.amplify-input').should('have.attr', 'autocomplete', 'current-password');
    });
  });

  describe('PhoneNumberField', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
      cy.get('#phone-number-field').find('.amplify-input').should('have.attr', 'autocomplete', 'tel-national');
    });
  });

  describe('Placeholder', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
      cy.get('#placeholder').find('.amplify-placeholder');
    });
  });

  describe('Radio', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
      cy.get('#radio')
        .find('.amplify-radio')
        .within(() => {
          cy.get('input').should('have.attr', 'value', 'html');
          cy.get('.amplify-text').should('have.text', 'HTML');
        });
    });
  });

  describe('RadioGroupField', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
      cy.get('#radio-group-field')
        .find('.amplify-radiogroupfield')
        .within(() => {
          cy.get('label').should('have.text', 'Languagehtmlcssjavascript');
          cy.get('.amplify-radiogroup').within(() => {
            cy.get('.amplify-radio').eq(0).should('have.text', 'html');
            cy.get('.amplify-radio').eq(1).should('have.text', 'css');
            cy.get('.amplify-radio').eq(2).should('have.text', 'javascript');
          });
        });
    });
  });

  describe('Rating', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
      cy.get('#rating').find('.amplify-visually-hidden').should('have.text', '3.7 out of 5 rating');
    });
  });

  describe('ScrollView', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
      cy.get('#scroll-view').find('.amplify-scrollview').should('have.attr', 'style', 'height: 300px; width: 400px;');
    });
  });

  describe('SearchField', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
      cy.get('#search-field').find('.amplify-input').should('have.attr', 'name', 'q');
    });
  });

  describe('SliderField', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
      cy.get('#slider-field')
        .find('.amplify-sliderfield')
        .within(() => {
          cy.get('.amplify-label').within(() => {
            cy.get('span').eq(0).contains('Slider');
            cy.get('span').eq(1).contains('50');
          });
          cy.get('.amplify-sliderfield__group')
            .find('span')
            .find('span')
            .eq(0)
            .find('span')
            .should('have.attr', 'style', 'left: 0%; right: 50%;');
        });
    });
  });

  describe('StepperField', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
      cy.get('#stepper-field').within(() => {
        cy.get('.amplify-input').should('have.attr', 'type', 'number');
        cy.get('.amplify-input').should('have.attr', 'min', '0');
        cy.get('.amplify-input').should('have.attr', 'max', '10');
        cy.get('.amplify-input').should('have.attr', 'step', '1');
      });
    });
  });

  describe('SwitchField', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
      cy.get('#switch-field')
        .find('.amplify-switch__wrapper')
        .within(() => {
          cy.get('.amplify-switch-label').should('have.text', 'This is a switch');
          cy.get('.amplify-switch-track');
        });
    });
  });

  describe('Tabs', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
      cy.get('#tabs')
        .find('div')
        .within(() => {
          cy.get('.amplify-tabs').within(() => {
            cy.get('div').eq(0).should('have.text', 'Tab 1');
            cy.get('div').eq(1).should('have.text', 'Tab 2');
          });
        });
    });
  });

  describe('Text', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
      cy.get('#text').find('.amplify-text').should('have.text', 'Hello world');
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
      cy.get('#toggle-button').within(() => {
        cy.get('.amplify-togglebutton').should('have.text', 'Press me!');
        cy.get('.amplify-togglebutton').should('have.attr', 'aria-pressed', 'false');
      });
    });
  });

  describe('ToggleButtonGroup', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
      cy.get('#toggle-button-group')
        .find('.amplify-togglebuttongroup')
        .within(() => {
          cy.get('.amplify-togglebutton').eq(0).should('have.text', 'bold');
          cy.get('.amplify-togglebutton').eq(0).should('have.attr', 'aria-pressed', 'true');
          cy.get('.amplify-togglebutton').eq(1).should('have.text', 'italic');
          cy.get('.amplify-togglebutton').eq(1).should('have.attr', 'aria-pressed', 'false');
          cy.get('.amplify-togglebutton').eq(2).should('have.text', 'underline');
          cy.get('.amplify-togglebutton').eq(2).should('have.attr', 'aria-pressed', 'false');
          cy.get('.amplify-togglebutton').eq(3).should('have.text', 'color-fill');
          cy.get('.amplify-togglebutton').eq(3).should('have.attr', 'aria-pressed', 'false');
        });
    });
  });

  describe('View', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
      cy.get('#view').find('div').should('have.text', 'Nice view! 🏔');
    });
  });

  describe('VisuallyHidden', () => {
    it('Basic', () => {
      cy.visit('http://localhost:3000/primitives-tests');
      cy.get('#visually-hidden').find('button').find('.amplify-visually-hidden').should('have.text', 'Donemark');
    });
  });
});
