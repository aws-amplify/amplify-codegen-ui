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
import { setupAuthAttributeIntercept } from '../utils/form';

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
  beforeEach(() => {
    setupAuthAttributeIntercept();
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

      it('Renders Button text as a concatenated, auth element', () => {
        cy.get('#concat-and-conditional').contains('Harry Callahan TestUser');
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
      cy.get('#variant4').should('have.css', 'font-size', '15px');
      cy.get('#variant4').contains('ComponentWithVariantWithMappedChildrenProp');
      cy.get('#variant5').contains('ComponentWithVariantWithChildrenProp');
      cy.get('#variant5').should('have.css', 'font-size', '16px');
      cy.get('#variant6').contains('Nice view!! 🏔');
    });

    it('should have rest props override variant values', () => {
      cy.get('#variantWithRest').should('have.css', 'font-size', '10px');
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

      describe('Auth Binding', () => {
        it('Renders if user data is not available', () => {
          cy.get('#authBinding [alt="User Image"]');
        });

        it('Renders user data if available', () => {
          cy.get('#data-binding').within(() => {
            cy.contains('TestUser');
            cy.contains('Mint Chip');
          });
        });
      });

      describe('Multiple Data Bindings', () => {
        it('Renders data from both bound data models', () => {
          cy.get('#multipleDataBindings').contains('QA - 2200');
        });
      });
    });

    describe('Slot Binding', () => {
      it('Renders component passed into the slot, overriding nested components', () => {
        cy.get('#slotBinding').within(() => {
          cy.contains('Customer component');
          cy.contains('Nested child text').should('not.exist');
        });
      });
    });
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

    it('It renders searchable collections', () => {
      cy.get('#searchableCollection').contains('Mountain Retreat - $1800');
      cy.get('input[placeholder="Type to search"]').type('Cabin');
      cy.get('#searchableCollection').contains('Mountain Retreat - $1800').should('not.exist');
      cy.get('#searchableCollection').contains('Cabin in the Woods - $600/night');
    });

    it('Supports overrideItems with context injection', () => {
      cy.get('#collectionWithOverrideItems').contains('0 - Doodle, Yankee');
      cy.get('#collectionWithOverrideItems').contains('1 - Cap, Feather');
    });

    it('Supports overrideItems that return JSX.Element prop values', () => {
      cy.get('#collectionWithJSXOverrideItems').within(() => {
        cy.contains('Yankee');
        cy.contains('Doodle');
        cy.contains('Feather');
        cy.contains('Cap');
      });
    });

    it('Supports hasOne, belongsTo, and hasMany relationships', () => {
      cy.get('#collectionWithCompositeKeysAndRelationships').within(() => {
        cy.contains('Ruca');
        cy.contains('Owner: Erica');
        cy.contains('Bowl: round');
        cy.contains('Toys: stick, ball');
      });
    });

    it('Supports between predicates', () => {
      cy.get('#collectionWithBetweenPredicate').within(() => {
        cy.contains('Real');
        cy.contains('Last');
        cy.contains('Another').should('not.exist');
        cy.contains('Too Young').should('not.exist');
      });
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

  describe('Reserved Keywords', () => {
    it('renders with reseverd keywords props', () => {
      cy.get('#reserved-keywords').find('.amplify-text').should('have.text', 'biology');
    });
  });
});
