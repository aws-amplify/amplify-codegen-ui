describe('Generated Components', () => {
  describe('Sanity Test', () => {
    it('Successfully opens the app', () => {
      cy.visit('http://localhost:3000/');
    });
  });

  describe('Basic Components', () => {
    it('Renders Badge component', () => {
      cy.visit('http://localhost:3000/component-tests');
      cy.get('#basic-components').contains('Basic Component Badge');
    });

    it('Renders View component', () => {
      cy.visit('http://localhost:3000/component-tests');
      cy.get('#basic-components').contains('Basic Component View');
    });

    it('Renders Button component', () => {
      cy.visit('http://localhost:3000/component-tests');
      cy.get('#basic-components').contains('Basic Component Button');
    });

    it('Renders Card component', () => {
      cy.visit('http://localhost:3000/component-tests');
      cy.get('#basic-components').contains('Basic Component Card');
    });

    it('Renders Collection component', () => {
      cy.visit('http://localhost:3000/component-tests');
      cy.get('#basic-components').find('p:contains("Basic Collection Card Text")').should('have.length', 2);
    });

    it('Renders Divider component', () => {
      cy.visit('http://localhost:3000/component-tests');
      cy.get('#basic-components').find('.amplify-divider');
    });

    it('Renders Flex component', () => {
      cy.visit('http://localhost:3000/component-tests');
      cy.get('#basic-components').find('.amplify-flex').contains('Basic Component Flex');
    });

    it('Renders Image component', () => {
      cy.visit('http://localhost:3000/component-tests');
      cy.get('#basic-components').find('img');
    });

    it('Renders Text component', () => {
      cy.visit('http://localhost:3000/component-tests');
      cy.get('#basic-components').contains('Basic Component Text');
    });

    it('Renders Custom component', () => {
      cy.visit('http://localhost:3000/component-tests');
      cy.get('#basic-components').find('.amplify-rating');
    });
  });

  describe('Generated Components', () => {
    describe('Concatenated Data', () => {
      it('Renders Button text as a concatenated, bound element', () => {
        cy.visit('http://localhost:3000/component-tests');
        cy.get('#concat-and-conditional').contains('Harry Callahan');
      });

      it('Renders Button text as a concatenated, bound element, with overrides', () => {
        cy.visit('http://localhost:3000/component-tests');
        cy.get('#concat-and-conditional').contains('Norm Gunderson');
      });
    });

    describe('Conditional Data', () => {
      it('Renders Button with one background when user is logged in', () => {
        cy.visit('http://localhost:3000/component-tests');
        cy.get('#concat-and-conditional').get('#conditional1').should('have.css', 'background-color', 'rgb(255, 0, 0)');
      });

      it('Renders Button with a different background when user is not logged in', () => {
        cy.visit('http://localhost:3000/component-tests');
        cy.get('#concat-and-conditional').get('#conditional2').should('have.css', 'background-color', 'rgb(0, 0, 255)');
      });

      it('Renders Button disabled when user is not logged in', () => {
        cy.visit('http://localhost:3000/component-tests');
        cy.get('#concat-and-conditional').get('#conditional2').get('[disabled]');
      });
    });
  });

  describe('Component Variants', () => {
    it('Renders Button disabled when user is not logged in', () => {
      cy.visit('http://localhost:3000/component-tests');
      cy.get('#variants').get('#variant1').should('have.css', 'font-size', '12px');
      cy.get('#variants').get('#variant2').should('have.css', 'font-size', '40px');
      cy.get('#variants').get('#variant3').should('have.css', 'width', '500px');
    });
  });

  describe('Data Binding', () => {
    describe('Simple Property Binding', () => {
      it('Renders the Bound property', () => {
        cy.visit('http://localhost:3000/component-tests');
        cy.get('#data-binding').get('#simplePropIsDisabled').get('[disabled]');
      });
    });

    describe('DataStore Binding Without Predicate', () => {
      it('Renders with and without overrides', () => {
        cy.visit('http://localhost:3000/component-tests');
        cy.get('#data-binding').get('#dataStoreBindingWithoutPredicateNoOverride').contains('Al');
        cy.get('#data-binding').get('#dataStoreBindingWithoutPredicateWithOverride').contains('Override Name');
      });
    });

    describe('DataStore Binding With Predicate', () => {
      it('Renders with and without overrides', () => {
        cy.visit('http://localhost:3000/component-tests');
        cy.get('#data-binding').get('#dataStoreBindingWithPredicateNoOverrideNoModel').contains('Buddy');
        cy.get('#data-binding').get('#dataStoreBindingWithPredicateWithOverride').contains('Override Name');
      });

      it('Renders with wired data model', () => {
        // TODO: Implement me.
      });
    });
  });

  describe('Action Binding', () => {
    // TODO: Write Action Binding Cases
  });

  describe('Collections', () => {
    it('It renders a list of override values', () => {
      cy.visit('http://localhost:3000/component-tests');
      cy.get('#collections').get('#collectionWithBindingAndOverrides button').eq(0).contains('Yankee');
      cy.get('#collections').get('#collectionWithBindingAndOverrides button').eq(1).contains('Feather');
    });

    it('It renders data pulled from local datastore', () => {
      cy.visit('http://localhost:3000/component-tests');
      cy.get('#collections').get('#collectionWithBindingNoOverrides button').eq(0).contains('Real');
      cy.get('#collections').get('#collectionWithBindingNoOverrides button').eq(1).contains('Another');
      cy.get('#collections').get('#collectionWithBindingNoOverrides button').eq(2).contains('Last');
    });

    it('It respects sort functionality', () => {
      cy.visit('http://localhost:3000/component-tests');
      cy.get('#collections').get('#collectionWithSort button').eq(0).contains('LUser1');
      cy.get('#collections').get('#collectionWithSort button').eq(1).contains('LUser2');
      cy.get('#collections').get('#collectionWithSort button').eq(2).contains('LUser3');
    });
  });

  describe('Default Value', () => {
    it('Renders simple property binding default value', () => {
      cy.get('#default-value')
        .get('#bound-simple-binding-default')
        .invoke('text')
        .then((text) => {
          expect(text.trim()).equal('Default Binding Property');
        });
    });

    it('Overrides simple property binding default value', () => {
      cy.get('#default-value')
        .get('#bound-simple-binding-override')
        .invoke('text')
        .then((text) => {
          expect(text.trim()).equal('Override Simple Binding');
        });
    });

    it('Renders bound default value', () => {
      cy.get('#default-value')
        .get('#bound-default')
        .invoke('text')
        .then((text) => {
          expect(text.trim()).equal('Bound Default');
        });
    });

    it('Overrides bound default value', () => {
      cy.get('#default-value')
        .get('#bound-override')
        .invoke('text')
        .then((text) => {
          expect(text.trim()).equal('Override Bound');
        });
    });

    it('Renders simple default value when simple and bound', () => {
      cy.get('#default-value')
        .get('#simple-and-bound-default')
        .invoke('text')
        .then((text) => {
          expect(text.trim()).equal('Simple Double Default');
        });
    });

    it('Overrides simple and bound default value', () => {
      cy.get('#default-value')
        .get('#simple-and-bound-override')
        .invoke('text')
        .then((text) => {
          expect(text.trim()).equal('Override Simple And Bound');
        });
    });

    it('Renders collection default value', () => {
      cy.get('#default-value')
        .get('#collection-default')
        .find('.amplify-text')
        .invoke('text')
        .then((text) => {
          expect(text.trim()).equal('Collection Default');
        });
    });

    it('Overrides collection default value', () => {
      cy.get('#default-value')
        .get('#collection-override')
        .find('.amplify-text')
        .invoke('text')
        .then((text) => {
          expect(text.trim()).equal('Override Collection');
        });
    });
  });

  describe('Parsed Fixed Property Values', () => {
    it('String Value', () => {
      cy.visit('http://localhost:3000/component-tests');
      cy.get('#parsed-fixed-values')
        .find('#string-value')
        .should('have.attr', 'value')
        .should('equal', 'raw string value');
    });

    // string and parsed number values are represented the same in HTML. Snapshot tests cover differences.
    it('String Number Value', () => {
      cy.visit('http://localhost:3000/component-tests');
      cy.get('#parsed-fixed-values').find('#string-number-value').should('have.attr', 'value').should('equal', '67548');
    });

    it('Parsed Number Value', () => {
      cy.visit('http://localhost:3000/component-tests');
      cy.get('#parsed-fixed-values').find('#parsed-number-value').should('have.attr', 'value').should('equal', '67548');
    });

    // string and parsed boolean values are represented the same in HTML. Snapshot tests cover differences.
    it('String Boolean Value', () => {
      cy.visit('http://localhost:3000/component-tests');
      cy.get('#parsed-fixed-values').find('#string-boolean-value').should('have.attr', 'value').should('equal', 'true');
    });

    it('Parsed Boolean Value', () => {
      cy.visit('http://localhost:3000/component-tests');
      cy.get('#parsed-fixed-values').find('#parsed-boolean-value').should('have.attr', 'value').should('equal', 'true');
    });

    it('String JSON Value', () => {
      cy.visit('http://localhost:3000/component-tests');
      cy.get('#parsed-fixed-values')
        .find('#string-json-value')
        .should('have.attr', 'value')
        .should('equal', '{"foo": "bar"}');
    });

    it('Parsed JSON Value', () => {
      cy.visit('http://localhost:3000/component-tests');
      cy.get('#parsed-fixed-values')
        .find('#parsed-json-value')
        .should('have.attr', 'value')
        .should('equal', '[object Object]'); // shows that object was parsed
    });

    it('String Array Value', () => {
      cy.visit('http://localhost:3000/component-tests');
      cy.get('#parsed-fixed-values')
        .find('#string-array-value')
        .should('have.attr', 'value')
        .should('equal', '[1,2,3]');
    });

    it('Parsed Array Value', () => {
      cy.visit('http://localhost:3000/component-tests');
      // no brackets indicates array was parsed
      cy.get('#parsed-fixed-values').find('#parsed-array-value').should('have.attr', 'value').should('equal', '1,2,3');
    });

    it('String Null Value', () => {
      cy.visit('http://localhost:3000/component-tests');
      cy.get('#parsed-fixed-values').find('#string-null-value').should('have.attr', 'value').should('equal', 'null');
    });

    it('Parsed Null Value', () => {
      cy.visit('http://localhost:3000/component-tests');
      cy.get('#parsed-fixed-values').find('#parsed-null-value').should('have.attr', 'value').should('be.empty');
    });
  });
});

describe('Generated Themes', () => {
  it('Successfully decorates the app', () => {
    cy.visit('http://localhost:3000/component-tests');
    // amplify-ui theming converts hex color to rgb
    cy.get('p.amplify-text').should('have.css', 'color', 'rgb(0, 128, 128)');
  });
});
