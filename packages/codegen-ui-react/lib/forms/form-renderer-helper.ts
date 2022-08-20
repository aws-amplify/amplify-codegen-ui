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

import {
  ComponentMetadata,
  DataFieldDataType,
  FieldValidationConfiguration,
  FormDefinition,
  StateStudioComponentProperty,
  StudioComponent,
  StudioComponentChild,
  StudioForm,
  StudioFormActionType,
} from '@aws-amplify/codegen-ui';
import { FieldConfigMetadata } from '@aws-amplify/codegen-ui/lib/types';
import {
  BindingElement,
  Expression,
  factory,
  NodeFlags,
  PropertySignature,
  SyntaxKind,
  ObjectLiteralElementLike,
  ObjectLiteralExpression,
} from 'typescript';
import { ImportCollection, ImportSource, ImportValue } from '../imports';
import { getStateName, getSetStateName } from '../react-component-render-helper';
import { getActionIdentifier } from '../workflow';
import { buildTargetVariable } from './event-targets';

export const FormTypeDataStoreMap: Record<StudioFormActionType, string> = {
  create: 'Amplify.DataStoreCreateItemAction',
  update: 'Amplify.DataStoreUpdateItemAction',
};

export const FieldStateVariable = (componentName: string): StateStudioComponentProperty => ({
  componentName,
  property: 'fields',
});

function capitalizeFirstLetter(val: string) {
  return val.charAt(0).toUpperCase() + val.slice(1);
}

/**
 * - formFields
 */
export const buildFieldStateStatements = (formName: string, importCollection: ImportCollection) => {
  importCollection.addMappedImport(ImportValue.USE_STATE_MUTATION_ACTION);

  return factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createArrayBindingPattern([
            factory.createBindingElement(
              undefined,
              undefined,
              factory.createIdentifier(getStateName(FieldStateVariable(formName))),
              undefined,
            ),
            factory.createBindingElement(
              undefined,
              undefined,
              factory.createIdentifier(getSetStateName(FieldStateVariable(formName))),
              undefined,
            ),
          ]),
          undefined,
          undefined,
          factory.createCallExpression(factory.createIdentifier('useStateMutationAction'), undefined, [
            factory.createObjectLiteralExpression(),
          ]),
        ),
      ],
      NodeFlags.Const,
    ),
  );
};

export const buildMutationBindings = (form: StudioForm) => {
  const {
    dataType: { dataSourceType },
    formActionType,
  } = form;
  const elements: BindingElement[] = [];
  if (dataSourceType === 'DataStore') {
    if (formActionType === 'update') {
      elements.push(factory.createBindingElement(undefined, undefined, factory.createIdentifier('id'), undefined));
    }
    elements.push(
      factory.createBindingElement(undefined, undefined, factory.createIdentifier('onSubmitBefore'), undefined),
      factory.createBindingElement(undefined, undefined, factory.createIdentifier('onSubmitComplete'), undefined),
    );
  } else {
    elements.push(
      factory.createBindingElement(
        undefined,
        factory.createIdentifier('onSubmit'),
        getActionIdentifier(form.name, 'onSubmit'), // custom onsubmit function with the name of the form
        undefined,
      ),
    );
  }
  elements.push(factory.createBindingElement(undefined, undefined, factory.createIdentifier('onCancel'), undefined));
  return elements;
};

/*
    generate params in typed props
    - datastore (onSubmitBefore(fields) & onSubmitComplete({saveSuccessful, errorMessage}))
     - if update include id
    - custom (onSubmit(fields))
   */
