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
import { FieldConfigMetadata, GenericDataSchema } from '@aws-amplify/codegen-ui';
import {
  factory,
  NodeFlags,
  SyntaxKind,
  Expression,
  Statement,
  VariableStatement,
  ExpressionStatement,
  IfStatement,
} from 'typescript';
import { getModelNameProp, getSetNameIdentifier, lowerCaseFirst } from '../../helpers';
import { getDisplayValueObjectName } from './model-values';
import {
  buildHasManyRelationshipStatements,
  buildManyToManyRelationshipStatements,
  getRelationshipBasedRecordUpdateStatements,
} from './relationship';
import { isManyToManyRelationship } from './map-from-fieldConfigs';
import { ImportCollection } from '../../imports';
import { getBiDirectionalRelationshipStatements } from './bidirectional-relationship';
import { generateModelObjectToSave } from './parse-fields';
import { DataApiKind } from '../../react-render-config';
import {
  ActionType,
  getGraphqlCallExpression,
  getGraphqlQueryForModel,
  wrapInParenthesizedExpression,
} from '../../utils/graphql';

const getRecordCreateCallExpression = ({
  savedObjectName,
  importedModelName,
  importCollection,
  dataApi,
  renderConfigDependencies,
}: {
  savedObjectName: string;
  importedModelName: string;
  importCollection: ImportCollection;
  dataApi?: DataApiKind;
  renderConfigDependencies?: { [key: string]: string };
}) => {
  if (dataApi === 'GraphQL') {
    const inputs = [factory.createSpreadAssignment(factory.createIdentifier(savedObjectName))];

    return getGraphqlCallExpression(
      ActionType.CREATE,
      importedModelName,
      importCollection,
      { inputs },
      undefined,
      renderConfigDependencies,
    );
  }

  return factory.createCallExpression(
    factory.createPropertyAccessExpression(factory.createIdentifier('DataStore'), factory.createIdentifier('save')),
    undefined,
    [
      factory.createNewExpression(factory.createIdentifier(importedModelName), undefined, [
        factory.createIdentifier(savedObjectName),
      ]),
    ],
  );
};

const getRecordUpdateDataStoreCallExpression = ({
  savedObjectName,
  savedRecordName,
  thisModelPrimaryKeys,
  modelName,
  importedModelName,
  fieldConfigs,
  importCollection,
  dataApi,
  renderConfigDependencies,
}: {
  savedObjectName: string;
  savedRecordName: string;
  thisModelPrimaryKeys: string[];
  modelName: string;
  importedModelName: string;
  fieldConfigs: Record<string, FieldConfigMetadata>;
  importCollection: ImportCollection;
  dataApi?: DataApiKind;
  renderConfigDependencies?: { [key: string]: string };
}) => {
  const updatedObjectName = 'updated';
  // TODO: remove after DataStore addresses issue: https://github.com/aws-amplify/amplify-js/issues/10750
  // temporary solution to remove hasOne & belongsTo records
  const relationshipBasedUpdates = getRelationshipBasedRecordUpdateStatements({
    updatedObjectName,
    savedObjectName,
    fieldConfigs,
  });

  if (dataApi === 'GraphQL') {
    const inputs = [
      ...thisModelPrimaryKeys.map((key) =>
        factory.createPropertyAssignment(
          factory.createIdentifier(key),
          factory.createPropertyAccessExpression(factory.createIdentifier(`${savedRecordName}Record`), key),
        ),
      ),
      factory.createSpreadAssignment(factory.createIdentifier(savedObjectName)),
    ];

    return getGraphqlCallExpression(
      ActionType.UPDATE,
      importedModelName,
      importCollection,
      { inputs },
      undefined,
      renderConfigDependencies,
    );
  }

  return factory.createCallExpression(
    factory.createPropertyAccessExpression(factory.createIdentifier('DataStore'), factory.createIdentifier('save')),
    undefined,
    [
      factory.createCallExpression(
        factory.createPropertyAccessExpression(
          factory.createIdentifier(importedModelName),
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
                factory.createIdentifier(updatedObjectName),
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
                    [factory.createIdentifier(updatedObjectName), factory.createIdentifier(savedObjectName)],
                  ),
                ),
                ...relationshipBasedUpdates,
              ],
              true,
            ),
          ),
        ],
      ),
    ],
  );
};

/**
  Object.entries(modelFields).forEach(([key, value]) => {
    if (typeof value === 'string' && value === "") {
      modelFields[key] = undefined;
    }
  });
 */
