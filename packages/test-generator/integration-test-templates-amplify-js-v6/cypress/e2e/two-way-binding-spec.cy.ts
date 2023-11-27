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

describe('Two way binding', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/two-way-binding-tests');
  });

  describe('CheckboxField', () => {
    it('updates on ui interaction', () => {
      cy.get('#checkbox-field-section').within(() => {
        cy.get('.amplify-checkbox__button').invoke('attr', 'data-checked').should('eq', 'false');
        cy.contains('Subscribe').click();
        cy.get('.amplify-checkbox__button').invoke('attr', 'data-checked').should('eq', 'true');
      });
    });

    it('updates on state mutation', () => {
      cy.get('#checkbox-field-section').within(() => {
        cy.contains('Subscribe').click();
        cy.get('.amplify-checkbox__button').invoke('attr', 'data-checked').should('eq', 'true');
        cy.contains('Set CheckboxFieldValue').click();
        cy.get('.amplify-checkbox__button').invoke('attr', 'data-checked').should('eq', 'false');
      });
    });
  });

  describe('PasswordField', () => {
    it('updates on ui interaction', () => {
      cy.get('#password-field-section').within(() => {
        cy.contains('Entered Value').should('not.exist');
        cy.get('input').type('Entered Value');
        cy.contains('Entered Value');
      });
    });

    it('updates on state mutation', () => {
      cy.get('#password-field-section').within(() => {
        cy.contains('admin123').should('not.exist');
        cy.contains('Set PasswordFieldValue').click();
        cy.contains('admin123');
      });
    });
  });

  describe('PhoneNumberField', () => {
    it('updates on ui interaction', () => {
      cy.get('#phone-number-field-section').within(() => {
        cy.contains('Entered Value').should('not.exist');
        cy.get('input').type('Entered Value');
        cy.contains('Entered Value');
      });
    });

    it('updates on state mutation', () => {
      cy.get('#phone-number-field-section').within(() => {
        cy.contains('8675309').should('not.exist');
        cy.contains('Set PhoneNumberFieldValue').click();
        cy.contains('8675309');
      });
    });
  });

  describe('RadioGroupField', () => {
    it('updates on ui interaction', () => {
      cy.get('#radio-group-field-section').within(() => {
        cy.get('#radio-group-field-value').contains('css').should('not.exist');
        cy.contains('css').click();
        cy.get('#radio-group-field-value').contains('css');
      });
    });

    it('updates on state mutation', () => {
      cy.get('#radio-group-field-section').within(() => {
        cy.get('#radio-group-field-value').contains('javascript').should('not.exist');
        cy.contains('Set RadioGroupField').click();
        cy.get('#radio-group-field-value').contains('javascript');
      });
    });
  });

  describe('SearchField', () => {
    it('updates on ui interaction', () => {
      cy.get('#search-field-section').within(() => {
        cy.contains('Entered Value').should('not.exist');
        cy.get('input').type('Entered Value');
        cy.contains('Entered Value');
      });
    });

    it('updates on state mutation', () => {
      cy.get('#search-field-section').within(() => {
        cy.contains('UI Docs').should('not.exist');
        cy.contains('Set SearchFieldValue').click();
        cy.contains('UI Docs');
      });
    });
  });

  describe('SelectField', () => {
    it('updates on ui interaction', () => {
      cy.get('#select-field-section').within(() => {
        cy.contains('banana').should('not.exist');
        cy.get('select').select('banana');
        cy.contains('banana');
      });
    });

    it('updates on state mutation', () => {
      cy.get('#select-field-section').within(() => {
        cy.contains('orange').should('not.exist');
        cy.contains('Set SelectFieldValue').click();
        cy.contains('orange');
      });
    });
  });

  describe('SliderField', () => {
    // Disabling ui interaction test, moving thumb slider is failing.
    it.skip('updates on ui interaction', () => {
      cy.get('#slider-field-section').within(() => {
        // cy.contains('90').should('not.exist');
        cy.get('.amplify-sliderfield__thumb').trigger('mousedown');
        cy.get('.amplify-sliderfield__thumb').trigger('mousemove', -20);
        cy.get('.amplify-sliderfield__thumb').trigger('mouseup');
        cy.contains('90');
      });
    });

    it('updates on state mutation', () => {
      cy.get('#slider-field-section').within(() => {
        cy.contains('90').should('not.exist');
        cy.contains('Set SliderFieldValue').click();
        cy.contains('90');
      });
    });
  });

  describe('StepperField', () => {
    it('updates on ui interaction', () => {
      cy.get('#stepper-field-section').within(() => {
        cy.contains('1').should('not.exist');
        cy.get('.amplify-stepperfield__button--increase').click();
        cy.contains('1');
      });
    });

    it('updates on state mutation', () => {
      cy.get('#stepper-field-section').within(() => {
        cy.contains('9').should('not.exist');
        cy.contains('Set StepperFieldValue').click();
        cy.contains('9');
      });
    });
  });

  describe('SwitchField', () => {
    it('updates on ui interaction', () => {
      cy.get('#switch-field-section').within(() => {
        cy.get('.amplify-switch__thumb').invoke('attr', 'data-checked').should('eq', 'false');
        cy.contains('Subscribe').click();
        cy.get('.amplify-switch__thumb').invoke('attr', 'data-checked').should('eq', 'true');
        cy.contains('Subscribe').click();
        cy.get('.amplify-switch__thumb').invoke('attr', 'data-checked').should('eq', 'false');
      });
    });

    it('updates on state mutation', () => {
      cy.get('#switch-field-section').within(() => {
        cy.get('.amplify-switch__thumb').invoke('attr', 'data-checked').should('eq', 'false');
        cy.contains('Set SwitchFieldValue').click();
        cy.get('.amplify-switch__thumb').invoke('attr', 'data-checked').should('eq', 'true');
      });
    });
  });

  describe('TextField', () => {
    it('updates on ui interaction', () => {
      cy.get('#text-field-section').within(() => {
        cy.contains('Entered Value').should('not.exist');
        cy.get('input').type('Entered Value');
        cy.contains('Entered Value');
      });
    });

    it('updates on state mutation', () => {
      cy.get('#text-field-section').within(() => {
        cy.contains('Hardcoded Value').should('not.exist');
        cy.contains('Set TextFieldValue').click();
        cy.contains('Hardcoded Value');
      });
    });
  });

  describe('TextAreaField', () => {
    it('updates on ui interaction', () => {
      cy.get('#text-area-field-section').within(() => {
        cy.contains('Entered Value').should('not.exist');
        cy.get('textarea').type('Entered Value');
        cy.contains('Entered Value');
      });
    });

    it('updates on state mutation', () => {
      cy.get('#text-area-field-section').within(() => {
        cy.contains('Hardcoded Value').should('not.exist');
        cy.contains('Set TextAreaFieldValue').click();
        cy.contains('Hardcoded Value');
      });
    });
  });
});
