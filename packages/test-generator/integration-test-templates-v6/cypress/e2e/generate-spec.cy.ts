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
const EXPECTED_SUCCESSFUL_CASES = new Set([
  'ViewWithButton',
  'ViewTest',
  'CustomButton',
  'ParsedFixedValues',
  'BasicComponentBadge',
  'BasicComponentView',
  'BasicComponentButton',
  'BasicComponentCard',
  'BasicComponentCollection',
  'BasicComponentDivider',
  'BasicComponentFlex',
  'BasicComponentImage',
  'BasicComponentText',
  'BasicComponentCustomRating',
  'CustomFormCreateDog',
  'DataStoreFormCreateAllSupportedFormFields',
  'DataStoreFormCreateAllSupportedFormFieldsScalar',
  'DataStoreFormUpdateAllSupportedFormFields',
  'DataStoreFormUpdateBidirectionalOwner',
  'DataStoreFormUpdateBidirectionalDog',
  'DataStoreFormCreateBidirectionalDog',
  'DataStoreFormCreateBidirectionalOwner',
  'CustomFormCreateNestedJson',
  'DataStoreFormUpdateCPKTeacher',
  'DataStoreFormCreateCPKTeacher',
  'DataStoreFormUpdateCompositeDog',
  'DataStoreFormUpdateCompositeDogScalar',
  'DataStoreFormCreateCompositeDog',
  'DataStoreFormUpdateCompositeToy',
  'DataStoreFormUpdateModelWithVariableCollisions',
  'DataStoreFormUpdateCar',
  'DataStoreFormUpdateDealership',
  'ComponentWithDataBindingWithPredicate',
  'ComponentWithDataBindingWithoutPredicate',
  'ComponentWithSimplePropertyBinding',
  'ComponentWithAuthBinding',
  'CompWithMultipleBindingsWithPred',
  'ComponentWithSlotBinding',
  'BoundDefaultValue',
  'SimplePropertyBindingDefaultValue',
  'SimpleAndBouldDefaultValue',
  'CollectionDefaultValue',
  'ComplexTest1',
  'ComplexTest2',
  'ComplexTest3',
  'ComplexTest4',
  'ComplexTest5',
  'ComplexTest6',
  'ComplexTest7',
  'ComplexTest8',
  'ComplexTest9',
  'ComplexTest10',
  'ComplexTest11',
  'ReneButton',
  'CollectionWithBinding',
  'CollectionWithSort',
  'CollectionWithBindingItemsName',
  'CompositeDogCard',
  'CollectionWithCompositeKeysAndRelationships',
  'CollectionWithBetweenPredicate',
  'PaginatedCollection',
  'SearchableCollection',
  'CustomParent',
  'CustomChildren',
  'CustomParentAndChildren',
  'ComponentWithConcatenation',
  'ComponentWithConditional',
  'ComponentWithBoundPropertyConditional',
  'ComponentWithNestedOverrides',
  'AlertPrimitive',
  'BadgePrimitive',
  'ButtonPrimitive',
  'ButtonGroupPrimitive',
  'CardPrimitive',
  'CheckboxFieldPrimitive',
  'CollectionPrimitive',
  'DividerPrimitive',
  'FlexPrimitive',
  'GridPrimitive',
  'HeadingPrimitive',
  'IconPrimitive',
  'ImagePrimitive',
  'LinkPrimitive',
  'LoaderPrimitive',
  'MenuButtonPrimitive',
  'MenuPrimitive',
  'PaginationPrimitive',
  'PasswordFieldPrimitive',
  'PhoneNumberFieldPrimitive',
  'PlaceholderPrimitive',
  'RadioPrimitive',
  'RadioGroupFieldPrimitive',
  'RatingPrimitive',
  'ScrollViewPrimitive',
  'SearchFieldPrimitive',
  'SelectFieldPrimitive',
  'SliderFieldPrimitive',
  'StepperFieldPrimitive',
  'SwitchFieldPrimitive',
  'TablePrimitive',
  'TextPrimitive',
  'TextAreaFieldPrimitive',
  'TextFieldPrimitive',
  'ToggleButtonPrimitive',
  'ToggleButtonGroupPrimitive',
  'ViewPrimitive',
  'VisuallyHiddenPrimitive',
  'ComponentWithBreakpoint',
  'ComponentWithVariant',
  'ComponentWithVariantAndOverrides',
  'ComponentWithVariantsAndNotOverrideChildProp',
  'MyTheme',
  'ViewWithButton',
  'ViewTest',
  'CustomButton',
  'GoldenBasicComponent',
  'GoldenCollectionWithDataBindingAndPagination',
  'GoldenCollectionWithDataBindingAndSort',
  'GoldenCollectionWithDataBinding',
  'GoldenCollectionWithSearchAndPagination',
  'GoldenCollectionWithSpecificRecord',
  'GoldenComponentWithAuthAttributes',
  'GoldenComponentWithChildrenAndDataBinding',
  'GoldenComponentWithChildren',
  'GoldenComponentWithCustomChildren',
  'GoldenComponentWithConcatAndConditional',
  'GoldenComponentWithConditionalWithoutField',
  'GoldenComponentWithDataBindingAndDatastoreDefault',
  'GoldenComponentWithDataBinding',
  'GoldenComponentWithEvent',
  'GoldenComponentWithExposed',
  'GoldenComponentWithForm',
  'GoldenComponentWithImageWithStorage',
  'GoldenComponentWithTypedProp',
  'GoldenComponentWithVariants',
  'GoldenTheme',
  'Event',
  'SimpleUserCollection',
  'AuthSignOutActions',
  'NavigationActions',
  'InternalMutation',
  'ButtonsToggleState',
  'MutationWithSyntheticProp',
  'SetStateWithoutInitialValue',
  'UpdateVisibility',
  'DataStoreActions',
  'FormWithState',
  'InternalMutation',
  'InputMutationOnClick',
  'ConditionalInMutation',
  'TwoWayBindings',
  'MutationActionBindings',
  'DataStoreActionBindings',
  'CreateModelWithComplexTypes',
  'InitialValueBindings',
  'DataBindingNamedClass',
]);
const EXPECTED_INVALID_INPUT_CASES = new Set([
  'ComponentMissingProperties',
  'ComponentMissingType',
  'InvalidTheme',
  'CardWithInvalidChildComponentType',
]);
const EXPECTED_INTERNAL_ERROR_CASES = new Set([]);