export const replaceEmptyStringStatement = factory.createExpressionStatement(
  factory.createCallExpression(
    factory.createPropertyAccessExpression(
      factory.createCallExpression(
        factory.createPropertyAccessExpression(factory.createIdentifier('Object'), factory.createIdentifier('entries')),
        undefined,
        [factory.createIdentifier('modelFields')],
      ),
      factory.createIdentifier('forEach'),
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
            factory.createArrayBindingPattern([
              factory.createBindingElement(undefined, undefined, factory.createIdentifier('key'), undefined),
              factory.createBindingElement(undefined, undefined, factory.createIdentifier('value'), undefined),
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
            factory.createIfStatement(
              factory.createBinaryExpression(
                factory.createBinaryExpression(
                  factory.createTypeOfExpression(factory.createIdentifier('value')),
                  factory.createToken(SyntaxKind.EqualsEqualsEqualsToken),
                  factory.createStringLiteral('string'),
                ),
                factory.createToken(SyntaxKind.AmpersandAmpersandToken),
                factory.createBinaryExpression(
                  factory.createIdentifier('value'),
                  factory.createToken(SyntaxKind.EqualsEqualsEqualsToken),
                  factory.createStringLiteral(''),
                ),
              ),
              factory.createBlock(
                [
                  factory.createExpressionStatement(
                    factory.createBinaryExpression(
                      factory.createElementAccessExpression(
                        factory.createIdentifier('modelFields'),
                        factory.createIdentifier('key'),
                      ),
                      factory.createToken(SyntaxKind.EqualsToken),
                      factory.createNull(),
                    ),
                  ),
                ],
                true,
              ),
              undefined,
            ),
          ],
          true,
        ),
      ),
    ],
  ),
);

export const buildExpression = (
  dataStoreActionType: 'update' | 'create',
  modelName: string,
  importedModelName: string,
  fieldConfigs: Record<string, FieldConfigMetadata>,
  dataSchema: GenericDataSchema,
  importCollection: ImportCollection,
  dataApi?: DataApiKind,
  renderConfigDependencies?: { [key: string]: string },
): Statement[] => {
  const modelFieldsObjectName = 'modelFields';
  const modelFieldsObjectToSaveName = 'modelFieldsToSave';

  const thisModelPrimaryKeys = dataSchema.models[modelName].primaryKeys;
  // promises.push(...statements that handle hasMany/ manyToMany/ hasOne-belongsTo relationships)
  const relationshipsPromisesAccessStatements: (VariableStatement | ExpressionStatement | IfStatement)[] = [];
  const savedRecordName = lowerCaseFirst(modelName);

  Object.entries(fieldConfigs).forEach((fieldConfig) => {
    const [, fieldConfigMetaData] = fieldConfig;

    relationshipsPromisesAccessStatements.push(
      ...getBiDirectionalRelationshipStatements({
        formActionType: dataStoreActionType,
        dataSchema,
        importCollection,
        fieldConfig,
        modelName,
        savedRecordName,
        thisModelPrimaryKeys,
        dataApi,
        renderConfigDependencies,
      }),
    );
    if (fieldConfigMetaData.relationship?.type === 'HAS_MANY') {
      if (isManyToManyRelationship(fieldConfigMetaData)) {
        const joinTable = dataSchema.models[fieldConfigMetaData.relationship.relatedJoinTableName];
        relationshipsPromisesAccessStatements.push(
          ...buildManyToManyRelationshipStatements(
            dataStoreActionType,
            importedModelName,
            fieldConfig,
            thisModelPrimaryKeys,
            joinTable,
            savedRecordName,
            importCollection,
            dataApi,
            renderConfigDependencies,
          ),
        );
      } else {
        relationshipsPromisesAccessStatements.push(
          ...buildHasManyRelationshipStatements(
            dataStoreActionType,
            importedModelName,
            fieldConfig,
            thisModelPrimaryKeys,
            savedRecordName,
            importCollection,
            dataApi,
            renderConfigDependencies,
          ),
        );
      }
    }
  });

  if (relationshipsPromisesAccessStatements.length) {
    relationshipsPromisesAccessStatements.unshift(
      factory.createVariableStatement(
        undefined,
        factory.createVariableDeclarationList(
          [
            factory.createVariableDeclaration(
              factory.createIdentifier('promises'),
              undefined,
              undefined,
              factory.createArrayLiteralExpression([], false),
            ),
          ],
          NodeFlags.Const,
        ),
      ),
    );
  }

  const { modelObjectToSave, isDifferentFromModelObject } = generateModelObjectToSave(
    fieldConfigs,
    modelFieldsObjectName,
    dataSchema.models,
    dataApi === 'GraphQL',
    dataStoreActionType,
  );

  const modelObjectToSaveStatements: Statement[] = [];

  let savedObjectName = modelFieldsObjectName;
  if (isDifferentFromModelObject) {
    savedObjectName = modelFieldsObjectToSaveName;
    modelObjectToSaveStatements.push(
      factory.createVariableStatement(
        undefined,
        factory.createVariableDeclarationList(
          [
            factory.createVariableDeclaration(
              factory.createIdentifier(modelFieldsObjectToSaveName),
              undefined,
              undefined,
              modelObjectToSave,
            ),
          ],
          NodeFlags.Const,
        ),
      ),
    );
  }

  const resolvePromisesStatement = factory.createExpressionStatement(
    factory.createAwaitExpression(
      factory.createCallExpression(
        factory.createPropertyAccessExpression(factory.createIdentifier('Promise'), factory.createIdentifier('all')),
        undefined,
        [factory.createIdentifier('promises')],
      ),
    ),
  );

  if (dataStoreActionType === 'update') {
    const recordUpdateDataStoreCallExpression = getRecordUpdateDataStoreCallExpression({
      savedObjectName,
      savedRecordName,
      thisModelPrimaryKeys,
      modelName,
      importedModelName,
      fieldConfigs,
      importCollection,
      dataApi,
      renderConfigDependencies,
    });

    const genericUpdateStatement = relationshipsPromisesAccessStatements.length
      ? [
          factory.createExpressionStatement(
            factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier('promises'),
                factory.createIdentifier('push'),
              ),
              undefined,
              [recordUpdateDataStoreCallExpression],
            ),
          ),
          resolvePromisesStatement,
        ]
      : [factory.createExpressionStatement(factory.createAwaitExpression(recordUpdateDataStoreCallExpression))];

    return [...relationshipsPromisesAccessStatements, ...modelObjectToSaveStatements, ...genericUpdateStatement];
  }

  const recordCreateCallExpression = getRecordCreateCallExpression({
    savedObjectName,
    importedModelName,
    importCollection,
    dataApi,
    renderConfigDependencies,
  });
  const genericCreateStatement = relationshipsPromisesAccessStatements.length
    ? [
        factory.createVariableStatement(
          undefined,
          factory.createVariableDeclarationList(
            [
              factory.createVariableDeclaration(
                factory.createIdentifier(savedRecordName),
                undefined,
                undefined,
                dataApi === 'GraphQL'
                  ? factory.createPropertyAccessChain(
                      factory.createPropertyAccessChain(
                        factory.createParenthesizedExpression(
                          factory.createAwaitExpression(recordCreateCallExpression),
                        ),
                        factory.createToken(SyntaxKind.QuestionDotToken),
                        factory.createIdentifier('data'),
                      ),
                      factory.createToken(SyntaxKind.QuestionDotToken),
                      factory.createIdentifier(getGraphqlQueryForModel(ActionType.CREATE, importedModelName)),
                    )
                  : factory.createAwaitExpression(recordCreateCallExpression),
              ),
            ],
            NodeFlags.Const,
          ),
        ),
      ]
    : [factory.createExpressionStatement(factory.createAwaitExpression(recordCreateCallExpression))];
  const createStatements = [
    ...modelObjectToSaveStatements,
    ...genericCreateStatement,
    ...relationshipsPromisesAccessStatements,
  ];
  if (relationshipsPromisesAccessStatements.length) {
    createStatements.push(resolvePromisesStatement);
  }
  return createStatements;
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

