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
  isControlledComponent,
} from '@aws-amplify/codegen-ui';
import {
  BindingElement,
  Expression,
  factory,
  NodeFlags,
  SyntaxKind,
  ObjectLiteralElementLike,
  ObjectLiteralExpression,
  JsxAttribute,
  IfStatement,
  ExpressionStatement,
} from 'typescript';
import { lowerCaseFirst } from '../helpers';
import { ImportCollection, ImportSource } from '../imports';
import { buildTargetVariable } from './event-targets';
import {
  buildAccessChain,
  buildNestedStateSet,
  capitalizeFirstLetter,
  getCurrentValueIdentifier,
  getCurrentValueName,
  getSetNameIdentifier,
  resetValuesName,
  setFieldState,
  setStateExpression,
} from './form-state';

export const buildMutationBindings = (form: StudioForm) => {
  const {
    dataType: { dataSourceType, dataTypeName },
    formActionType,
  } = form;
  const elements: BindingElement[] = [];
  if (dataSourceType === 'DataStore') {
    if (formActionType === 'update') {
      elements.push(
        // TODO: change once cpk is supported in datastore
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
      factory.createBindingElement(undefined, undefined, factory.createIdentifier('onSuccess'), undefined),
      factory.createBindingElement(undefined, undefined, factory.createIdentifier('onError'), undefined),
    );
  }
  if (dataSourceType === 'Custom' && formActionType === 'update') {
    factory.createBindingElement(undefined, undefined, factory.createIdentifier('initialData'), undefined);
  }
  elements.push(factory.createBindingElement(undefined, undefined, factory.createIdentifier('onSubmit'), undefined));
  return elements;
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
  const { name: componentName, componentType } = component;
  const attributes: JsxAttribute[] = [];
  /*
      boolean => RadioGroupField
      const value = e.target.value.toLowerCase() === 'yes';
      boolean => selectfield
      const value = ....
  
  
      componentType => SelectField && boolean
      const value = Boolean(e.target.checked)

    */

  if (componentName in formMetadata.fieldConfigs) {
    const fieldConfig = formMetadata.fieldConfigs[componentName];
    /*
    if the componetName is a dotPath we need to change the access expression to the following
     - bio.user.favorites.Quote => errors['bio.user.favorites.Quote']?.errorMessage
    if it's a regular componetName it will use the following expression
     - bio => errors.bio?.errorMessage
    */
    const errorKey =
      componentName.split('.').length > 1
        ? factory.createElementAccessExpression(
            factory.createIdentifier('errors'),
            factory.createStringLiteral(componentName),
          )
        : factory.createPropertyAccessExpression(
            factory.createIdentifier('errors'),
            factory.createIdentifier(componentName),
          );
    attributes.push(...buildComponentSpecificAttributes({ componentType, componentName }));
    if (formMetadata.formActionType === 'update' && !fieldConfig.isArray && !isControlledComponent(componentType)) {
      attributes.push(
        factory.createJsxAttribute(
          factory.createIdentifier('defaultValue'),
          factory.createJsxExpression(undefined, factory.createIdentifier(componentName)),
        ),
      );
    }
    attributes.push(buildOnChangeStatement(component, formMetadata.fieldConfigs));
    attributes.push(buildOnBlurStatement(componentName, fieldConfig.isArray));
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
          factory.createJsxExpression(undefined, getCurrentValueIdentifier(componentName)),
        ),
        factory.createJsxAttribute(
          factory.createIdentifier('ref'),
          factory.createJsxExpression(undefined, factory.createIdentifier(`${componentName}Ref`)),
        ),
      );
    }
  }
  if (componentName === 'ClearButton' || componentName === 'ResetButton') {
    attributes.push(
      factory.createJsxAttribute(
        factory.createIdentifier('onClick'),
        factory.createJsxExpression(undefined, resetValuesName),
      ),
    );
  }
  if (componentName === 'SubmitButton') {
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
  if (componentName === 'CancelButton') {
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

/**
  if (errors.name?.hasError) {
    runValidationTasks("name", value);
  }
 */
function getOnChangeValidationBlock(fieldName: string) {
  return factory.createIfStatement(
    factory.createPropertyAccessChain(
      factory.createPropertyAccessExpression(factory.createIdentifier('errors'), factory.createIdentifier(fieldName)),
      factory.createToken(SyntaxKind.QuestionDotToken),
      factory.createIdentifier('hasError'),
    ),
    factory.createBlock(
      [
        factory.createExpressionStatement(
          factory.createCallExpression(factory.createIdentifier('runValidationTasks'), undefined, [
            factory.createStringLiteral(fieldName),
            factory.createIdentifier('value'),
          ]),
        ),
      ],
      true,
    ),
    undefined,
  );
}

export function buildOnBlurStatement(fieldName: string, isArray: boolean | undefined) {
  return factory.createJsxAttribute(
    factory.createIdentifier('onBlur'),
    factory.createJsxExpression(
      undefined,
      factory.createArrowFunction(
        undefined,
        undefined,
        [],
        undefined,
        factory.createToken(SyntaxKind.EqualsGreaterThanToken),
        factory.createCallExpression(factory.createIdentifier('runValidationTasks'), undefined, [
          factory.createStringLiteral(fieldName),
          isArray ? getCurrentValueIdentifier(fieldName) : factory.createIdentifier(fieldName),
        ]),
      ),
    ),
  );
}

/**
 * if the onChange variable is defined it will send the current state of the fields into the function
 * the function expects all fields in return
 * the value for that fields onChange will be used from the return object for validation and updating the new state
 *
 *
 * ex. if the field is email
 * const returnObject = onChange({ email, ...otherFieldsForForm });
 * const value = returnObject.email;
 *
 * this value is now used in email validation and setting the state
 */
export const buildOverrideOnChangeStatement = (
  fieldName: string,
  fieldConfigs: Record<string, FieldConfigMetadata>,
): IfStatement => {
  const keyPath = fieldName.split('.');
  const keyName = keyPath[0];
  let keyValueExpression = factory.createPropertyAssignment(
    factory.createIdentifier(keyName),
    factory.createIdentifier('value'),
  );
  if (keyPath.length > 1) {
    keyValueExpression = factory.createPropertyAssignment(
      factory.createIdentifier(keyName),
      buildNestedStateSet(keyPath, [keyName], factory.createIdentifier('value')),
    );
  }
  return factory.createIfStatement(
    factory.createIdentifier('onChange'),
    factory.createBlock(
      [
        buildModelFieldObject(true, fieldConfigs, {
          [keyName]: keyValueExpression,
        }),
        factory.createVariableStatement(
          undefined,
          factory.createVariableDeclarationList(
            [
              factory.createVariableDeclaration(
                factory.createIdentifier('result'),
                undefined,
                undefined,
                factory.createCallExpression(factory.createIdentifier('onChange'), undefined, [
                  factory.createIdentifier('modelFields'),
                ]),
              ),
            ],
            NodeFlags.Const,
          ),
        ),
        factory.createExpressionStatement(
          factory.createBinaryExpression(
            factory.createIdentifier('value'),
            factory.createToken(SyntaxKind.EqualsToken),
            factory.createBinaryExpression(
              buildAccessChain(['result', ...fieldName.split('.')]),
              factory.createToken(SyntaxKind.QuestionQuestionToken),
              factory.createIdentifier('value'),
            ),
          ),
        ),
      ],
      true,
    ),
    undefined,
  );
};

function getOnValueChangeProp(fieldType: string): string {
  const map: { [key: string]: string } = {
    StepperField: 'onStepChange',
  };

  return map[fieldType] ?? 'onChange';
}

export const buildComponentSpecificAttributes = ({
  componentType,
  componentName,
}: {
  componentType: string;
  componentName: string;
}) => {
  const stateName = componentName.split('.')[0];
  const componentToAttributesMap: { [key: string]: JsxAttribute[] } = {
    ToggleButton: [
      factory.createJsxAttribute(
        factory.createIdentifier('isPressed'),
        factory.createJsxExpression(undefined, factory.createIdentifier(stateName)),
      ),
    ],
    SliderField: [
      factory.createJsxAttribute(
        factory.createIdentifier('value'),
        factory.createJsxExpression(undefined, factory.createIdentifier(stateName)),
      ),
    ],
    SelectField: [
      factory.createJsxAttribute(
        factory.createIdentifier('value'),
        factory.createJsxExpression(undefined, factory.createIdentifier(stateName)),
      ),
    ],
    StepperField: [
      factory.createJsxAttribute(
        factory.createIdentifier('value'),
        factory.createJsxExpression(undefined, factory.createIdentifier(stateName)),
      ),
    ],
  };

  return componentToAttributesMap[componentType] ?? [];
};

export const buildOnChangeStatement = (
  component: StudioComponent | StudioComponentChild,
  fieldConfigs: Record<string, FieldConfigMetadata>,
) => {
  const { name: fieldName, componentType: fieldType } = component;
  const { dataType, isArray } = fieldConfigs[fieldName];
  if (isArray) {
    return factory.createJsxAttribute(
      factory.createIdentifier(getOnValueChangeProp(fieldType)),
      factory.createJsxExpression(
        undefined,
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
          factory.createBlock(
            [
              buildTargetVariable(fieldType, fieldName, dataType),
              buildOverrideOnChangeStatement(fieldName, fieldConfigs),
              getOnChangeValidationBlock(fieldName),
              setStateExpression(getCurrentValueName(fieldName), factory.createIdentifier('value')),
            ],
            true,
          ),
        ),
      ),
    );
  }
  return factory.createJsxAttribute(
    factory.createIdentifier(getOnValueChangeProp(fieldType)),
    factory.createJsxExpression(
      undefined,
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
        factory.createBlock(
          [
            buildTargetVariable(fieldType, fieldName, dataType),
            buildOverrideOnChangeStatement(fieldName, fieldConfigs),
            getOnChangeValidationBlock(fieldName),
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
      factory.createTypeReferenceNode(factory.createIdentifier('FormProps'), [
        factory.createTypeReferenceNode(factory.createIdentifier('GridProps'), undefined),
      ]),
    ),
  ];

  formDefinition.elementMatrix.forEach((row, index) => {
    if (row.length > 1) {
      typeNodes.push(
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier(`RowGrid${index}`),
          factory.createToken(SyntaxKind.QuestionToken),
          factory.createTypeReferenceNode(factory.createIdentifier('FormProps'), [
            factory.createTypeReferenceNode(factory.createIdentifier('GridProps'), undefined),
          ]),
        ),
      );
    }
    row.forEach((field) => {
      const propKey =
        field.split('.').length > 1 ? factory.createStringLiteral(field) : factory.createIdentifier(field);
      const componentTypePropName = `${formDefinition.elements[field].componentType}Props`;
      typeNodes.push(
        factory.createPropertySignature(
          undefined,
          propKey,
          factory.createToken(SyntaxKind.QuestionToken),
          factory.createTypeReferenceNode(factory.createIdentifier('FormProps'), [
            factory.createTypeReferenceNode(factory.createIdentifier(componentTypePropName), undefined),
          ]),
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
 * the nameOverrides will swap in a different expression instead of the name of the state when building the object
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
export const buildModelFieldObject = (
  shouldBeConst: boolean,
  fieldConfigs: Record<string, FieldConfigMetadata> = {},
  nameOverrides: Record<string, ObjectLiteralElementLike> = {},
) => {
  const fieldSet = new Set<string>();
  const fields = Object.keys(fieldConfigs).reduce<ObjectLiteralElementLike[]>((acc, value) => {
    const fieldName = value.split('.')[0];
    if (!fieldSet.has(fieldName)) {
      const assignment = nameOverrides[fieldName]
        ? nameOverrides[fieldName]
        : factory.createShorthandPropertyAssignment(factory.createIdentifier(fieldName), undefined);
      acc.push(assignment);
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
      shouldBeConst ? NodeFlags.Const : NodeFlags.Let,
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

export const buildSetStateFunction = (fieldConfigs: Record<string, FieldConfigMetadata>) => {
  const fieldSet = new Set<string>();
  const expression = Object.keys(fieldConfigs).reduce<ExpressionStatement[]>((acc, field) => {
    const fieldName = field.split('.')[0];
    if (!fieldSet.has(fieldName)) {
      acc.push(
        factory.createExpressionStatement(
          factory.createCallExpression(factory.createIdentifier(`set${capitalizeFirstLetter(fieldName)}`), undefined, [
            factory.createPropertyAccessExpression(
              factory.createIdentifier('initialData'),
              factory.createIdentifier(fieldName),
            ),
          ]),
        ),
      );
      fieldSet.add(fieldName);
    }
    return acc;
  }, []);
  return factory.createIfStatement(factory.createIdentifier('initialData'), factory.createBlock(expression, true));
};

// ex. React.useEffect(resetStateValues, [bookRecord])
export const buildResetValuesOnRecordUpdate = (recordName: string) => {
  return factory.createExpressionStatement(
    factory.createCallExpression(
      factory.createPropertyAccessExpression(factory.createIdentifier('React'), factory.createIdentifier('useEffect')),
      undefined,
      [resetValuesName, factory.createArrayLiteralExpression([factory.createIdentifier(recordName)], false)],
    ),
  );
};

export const buildUpdateDatastoreQuery = (dataTypeName: string, recordName: string) => {
  // TODO: update this once cpk is supported in datastore
  const pkQueryIdentifier = factory.createIdentifier('id');
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
                            pkQueryIdentifier,
                            factory.createToken(SyntaxKind.QuestionToken),
                            factory.createAwaitExpression(
                              factory.createCallExpression(
                                factory.createPropertyAccessExpression(
                                  factory.createIdentifier('DataStore'),
                                  factory.createIdentifier('query'),
                                ),
                                undefined,
                                [factory.createIdentifier(dataTypeName), pkQueryIdentifier],
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
                    factory.createCallExpression(getSetNameIdentifier(recordName), undefined, [
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