export const buildFormPropNode = (form: StudioForm) => {
  const {
    dataType: { dataSourceType },
    formActionType,
  } = form;
  const propSignatures: PropertySignature[] = [];
  if (dataSourceType === 'DataStore') {
    if (formActionType === 'update') {
      propSignatures.push(
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('id'),
          undefined,
          factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
        ),
      );
    }
    propSignatures.push(
      factory.createPropertySignature(
        undefined,
        'onSubmitBefore',
        factory.createToken(SyntaxKind.QuestionToken),
        factory.createFunctionTypeNode(
          undefined,
          [
            factory.createParameterDeclaration(
              undefined,
              undefined,
              undefined,
              'fields',
              undefined,
              factory.createTypeReferenceNode(factory.createIdentifier('Record'), [
                factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
                factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
              ]),
              undefined,
            ),
          ],
          factory.createTypeReferenceNode(factory.createIdentifier('Record'), [
            factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
            factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
          ]),
        ),
      ),
      factory.createPropertySignature(
        undefined,
        'onSubmitComplete',
        factory.createToken(SyntaxKind.QuestionToken),
        factory.createFunctionTypeNode(
          undefined,
          [
            factory.createParameterDeclaration(
              undefined,
              undefined,
              undefined,
              factory.createObjectBindingPattern([
                factory.createBindingElement(
                  undefined,
                  undefined,
                  factory.createIdentifier('saveSuccessful'),
                  undefined,
                ),
                factory.createBindingElement(undefined, undefined, factory.createIdentifier('errorMessage'), undefined),
              ]),
              undefined,
              factory.createTypeLiteralNode([
                factory.createPropertySignature(
                  undefined,
                  'saveSuccessful',
                  undefined,
                  factory.createKeywordTypeNode(SyntaxKind.BooleanKeyword),
                ),
                factory.createPropertySignature(
                  undefined,
                  'errorMessage',
                  factory.createToken(SyntaxKind.QuestionToken),
                  factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
                ),
              ]),
              undefined,
            ),
          ],
          factory.createKeywordTypeNode(SyntaxKind.VoidKeyword),
        ),
      ),
    );
  }
  if (dataSourceType === 'Custom') {
    propSignatures.push(
      factory.createPropertySignature(
        undefined,
        'onSubmit',
        undefined,
        factory.createFunctionTypeNode(
          undefined,
          [
            factory.createParameterDeclaration(
              undefined,
              undefined,
              undefined,
              'fields',
              undefined,
              factory.createTypeReferenceNode(factory.createIdentifier('Record'), [
                factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
                factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
              ]),
              undefined,
            ),
          ],
          factory.createKeywordTypeNode(SyntaxKind.VoidKeyword),
        ),
      ),
    );
  }
  // onCancel?: () => void
  propSignatures.push(
    factory.createPropertySignature(
      undefined,
      'onCancel',
      factory.createToken(SyntaxKind.QuestionToken),
      factory.createFunctionTypeNode(undefined, [], factory.createKeywordTypeNode(SyntaxKind.VoidKeyword)),
    ),
  );
  /**
    onValidate?: Record<
    string,
    (
    value: any
    ) =>
      | { hasError: boolean, errorMessage?: string }
      | Promise<{ hasError: boolean, errorMessage?: string }>
    >
   */

  propSignatures.push(
    factory.createPropertySignature(
      undefined,
      factory.createIdentifier('onValidate'),
      factory.createToken(SyntaxKind.QuestionToken),
      factory.createTypeReferenceNode(factory.createIdentifier('Record'), [
        factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
        factory.createFunctionTypeNode(
          undefined,
          [
            factory.createParameterDeclaration(
              undefined,
              undefined,
              undefined,
              factory.createIdentifier('value'),
              undefined,
              factory.createKeywordTypeNode(SyntaxKind.AnyKeyword),
              undefined,
            ),
          ],
          factory.createUnionTypeNode([
            factory.createTypeLiteralNode([
              factory.createPropertySignature(
                undefined,
                factory.createIdentifier('hasError'),
                undefined,
                factory.createKeywordTypeNode(SyntaxKind.BooleanKeyword),
              ),
              factory.createPropertySignature(
                undefined,
                factory.createIdentifier('errorMessage'),
                factory.createToken(SyntaxKind.QuestionToken),
                factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
              ),
            ]),
            factory.createTypeReferenceNode(factory.createIdentifier('Promise'), [
              factory.createTypeLiteralNode([
                factory.createPropertySignature(
                  undefined,
                  factory.createIdentifier('hasError'),
                  undefined,
                  factory.createKeywordTypeNode(SyntaxKind.BooleanKeyword),
                ),
                factory.createPropertySignature(
                  undefined,
                  factory.createIdentifier('errorMessage'),
                  factory.createToken(SyntaxKind.QuestionToken),
                  factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
                ),
              ]),
            ]),
          ]),
        ),
      ]),
    ),
  );
  return factory.createTypeLiteralNode(propSignatures);
};

