describe('Complex Components', () => {
  it('Successfully opens the app', () => {
    cy.visit('http://localhost:3000/complex-tests');
  });

  it('Complex 1', () => {
    cy.visit('http://localhost:3000/complex-tests');
    cy.get('#complex-test-1').within(() => {
      cy.get('.amplify-flex')
        .should(
          'have.attr',
          'style',
          // eslint-disable-next-line max-len
          'align-items: flex-start; background-color: rgb(255, 255, 255); flex-direction: row; gap: 10px; overflow: hidden; padding: 34px 56px; position: relative;',
        )
        .within(() => {
          cy.get('.amplify-text').should(
            'have.attr',
            'style',
            // eslint-disable-next-line max-len
            'color: rgb(0, 0, 0); font-family: Roboto; font-size: 12px; font-weight: 400; height: 14px; line-height: 14.0625px; padding: 0px; position: relative; text-align: left; width: 52px;',
          );
          cy.get('.amplify-text').should('have.text', 'Hi harriso');
        });
    });
  });

  it('Complex 2', () => {
    cy.visit('http://localhost:3000/complex-tests');
    cy.get('#complex-test-2').within(() => {
      cy.get('.amplify-flex')
        .should(
          'have.attr',
          'style',
          // eslint-disable-next-line max-len
          'align-items: flex-start; background-color: rgb(255, 255, 255); flex-direction: row; gap: 0px; height: 289px; padding: 0px; position: relative; width: 153px;',
        )
        .within(() => {
          cy.get('.amplify-flex')
            .should(
              'have.attr',
              'style',
              // eslint-disable-next-line max-len
              'align-self: stretch; flex-direction: column; gap: 10px; height: 100%; overflow: hidden; padding: 10px; position: relative; width: 100%;',
            )
            .within(() => {
              cy.get('div')
                .eq(0)
                .should(
                  'have.attr',
                  'style',
                  'background-color: rgb(255, 0, 0); height: 125px; padding: 0px; position: relative; width: 123px;',
                )
                .should(
                  'have.attr',
                  'src',
                  'https://via.placeholder.com/153x289?text=Amplify+FrontendManager+is+Awesome!',
                );
              cy.get('div')
                .eq(1)
                .should(
                  'have.attr',
                  'style',
                  'background-color: rgb(219, 255, 0); height: 122px; padding: 0px; position: relative; width: 123px;',
                )
                .should(
                  'have.attr',
                  'src',
                  'https://via.placeholder.com/153x289?text=Amplify+FrontendManager+is+Awesome!',
                );
            });
        });
    });
  });

  it('Complex 3', () => {
    cy.visit('http://localhost:3000/complex-tests');
    cy.get('#complex-test-3').within(() => {
      cy.get('.amplify-flex')
        .should(
          'have.attr',
          'style',
          // eslint-disable-next-line max-len
          'align-items: center; background-color: rgb(255, 255, 255); flex-direction: column; gap: 80px; justify-content: center; overflow: hidden; padding: 20px; position: relative;',
        )
        .within(() => {
          cy.get('.amplify-text')
            .eq(0)
            .should(
              'have.attr',
              'style',
              // eslint-disable-next-line max-len
              'color: rgb(0, 0, 0); font-family: Inter; font-size: 24px; font-weight: 400; height: 29px; line-height: 28.8px; padding: 0px; position: relative; text-align: left; width: 146px;',
            )
            .should('have.text', 'Hello World!');

          cy.get('div')
            .should('have.attr', 'src', 'https://via.placeholder.com/430x452?text=Amplify+FrontendManager+is+Awesome!')
            .should(
              'have.attr',
              'style',
              'background-color: rgb(196, 196, 196); height: 69px; padding: 0px; position: relative; width: 390px;',
            );
          cy.get('.amplify-button')
            .should('have.attr', 'data-fullwidth', 'false')
            .should('have.attr', 'type', 'button')
            .should('have.attr', 'style', 'height: 45px; width: 293px;');

          cy.get('.amplify-text')
            .eq(1)
            .should(
              'have.attr',
              'style',
              // eslint-disable-next-line max-len
              'color: rgb(0, 0, 0); font-family: Inter; font-size: 24px; font-weight: 400; height: 29px; line-height: 28.8px; padding: 0px; position: relative; text-align: left; width: 138px;',
            )
            .should('have.text', 'Testing 123');
        });
    });
  });

  it('Complex 4', () => {
    cy.visit('http://localhost:3000/complex-tests');
    cy.get('#complex-test-4').within(() => {
      cy.get('.amplify-flex')
        .should(
          'have.attr',
          'style',
          // eslint-disable-next-line max-len
          'align-items: flex-start; background-color: rgb(255, 255, 255); flex-direction: row; gap: 10px; overflow: hidden; padding: 10px; position: relative;',
        )
        .within(() => {
          cy.get('.amplify-flex')
            .should('have.attr', 'style', 'height: 123px; padding: 0px; position: relative; width: 323px;')
            .within(() => {
              cy.get('div')
                .eq(0)
                .should(
                  'have.attr',
                  'src',
                  'https://via.placeholder.com/323x123?text=Amplify+FrontendManager+is+Awesome!',
                )
                .should(
                  'have.attr',
                  'style',
                  // eslint-disable-next-line max-len
                  'background-color: rgb(36, 0, 255); height: 123px; left: 0px; padding: 0px; position: absolute; top: 0px; width: 122px;',
                );
              cy.get('div')
                .eq(1)
                .should(
                  'have.attr',
                  'src',
                  'https://via.placeholder.com/323x123?text=Amplify+FrontendManager+is+Awesome!',
                )
                .should(
                  'have.attr',
                  'style',
                  // eslint-disable-next-line max-len
                  'background-color: rgb(0, 255, 25); height: 122px; left: 203px; padding: 0px; position: absolute; top: 1px; width: 120px;',
                );
            });
        });
    });
  });

  it('Complex 5', () => {
    cy.visit('http://localhost:3000/complex-tests');
    cy.get('#complex-test-5').within(() => {
      cy.get('.amplify-flex')
        .should(
          'have.attr',
          'style',
          // eslint-disable-next-line max-len
          'align-items: flex-start; background-color: rgb(255, 255, 255); flex-direction: row; gap: 0px; padding: 0px; position: relative;',
        )
        .within(() => {
          cy.get('div')
            .eq(0)
            .should('have.attr', 'src', 'https://via.placeholder.com/240x120?text=Amplify+FrontendManager+is+Awesome!')
            .should(
              'have.attr',
              'style',
              'background-color: rgb(36, 0, 255); height: 120px; padding: 0px; position: relative; width: 120px;',
            );
          cy.get('div')
            .eq(1)
            .should('have.attr', 'src', 'https://via.placeholder.com/240x120?text=Amplify+FrontendManager+is+Awesome!')
            .should(
              'have.attr',
              'style',
              'background-color: rgb(0, 255, 25); height: 120px; padding: 0px; position: relative; width: 120px;',
            );
        });
    });
  });

  it('Complex 6', () => {
    cy.visit('http://localhost:3000/complex-tests');
    cy.get('#complex-test-6').within(() => {
      cy.get('.amplify-flex')
        .should(
          'have.attr',
          'style',
          // eslint-disable-next-line max-len
          'background-color: rgb(255, 255, 255); flex-direction: column; gap: 22px; overflow: hidden; padding: 21px 42px; position: relative;',
        )
        .within(() => {
          cy.get('.amplify-text')
            .eq(0)
            .should(
              'have.attr',
              'style',
              // eslint-disable-next-line max-len
              'color: rgb(0, 0, 0); font-family: Inter; font-size: 24px; font-weight: 700; height: 29px; line-height: 28.125px; padding: 0px; position: relative; text-align: left; width: 68px;',
            )
            .should('have.text', 'Name');

          cy.get('.amplify-text')
            .eq(1)
            .should(
              'have.attr',
              'style',
              // eslint-disable-next-line max-len
              'color: rgb(0, 0, 0); font-family: Roboto; font-size: 12px; font-weight: 400; height: 14px; line-height: 14.0625px; padding: 0px; position: relative; text-align: left; width: 83px;',
            )
            .should('have.text', 'Price / Address');

          cy.get('.amplify-text')
            .eq(2)
            .should(
              'have.attr',
              'style',
              // eslint-disable-next-line max-len
              'color: rgb(0, 0, 0); font-family: Roboto; font-size: 12px; font-weight: 400; height: 14px; line-height: 14.0625px; padding: 0px; position: relative; text-align: left; width: 23px;',
            )
            .should('have.text', 'Sqft');
        });
    });
  });

  it('Complex 7', () => {
    cy.visit('http://localhost:3000/complex-tests');
    cy.get('#complex-test-7').within(() => {
      cy.get('div')
        .should('have.attr', 'style', 'height: 192px; padding: 0px; position: relative; width: 401px;')
        .within(() => {
          cy.get('img')
            .eq(0)
            .should(
              'have.attr',
              'style',
              // eslint-disable-next-line max-len
              'border: 4px solid rgb(0, 0, 0); border-radius: 45px; height: 196px; left: 254.151px; padding: 0px; position: absolute; top: 0px; width: 150.849px;',
            )
            .should('have.attr', 'src', 'https://via.placeholder.com/401x192?text=Amplify+FrontendManager+is+Awesome!')
            .should('have.attr', 'alt', 'Amplify FrontendManager is Awesome!');

          cy.get('.amplify-text')
            .should(
              'have.attr',
              'style',
              // eslint-disable-next-line max-len
              'color: rgb(0, 0, 0); font-family: Inter; font-size: 24px; font-weight: 400; height: 27.84px; left: 187.401px; line-height: 28.8px; padding: 0px; position: absolute; text-align: left; top: 0px; width: 54.4267px;',
            )
            .should('have.text', 'Test');

          cy.get('img')
            .eq(1)
            .should(
              'have.attr',
              'style',
              // eslint-disable-next-line max-len
              'border: 4px solid rgb(0, 0, 0); border-radius: 27px; height: 189.088px; left: 0px; padding: 0px; position: absolute; top: 0px; width: 169.423px;',
            )
            .should('have.attr', 'src', 'https://via.placeholder.com/401x192?text=Amplify+FrontendManager+is+Awesome!')
            .should('have.attr', 'alt', 'Amplify FrontendManager is Awesome!');
        });
    });
  });

  it('Complex 8', () => {
    cy.visit('http://localhost:3000/complex-tests');
    cy.get('#complex-test-8').within(() => {
      cy.get('.amplify-flex')
        .should(
          'have.attr',
          'style',
          // eslint-disable-next-line max-len
          'align-items: flex-start; background-color: rgb(255, 255, 255); flex-direction: row; gap: 0px; height: 243px; padding: 0px; position: relative; width: 145px;',
        )
        .within(() => {
          cy.get('.amplify-flex')
            .should(
              'have.attr',
              'style',
              'flex-direction: column; gap: 0px; height: 723px; padding: 0px; position: relative; width: 472px;',
            )
            .within(() => {
              cy.get('div')
                .eq(0)
                .should(
                  'have.attr',
                  'style',
                  'background-color: rgb(219, 255, 0); height: 119px; padding: 0px; position: relative; width: 145px;',
                )
                .should(
                  'have.attr',
                  'src',
                  'https://via.placeholder.com/472x723?text=Amplify+FrontendManager+is+Awesome!',
                );
              cy.get('div')
                .eq(1)
                .should(
                  'have.attr',
                  'style',
                  'background-color: rgb(255, 0, 0); height: 124px; padding: 0px; position: relative; width: 145px;',
                )
                .should(
                  'have.attr',
                  'src',
                  'https://via.placeholder.com/472x723?text=Amplify+FrontendManager+is+Awesome!',
                );
            });
        });
    });
  });
});
