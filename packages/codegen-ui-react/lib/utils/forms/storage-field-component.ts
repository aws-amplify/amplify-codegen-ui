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
  FieldConfigMetadata,
  FormDefinitionStorageFieldElement,
  LabelDecorator,
  StudioComponent,
  StudioComponentChild,
  ComponentMetadata,
  isValidVariableName,
} from '@aws-amplify/codegen-ui';
import { factory, JsxAttributeLike, JsxChild, JsxElement, JsxExpression, NodeFlags, SyntaxKind } from 'typescript';
import { getDecoratedLabel } from '../../forms/form-renderer-helper';
import { buildStorageManagerOnChangeStatement } from '../../forms/form-renderer-helper/event-handler-props';
import { propertyToExpression } from '../../react-component-render-helper';
import { STORAGE_FILE_ALGO_TYPE, STORAGE_FILE_KEY } from '../constants';
import { lowerCaseFirst } from '../../helpers';
import { ImportValue } from '../../imports';

const fieldKeys = new Set<keyof FormDefinitionStorageFieldElement['props']>([
  'label',
  'isRequired',
  'isReadOnly',
  'descriptiveText',
]);

const storageManagerKeys = new Set<keyof FormDefinitionStorageFieldElement['props']>([
  'accessLevel',
  'acceptedFileTypes',
  'showThumbnails',
  'isResumable',
  'maxFileCount',
  'maxSize',
]);

function isFieldKey(key: string) {
  return fieldKeys.has(key as any);
}

function isStorageManagerKey(key: string) {
  return storageManagerKeys.has(key as any);
}

export const buildStorageManagerProcessFileVariableStatement = () => {
  return factory.createVariableStatement(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier('processFile'),
          undefined,
          undefined,
          factory.createArrowFunction(
            [factory.createToken(SyntaxKind.AsyncKeyword)],
            undefined,
            [
              factory.createParameterDeclaration(
                undefined,
                undefined,
                undefined,
                factory.createObjectBindingPattern([
                  factory.createBindingElement(undefined, undefined, factory.createIdentifier('file'), undefined),
                ]),
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
                        factory.createIdentifier('fileExtension'),
                        undefined,
                        undefined,
                        factory.createCallExpression(
                          factory.createPropertyAccessExpression(
                            factory.createCallExpression(
                              factory.createPropertyAccessExpression(
                                factory.createPropertyAccessExpression(
                                  factory.createIdentifier('file'),
                                  factory.createIdentifier('name'),
                                ),
                                factory.createIdentifier('split'),
                              ),
                              undefined,
                              [factory.createStringLiteral('.')],
                            ),
                            factory.createIdentifier('pop'),
                          ),
                          undefined,
                          [],
                        ),
                      ),
                    ],
                    NodeFlags.Const,
                  ),
                ),
                factory.createReturnStatement(
                  factory.createCallExpression(
                    factory.createPropertyAccessExpression(
                      factory.createCallExpression(
                        factory.createPropertyAccessExpression(
                          factory.createCallExpression(
                            factory.createPropertyAccessExpression(
                              factory.createIdentifier('file'),
                              factory.createIdentifier('arrayBuffer'),
                            ),
                            undefined,
                            [],
                          ),
                          factory.createIdentifier('then'),
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
                                factory.createIdentifier('filebuffer'),
                                undefined,
                                undefined,
                                undefined,
                              ),
                            ],
                            undefined,
                            factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                            factory.createCallExpression(
                              factory.createPropertyAccessExpression(
                                factory.createPropertyAccessExpression(
                                  factory.createPropertyAccessExpression(
                                    factory.createIdentifier('window'),
                                    factory.createIdentifier('crypto'),
                                  ),
                                  factory.createIdentifier('subtle'),
                                ),
                                factory.createIdentifier('digest'),
                              ),
                              undefined,
                              [
                                factory.createStringLiteral(STORAGE_FILE_ALGO_TYPE),
                                factory.createIdentifier('filebuffer'),
                              ],
                            ),
                          ),
                        ],
                      ),
                      factory.createIdentifier('then'),
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
                            factory.createIdentifier('hashBuffer'),
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
                                    factory.createIdentifier('hashArray'),
                                    undefined,
                                    undefined,
                                    factory.createCallExpression(
                                      factory.createPropertyAccessExpression(
                                        factory.createIdentifier('Array'),
                                        factory.createIdentifier('from'),
                                      ),
                                      undefined,
                                      [
                                        factory.createNewExpression(factory.createIdentifier('Uint8Array'), undefined, [
                                          factory.createIdentifier('hashBuffer'),
                                        ]),
                                      ],
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
                                    factory.createIdentifier('hashHex'),
                                    undefined,
                                    undefined,
                                    factory.createCallExpression(
                                      factory.createPropertyAccessExpression(
                                        factory.createCallExpression(
                                          factory.createPropertyAccessExpression(
                                            factory.createIdentifier('hashArray'),
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
                                                  factory.createIdentifier('a'),
                                                  undefined,
                                                  undefined,
                                                  undefined,
                                                ),
                                              ],
                                              undefined,
                                              factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                                              factory.createCallExpression(
                                                factory.createPropertyAccessExpression(
                                                  factory.createCallExpression(
                                                    factory.createPropertyAccessExpression(
                                                      factory.createIdentifier('a'),
                                                      factory.createIdentifier('toString'),
                                                    ),
                                                    undefined,
                                                    [factory.createNumericLiteral('16')],
                                                  ),
                                                  factory.createIdentifier('padStart'),
                                                ),
                                                undefined,
                                                [factory.createNumericLiteral('2'), factory.createStringLiteral('0')],
                                              ),
                                            ),
                                          ],
                                        ),
                                        factory.createIdentifier('join'),
                                      ),
                                      undefined,
                                      [factory.createStringLiteral('')],
                                    ),
                                  ),
                                ],
                                NodeFlags.Const,
                              ),
                            ),
                            factory.createReturnStatement(
                              factory.createObjectLiteralExpression(
                                [
                                  factory.createShorthandPropertyAssignment(
                                    factory.createIdentifier('file'),
                                    undefined,
                                  ),
                                  factory.createPropertyAssignment(
                                    factory.createIdentifier('key'),
                                    factory.createTemplateExpression(factory.createTemplateHead('', ''), [
                                      factory.createTemplateSpan(
                                        factory.createIdentifier('hashHex'),
                                        factory.createTemplateMiddle('.', '.'),
                                      ),
                                      factory.createTemplateSpan(
                                        factory.createIdentifier('fileExtension'),
                                        factory.createTemplateTail('', ''),
                                      ),
                                    ]),
                                  ),
                                ],
                                false,
                              ),
                            ),
                          ],
                          true,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
              true,
            ),
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  );
};