export const buildStateMutationStatement = (name: string, defaultValue: Expression) => {
  return factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createArrayBindingPattern([
            factory.createBindingElement(undefined, undefined, factory.createIdentifier(name), undefined),
            factory.createBindingElement(
              undefined,
              undefined,
              factory.createIdentifier(`set${capitalizeFirstLetter(name)}`),
              undefined,
            ),
          ]),
          undefined,
          undefined,
          factory.createCallExpression(factory.createIdentifier('useStateMutationAction'), undefined, [defaultValue]),
        ),
      ],
      NodeFlags.Const,
    ),
  );
};

export const createValidationExpression = (validationRules: FieldValidationConfiguration[] = []): Expression => {
  const validateExpressions = validationRules.map<ObjectLiteralExpression>((rule) => {
    const elements: ObjectLiteralElementLike[] = [
      factory.createPropertyAssignment(factory.createIdentifier('type'), factory.createStringLiteral(rule.type)),
    ];
    if ('strValues' in rule) {
      elements.push(
        factory.createPropertyAssignment(
          factory.createIdentifier('strValues'),
          factory.createArrayLiteralExpression(
            rule.strValues.map((value) => factory.createStringLiteral(value)),
            false,
          ),
        ),
      );
    }
    if ('numValues' in rule) {
      elements.push(
        factory.createPropertyAssignment(
          factory.createIdentifier('numValues'),
          factory.createArrayLiteralExpression(
            rule.numValues.map((value) => factory.createNumericLiteral(value)),
            false,
          ),
        ),
      );
    }
    if (rule.validationMessage) {
      elements.push(
        factory.createPropertyAssignment(
          factory.createIdentifier('validationMessage'),
          factory.createStringLiteral(rule.validationMessage),
        ),
      );
    }
    return factory.createObjectLiteralExpression(elements, false);
  });

  return factory.createArrayLiteralExpression(validateExpressions, true);
};

