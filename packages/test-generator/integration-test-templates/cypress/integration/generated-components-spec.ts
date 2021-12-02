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
describe('Generated Components', () => {
  before(() => {
    cy.visit('http://localhost:3000/component-tests');
  });

  describe('Basic Components', () => {
    it('Renders Badge component', () => {
      cy.get('#basic-components').contains('Basic Component Badge');
    });

    it('Renders View component', () => {
      cy.get('#basic-components').contains('Basic Component View');
    });

    it('Renders Button component', () => {
      cy.get('#basic-components').contains('Basic Component Button');
    });

    it('Renders Card component', () => {
      cy.get('#basic-components').contains('Basic Component Card');
    });

    it('Renders Collection component', () => {
      cy.get('#basic-components').find('p:contains("Basic Collection Card Text")').should('have.length', 2);
    });

    it('Renders Divider component', () => {
      cy.get('#basic-components').find('.amplify-divider');
    });

    it('Renders Flex component', () => {
      cy.get('#basic-components').find('.amplify-flex').contains('Basic Component Flex');
    });

    it('Renders Image component', () => {
      cy.get('#basic-components').find('img');
    });

    it('Renders Text component', () => {
      cy.get('#basic-components').contains('Basic Component Text');
    });

    it('Renders Custom component', () => {
      cy.get('#basic-components').find('.amplify-rating');
    });
  });

  describe('Generated Components', () => {
    describe('Concatenated Data', () => {
      it('Renders Button text as a concatenated, bound element', () => {
        cy.get('#concat-and-conditional').contains('Harry Callahan');
      });

      it('Renders Button text as a concatenated, bound element, with overrides', () => {
        cy.get('#concat-and-conditional').contains('Norm Gunderson');
      });
    });

    describe('Conditional Data', () => {
      it('Renders Button with one background when user is logged in', () => {
        cy.get('#conditional1').should('have.css', 'background-color', 'rgb(255, 0, 0)');
      });

      it('Renders Button with a different background when user is not logged in', () => {
        cy.get('#conditional2').should('have.css', 'background-color', 'rgb(0, 0, 255)');
      });

      it('Renders Button disabled when user is not logged in', () => {
        cy.get('#conditional2').get('[disabled]');
      });

      it('Renders conditional props for simple property binding', () => {
        cy.get('#ComponentWithBoundPropertyConditional-no-prop [disabled]').should('not.exist');
        cy.get('#ComponentWithBoundPropertyConditional-true-prop').get('[disabled]');
        cy.get('#ComponentWithBoundPropertyConditional-false-prop [disabled]').should('not.exist');
      });
    });
  });

  describe('Component Variants', () => {
    it('Renders Button disabled when user is not logged in', () => {
      cy.get('#variant1').should('have.css', 'font-size', '12px');
      cy.get('#variant2').should('have.css', 'font-size', '40px');
      cy.get('#variant3').should('have.css', 'width', '500px');
    });

    it('allows for use of both variants and overrides, prioritizing overrides if they collide', () => {
      cy.get('#variantAndOverrideDefault').contains('DefaultText');
      cy.get('#variantAndOverrideVariantValue').contains('Hello');
      cy.get('#variantAndOverrideOverrideApplied').contains('Overriden Text');
      cy.get('#variantAndOverrideVariantValueAndNonOverlappingOverride').contains('Goodbye');
      cy.get('#variantAndOverrideVariantValueAndOverlappingOverride').contains('Overriden Text');
    });
  });

  describe('Data Binding', () => {
    describe('Simple Property Binding', () => {
      it('Renders the Bound property', () => {
        cy.get('#simplePropIsDisabled').get('[disabled]');
      });
    });

    describe('DataStore Binding Without Predicate', () => {
      it('Renders with and without overrides', () => {
        cy.get('#dataStoreBindingWithoutPredicateNoOverride').contains('Al');
        cy.get('#dataStoreBindingWithoutPredicateWithOverride').contains('Override Name');
      });
    });

    describe('DataStore Binding With Predicate', () => {
      it('Renders with and without overrides', () => {
        cy.get('#dataStoreBindingWithPredicateNoOverrideNoModel').contains('Buddy');
        cy.get('#dataStoreBindingWithPredicateWithOverride').contains('Override Name');
      });

      it('Renders with wired data model', () => {
        // TODO: Implement me.
      });

      describe('Auth Binding', () => {
        it('Renders if user data is not available', () => {
          cy.get('#authBinding [alt="User Image"]');
        });

        it('Renders user data is available', () => {
          // TODO: Implement me.
        });
      });

      describe('Multiple Data Bindings', () => {
        it('Renders data from both bound data models', () => {
          cy.get('#multipleDataBindings').contains('QA - 2200');
        });
      });
    });
  });

  describe('Action Binding', () => {
    // TODO: Write Action Binding Cases
  });

  describe('Collections', () => {
    it('It renders a list of override values', () => {
      cy.get('#collectionWithBindingAndOverrides button').eq(0).contains('Yankee');
      cy.get('#collectionWithBindingAndOverrides button').eq(1).contains('Feather');
    });

    it('It renders data pulled from local datastore', () => {
      cy.get('#collectionWithBindingNoOverrides button').eq(0).contains('Real');
      cy.get('#collectionWithBindingNoOverrides button').eq(1).contains('Another');
      cy.get('#collectionWithBindingNoOverrides button').eq(2).contains('Last');
    });

    it('It respects sort functionality', () => {
      cy.get('#collectionWithSort button').eq(0).contains('LUser1');
      cy.get('#collectionWithSort button').eq(1).contains('LUser2');
      cy.get('#collectionWithSort button').eq(2).contains('LUser3');
    });

    it('It renders a list of override values with collectionProperty named items', () => {
      cy.get('#collectionWithBindingItemsNameWithOverrides button').eq(0).contains('Yankee');
      cy.get('#collectionWithBindingItemsNameWithOverrides button').eq(1).contains('Feather');
    });

    it('It renders data pulled from local datastore with collectionProperty named items', () => {
      cy.get('#collectionWithBindingItemsNameNoOverrides button').eq(0).contains('Real');
      cy.get('#collectionWithBindingItemsNameNoOverrides button').eq(1).contains('Another');
      cy.get('#collectionWithBindingItemsNameNoOverrides button').eq(2).contains('Last');
    });

    it('It renders paginated collections', () => {
      cy.get('#paginatedCollection').contains('Mountain Retreat - $1800');
      cy.get('#paginatedCollection').contains('Beachside Cottage - $1000').should('not.exist');
      cy.get('[aria-label="Go to page 2"]').click();
      cy.get('#paginatedCollection').contains('Beachside Cottage - $1000');
    });
  });

  describe('Default Value', () => {
    it('Renders simple property binding default value', () => {
      cy.get('#bound-simple-binding-default')
        .invoke('text')
        .then((text) => {
          expect(text.trim()).equal('Default Binding Property');
        });
    });

    it('Overrides simple property binding default value', () => {
      cy.get('#bound-simple-binding-override')
        .invoke('text')
        .then((text) => {
          expect(text.trim()).equal('Override Simple Binding');
        });
    });

    it('Renders bound default value', () => {
      cy.get('#bound-default')
        .invoke('text')
        .then((text) => {
          expect(text.trim()).equal('Bound Default');
        });
    });

    it('Overrides bound default value', () => {
      cy.get('#bound-override')
        .invoke('text')
        .then((text) => {
          expect(text.trim()).equal('Override Bound');
        });
    });

    it('Renders simple default value when simple and bound', () => {
      cy.get('#simple-and-bound-default')
        .invoke('text')
        .then((text) => {
          expect(text.trim()).equal('Simple Double Default');
        });
    });

    it('Overrides simple and bound default value', () => {
      cy.get('#simple-and-bound-override')
        .invoke('text')
        .then((text) => {
          expect(text.trim()).equal('Override Simple And Bound');
        });
    });

    it('Renders collection default value', () => {
      cy.get('#collection-default')
        .find('.amplify-text')
        .invoke('text')
        .then((text) => {
          expect(text.trim()).equal('Collection Default');
        });
    });

    it('Overrides collection default value', () => {
      cy.get('#collection-override')
        .find('.amplify-text')
        .invoke('text')
        .then((text) => {
          expect(text.trim()).equal('Override Collection');
        });
    });
  });

  describe('Parsed Fixed Property Values', () => {
    it('String Value', () => {
      cy.get('#parsed-fixed-values')
        .find('#string-value')
        .should('have.attr', 'value')
        .should('equal', 'raw string value');
    });

    it('String Number Value', () => {
      cy.get('#parsed-fixed-values').find('#string-number-value').should('have.attr', 'value').should('equal', '67548');
    });

    it('Parsed Number Value', () => {
      cy.get('#parsed-fixed-values').find('#parsed-number-value').get('.amplify-visually-hidden').contains('0.4');
    });

    it('String Boolean Value', () => {
      cy.get('#parsed-fixed-values').find('#string-boolean-value').should('have.attr', 'value').should('equal', 'true');
    });

    it('Parsed Boolean Value', () => {
      cy.get('#parsed-fixed-values').find('#parsed-boolean-value').should('be.disabled');
    });

    it('String JSON Value', () => {
      cy.get('#parsed-fixed-values')
        .find('#string-json-value')
        .should('have.attr', 'value')
        .should('equal', '{"foo": "bar"}');
    });

    it('Parsed JSON Value', () => {
      cy.get('#parsed-fixed-values').find('#parsed-json-value').should('have.attr', 'viewBox', '0 0 24 24');
    });

    it('String Array Value', () => {
      cy.get('#parsed-fixed-values')
        .find('#string-array-value')
        .should('have.attr', 'value')
        .should('equal', '[1,2,3]');
    });

    it('Parsed Array Value', () => {
      cy.get('#parsed-fixed-values').find('#parsed-array-value').contains('123');
    });

    it('String Null Value', () => {
      cy.get('#parsed-fixed-values').find('#string-null-value').should('have.attr', 'value').should('equal', 'null');
    });

    it('Parsed Null Value', () => {
      cy.get('#parsed-fixed-values').find('#parsed-null-value').should('have.text', '');
    });
  });

  describe('Custom Component', () => {
    it('Renders custom children', () => {
      cy.get('#custom-component')
        .find('#custom-children')
        .find('button')
        .should('have.attr', 'style', 'color: rgb(255, 0, 0);');
    });
    it('Renders custom parent', () => {
      cy.get('#custom-component').find('#custom-parent').should('have.css', 'font-family', '"Times New Roman"');
    });

    it('Renders custom parent and children', () => {
      cy.get('#custom-component')
        .find('#custom-parent-and-children')
        .should('have.css', 'font-family', '"Times New Roman"')
        .find('button')
        .should('have.attr', 'style', 'color: rgb(255, 0, 0);');
    });
  });

  describe('Icons', () => {
    it('Renders IconCloud', () => {
      cy.get('#icons').find('svg').find('path').should(
        'have.attr',
        'd',
        // eslint-disable-next-line max-len
        'M12 6C14.62 6 16.88 7.86 17.39 10.43L17.69 11.93L19.22 12.04C20.78 12.14 22 13.45 22 15C22 16.65 20.65 18 19 18H6C3.79 18 2 16.21 2 14C2 11.95 3.53 10.24 5.56 10.03L6.63 9.92L7.13 8.97C8.08 7.14 9.94 6 12 6ZM12 4C9.11 4 6.6 5.64 5.35 8.04C2.34 8.36 0 10.91 0 14C0 17.31 2.69 20 6 20H19C21.76 20 24 17.76 24 15C24 12.36 21.95 10.22 19.35 10.04C18.67 6.59 15.64 4 12 4Z',
      );
    });
  });

  describe('Overrides', () => {
    it('renders overrides with the correct indices', () => {
      cy.get('#componentWithNestedOverrides').should('have.css', 'background-color', 'rgb(255, 0, 0)');
      cy.get('#componentWithNestedOverrides #ChildFlex3').should('have.css', 'background-color', 'rgb(0, 128, 0)');
      cy.get('#componentWithNestedOverrides #ChildChildFlex1').should('have.css', 'background-color', 'rgb(0, 0, 255)');
    });
  });

  describe('Generated Themes', () => {
    it('Successfully decorates the app', () => {
      // amplify-ui theming converts hex color to rgb
      cy.get('p.amplify-text').should('have.css', 'color', 'rgb(0, 128, 128)');
    });
  });
});
