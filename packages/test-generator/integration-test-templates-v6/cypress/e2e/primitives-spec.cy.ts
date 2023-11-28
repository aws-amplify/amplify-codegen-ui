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
describe('Primitives', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/primitives-tests');
  });

  describe('Alert', () => {
    it('Basic', () => {
      cy.get('#alert')
        .find('.amplify-alert')
        .within(() => {
          cy.get('div').contains('Alert Text');
        });
    });
  });

  describe('Badge', () => {
    it('Basic', () => {
      cy.get('#badge').find('.amplify-badge').contains('Error Found');
    });
  });

  describe('Button', () => {
    it('Basic', () => {
      cy.get('#button').within(() => {
        cy.get('.amplify-button').should('have.text', 'Hello world!');
        cy.get('.amplify-button').should('have.attr', 'type', 'button');
      });
    });
  });

  describe('ButtonGroup', () => {
    it('Basic', () => {
      cy.get('#button-group').within(() => {
        cy.get('.amplify-button').should('have.class', 'amplify-button--primary');
      });
    });
  });

  describe('Card', () => {
    it('Basic', () => {
      cy.get('#card').within(() => {
        cy.get('.amplify-card').find('div').should('have.attr', 'style', 'padding: 1rem;');
      });
    });
  });

  describe('CheckboxField', () => {
    it('Basic', () => {
      cy.get('#checkbox-field').within(() => {
        cy.get('.amplify-checkboxfield').get('.amplify-checkbox__label').should('have.text', 'Subscribe');
      });
    });
  });

  describe('Collection', () => {
    it('Basic', () => {
      cy.get('#collection').find('.amplify-card').eq(0).should('have.text', 'Cozy BungalowLorem ipsum dolor sit amet');
    });
  });

  describe('Divider', () => {
    it('Basic', () => {
      cy.get('#divider').find('.amplify-divider');
    });
  });

  describe('Flex', () => {
    it('Basic', () => {
      cy.get('#flex').within(() => {
        cy.get('.amplify-text').eq(0).should('have.text', 'Hello');
        cy.get('.amplify-text').eq(1).should('have.text', 'world');
      });
    });
  });

  describe('Grid', () => {
    it('Basic', () => {
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
      cy.get('#heading').find('.amplify-heading').eq(1).should('have.text', 'Hello world!');
    });
  });

  describe('Icon', () => {
    it('Basic', () => {
      cy.get('#icon')
        .get('.amplify-icon')
        .first()
        .within(() => {
          cy.get('path').should(
            'have.attr',
            'd',
            // eslint-disable-next-line max-len
            'M11 7H13V9H11V7ZM11 11H13V17H11V11ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z',
          );
        });
    });
  });

  describe('Image', () => {
    it('Basic', () => {
      cy.get('#image').get('.amplify-image').should('have.attr', 'src', '/road-to-milford-new-zealand-800w.jpg');
    });
  });

  describe('Link', () => {
    it('Basic', () => {
      cy.get('#link').get('.amplify-link').should('have.text', 'My Link');
      cy.get('#link').get('.amplify-link').should('have.attr', 'href', '/primitives-tests');
    });
  });

  describe('Loader', () => {
    it('Basic', () => {
      cy.get('#loader').get('.amplify-loader').should('have.class', 'amplify-loader--large');
    });
  });

  describe('Menu', () => {
    it('Basic', () => {
      cy.get('#menu')
        .find('button')
        .find('path')
        .should('have.attr', 'd', 'M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z');

      cy.get('.amplify-menu__wrapper').should('not.exist');
      cy.get('#menu').find('button').click({ force: true });
      cy.get('.amplify-menu__wrapper').should('have.text', 'Item');
    });
  });

  describe('MenuButton', () => {
    it('Basic', () => {
      cy.get('#menu-button').find('.amplify-button').should('have.text', 'Menu Button');
    });
  });

  describe('Pagination', () => {
    it('Basic', () => {
      cy.get('#pagination')
        .get('.amplify-pagination')
        .get('ol')
        .within(() => {
          cy.get('li').eq(1).should('have.text', 'Page:1');
          cy.get('li').eq(2).should('have.text', '2');
          cy.get('li').eq(6).should('have.text', '…');
          cy.get('li').eq(7).should('have.text', '10');
        });
    });
  });

  describe('PasswordField', () => {
    it('Basic', () => {
      cy.get('#password-field').find('.amplify-input').should('have.attr', 'autocomplete', 'current-password');
    });
  });

  describe('PhoneNumberField', () => {
    it('Basic', () => {
      cy.get('#phone-number-field').find('.amplify-input').should('have.attr', 'autocomplete', 'tel-national');
    });
  });

  describe('Placeholder', () => {
    it('Basic', () => {
      cy.get('#placeholder').find('.amplify-placeholder');
    });
  });

  describe('Radio', () => {
    it('Basic', () => {
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
      cy.get('#radio-group-field')
        .find('.amplify-radiogroupfield')
        .within(() => {
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
      cy.get('#rating').find('.amplify-visually-hidden').should('have.text', '3.7 out of 5 rating');
    });
  });

  describe('ScrollView', () => {
    it('Basic', () => {
      cy.get('#scroll-view').find('.amplify-scrollview').should('have.attr', 'style', 'height: 300px; width: 400px;');
    });
  });

  describe('SearchField', () => {
    it('Basic', () => {
      cy.get('#search-field').find('.amplify-input').should('have.attr', 'name', 'q');
    });
  });

  describe('SliderField', () => {
    it('Basic', () => {
      cy.get('#slider-field')
        .find('.amplify-sliderfield')
        .within(() => {
          cy.get('.amplify-label').contains('50');
          cy.get('.amplify-label').within(() => {
            cy.get('span').eq(0).contains('Slider');
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
      cy.get('#switch-field')
        .find('.amplify-switch__wrapper')
        .within(() => {
          cy.get('.amplify-switch__label').should('have.text', 'This is a switch');
          cy.get('.amplify-switch__track');
        });
    });
  });

  describe('Table', () => {
    it('Basic', () => {
      cy.get('#table')
        .find('.amplify-table')
        .within(() => {
          cy.get('.amplify-table__caption').should('have.text', 'Some fruits');
          cy.get('.amplify-table__head').within(() => {
            cy.get('.amplify-table__th').eq(0).should('have.text', 'Citrus');
            cy.get('.amplify-table__th').eq(1).should('have.text', 'Stone Fruit');
            cy.get('.amplify-table__th').eq(2).should('have.text', 'Berry');
          });
          cy.get('.amplify-table__body').within(() => {
            cy.get('.amplify-table__row')
              .eq(0)
              .within(() => {
                cy.get('.amplify-table__td').eq(0).should('have.text', 'Orange');
                cy.get('.amplify-table__td').eq(1).should('have.text', 'Nectarine');
                cy.get('.amplify-table__td').eq(2).should('have.text', 'Raspberry');
              });
            cy.get('.amplify-table__row')
              .eq(1)
              .within(() => {
                cy.get('.amplify-table__td').eq(0).should('have.text', 'Grapefruit');
                cy.get('.amplify-table__td').eq(1).should('have.text', 'Apricot');
                cy.get('.amplify-table__td').eq(2).should('have.text', 'Blueberry');
              });
            cy.get('.amplify-table__row')
              .eq(2)
              .within(() => {
                cy.get('.amplify-table__td').eq(0).should('have.text', 'Lime');
                cy.get('.amplify-table__td').eq(1).should('have.text', 'Peach');
                cy.get('.amplify-table__td').eq(2).should('have.text', 'Strawberry');
              });
          });
          cy.get('.amplify-table__foot').within(() => {
            cy.get('.amplify-table__th').eq(0).should('have.text', 'Citrus');
            cy.get('.amplify-table__th').eq(1).should('have.text', 'Stone Fruit');
            cy.get('.amplify-table__th').eq(2).should('have.text', 'Berry');
          });
        });
    });
  });

  describe('Text', () => {
    it('Basic', () => {
      cy.get('#text').find('.amplify-text').should('have.text', 'Hello world');
    });
  });

  describe('TextAreaField', () => {
    it('Basic', () => {
      cy.get('#text-area-field')
        .find('.amplify-textareafield')
        .within(() => {
          cy.get('.amplify-label').contains('Name');
          cy.get('.amplify-text').contains('Please enter valid name');
          cy.get('.amplify-textarea').should('have.attr', 'placeholder', 'Holden');
        });
    });
  });

  describe('TextField', () => {
    it('Basic', () => {
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
      cy.get('#toggle-button').within(() => {
        cy.get('.amplify-togglebutton').should('have.text', 'Press me!');
        cy.get('.amplify-togglebutton').should('have.attr', 'aria-pressed', 'false');
      });
    });
  });

  describe('ToggleButtonGroup', () => {
    it('Basic', () => {
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
      cy.get('#view').find('div').should('have.text', 'Nice view! 🏔');
    });
  });

  describe('VisuallyHidden', () => {
    it('Basic', () => {
      cy.get('#visually-hidden').find('button').find('.amplify-visually-hidden').should('have.text', 'Donemark');
    });
  });
});