export const renderStorageFieldComponent = (
  component: StudioComponent | StudioComponentChild,
  componentMetadata: ComponentMetadata,
  fieldLabel: string,
  fieldConfigs: Record<string, FieldConfigMetadata>,
  labelDecorator?: LabelDecorator,
  isRequired?: boolean,
) => {
  const { name: componentName } = component;
  const dataTypeName = componentMetadata.formMetadata?.dataType.dataTypeName || '';
  const lowerCaseDataTypeName = lowerCaseFirst(dataTypeName);
  const lowerCaseDataTypeNameRecord = `${lowerCaseDataTypeName}Record`;
  const storageManagerComponentName = factory.createIdentifier('StorageManager');
  const storageManagerAttributes: JsxAttributeLike[] = [];
  const fieldAttributes: JsxAttributeLike[] = [];

  if (componentMetadata.formMetadata) {
    const errorKey =
      componentName.split('.').length > 1 || !isValidVariableName(componentName)
        ? factory.createElementAccessExpression(
            factory.createIdentifier('errors'),
            factory.createStringLiteral(componentName),
          )
        : factory.createPropertyAccessExpression(
            factory.createIdentifier('errors'),
            factory.createIdentifier(componentName),
          );

    if (componentMetadata.formMetadata.formActionType === 'update') {
      const defaultFileExpression: JsxExpression = fieldConfigs[component.name].isArray
        ? factory.createJsxExpression(
            undefined,
            factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createPropertyAccessExpression(
                  factory.createIdentifier(lowerCaseDataTypeNameRecord),
                  factory.createIdentifier(componentName),
                ),
                factory.createIdentifier('map'),
              ),
              undefined,
              [
                factory.createParenthesizedExpression(
                  factory.createArrowFunction(
                    undefined,
                    undefined,
                    [
                      factory.createParameterDeclaration(
                        undefined,
                        undefined,
                        undefined,
                        factory.createIdentifier(STORAGE_FILE_KEY),
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
                          factory.createShorthandPropertyAssignment(
                            factory.createIdentifier(STORAGE_FILE_KEY),
                            undefined,
                          ),
                        ],
                        false,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          )
        : factory.createJsxExpression(
            undefined,
            factory.createArrayLiteralExpression(
              [
                factory.createObjectLiteralExpression(
                  [
                    factory.createPropertyAssignment(
                      factory.createIdentifier('key'),
                      factory.createPropertyAccessExpression(
                        factory.createIdentifier(lowerCaseDataTypeNameRecord),
                        factory.createIdentifier(componentName),
                      ),
                    ),
                  ],
                  false,
                ),
              ],
              false,
            ),
          );

      storageManagerAttributes.push(
        factory.createJsxAttribute(factory.createIdentifier('defaultFiles'), defaultFileExpression),
      );
    }

    storageManagerAttributes.push(buildStorageManagerOnChangeStatement(component, fieldConfigs, 'onUploadSuccess'));
    storageManagerAttributes.push(buildStorageManagerOnChangeStatement(component, fieldConfigs, 'onFileRemove'));
    storageManagerAttributes.push(
      factory.createJsxAttribute(
        factory.createIdentifier('processFile'),
        factory.createJsxExpression(undefined, factory.createIdentifier(ImportValue.PROCESS_FILE)),
      ),
    );

    fieldAttributes.push(
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
  }

  Object.entries(component.properties).forEach(([key, value]) => {
    if (isFieldKey(key)) {
      if (
        (key === 'label' && labelDecorator && labelDecorator === 'required' && isRequired) ||
        (labelDecorator === 'optional' && !isRequired && 'value' in value)
      ) {
        fieldAttributes.push(getDecoratedLabel('label', fieldLabel, labelDecorator));
      } else {
        fieldAttributes.push(
          factory.createJsxAttribute(
            factory.createIdentifier(key),
            factory.createJsxExpression(undefined, propertyToExpression(componentMetadata, value)),
          ),
        );
      }
    }
    if (isStorageManagerKey(key)) {
      let storageManagerValue = value;

      if (key === 'maxFileCount' && !fieldConfigs[componentName].isArray) {
        storageManagerValue = { ...value, value: 1 };
      }

      storageManagerAttributes.push(
        factory.createJsxAttribute(
          factory.createIdentifier(key),
          factory.createJsxExpression(undefined, propertyToExpression(componentMetadata, storageManagerValue)),
        ),
      );
    }
  });

  storageManagerAttributes.push(
    factory.createJsxSpreadAttribute(
      factory.createCallExpression(factory.createIdentifier('getOverrideProps'), undefined, [
        factory.createIdentifier('overrides'),
        factory.createStringLiteral(componentName),
      ]),
    ),
  );

  const storageManager = factory.createJsxElement(
    factory.createJsxOpeningElement(
      storageManagerComponentName,
      undefined,
      factory.createJsxAttributes(storageManagerAttributes),
    ),
    [],
    factory.createJsxClosingElement(storageManagerComponentName),
  );

  const wrappedStorageManagerBlock = factory.createJsxExpression(
    undefined,
    factory.createBinaryExpression(
      factory.createIdentifier(lowerCaseDataTypeNameRecord),
      factory.createToken(SyntaxKind.AmpersandAmpersandToken),
      factory.createParenthesizedExpression(storageManager),
    ),
  );
  return renderFieldWrapper(
    fieldAttributes,
    componentMetadata.formMetadata?.formActionType === 'update' ? wrappedStorageManagerBlock : storageManager,
  );
};

export const renderFieldWrapper = (attributes: JsxAttributeLike[], storageManagerComponent: JsxChild): JsxElement => {
  const storageManagerComponentName = factory.createIdentifier('Field');

  return factory.createJsxElement(
    factory.createJsxOpeningElement(storageManagerComponentName, undefined, factory.createJsxAttributes(attributes)),
    [storageManagerComponent],
    factory.createJsxClosingElement(storageManagerComponentName),
  );
};
