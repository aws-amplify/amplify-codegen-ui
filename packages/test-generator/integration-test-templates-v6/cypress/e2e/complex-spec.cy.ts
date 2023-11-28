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
describe('Complex Components', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/complex-tests');
  });

  it('Complex 1', () => {
    cy.get('#complex-test-1').within(() => {
      cy.get('.amplify-flex')
        .then((el) => {
          const style = el.attr('style');
          const expectedStyles = [
            'align-items: flex-start',
            'background-color: rgb(255, 255, 255)',
            'flex-direction: row',
            'gap: 10px',
            'overflow: hidden',
            'padding: 34px 56px',
            'position: relative',
          ];
          expect(style.split('; ')).to.have.length(expectedStyles.length);
          expectedStyles.forEach((expected) => {
            expect(style).to.include(expected);
          });
        })
        .within(() => {
          cy.get('.amplify-text').then((el) => {
            const style = el.attr('style');
            const expectedStyles = [
              'color: rgb(0, 0, 0)',
              'font-family: Roboto',
              'font-size: 12px',
              'font-weight: 400',
              'height: 14px',
              'line-height: 14.0625px',
              'padding: 0px',
              'position: relative',
              'text-align: left',
              'width: 52px',
            ];
            expect(style.split('; ')).to.have.length(expectedStyles.length);
            expectedStyles.forEach((expected) => {
              expect(style).to.include(expected);
            });
          });
          cy.get('.amplify-text').should('have.text', 'Hi harriso');
        });
    });
  });

  it('Complex 2', () => {
    cy.get('#complex-test-2').within(() => {
      cy.get('.amplify-flex')
        .first()
        .then((el) => {
          const style = el.attr('style');
          const expectedStyles = [
            'align-items: flex-start',
            'background-color: rgb(255, 255, 255)',
            'flex-direction: row',
            'gap: 0px',
            'height: 289px',
            'padding: 0px',
            'position: relative',
            'width: 153px',
          ];
          expect(style.split('; ')).to.have.length(expectedStyles.length);
          expectedStyles.forEach((expected) => {
            expect(style).to.include(expected);
          });
        })
        .within(() => {
          cy.get('.amplify-flex')
            .then((el) => {
              const style = el.attr('style');
              const expectedStyles = [
                'align-self: stretch',
                'flex-direction: column',
                'gap: 10px',
                'height: 100%',
                'overflow: hidden',
                'padding: 10px',
                'position: relative',
                'width: 100%',
              ];
              expect(style.split('; ')).to.have.length(expectedStyles.length);
              expectedStyles.forEach((expected) => {
                expect(style).to.include(expected);
              });
            })
            .within(() => {
              cy.get('div')
                .eq(0)
                .then((el) => {
                  const style = el.attr('style');
                  const expectedStyles = [
                    'background-color: rgb(255, 0, 0)',
                    'height: 125px',
                    'padding: 0px',
                    'position: relative',
                    'width: 123px',
                  ];
                  expect(style.split('; ')).to.have.length(expectedStyles.length);
                  expectedStyles.forEach((expected) => {
                    expect(style).to.include(expected);
                  });
                })
                .should('have.attr', 'src', 'https://via.placeholder.com/153x289?text=Amplify+Studio+is+Awesome!');
              cy.get('div')
                .eq(1)
                .then((el) => {
                  const style = el.attr('style');
                  const expectedStyles = [
                    'background-color: rgb(219, 255, 0)',
                    'height: 122px',
                    'padding: 0px',
                    'position: relative',
                    'width: 123px',
                  ];
                  expect(style.split('; ')).to.have.length(expectedStyles.length);
                  expectedStyles.forEach((expected) => {
                    expect(style).to.include(expected);
                  });
                })
                .should('have.attr', 'src', 'https://via.placeholder.com/153x289?text=Amplify+Studio+is+Awesome!');
            });
        });
    });
  });

  it('Complex 3', () => {
    cy.get('#complex-test-3').within(() => {
      cy.get('.amplify-flex')
        .then((el) => {
          const style = el.attr('style');
          const expectedStyles = [
            'align-items: center',
            'background-color: rgb(255, 255, 255)',
            'flex-direction: column',
            'gap: 80px',
            'justify-content: center',
            'overflow: hidden',
            'padding: 20px',
            'position: relative',
          ];
          expect(style.split('; ')).to.have.length(expectedStyles.length);
          expectedStyles.forEach((expected) => {
            expect(style).to.include(expected);
          });
        })
        .within(() => {
          cy.get('.amplify-text')
            .eq(0)
            .then((el) => {
              const style = el.attr('style');
              const expectedStyles = [
                'color: rgb(0, 0, 0)',
                'font-family: Inter',
                'font-size: 24px',
                'font-weight: 400',
                'height: 29px',
                'line-height: 28.8px',
                'padding: 0px',
                'position: relative',
                'text-align: left',
                'width: 146px',
              ];
              expect(style.split('; ')).to.have.length(expectedStyles.length);
              expectedStyles.forEach((expected) => {
                expect(style).to.include(expected);
              });
            })
            .should('have.text', 'Hello World!');

          cy.get('div')
            .should('have.attr', 'src', 'https://via.placeholder.com/430x452?text=Amplify+Studio+is+Awesome!')
            .then((el) => {
              const style = el.attr('style');
              const expectedStyles = [
                'background-color: rgb(196, 196, 196)',
                'height: 69px',
                'padding: 0px',
                'position: relative',
                'width: 390px',
              ];
              expect(style.split('; ')).to.have.length(expectedStyles.length);
              expectedStyles.forEach((expected) => {
                expect(style).to.include(expected);
              });
            });
          cy.get('.amplify-button')
            .should('have.attr', 'type', 'button')
            .then((el) => {
              const style = el.attr('style');
              const expectedStyles = ['height: 45px', 'width: 293px'];
              expect(style.split('; ')).to.have.length(expectedStyles.length);
              expectedStyles.forEach((expected) => {
                expect(style).to.include(expected);
              });
            });
          cy.get('.amplify-text')
            .eq(1)
            .then((el) => {
              const style = el.attr('style');
              const expectedStyles = [
                'color: rgb(0, 0, 0)',
                'font-family: Inter',
                'font-size: 24px',
                'font-weight: 400',
                'height: 29px',
                'line-height: 28.8px',
                'padding: 0px',
                'position: relative',
                'text-align: left',
                'width: 138px',
              ];
              expect(style.split('; ')).to.have.length(expectedStyles.length);
              expectedStyles.forEach((expected) => {
                expect(style).to.include(expected);
              });
            })
            .should('have.text', 'Testing 123');
        });
    });
  });

  it('Complex 4', () => {
    cy.get('#complex-test-4').within(() => {
      cy.get('.amplify-flex')
        .first()
        .then((el) => {
          const style = el.attr('style');
          const expectedStyles = [
            'align-items: flex-start',
            'background-color: rgb(255, 255, 255)',
            'flex-direction: row',
            'gap: 10px',
            'overflow: hidden',
            'padding: 10px',
            'position: relative',
          ];
          expect(style.split('; ')).to.have.length(expectedStyles.length);
          expectedStyles.forEach((expected) => {
            expect(style).to.include(expected);
          });
        })
        .within(() => {
          cy.get('.amplify-flex')
            .then((el) => {
              const style = el.attr('style');
              const expectedStyles = ['height: 123px', 'padding: 0px', 'position: relative', 'width: 323px'];
              expect(style.split('; ')).to.have.length(expectedStyles.length);
              expectedStyles.forEach((expected) => {
                expect(style).to.include(expected);
              });
            })
            .within(() => {
              cy.get('div')
                .eq(0)
                .should('have.attr', 'src', 'https://via.placeholder.com/323x123?text=Amplify+Studio+is+Awesome!')
                .then((el) => {
                  const style = el.attr('style');
                  const expectedStyles = [
                    'background-color: rgb(36, 0, 255)',
                    'height: 123px',
                    'left: 0px',
                    'padding: 0px',
                    'position: absolute',
                    'top: 0px',
                    'width: 122px',
                  ];
                  expect(style.split('; ')).to.have.length(expectedStyles.length);
                  expectedStyles.forEach((expected) => {
                    expect(style).to.include(expected);
                  });
                });
              cy.get('div')
                .eq(1)
                .should('have.attr', 'src', 'https://via.placeholder.com/323x123?text=Amplify+Studio+is+Awesome!')
                .then((el) => {
                  const style = el.attr('style');
                  const expectedStyles = [
                    'background-color: rgb(0, 255, 25)',
                    'height: 122px',
                    'left: 203px',
                    'padding: 0px',
                    'position: absolute',
                    'top: 1px',
                    'width: 120px',
                  ];
                  expect(style.split('; ')).to.have.length(expectedStyles.length);
                  expectedStyles.forEach((expected) => {
                    expect(style).to.include(expected);
                  });
                });
            });
        });
    });
  });

  it('Complex 5', () => {
    cy.get('#complex-test-5').within(() => {
      cy.get('.amplify-flex')
        .then((el) => {
          const style = el.attr('style');
          const expectedStyles = [
            'align-items: flex-start',
            'background-color: rgb(255, 255, 255)',
            'flex-direction: row',
            'gap: 0px',
            'padding: 0px',
            'position: relative',
          ];
          expect(style.split('; ')).to.have.length(expectedStyles.length);
          expectedStyles.forEach((expected) => {
            expect(style).to.include(expected);
          });
        })
        .within(() => {
          cy.get('div')
            .eq(0)
            .should('have.attr', 'src', 'https://via.placeholder.com/240x120?text=Amplify+Studio+is+Awesome!')
            .then((el) => {
              const style = el.attr('style');
              const expectedStyles = [
                'background-color: rgb(36, 0, 255)',
                'height: 120px',
                'padding: 0px',
                'position: relative',
                'width: 120px',
              ];
              expect(style.split('; ')).to.have.length(expectedStyles.length);
              expectedStyles.forEach((expected) => {
                expect(style).to.include(expected);
              });
            });
          cy.get('div')
            .eq(1)
            .should('have.attr', 'src', 'https://via.placeholder.com/240x120?text=Amplify+Studio+is+Awesome!')
            .then((el) => {
              const style = el.attr('style');
              const expectedStyles = [
                'background-color: rgb(0, 255, 25)',
                'height: 120px',
                'padding: 0px',
                'position: relative',
                'width: 120px',
              ];
              expect(style.split('; ')).to.have.length(expectedStyles.length);
              expectedStyles.forEach((expected) => {
                expect(style).to.include(expected);
              });
            });
        });
    });
  });

  it('Complex 6', () => {
    cy.get('#complex-test-6').within(() => {
      cy.get('.amplify-flex')
        .then((el) => {
          const style = el.attr('style');
          const expectedStyles = [
            'background-color: rgb(255, 255, 255)',
            'flex-direction: column',
            'gap: 22px',
            'overflow: hidden',
            'padding: 21px 42px',
            'position: relative',
          ];
          expect(style.split('; ')).to.have.length(expectedStyles.length);
          expectedStyles.forEach((expected) => {
            expect(style).to.include(expected);
          });
        })
        .within(() => {
          cy.get('.amplify-text')
            .eq(0)
            .then((el) => {
              const style = el.attr('style');
              const expectedStyles = [
                'color: rgb(0, 0, 0)',
                'font-family: Inter',
                'font-size: 24px',
                'font-weight: 700',
                'height: 29px',
                'line-height: 28.125px',
                'padding: 0px',
                'position: relative',
                'text-align: left',
                'width: 68px',
              ];
              expect(style.split('; ')).to.have.length(expectedStyles.length);
              expectedStyles.forEach((expected) => {
                expect(style).to.include(expected);
              });
            })
            .should('have.text', 'Name');

          cy.get('.amplify-text')
            .eq(1)
            .then((el) => {
              const style = el.attr('style');
              const expectedStyles = [
                'color: rgb(0, 0, 0)',
                'font-family: Roboto',
                'font-size: 12px',
                'font-weight: 400',
                'height: 14px',
                'line-height: 14.0625px',
                'padding: 0px',
                'position: relative',
                'text-align: left',
                'width: 83px',
              ];
              expect(style.split('; ')).to.have.length(expectedStyles.length);
              expectedStyles.forEach((expected) => {
                expect(style).to.include(expected);
              });
            })
            .should('have.text', 'Price / Address');

          cy.get('.amplify-text')
            .eq(2)
            .then((el) => {
              const style = el.attr('style');
              const expectedStyles = [
                'color: rgb(0, 0, 0)',
                'font-family: Roboto',
                'font-size: 12px',
                'font-weight: 400',
                'height: 14px',
                'line-height: 14.0625px',
                'padding: 0px',
                'position: relative',
                'text-align: left',
                'width: 23px',
              ];
              expect(style.split('; ')).to.have.length(expectedStyles.length);
              expectedStyles.forEach((expected) => {
                expect(style).to.include(expected);
              });
            })
            .should('have.text', 'Sqft');
        });
    });
  });

  it('Complex 7', () => {
    cy.get('#complex-test-7').within(() => {
      cy.get('div')
        .then((el) => {
          const style = el.attr('style');
          const expectedStyles = ['height: 192px', 'padding: 0px', 'position: relative', 'width: 401px'];
          expect(style.split('; ')).to.have.length(expectedStyles.length);
          expectedStyles.forEach((expected) => {
            expect(style).to.include(expected);
          });
        })
        .within(() => {
          cy.get('img')
            .eq(0)
            .then((el) => {
              const style = el.attr('style');
              const expectedStyles = [
                'border: 4px solid rgb(0, 0, 0)',
                'border-radius: 45px',
                'height: 196px',
                'left: 254.151px',
                'padding: 0px',
                'position: absolute',
                'top: 0px',
                'width: 150.849px',
              ];
              expect(style.split('; ')).to.have.length(expectedStyles.length);
              expectedStyles.forEach((expected) => {
                expect(style).to.include(expected);
              });
            })
            .should('have.attr', 'src', 'https://via.placeholder.com/401x192?text=Amplify+Studio+is+Awesome!')
            .should('have.attr', 'alt', 'Amplify Studio is Awesome!');

          cy.get('.amplify-text')
            .then((el) => {
              const style = el.attr('style');
              const expectedStyles = [
                'color: rgb(0, 0, 0)',
                'font-family: Inter',
                'font-size: 24px',
                'font-weight: 400',
                'height: 27.84px',
                'left: 187.401px',
                'line-height: 28.8px',
                'padding: 0px',
                'position: absolute',
                'text-align: left',
                'top: 0px',
                'width: 54.4267px',
              ];
              expect(style.split('; ')).to.have.length(expectedStyles.length);
              expectedStyles.forEach((expected) => {
                expect(style).to.include(expected);
              });
            })
            .should('have.text', 'Test');

          cy.get('img')
            .eq(1)
            .then((el) => {
              const style = el.attr('style');
              const expectedStyles = [
                'border: 4px solid rgb(0, 0, 0)',
                'border-radius: 27px',
                'height: 189.088px',
                'left: 0px',
                'padding: 0px',
                'position: absolute',
                'top: 0px',
                'width: 169.423px',
              ];
              expect(style.split('; ')).to.have.length(expectedStyles.length);
              expectedStyles.forEach((expected) => {
                expect(style).to.include(expected);
              });
            })
            .should('have.attr', 'src', 'https://via.placeholder.com/401x192?text=Amplify+Studio+is+Awesome!')
            .should('have.attr', 'alt', 'Amplify Studio is Awesome!');
        });
    });
  });

  it('Complex 8', () => {
    cy.get('#complex-test-8').within(() => {
      cy.get('.amplify-flex')
        .first()
        .then((el) => {
          const style = el.attr('style');
          const expectedStyles = [
            'align-items: flex-start',
            'background-color: rgb(255, 255, 255)',
            'flex-direction: row',
            'gap: 0px',
            'height: 243px',
            'padding: 0px',
            'position: relative',
            'width: 145px',
          ];
          expect(style.split('; ')).to.have.length(expectedStyles.length);
          expectedStyles.forEach((expected) => {
            expect(style).to.include(expected);
          });
        })
        .within(() => {
          cy.get('.amplify-flex')
            .then((el) => {
              const style = el.attr('style');
              const expectedStyles = [
                'flex-direction: column',
                'gap: 0px',
                'height: 723px',
                'padding: 0px',
                'position: relative',
                'width: 472px',
              ];
              expect(style.split('; ')).to.have.length(expectedStyles.length);
              expectedStyles.forEach((expected) => {
                expect(style).to.include(expected);
              });
            })
            .within(() => {
              cy.get('div')
                .eq(0)
                .then((el) => {
                  const style = el.attr('style');
                  const expectedStyles = [
                    'background-color: rgb(219, 255, 0)',
                    'height: 119px',
                    'padding: 0px',
                    'position: relative',
                    'width: 145px',
                  ];
                  expect(style.split('; ')).to.have.length(expectedStyles.length);
                  expectedStyles.forEach((expected) => {
                    expect(style).to.include(expected);
                  });
                })
                .should('have.attr', 'src', 'https://via.placeholder.com/472x723?text=Amplify+Studio+is+Awesome!');
              cy.get('div')
                .eq(1)
                .then((el) => {
                  const style = el.attr('style');
                  const expectedStyles = [
                    'background-color: rgb(255, 0, 0)',
                    'height: 124px',
                    'padding: 0px',
                    'position: relative',
                    'width: 145px',
                  ];
                  expect(style.split('; ')).to.have.length(expectedStyles.length);
                  expectedStyles.forEach((expected) => {
                    expect(style).to.include(expected);
                  });
                })
                .should('have.attr', 'src', 'https://via.placeholder.com/472x723?text=Amplify+Studio+is+Awesome!');
            });
        });
    });
  });
  it('Complex 9', () => {
    cy.get('#complex-test-9').within(() => {
      cy.get('.amplify-flex')
        .first()
        .within(() => {
          cy.get('.amplify-flex')
            .then((el) => {
              const style = el.attr('style');
              const expectedStyles = [
                'align-items: center',
                'align-self: stretch',
                'background-color: rgb(0, 64, 77)',
                'flex-basis: 685px',
                'flex-direction: column',
                'gap: 10px',
                'flex-grow: 1',
                'height: 422px',
                'justify-content: center',
                'overflow: hidden',
                'padding: 120px',
                'position: relative',
              ];
              expect(style.split('; ')).to.have.length(expectedStyles.length);
              expectedStyles.forEach((expected) => {
                expect(style).to.include(expected);
              });
            })
            .first()
            .within(() => {
              cy.get('.amplify-flex')
                .then((el) => {
                  const style = el.attr('style');
                  const expectedStyles = [
                    'align-items: center',
                    'align-self: stretch',
                    'flex-direction: column',
                    'gap: 24px',
                    'justify-content: center',
                    'padding: 0px',
                    'position: relative',
                    'flex-shrink: 0',
                  ];
                  expect(style.split('; ')).to.have.length(expectedStyles.length);
                  expectedStyles.forEach((expected) => {
                    expect(style).to.include(expected);
                  });
                })
                .first()
                .within(() => {
                  cy.get('.amplify-text')
                    .contains('TestMessage1')
                    .then((el) => {
                      const style = el.attr('style');
                      const expectedStyles = [
                        'align-self: stretch',
                        'color: rgb(233, 249, 252)',
                        'flex-direction: column',
                        'display: flex',
                        'font-family: Inter',
                        'font-size: 16px',
                        'font-weight: 700',
                        'justify-content: flex-start',
                        'letter-spacing: 0.49px',
                        'line-height: 20px',
                        'padding: 0px',
                        'position: relative',
                        'flex-shrink: 0',
                        'text-align: center',
                        'width: 445px',
                      ];
                      expect(style.split('; ')).to.have.length(expectedStyles.length);
                      expectedStyles.forEach((expected) => {
                        expect(style).to.include(expected);
                      });
                    });
                  cy.get('.amplify-button').contains('TestButton1');
                  cy.get('.amplify-flex')
                    .then((el) => {
                      const style = el.attr('style');
                      const expectedStyles = [
                        'align-items: center',
                        'align-self: stretch',
                        'flex-direction: column',
                        'gap: 16px',
                        'justify-content: center',
                        'padding: 0px',
                        'position: relative',
                        'flex-shrink: 0',
                      ];
                      expect(style.split('; ')).to.have.length(expectedStyles.length);
                      expectedStyles.forEach((expected) => {
                        expect(style).to.include(expected);
                      });
                    })
                    .first()
                    .within(() => {
                      cy.get('.amplify-text')
                        .eq(0)
                        .contains('TestMessage2')
                        .then((el) => {
                          const style = el.attr('style');
                          const expectedStyles = [
                            'align-self: stretch',
                            'color: rgb(233, 249, 252)',
                            'flex-direction: column',
                            'display: flex',
                            'font-family: Inter',
                            'font-size: 40px',
                            'font-weight: 700',
                            'justify-content: flex-start',
                            'line-height: 48px',
                            'padding: 0px',
                            'position: relative',
                            'flex-shrink: 0',
                            'text-align: center',
                            'width: 445px',
                          ];
                          expect(style.split('; ')).to.have.length(expectedStyles.length);
                          expectedStyles.forEach((expected) => {
                            expect(style).to.include(expected);
                          });
                        });
                      cy.get('.amplify-text')
                        .eq(1)
                        .contains('TestMessage3')
                        .then((el) => {
                          const style = el.attr('style');
                          const expectedStyles = [
                            'align-self: stretch',
                            'color: rgb(233, 249, 252)',
                            'flex-direction: column',
                            'display: flex',
                            'font-family: Inter',
                            'font-size: 16px',
                            'font-weight: 400',
                            'justify-content: flex-start',
                            'letter-spacing: 0.01px',
                            'line-height: 24px',
                            'padding: 0px',
                            'position: relative',
                            'flex-shrink: 0',
                            'text-align: center',
                            'width: 445px',
                          ];
                          expect(style.split('; ')).to.have.length(expectedStyles.length);
                          expectedStyles.forEach((expected) => {
                            expect(style).to.include(expected);
                          });
                        });
                    });
                });
            });
        });
    });
  });

  it('Complex 10', () => {
    cy.get('#complex-test-10')
      .first()
      .within(() => {
        cy.get('.amplify-flex')
          .then((el) => {
            const style = el.attr('style');
            const expectedStyles = [
              'align-items: center',
              'background-color: rgb(239, 240, 240)',
              'flex-direction: row',
              'gap: 24px',
              'justify-content: center',
              'overflow: hidden',
              'padding: 40px 140px',
              'position: relative',
              'width: 1440px',
            ];
            expect(style.split('; ')).to.have.length(expectedStyles.length);
            expectedStyles.forEach((expected) => {
              expect(style).to.include(expected);
            });
          })
          .first()
          .within(() => {
            cy.get('.amplify-flex')
              .then((el) => {
                const style = el.attr('style');
                const expectedStyles = [
                  'align-items: flex-start',
                  'flex-basis: 1160px',
                  'flex-direction: row',
                  'gap: 24px',
                  'flex-grow: 1',
                  'height: 618px',
                  'padding: 0px',
                  'position: relative',
                  'width: 1160px',
                ];
                expect(style.split('; ')).to.have.length(expectedStyles.length);
                expectedStyles.forEach((expected) => {
                  expect(style).to.include(expected);
                });
              })
              .first()
              .within(() => {
                cy.get('.amplify-flex')
                  .eq(0)
                  .then((el) => {
                    const style = el.attr('style');
                    const expectedStyles = [
                      'align-items: center',
                      'background-color: rgb(255, 255, 255)',
                      'flex-basis: 272px',
                      'flex-direction: column',
                      'gap: 24px',
                      'flex-grow: 1',
                      'height: 618px',
                      'justify-content: center',
                      'padding: 24px',
                      'position: relative',
                      'width: 272px',
                    ];
                    expect(style.split('; ')).to.have.length(expectedStyles.length);
                    expectedStyles.forEach((expected) => {
                      expect(style).to.include(expected);
                    });
                  })
                  .first()
                  .within(() => {
                    cy.get('.amplify-text')
                      .eq(0)
                      .contains('Free')
                      .then((el) => {
                        const style = el.attr('style');
                        const expectedStyles = [
                          'align-self: stretch',
                          'color: rgb(13, 26, 38)',
                          'flex-direction: column',
                          'display: flex',
                          'font-family: Inter',
                          'font-size: 40px',
                          'font-weight: 700',
                          'justify-content: flex-start',
                          'line-height: 48px',
                          'padding: 0px',
                          'position: relative',
                          'flex-shrink: 0',
                          'text-align: center',
                          'width: 224px',
                        ];
                        expect(style.split('; ')).to.have.length(expectedStyles.length);
                        expectedStyles.forEach((expected) => {
                          expect(style).to.include(expected);
                        });
                      });
                    cy.get('.amplify-button').contains('Primary Button');
                    cy.get('.amplify-flex')
                      .eq(0)
                      .then((el) => {
                        const style = el.attr('style');
                        const expectedStyles = [
                          'align-items: flex-start',
                          'align-self: stretch',
                          'flex-direction: row',
                          'gap: 16px',
                          'padding: 0px',
                          'position: relative',
                          'flex-shrink: 0',
                        ];
                        expect(style.split('; ')).to.have.length(expectedStyles.length);
                        expectedStyles.forEach((expected) => {
                          expect(style).to.include(expected);
                        });
                      })
                      .first()
                      .within(() => {
                        cy.get('.amplify-icon').then((el) => {
                          const style = el.attr('style');
                          const expectedStyles = [
                            'color: rgb(64, 170, 191)',
                            'font-size: 24px',
                            'height: 24px',
                            'overflow: hidden',
                            'padding: 0px',
                            'position: relative',
                            'flex-shrink: 0',
                            'width: 24px',
                          ];
                          expect(style.split('; ')).to.have.length(expectedStyles.length);
                          expectedStyles.forEach((expected) => {
                            expect(style).to.include(expected);
                          });
                        });
                        cy.get('.amplify-text')
                          .then((el) => {
                            const style = el.attr('style');
                            const expectedStyles = [
                              'flex-basis: 184px',
                              'color: rgb(48, 64, 80)',
                              'flex-direction: column',
                              'display: flex',
                              'font-family: Inter',
                              'font-size: 16px',
                              'font-weight: 400',
                              'flex-grow: 1',
                              'justify-content: flex-start',
                              'letter-spacing: 0.01px',
                              'line-height: 24px',
                              'padding: 0px',
                              'position: relative',
                              'text-align: left',
                              'width: 184px',
                            ];
                            expect(style.split('; ')).to.have.length(expectedStyles.length);
                            expectedStyles.forEach((expected) => {
                              expect(style).to.include(expected);
                            });
                          })
                          .contains('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.');
                      });
                  });
                cy.get('.amplify-flex')
                  .eq(12)
                  .then((el) => {
                    const style = el.attr('style');
                    const expectedStyles = [
                      'align-items: center',
                      'background-color: rgb(255, 255, 255)',
                      'flex-basis: 272px',
                      'flex-direction: column',
                      'gap: 24px',
                      'flex-grow: 1',
                      'height: 618px',
                      'justify-content: center',
                      'padding: 24px',
                      'position: relative',
                      'width: 272px',
                    ];
                    expect(style.split('; ')).to.have.length(expectedStyles.length);
                    expectedStyles.forEach((expected) => {
                      expect(style).to.include(expected);
                    });
                  })
                  .first()
                  .within(() => {
                    cy.get('.amplify-text')
                      .eq(0)
                      .contains('Enterprise')
                      .then((el) => {
                        const style = el.attr('style');
                        const expectedStyles = [
                          'align-self: stretch',
                          'color: rgb(13, 26, 38)',
                          'flex-direction: column',
                          'display: flex',
                          'font-family: Inter',
                          'font-size: 40px',
                          'font-weight: 700',
                          'justify-content: flex-start',
                          'line-height: 48px',
                          'padding: 0px',
                          'position: relative',
                          'flex-shrink: 0',
                          'text-align: center',
                          'width: 224px',
                        ];
                        expect(style.split('; ')).to.have.length(expectedStyles.length);
                        expectedStyles.forEach((expected) => {
                          expect(style).to.include(expected);
                        });
                      });
                    cy.get('.amplify-button').contains('Primary Button');
                    cy.get('.amplify-flex')
                      .eq(0)
                      .then((el) => {
                        const style = el.attr('style');
                        const expectedStyles = [
                          'align-items: flex-start',
                          'align-self: stretch',
                          'flex-direction: row',
                          'gap: 16px',
                          'padding: 0px',
                          'position: relative',
                          'flex-shrink: 0',
                        ];
                        expect(style.split('; ')).to.have.length(expectedStyles.length);
                        expectedStyles.forEach((expected) => {
                          expect(style).to.include(expected);
                        });
                      })
                      .first()
                      .within(() => {
                        cy.get('.amplify-icon').then((el) => {
                          const style = el.attr('style');
                          const expectedStyles = [
                            'color: rgb(64, 170, 191)',
                            'font-size: 24px',
                            'height: 24px',
                            'overflow: hidden',
                            'padding: 0px',
                            'position: relative',
                            'flex-shrink: 0',
                            'width: 24px',
                          ];
                          expect(style.split('; ')).to.have.length(expectedStyles.length);
                          expectedStyles.forEach((expected) => {
                            expect(style).to.include(expected);
                          });
                        });
                        cy.get('.amplify-text')
                          .then((el) => {
                            const style = el.attr('style');
                            const expectedStyles = [
                              'flex-basis: 184px',
                              'color: rgb(48, 64, 80)',
                              'flex-direction: column',
                              'display: flex',
                              'font-family: Inter',
                              'font-size: 16px',
                              'font-weight: 400',
                              'flex-grow: 1',
                              'justify-content: flex-start',
                              'letter-spacing: 0.01px',
                              'line-height: 24px',
                              'padding: 0px',
                              'position: relative',
                              'text-align: left',
                              'width: 184px',
                            ];
                            expect(style.split('; ')).to.have.length(expectedStyles.length);
                            expectedStyles.forEach((expected) => {
                              expect(style).to.include(expected);
                            });
                          })
                          .contains(
                            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor123123.',
                          );
                      });
                  });
              });
          });
      });
  });

  it('Complex 11', () => {
    cy.get('#complex-test-11')
      .first()
      .within(() => {
        cy.get('.amplify-flex')
          .then((el) => {
            const style = el.attr('style');
            const expectedStyles = [
              'align-items: flex-start',
              'flex-direction: row',
              'gap: 24px',
              'padding: 0px',
              'position: relative',
              'width: 1160px',
            ];
            expect(style.split('; ')).to.have.length(expectedStyles.length);
            expectedStyles.forEach((expected) => {
              expect(style).to.include(expected);
            });
          })
          .first()
          .within(() => {
            cy.get('.amplify-flex').then((el) => {
              const style = el.attr('style');
              const expectedStyles = [
                'align-items: flex-start',
                'background-color: rgb(255, 255, 255)',
                'flex-basis: 667px',
                'flex-direction: row',
                'gap: 0px',
                'flex-grow: 1',
                'height: 1148px',
                'padding: 32px 0px',
                'position: relative',
                'width: 667px',
              ];
              expect(style.split('; ')).to.have.length(expectedStyles.length);
              expectedStyles.forEach((expected) => {
                expect(style).to.include(expected);
              });
            });
            cy.get('.amplify-button')
              .contains('Place Order')
              .then((el) => {
                const style = el.attr('style');
                const expectedStyles = [
                  'display: flex',
                  'left: 32px',
                  'position: absolute',
                  'top: 822px',
                  'width: 405px',
                ];
                expect(style.split('; ')).to.have.length(expectedStyles.length);
                expectedStyles.forEach((expected) => {
                  expect(style).to.include(expected);
                });
              });
            cy.get('.amplify-badge')
              .contains('Discount - 10% off')
              .then((el) => {
                const style = el.attr('style');
                const expectedStyles = [
                  'background-color: rgb(214, 245, 219)',
                  'color: rgb(54, 94, 61)',
                  'flex-direction: column',
                  'display: flex',
                  'font-family: Inter',
                  'font-size: 16px',
                  'font-weight: 700',
                  'justify-content: flex-start',
                  'left: 32px',
                  'letter-spacing: 0.49px',
                  'line-height: 20px',
                  'position: absolute',
                  'text-align: left',
                  'top: 0px',
                  'width: 405px',
                ];
                expect(style.split('; ')).to.have.length(expectedStyles.length);
                expectedStyles.forEach((expected) => {
                  expect(style).to.include(expected);
                });
              });
            cy.get('.amplify-flex')
              .first()
              .within(() => {
                cy.get('.amplify-flex')
                  .first()
                  .within(() => {
                    cy.get('.amplify-label').contains('Label');
                  });
              });
          });
      });
  });
});
