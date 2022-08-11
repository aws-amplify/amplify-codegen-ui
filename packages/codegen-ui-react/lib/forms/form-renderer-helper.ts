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
  FieldValidationConfiguration,
  FormDefinition,
  StateStudioComponentProperty,
  StudioComponent,
  StudioComponentChild,
  StudioForm,
  StudioFormActionType,
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
} from 'typescript';
import { ImportCollection, ImportSource, ImportValue } from '../imports';
import { getStateName, getSetStateName } from '../react-component-render-helper';
import { getActionIdentifier } from '../workflow';

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
                  factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
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

export const buildOnChangeStatement = (fieldName: string, validationRules?: FieldValidationConfiguration[]) => {
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
            factory.createVariableStatement(
              undefined,
              factory.createVariableDeclarationList(
                [
                  factory.createVariableDeclaration(
                    factory.createObjectBindingPattern([
                      factory.createBindingElement(undefined, undefined, factory.createIdentifier('value'), undefined),
                    ]),
                    undefined,
                    undefined,
                    factory.createPropertyAccessExpression(
                      factory.createIdentifier('e'),
                      factory.createIdentifier('target'),
                    ),
                  ),
                ],
                NodeFlags.Const,
              ),
            ),
            factory.createVariableStatement(
              undefined,
              factory.createVariableDeclarationList(
                [
                  factory.createVariableDeclaration(
                    factory.createIdentifier('isValidResult'),
                    undefined,
                    undefined,
                    factory.createConditionalExpression(
                      factory.createElementAccessChain(
                        factory.createIdentifier('onValidate'),
                        factory.createToken(SyntaxKind.QuestionDotToken),
                        factory.createStringLiteral(fieldName),
                      ),
                      factory.createToken(SyntaxKind.QuestionToken),
                      factory.createAwaitExpression(
                        factory.createCallExpression(
                          factory.createElementAccessExpression(
                            factory.createIdentifier('onValidate'),
                            factory.createStringLiteral(fieldName),
                          ),
                          undefined,
                          [factory.createIdentifier('value')],
                        ),
                      ),
                      factory.createToken(SyntaxKind.ColonToken),
                      factory.createCallExpression(factory.createIdentifier('validateField'), undefined, [
                        factory.createIdentifier('value'),
                        createValidationExpression(validationRules),
                      ]),
                    ),
                  ),
                ],
                NodeFlags.Const,
              ),
            ),
            factory.createExpressionStatement(
              factory.createCallExpression(
                factory.createIdentifier(`set${capitalizeFirstLetter(fieldName)}FieldError`),
                undefined,
                [
                  factory.createObjectLiteralExpression(
                    [
                      factory.createSpreadAssignment(factory.createIdentifier(`${fieldName}FieldError`)),
                      factory.createSpreadAssignment(factory.createIdentifier('isValidResult')),
                    ],
                    false,
                  ),
                ],
              ),
            ),
            factory.createExpressionStatement(
              factory.createCallExpression(factory.createIdentifier('setFormValid'), undefined, [
                factory.createPrefixUnaryExpression(
                  SyntaxKind.ExclamationToken,
                  factory.createPropertyAccessExpression(
                    factory.createIdentifier(`${fieldName}FieldError`),
                    factory.createIdentifier('hasError'),
                  ),
                ),
              ]),
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
  if (component.componentType.includes('Field')) {
    if (formMetadata?.onChangeFields.includes(component.name)) {
      const validationRules = formMetadata.onValidationFields?.[component.name];
      attributes.push(buildOnChangeStatement(component.name, validationRules));
    }
    attributes.push(
      factory.createJsxAttribute(
        factory.createIdentifier('errorMessage'),
        factory.createJsxExpression(
          undefined,
          factory.createPropertyAccessExpression(
            factory.createIdentifier(`${component.name}FieldError`),
            factory.createIdentifier('errorMessage'),
          ),
        ),
      ),
      factory.createJsxAttribute(
        factory.createIdentifier('hasError'),
        factory.createJsxExpression(
          undefined,
          factory.createPropertyAccessExpression(
            factory.createIdentifier(`${component.name}FieldError`),
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
          factory.createPrefixUnaryExpression(SyntaxKind.ExclamationToken, factory.createIdentifier('formValid')),
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
