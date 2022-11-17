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
import { FieldConfigMetadata } from '@aws-amplify/codegen-ui/lib/types';
import { factory, NodeFlags, SyntaxKind, Expression } from 'typescript';
import { lowerCaseFirst } from '../../helpers';
import { getDisplayValueObjectName } from './display-value';
import { getSetNameIdentifier } from './form-state';
import { buildManyToManyRelationshipCreateStatements } from './relationship';

export const buildDataStoreExpression = (
  dataStoreActionType: 'update' | 'create',
  importedModelName: string,
  hasManyFieldConfigs: [string, FieldConfigMetadata][],
) => {
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
                  [factory.createIdentifier(importedModelName), factory.createIdentifier('id')],
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
                  factory.createIdentifier(importedModelName),
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

  // TODO: Many to Many update action, this condition dataStoreActionType === 'create' can be moved inside the functon
  if (hasManyFieldConfigs.length > 0 && dataStoreActionType === 'create') {
    return hasManyFieldConfigs
      .map((hasManyFieldConfig) => {
        const [, fieldConfigMetaData] = hasManyFieldConfig;
        if (
          fieldConfigMetaData.relationship?.type === 'HAS_MANY' &&
          fieldConfigMetaData.relationship.relatedJoinTableName
        ) {
          return buildManyToManyRelationshipCreateStatements(importedModelName, hasManyFieldConfig);
        }
        return [];
      })
      .reduce((statements, statement) => {
        return [...statements, ...statement];
      }, []);
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
            factory.createNewExpression(factory.createIdentifier(importedModelName), undefined, [
              factory.createIdentifier('modelFields'),
            ]),
          ],
        ),
      ),
    ),
  ];
};

/**
  example: const validationResponses = await Promise.all(
    Object.keys(validations).reduce((promises, fieldName) => {
      if (Array.isArray(modelFields[fieldName])) {
        promises.push(
          ...modelFields[fieldName].map((item) =>
            runValidationTasks(fieldName, item, getDisplayValue[fieldName]),
          ),
        );
        return promises;
      }
      promises.push(runValidationTasks(fieldName, modelFields[fieldName], getDisplayValue[fieldName]));
      return promises;
    }, []),
  );
  if (validationResponses.some((r) => r.hasError)) {
    return;
  }
*/

export const onSubmitValidationRun = (shouldUseGetDisplayValue?: boolean) => {
  const getDisplayValueAccess = factory.createElementAccessExpression(
    factory.createIdentifier(getDisplayValueObjectName),
    factory.createIdentifier('fieldName'),
  );

  const runValidationTasksArgsForArray: Expression[] = [
    factory.createIdentifier('fieldName'),
    factory.createIdentifier('item'),
  ];

  const runValidationTasksArgs = [
    factory.createIdentifier('fieldName'),
    factory.createElementAccessExpression(
      factory.createIdentifier('modelFields'),
      factory.createIdentifier('fieldName'),
    ),
  ];

  if (shouldUseGetDisplayValue) {
    runValidationTasksArgsForArray.push(getDisplayValueAccess);
    runValidationTasksArgs.push(getDisplayValueAccess);
  }

  return [
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
                            undefined,
                          ),
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
                                                    undefined,
                                                  ),
                                                ],
                                                undefined,
                                                factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                                                factory.createCallExpression(
                                                  factory.createIdentifier('runValidationTasks'),
                                                  undefined,
                                                  runValidationTasksArgsForArray,
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
                                    runValidationTasksArgs,
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