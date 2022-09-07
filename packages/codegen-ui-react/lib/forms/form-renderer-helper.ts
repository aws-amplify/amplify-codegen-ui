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
  FieldValidationConfiguration,
  FormDefinition,
  StudioComponent,
  StudioComponentChild,
  StudioForm,
  FieldConfigMetadata,
  FormMetadata,
} from '@aws-amplify/codegen-ui';
import {
  BindingElement,
  Expression,
  factory,
  NodeFlags,
  PropertySignature,
  SyntaxKind,
  ObjectLiteralElementLike,
  ObjectLiteralExpression,
  ShorthandPropertyAssignment,
  JsxAttribute,
} from 'typescript';
import { lowerCaseFirst } from '../helpers';
import { ImportCollection, ImportSource } from '../imports';
import { getActionIdentifier } from '../workflow';
import { buildTargetVariable } from './event-targets';
import { capitalizeFirstLetter, setFieldState } from './form-state';
import { buildOnValidateType } from './type-helper';

export const buildMutationBindings = (form: StudioForm) => {
  const {
    dataType: { dataSourceType, dataTypeName },
    formActionType,
  } = form;
  const elements: BindingElement[] = [];
  if (dataSourceType === 'DataStore') {
    if (formActionType === 'update') {
      elements.push(
        factory.createBindingElement(undefined, undefined, factory.createIdentifier('id'), undefined),
        factory.createBindingElement(
          undefined,
          undefined,
          factory.createIdentifier(lowerCaseFirst(dataTypeName)),
          undefined,
        ),
      );
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
          factory.createToken(SyntaxKind.QuestionToken),
          factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
        ),
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier(lowerCaseFirst(form.dataType.dataTypeName)),
          factory.createToken(SyntaxKind.QuestionToken),
          factory.createTypeReferenceNode(factory.createIdentifier(form.dataType.dataTypeName), undefined),
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
  propSignatures.push(buildOnValidateType(form.name));
  return factory.createTypeLiteralNode(propSignatures);
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

export const addFormAttributes = (component: StudioComponent | StudioComponentChild, formMetadata: FormMetadata) => {
  const attributes: JsxAttribute[] = [];
  /*
      boolean => RadioGroupField
      const value = e.target.value.toLowerCase() === 'yes';
      boolean => selectfield
      const value = ....
  
  
      componentType => SelectField && boolean
      const value = Boolean(e.target.checked)

    */
  if (component.name in formMetadata.fieldConfigs) {
    const fieldConfig = formMetadata.fieldConfigs[component.name];
    /*
    if the componetName is a dotPath we need to change the access expression to the following
     - bio.user.favorites.Quote => errors['bio.user.favorites.Quote']?.errorMessage
    if it's a regular componetName it will use the following expression
     - bio => errors.bio?.errorMessage
    */
    const errorKey =
      component.name.split('.').length > 1
        ? factory.createElementAccessExpression(
            factory.createIdentifier('errors'),
            factory.createStringLiteral(component.name),
          )
        : factory.createPropertyAccessExpression(
            factory.createIdentifier('errors'),
            factory.createIdentifier(component.name),
          );
    attributes.push(buildOnChangeStatement(component, fieldConfig));
    attributes.push(
      factory.createJsxAttribute(
        factory.createIdentifier('errorMessage'),
        factory.createJsxExpression(
          undefined,
          factory.createPropertyAccessChain(
            errorKey,
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
            errorKey,
            factory.createToken(SyntaxKind.QuestionDotToken),
            factory.createIdentifier('hasError'),
          ),
        ),
      ),
    );
    if (fieldConfig.isArray) {
      attributes.push(
        factory.createJsxAttribute(
          factory.createIdentifier('value'),
          factory.createJsxExpression(
            undefined,
            factory.createIdentifier(`current${capitalizeFirstLetter(component.name)}Value`),
          ),
        ),
      );
    }
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
                factory.createPropertyAccessChain(
                  factory.createIdentifier('e'),
                  factory.createToken(SyntaxKind.QuestionDotToken),
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

export const buildOnChangeStatement = (
  component: StudioComponent | StudioComponentChild,
  fieldConfig: FieldConfigMetadata,
) => {
  const { name: fieldName, componentType: fieldType } = component;
  const { dataType, isArray } = fieldConfig;
  if (isArray) {
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
                factory.createCallExpression(
                  factory.createIdentifier(`setCurrent${capitalizeFirstLetter(fieldName)}Value`),
                  undefined,
                  [factory.createIdentifier('value')],
                ),
              ),
            ],
            true,
          ),
        ),
      ),
    );
  }
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
            buildTargetVariable(fieldType, fieldConfig.dataType),
            factory.createExpressionStatement(
              factory.createAwaitExpression(
                factory.createCallExpression(factory.createIdentifier('runValidationTasks'), undefined, [
                  factory.createStringLiteral(fieldName),
                  factory.createIdentifier('value'),
                ]),
              ),
            ),
            factory.createExpressionStatement(setFieldState(fieldName, factory.createIdentifier('value'))),
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
                  factory.createIdentifier(`${lowerCaseFirst(modelName)}Record`),
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
                        undefined,
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
      factory.createToken(SyntaxKind.QuestionToken),
      factory.createTypeReferenceNode(factory.createIdentifier('GridProps'), undefined),
    ),
  ];

  formDefinition.elementMatrix.forEach((row, index) => {
    typeNodes.push(
      factory.createPropertySignature(
        undefined,
        factory.createIdentifier(`RowGrid${index}`),
        factory.createToken(SyntaxKind.QuestionToken),
        factory.createTypeReferenceNode(factory.createIdentifier('GridProps'), undefined),
      ),
    );
    row.forEach((field) => {
      const propKey =
        field.split('.').length > 1 ? factory.createStringLiteral(field) : factory.createIdentifier(field);
      const componentTypePropName = `${formDefinition.elements[field].componentType}Props`;
      typeNodes.push(
        factory.createPropertySignature(
          undefined,
          propKey,
          factory.createToken(SyntaxKind.QuestionToken),
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

/**
 * builds validation variable
 * for nested values it will mention the full path as that corresponds to the fields
 * this will also link to error messages
 *
 * const validations = { post_url: [{ type: "URL" }], 'user.status': [] };
 *
 * @param fieldConfigs
 * @returns
 */
export function buildValidations(fieldConfigs: Record<string, FieldConfigMetadata>) {
  const validationsForField = Object.entries(fieldConfigs).map(([fieldName, { validationRules }]) => {
    const propKey =
      fieldName.split('.').length > 1 ? factory.createStringLiteral(fieldName) : factory.createIdentifier(fieldName);
    return factory.createPropertyAssignment(propKey, createValidationExpression(validationRules));
  });

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
    if (onValidate?.[fieldName]) {
      validationResponse = await onValidate[fieldName](value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
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
              factory.createVariableStatement(
                undefined,
                factory.createVariableDeclarationList(
                  [
                    factory.createVariableDeclaration(
                      factory.createIdentifier('customValidator'),
                      undefined,
                      undefined,
                      factory.createCallExpression(factory.createIdentifier('fetchByPath'), undefined, [
                        factory.createIdentifier('onValidate'),
                        factory.createIdentifier('fieldName'),
                      ]),
                    ),
                  ],
                  NodeFlags.Const,
                ),
              ),
              factory.createIfStatement(
                factory.createIdentifier('customValidator'),
                factory.createBlock(
                  [
                    factory.createExpressionStatement(
                      factory.createBinaryExpression(
                        factory.createIdentifier('validationResponse'),
                        factory.createToken(SyntaxKind.EqualsToken),
                        factory.createAwaitExpression(
                          factory.createCallExpression(factory.createIdentifier('customValidator'), undefined, [
                            factory.createIdentifier('value'),
                            factory.createIdentifier('validationResponse'),
                          ]),
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
 * builds modelFields object which is used to validate, onSubmit, onSuccess/onError
 *
 * ex.  [name, content, updatedAt]
 *
 * const modelFields = {
 *   name,
 *   content,
 *   updatedAt
 * };
 * @param fieldConfigs
 * @returns
 */
export const buildModelFieldObject = (fieldConfigs: Record<string, FieldConfigMetadata> = {}) => {
  const fieldSet = new Set<string>();
  const fields = Object.keys(fieldConfigs).reduce<ShorthandPropertyAssignment[]>((acc, value) => {
    const fieldName = value.split('.')[0];
    if (!fieldSet.has(fieldName)) {
      acc.push(factory.createShorthandPropertyAssignment(factory.createIdentifier(fieldName), undefined));
      fieldSet.add(fieldName);
    }
    return acc;
  }, []);

  return factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier('modelFields'),
          undefined,
          undefined,
          factory.createObjectLiteralExpression(fields, true),
        ),
      ],
      NodeFlags.Const,
    ),
  );
};

/**
  const validationResponses = await Promise.all(
    Object.keys(validations).reduce((promises, fieldName) => {
        if (Array.isArray(modelFields[fieldName])) {
            promises.push(...modelFields[fieldName].map(item => runValidationTasks(fieldName, item)));
        }
        promises.push(runValidationTasks(fieldName, modelFields[fieldName]))
        return promises
    }, [])
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
                    factory.createIdentifier('reduce'),
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
                          factory.createIdentifier('promises'),
                          undefined,
                          undefined,
                        ),
                        factory.createParameterDeclaration(
                          undefined,
                          undefined,
                          undefined,
                          factory.createIdentifier('fieldName'),
                          undefined,
                          undefined,
                        ),
                      ],
                      undefined,
                      factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                      factory.createBlock(
                        [
                          factory.createIfStatement(
                            factory.createCallExpression(
                              factory.createPropertyAccessExpression(
                                factory.createIdentifier('Array'),
                                factory.createIdentifier('isArray'),
                              ),
                              undefined,
                              [
                                factory.createElementAccessExpression(
                                  factory.createIdentifier('modelFields'),
                                  factory.createIdentifier('fieldName'),
                                ),
                              ],
                            ),
                            factory.createBlock(
                              [
                                factory.createExpressionStatement(
                                  factory.createCallExpression(
                                    factory.createPropertyAccessExpression(
                                      factory.createIdentifier('promises'),
                                      factory.createIdentifier('push'),
                                    ),
                                    undefined,
                                    [
                                      factory.createSpreadElement(
                                        factory.createCallExpression(
                                          factory.createPropertyAccessExpression(
                                            factory.createElementAccessExpression(
                                              factory.createIdentifier('modelFields'),
                                              factory.createIdentifier('fieldName'),
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
                                                  factory.createIdentifier('item'),
                                                  undefined,
                                                  undefined,
                                                ),
                                              ],
                                              undefined,
                                              factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                                              factory.createCallExpression(
                                                factory.createIdentifier('runValidationTasks'),
                                                undefined,
                                                [
                                                  factory.createIdentifier('fieldName'),
                                                  factory.createIdentifier('item'),
                                                ],
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                factory.createReturnStatement(factory.createIdentifier('promises')),
                              ],
                              true,
                            ),
                            undefined,
                          ),
                          factory.createExpressionStatement(
                            factory.createCallExpression(
                              factory.createPropertyAccessExpression(
                                factory.createIdentifier('promises'),
                                factory.createIdentifier('push'),
                              ),
                              undefined,
                              [
                                factory.createCallExpression(
                                  factory.createIdentifier('runValidationTasks'),
                                  undefined,
                                  [
                                    factory.createIdentifier('fieldName'),
                                    factory.createElementAccessExpression(
                                      factory.createIdentifier('modelFields'),
                                      factory.createIdentifier('fieldName'),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                          factory.createReturnStatement(factory.createIdentifier('promises')),
                        ],
                        true,
                      ),
                    ),
                    factory.createArrayLiteralExpression([], false),
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

export const buildUpdateDatastoreQuery = (dataTypeName: string) => {
  return [
    factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier('queryData'),
            undefined,
            undefined,
            factory.createArrowFunction(
              [factory.createModifier(SyntaxKind.AsyncKeyword)],
              undefined,
              [],
              undefined,
              factory.createToken(SyntaxKind.EqualsGreaterThanToken),
              factory.createBlock(
                [
                  factory.createVariableStatement(
                    undefined,
                    factory.createVariableDeclarationList(
                      [
                        factory.createVariableDeclaration(
                          factory.createIdentifier('record'),
                          undefined,
                          undefined,
                          factory.createConditionalExpression(
                            factory.createIdentifier('id'),
                            factory.createToken(SyntaxKind.QuestionToken),
                            factory.createAwaitExpression(
                              factory.createCallExpression(
                                factory.createPropertyAccessExpression(
                                  factory.createIdentifier('DataStore'),
                                  factory.createIdentifier('query'),
                                ),
                                undefined,
                                [factory.createIdentifier(dataTypeName), factory.createIdentifier('id')],
                              ),
                            ),
                            factory.createToken(SyntaxKind.ColonToken),
                            factory.createIdentifier(lowerCaseFirst(dataTypeName)),
                          ),
                        ),
                      ],
                      NodeFlags.Const,
                    ),
                  ),
                  factory.createExpressionStatement(
                    factory.createCallExpression(factory.createIdentifier(`set${dataTypeName}Record`), undefined, [
                      factory.createIdentifier('record'),
                    ]),
                  ),
                ],
                true,
              ),
            ),
          ),
        ],
        NodeFlags.Const,
      ),
    ),
    factory.createExpressionStatement(
      factory.createCallExpression(factory.createIdentifier('queryData'), undefined, []),
    ),
  ];
};