export const buildUpdateDatastoreQuery = (
  importedModelName: string,
  lowerCaseDataTypeName: string,
  relatedModelStatements: Statement[],
  primaryKeyPropName: string,
  importCollection: ImportCollection,
  primaryKeys: string[],
  dataApi?: DataApiKind,
  renderConfigDependencies?: { [key: string]: string },
) => {
  // if there are multiple primaryKeys, it's a composite key and we're using 'id' for a composite key prop
  const pkPropIdentifier = factory.createIdentifier(primaryKeyPropName);

  const queryCall =
    dataApi === 'GraphQL'
      ? wrapInParenthesizedExpression(
          getGraphqlCallExpression(
            ActionType.GET,
            importedModelName,
            importCollection,
            {
              inputs: [
                primaryKeys.length > 1
                  ? factory.createSpreadAssignment(pkPropIdentifier)
                  : factory.createPropertyAssignment(factory.createIdentifier(primaryKeys[0]), pkPropIdentifier),
              ],
            },
            undefined,
            renderConfigDependencies,
          ),
          ['data', getGraphqlQueryForModel(ActionType.GET, importedModelName)],
        )
      : factory.createAwaitExpression(
          factory.createCallExpression(
            factory.createPropertyAccessExpression(
              factory.createIdentifier('DataStore'),
              factory.createIdentifier('query'),
            ),
            undefined,
            [factory.createIdentifier(importedModelName), pkPropIdentifier],
          ),
        );

  const statements: Statement[] = [];
  const setRecordStatement: ExpressionStatement = factory.createExpressionStatement(
    factory.createCallExpression(getSetNameIdentifier(`${lowerCaseDataTypeName}Record`), undefined, [
      factory.createIdentifier('record'),
    ]),
  );

  if (dataApi === 'GraphQL') {
    statements.push(...relatedModelStatements);
    statements.push(setRecordStatement);
  } else {
    statements.push(setRecordStatement);
    statements.push(...relatedModelStatements);
  }

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
                            pkPropIdentifier,
                            factory.createToken(SyntaxKind.QuestionToken),
                            queryCall,
                            factory.createToken(SyntaxKind.ColonToken),
                            factory.createIdentifier(getModelNameProp(lowerCaseDataTypeName)),
                          ),
                        ),
                      ],
                      NodeFlags.Const,
                    ),
                  ),
                  ...statements,
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