export const addFormAttributes = (
  component: StudioComponent | StudioComponentChild,
  componentMetadata: ComponentMetadata,
) => {
  const attributes = [];
  const { formMetadata } = componentMetadata;

  // do some sort of mapping of the componetName from the dataschema fields
  // then map this with the componentType

  /*
      boolean => RadioGroupField
      const value = e.target.value.toLowerCase() === 'yes';
      boolean => selectfield
      const value = ....
  
  
      componentType => SelectField && boolean
      const value = Boolean(e.target.checked)
  
    */
  if (formMetadata && component.name in formMetadata?.fieldConfigs) {
    const { dataType } = formMetadata.fieldConfigs[component.name];
    attributes.push(buildOnChangeStatement(component.name, component.componentType, dataType));
    attributes.push(
      factory.createJsxAttribute(
        factory.createIdentifier('errorMessage'),
        factory.createJsxExpression(
          undefined,
          factory.createPropertyAccessChain(
            factory.createPropertyAccessExpression(
              factory.createIdentifier('errors'),
              factory.createIdentifier(component.name),
            ),
            factory.createToken(SyntaxKind.QuestionDotToken),
            factory.createIdentifier('errorMessage'),
          ),
        ),
      ),
      factory.createJsxAttribute(
        factory.createIdentifier('hasError'),
        factory.createJsxExpression(
          undefined,
          factory.createPropertyAccessChain(
            factory.createPropertyAccessExpression(
              factory.createIdentifier('errors'),
              factory.createIdentifier(component.name),
            ),
            factory.createToken(SyntaxKind.QuestionDotToken),
            factory.createIdentifier('hasError'),
          ),
        ),
      ),
    );
  }

  if (component.name === 'SubmitButton') {
    attributes.push(
      factory.createJsxAttribute(
        factory.createIdentifier('isDisabled'),
        factory.createJsxExpression(
          undefined,
          factory.createCallExpression(
            factory.createPropertyAccessExpression(
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createIdentifier('Object'),
                  factory.createIdentifier('values'),
                ),
                undefined,
                [factory.createIdentifier('errors')],
              ),
              factory.createIdentifier('some'),
            ),
            undefined,
            [
              factory.createArrowFunction(
                undefined,
                undefined,
                [
                  factory.createParameterDeclaration(
                    undefined,
                    undefined,
                    undefined,
                    factory.createIdentifier('e'),
                    undefined,
                    undefined,
                    undefined,
                  ),
                ],
                undefined,
                factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                factory.createPropertyAccessExpression(
                  factory.createIdentifier('e'),
                  factory.createIdentifier('hasError'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
  if (component.name === 'CancelButton') {
    attributes.push(
      factory.createJsxAttribute(
        factory.createIdentifier('onClick'),
        factory.createJsxExpression(
          undefined,
          factory.createArrowFunction(
            undefined,
            undefined,
            [],
            undefined,
            factory.createToken(SyntaxKind.EqualsGreaterThanToken),
            factory.createBlock(
              [
                factory.createExpressionStatement(
                  factory.createBinaryExpression(
                    factory.createIdentifier('onCancel'),
                    factory.createToken(SyntaxKind.AmpersandAmpersandToken),
                    factory.createCallExpression(factory.createIdentifier('onCancel'), undefined, []),
                  ),
                ),
              ],
              false,
            ),
          ),
        ),
      ),
    );
  }
  return attributes;
};

export const buildOnChangeStatement = (fieldName: string, fieldType: string, dataType?: DataFieldDataType) => {
  return factory.createJsxAttribute(
    factory.createIdentifier('onChange'),
    factory.createJsxExpression(
      undefined,
      factory.createArrowFunction(
        [factory.createModifier(SyntaxKind.AsyncKeyword)],
        undefined,
        [
          factory.createParameterDeclaration(
            undefined,
            undefined,
            undefined,
            factory.createIdentifier('e'),
            undefined,
            undefined,
            undefined,
          ),
        ],
        undefined,
        factory.createToken(SyntaxKind.EqualsGreaterThanToken),
        factory.createBlock(
          [
            buildTargetVariable(fieldType, dataType),
            factory.createExpressionStatement(
              factory.createAwaitExpression(
                factory.createCallExpression(factory.createIdentifier('runValidationTasks'), undefined, [
                  factory.createStringLiteral(fieldName),
                  factory.createIdentifier('value'),
                ]),
              ),
            ),
            factory.createExpressionStatement(
              factory.createCallExpression(factory.createIdentifier('setModelFields'), undefined, [
                factory.createObjectLiteralExpression(
                  [
                    factory.createSpreadAssignment(factory.createIdentifier('modelFields')),
                    factory.createPropertyAssignment(
                      factory.createIdentifier(fieldName),
                      factory.createIdentifier('value'),
                    ),
                  ],
                  false,
                ),
              ]),
            ),
          ],
          true,
        ),
      ),
    ),
  );
};

export const buildDataStoreExpression = (dataStoreActionType: 'update' | 'create', modelName: string) => {
  if (dataStoreActionType === 'update') {
    return [
      factory.createVariableStatement(
        undefined,
        factory.createVariableDeclarationList(
          [
            factory.createVariableDeclaration(
              factory.createIdentifier('original'),
              undefined,
              undefined,
              factory.createAwaitExpression(
                factory.createCallExpression(
                  factory.createPropertyAccessExpression(
                    factory.createIdentifier('DataStore'),
                    factory.createIdentifier('query'),
                  ),
                  undefined,
                  [factory.createIdentifier(modelName), factory.createIdentifier('id')],
                ),
              ),
            ),
          ],
          NodeFlags.Const,
        ),
      ),
      factory.createExpressionStatement(
        factory.createAwaitExpression(
          factory.createCallExpression(
            factory.createPropertyAccessExpression(
              factory.createIdentifier('DataStore'),
              factory.createIdentifier('save'),
            ),
            undefined,
            [
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createIdentifier(modelName),
                  factory.createIdentifier('copyOf'),
                ),
                undefined,
                [
                  factory.createIdentifier('original'),
                  factory.createArrowFunction(
                    undefined,
                    undefined,
                    [
                      factory.createParameterDeclaration(
                        undefined,
                        undefined,
                        undefined,
                        factory.createIdentifier('updated'),
                        undefined,
                        factory.createKeywordTypeNode(SyntaxKind.AnyKeyword),
                        undefined,
                      ),
                    ],
                    undefined,
                    factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                    factory.createBlock(
                      [
                        factory.createExpressionStatement(
                          factory.createCallExpression(
                            factory.createPropertyAccessExpression(
                              factory.createIdentifier('Object'),
                              factory.createIdentifier('assign'),
                            ),
                            undefined,
                            [factory.createIdentifier('updated'), factory.createIdentifier('modelFields')],
                          ),
                        ),
                      ],
                      true,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    ];
  }
  return [
    factory.createExpressionStatement(
      factory.createAwaitExpression(
        factory.createCallExpression(
          factory.createPropertyAccessExpression(
            factory.createIdentifier('DataStore'),
            factory.createIdentifier('save'),
          ),
          undefined,
          [
            factory.createNewExpression(factory.createIdentifier(modelName), undefined, [
              factory.createIdentifier('modelFields'),
            ]),
          ],
        ),
      ),
    ),
  ];
};

export const buildOverrideTypesBindings = (
  formComponent: StudioComponent,
  formDefinition: FormDefinition,
  importCollection: ImportCollection,
) => {
  importCollection.addImport(ImportSource.UI_REACT, 'GridProps');

  const typeNodes = [
    factory.createPropertySignature(
      undefined,
      factory.createIdentifier(`${formComponent.name}Grid`),
      undefined,
      factory.createTypeReferenceNode(factory.createIdentifier('GridProps'), undefined),
    ),
  ];

  formDefinition.elementMatrix.forEach((row, index) => {
    typeNodes.push(
      factory.createPropertySignature(
        undefined,
        factory.createIdentifier(`RowGrid${index}`),
        undefined,
        factory.createTypeReferenceNode(factory.createIdentifier('GridProps'), undefined),
      ),
    );
    row.forEach((field) => {
      const componentTypePropName = `${formDefinition.elements[field].componentType}Props`;
      typeNodes.push(
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier(field),
          undefined,
          factory.createTypeReferenceNode(factory.createIdentifier(componentTypePropName), undefined),
        ),
      );
      importCollection.addImport(ImportSource.UI_REACT, componentTypePropName);
    });
  });

  return factory.createTypeAliasDeclaration(
    undefined,
    [factory.createModifier(SyntaxKind.ExportKeyword), factory.createModifier(SyntaxKind.DeclareKeyword)],
    factory.createIdentifier(`${formComponent.name}OverridesProps`),
    undefined,
    factory.createIntersectionTypeNode([
      factory.createTypeLiteralNode(typeNodes),
      factory.createTypeReferenceNode(factory.createIdentifier('EscapeHatchProps'), undefined),
    ]),
  );
};

export function buildValidations(fieldConfigs: Record<string, FieldConfigMetadata>) {
  const validationsForField = Object.entries(fieldConfigs).map(([fieldName, fieldConfig]) =>
    factory.createPropertyAssignment(
      factory.createIdentifier(fieldName),
      createValidationExpression(fieldConfig.validationRules),
    ),
  );

  return factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier('validations'),
          undefined,
          undefined,
          factory.createObjectLiteralExpression(validationsForField, true),
        ),
      ],
      NodeFlags.Const,
    ),
  );
}

/**
  const runValidationTasks = async (fieldName, value) => {
    let validationResponse = validateField(value, validations[fieldName]);
    if(!validationResponse.hasError) {
      validationResponse = await onValidate?.[fieldName]?.(value) ?? {};
    }
    setErrors(errors => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  }
 */

export const runValidationTasksFunction = factory.createVariableStatement(
  undefined,
  factory.createVariableDeclarationList(
    [
      factory.createVariableDeclaration(
        factory.createIdentifier('runValidationTasks'),
        undefined,
        undefined,
        factory.createArrowFunction(
          [factory.createModifier(SyntaxKind.AsyncKeyword)],
          undefined,
          [
            factory.createParameterDeclaration(
              undefined,
              undefined,
              undefined,
              factory.createIdentifier('fieldName'),
              undefined,
              undefined,
              undefined,
            ),
            factory.createParameterDeclaration(
              undefined,
              undefined,
              undefined,
              factory.createIdentifier('value'),
              undefined,
              undefined,
              undefined,
            ),
          ],
          undefined,
          factory.createToken(SyntaxKind.EqualsGreaterThanToken),
          factory.createBlock(
            [
              factory.createVariableStatement(
                undefined,
                factory.createVariableDeclarationList(
                  [
                    factory.createVariableDeclaration(
                      factory.createIdentifier('validationResponse'),
                      undefined,
                      undefined,
                      factory.createCallExpression(factory.createIdentifier('validateField'), undefined, [
                        factory.createIdentifier('value'),
                        factory.createElementAccessExpression(
                          factory.createIdentifier('validations'),
                          factory.createIdentifier('fieldName'),
                        ),
                      ]),
                    ),
                  ],
                  NodeFlags.Let,
                ),
              ),
              factory.createIfStatement(
                factory.createPrefixUnaryExpression(
                  SyntaxKind.ExclamationToken,
                  factory.createPropertyAccessExpression(
                    factory.createIdentifier('validationResponse'),
                    factory.createIdentifier('hasError'),
                  ),
                ),
                factory.createBlock(
                  [
                    factory.createExpressionStatement(
                      factory.createBinaryExpression(
                        factory.createIdentifier('validationResponse'),
                        factory.createToken(SyntaxKind.EqualsToken),
                        factory.createBinaryExpression(
                          factory.createAwaitExpression(
                            factory.createCallChain(
                              factory.createElementAccessChain(
                                factory.createIdentifier('onValidate'),
                                factory.createToken(SyntaxKind.QuestionDotToken),
                                factory.createIdentifier('fieldName'),
                              ),
                              factory.createToken(SyntaxKind.QuestionDotToken),
                              undefined,
                              [factory.createIdentifier('value')],
                            ),
                          ),
                          factory.createToken(SyntaxKind.QuestionQuestionToken),
                          factory.createObjectLiteralExpression([], false),
                        ),
                      ),
                    ),
                  ],
                  true,
                ),
                undefined,
              ),
              factory.createExpressionStatement(
                factory.createCallExpression(factory.createIdentifier('setErrors'), undefined, [
                  factory.createArrowFunction(
                    undefined,
                    undefined,
                    [
                      factory.createParameterDeclaration(
                        undefined,
                        undefined,
                        undefined,
                        factory.createIdentifier('errors'),
                        undefined,
                        undefined,
                        undefined,
                      ),
                    ],
                    undefined,
                    factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                    factory.createParenthesizedExpression(
                      factory.createObjectLiteralExpression(
                        [
                          factory.createSpreadAssignment(factory.createIdentifier('errors')),
                          factory.createPropertyAssignment(
                            factory.createComputedPropertyName(factory.createIdentifier('fieldName')),
                            factory.createIdentifier('validationResponse'),
                          ),
                        ],
                        false,
                      ),
                    ),
                  ),
                ]),
              ),
              factory.createReturnStatement(factory.createIdentifier('validationResponse')),
            ],
            true,
          ),
        ),
      ),
    ],
    NodeFlags.Const,
  ),
);

/**
  const validationResponses = await Promise.all(
    Object.keys(validations).map((fieldName) =>
      runValidationTasks(fieldName, modelFields[fieldName])
    )
  );

  if (validationResponses.some((r) => r.hasError)) {
    return;
  }
 */

export const onSubmitValidationRun = [
  factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier('validationResponses'),
          undefined,
          undefined,
          factory.createAwaitExpression(
            factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier('Promise'),
                factory.createIdentifier('all'),
              ),
              undefined,
              [
                factory.createCallExpression(
                  factory.createPropertyAccessExpression(
                    factory.createCallExpression(
                      factory.createPropertyAccessExpression(
                        factory.createIdentifier('Object'),
                        factory.createIdentifier('keys'),
                      ),
                      undefined,
                      [factory.createIdentifier('validations')],
                    ),
                    factory.createIdentifier('map'),
                  ),
                  undefined,
                  [
                    factory.createArrowFunction(
                      undefined,
                      undefined,
                      [
                        factory.createParameterDeclaration(
                          undefined,
                          undefined,
                          undefined,
                          factory.createIdentifier('fieldName'),
                          undefined,
                          undefined,
                          undefined,
                        ),
                      ],
                      undefined,
                      factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                      factory.createCallExpression(factory.createIdentifier('runValidationTasks'), undefined, [
                        factory.createIdentifier('fieldName'),
                        factory.createElementAccessExpression(
                          factory.createIdentifier('modelFields'),
                          factory.createIdentifier('fieldName'),
                        ),
                      ]),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  ),
  factory.createIfStatement(
    factory.createCallExpression(
      factory.createPropertyAccessExpression(
        factory.createIdentifier('validationResponses'),
        factory.createIdentifier('some'),
      ),
      undefined,
      [
        factory.createArrowFunction(
          undefined,
          undefined,
          [
            factory.createParameterDeclaration(
              undefined,
              undefined,
              undefined,
              factory.createIdentifier('r'),
              undefined,
              undefined,
              undefined,
            ),
          ],
          undefined,
          factory.createToken(SyntaxKind.EqualsGreaterThanToken),
          factory.createPropertyAccessExpression(factory.createIdentifier('r'), factory.createIdentifier('hasError')),
        ),
      ],
    ),
    factory.createBlock([factory.createReturnStatement(undefined)], true),
    undefined,
  ),
];