const TARGET_GENERATORS = ['ES2016_TSX', 'ES2016_JSX', 'ES5_TSX', 'ES5_JSX'];

describe('Generate Components', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/generate-tests');
  });

  it('verifies all tests are categorized', () => {
    const missingCases: string[] = [];
    cy.get('.generateTest')
      .each(($element) => {
        const testCase = $element.attr('id').replace('generateTest', '');
        if (
          !EXPECTED_SUCCESSFUL_CASES.has(testCase) &&
          !EXPECTED_INVALID_INPUT_CASES.has(testCase) &&
          !EXPECTED_INTERNAL_ERROR_CASES.has(testCase)
        ) {
          missingCases.push(testCase);
        }
      })
      .then(() => {
        if (missingCases.length > 0) {
          throw new Error(
            // eslint-disable-next-line max-len
            `Expected all tests cases to be mapped, didn't find config for ${missingCases}. Please add them to EXPECTED_INVALID_INPUT_CASES, EXPECTED_INTERNAL_ERROR_CASES, or EXPECTED_SUCCESSFUL_CASES`,
          );
        }
      });
  });

  EXPECTED_SUCCESSFUL_CASES.forEach((testCase) => {
    it(`Generates a successful result for ${testCase}`, () => {
      cy.get(`#generateTest${testCase}`).within(() => {
        cy.get('button').click();
        TARGET_GENERATORS.forEach((targetName) => {
          cy.get(`.${targetName}`).contains('✅');
        });
      });
    });
  });

  EXPECTED_INVALID_INPUT_CASES.forEach((testCase) => {
    it(`Generates an invalid input result for ${testCase}`, () => {
      cy.get(`#generateTest${testCase}`).within(() => {
        cy.get('button').click();
        TARGET_GENERATORS.forEach((targetName) => {
          cy.get(`.${targetName}`).contains('❌');
          cy.get(`.${targetName}`).contains('InvalidInputError');
        });
      });
    });
  });

  EXPECTED_INTERNAL_ERROR_CASES.forEach((testCase) => {
    it(`Generates an internal error result for ${testCase}`, () => {
      cy.get(`#generateTest${testCase}`).within(() => {
        cy.get('button').click();
        TARGET_GENERATORS.forEach((targetName) => {
          cy.get(`.${targetName}`).contains('❌');
          cy.get(`.${targetName}`).contains('InternalError');
        });
      });
    });
  });
});
