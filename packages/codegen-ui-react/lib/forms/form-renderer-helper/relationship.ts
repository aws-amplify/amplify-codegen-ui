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
import { CallExpression, factory, IfStatement, NodeFlags, PropertyAssignment, Statement, SyntaxKind } from 'typescript';
import {
  FieldConfigMetadata,
  HasManyRelationshipType,
  InternalError,
  GenericDataModel,
  GenericDataField,
} from '@aws-amplify/codegen-ui';
import { getRecordsName, getLinkedDataName, buildAccessChain, getCanUnlinkModelName } from './form-state';
import { buildBaseCollectionVariableStatement } from '../../react-studio-template-renderer-helper';
import { ImportCollection } from '../../imports';
import { lowerCaseFirst, getSetNameIdentifier, capitalizeFirstLetter } from '../../helpers';
import { isManyToManyRelationship } from './map-from-fieldConfigs';
import { extractModelAndKeys, getIDValueCallChain, getMatchEveryModelFieldCallExpression } from './model-values';
import { isModelDataType } from './render-checkers';
import { DataApiKind } from '../../react-render-config';

export const buildRelationshipQuery = (
  relatedModelName: string,
  importCollection: ImportCollection,
  dataApi?: DataApiKind,
) => {
  const itemsName = getRecordsName(relatedModelName);

  if (dataApi === 'GraphQL') {
    const query = `list${importCollection.addModelImport(relatedModelName)}s`;
    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(itemsName),
            undefined,
            undefined,
            factory.createAwaitExpression(
              factory.createPropertyAccessExpression(
                factory.createPropertyAccessExpression(
                  factory.createCallExpression(
                    factory.createPropertyAccessExpression(
                      factory.createIdentifier('API'),
                      factory.createIdentifier('graphql'),
                    ),
                    undefined,
                    [
                      factory.createObjectLiteralExpression(
                        [
                          factory.createPropertyAssignment(
                            factory.createIdentifier('query'),
                            factory.createIdentifier(importCollection.addGraphqlQueryImport(query)),
                          ),
                        ],
                        false,
                      ),
                    ],
                  ),
                  factory.createIdentifier('data'),
                ),
                factory.createIdentifier(query),
              ),
            ),
          ),
        ],
        NodeFlags.Const,
      ),
    );
  }

  const objectProperties = [
    factory.createPropertyAssignment(factory.createIdentifier('type'), factory.createStringLiteral('collection')),
    factory.createPropertyAssignment(
      factory.createIdentifier('model'),
      factory.createIdentifier(importCollection.addModelImport(relatedModelName)),
    ),
  ];
  return buildBaseCollectionVariableStatement(
    itemsName,
    factory.createCallExpression(factory.createIdentifier('useDataStoreBinding'), undefined, [
      factory.createObjectLiteralExpression(objectProperties, true),
    ]),
  );
};

const getJoinTableQueryArrowFunction = ({
  thisModelPrimaryKeys,
  relatedModelPrimaryKeys,
  joinTableThisModelFields,
  joinTableRelatedModelFields,
  thisModelRecord,
}: {
  thisModelPrimaryKeys: string[];
  relatedModelPrimaryKeys: string[];
  joinTableThisModelFields: string[];
  joinTableRelatedModelFields: string[];
  thisModelRecord: string;
}) => {
  const getQueryCallExpression = (queriedKey: string, recordName: string, recordKey: string) =>
    factory.createCallExpression(
      factory.createPropertyAccessExpression(
        factory.createPropertyAccessExpression(factory.createIdentifier('r'), factory.createIdentifier(queriedKey)),
        factory.createIdentifier('eq'),
      ),
      undefined,
      [
        factory.createPropertyAccessExpression(
          factory.createIdentifier(recordName),
          factory.createIdentifier(recordKey),
        ),
      ],
    );

  const recordKeysString = 'recordKeys';

  const queryCallExpressions: CallExpression[] = [];

  joinTableRelatedModelFields.forEach((field, index) => {
    const recordKey = relatedModelPrimaryKeys[index];
    if (!recordKey) {
      throw new InternalError(`Cannot find corresponding key for ${field}`);
    }
    queryCallExpressions.push(getQueryCallExpression(field, recordKeysString, recordKey));
  });

  joinTableThisModelFields.forEach((field, index) => {
    const recordKey = thisModelPrimaryKeys[index];
    if (!recordKey) {
      throw new InternalError(`Cannot find corresponding key for ${field}`);
    }
    queryCallExpressions.push(getQueryCallExpression(field, thisModelRecord, recordKey));
  });

  return factory.createArrowFunction(
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
    factory.createBlock(
      [
        factory.createVariableStatement(
          undefined,
          factory.createVariableDeclarationList(
            [
              factory.createVariableDeclaration(
                factory.createIdentifier(recordKeysString),
                undefined,
                undefined,
                factory.createCallExpression(
                  factory.createPropertyAccessExpression(
                    factory.createIdentifier('JSON'),
                    factory.createIdentifier('parse'),
                  ),
                  undefined,
                  [factory.createIdentifier('id')],
                ),
              ),
            ],
            NodeFlags.Const,
          ),
        ),
        factory.createReturnStatement(factory.createArrayLiteralExpression(queryCallExpressions, true)),
      ],
      true,
    ),
  );
};

function extractAssociatedFields(field: GenericDataField): string[] | undefined {
  const { relationship } = field;
  if (relationship && 'associatedFields' in relationship && relationship.associatedFields) {
    return relationship.associatedFields;
  }
  return undefined;
}

function createHasManyUpdateRelatedModelBlock({
  relatedModelFields,
  thisModelPrimaryKeys,
  thisModelRecord,
  belongsToFieldOnRelatedModel,
  setToNull,
}: {
  relatedModelFields: string[];
  thisModelPrimaryKeys: string[];
  thisModelRecord: string;
  belongsToFieldOnRelatedModel?: string;
  setToNull?: boolean;
}) {
  const statements: Statement[] = relatedModelFields.map((relatedModelField, index) => {
    const correspondingPrimaryKey = thisModelPrimaryKeys[index];
    if (!correspondingPrimaryKey) {
      throw new InternalError(`Corresponding primary key not found for ${relatedModelField}`);
    }

    // updated.cPKTeacherID = cPKTeacherRecord.specialTeacherId;
    return factory.createExpressionStatement(
      factory.createBinaryExpression(
        factory.createPropertyAccessExpression(
          factory.createIdentifier('updated'),
          factory.createIdentifier(relatedModelField),
        ),
        factory.createToken(SyntaxKind.EqualsToken),
        setToNull
          ? factory.createNull()
          : factory.createPropertyAccessExpression(
              factory.createIdentifier(thisModelRecord),
              factory.createIdentifier(correspondingPrimaryKey),
            ),
      ),
    );
  });

  // updated.Org = orgRecord;
  if (belongsToFieldOnRelatedModel) {
    statements.push(
      factory.createExpressionStatement(
        factory.createBinaryExpression(
          factory.createPropertyAccessExpression(
            factory.createIdentifier('updated'),
            factory.createIdentifier(belongsToFieldOnRelatedModel),
          ),
          factory.createToken(SyntaxKind.EqualsToken),
          setToNull ? factory.createNull() : factory.createIdentifier(thisModelRecord),
        ),
      ),
    );
  }
  return factory.createBlock(statements, true);
}

export const buildManyToManyRelationshipStatements = (
  dataStoreActionType: 'update' | 'create',
  modelName: string,
  hasManyFieldConfig: [string, FieldConfigMetadata],
  thisModelPrimaryKeys: string[],
  joinTable: GenericDataModel,
  savedModelName: string,
  importCollection: ImportCollection,
  dataApi?: DataApiKind,
) => {
  let [fieldName] = hasManyFieldConfig;
  const [, fieldConfigMetaData] = hasManyFieldConfig;
  fieldName = fieldConfigMetaData.sanitizedFieldName || fieldName;
  const { relatedModelFields, relatedJoinFieldName, relatedJoinTableName, relatedModelName } =
    fieldConfigMetaData.relationship as HasManyRelationshipType;
  const joinTableThisModelName = relatedModelFields[0];
  const joinTableRelatedModelName = relatedJoinFieldName;
  if (!relatedJoinTableName) {
    throw new InternalError(`Cannot find join table for ${fieldName}`);
  }
  if (!joinTableRelatedModelName) {
    throw new InternalError(`Cannot find corresponding field in join table for ${fieldName}`);
  }
  const joinTableThisModelFields = extractAssociatedFields(joinTable.fields[joinTableThisModelName]);
  const joinTableRelatedModelFields = extractAssociatedFields(joinTable.fields[joinTableRelatedModelName]);

  if (!joinTableThisModelFields || !joinTableRelatedModelFields) {
    throw new InternalError(`Cannot find associated fields to build ${fieldName}`);
  }
  if (dataStoreActionType === 'update') {
    const idValueCallChain = getIDValueCallChain({ fieldName, recordString: 'r' });
    const linkedDataName = getLinkedDataName(fieldName);
    const dataToLinkMap = `${lowerCaseFirst(fieldName)}ToLinkMap`;
    const dataToUnlinkMap = `${lowerCaseFirst(fieldName)}ToUnLinkMap`;
    const updatedMap = `${lowerCaseFirst(fieldName)}Map`;
    const originalMap = `${linkedDataName}Map`;
    const { keys: relatedModelPrimaryKeys } = extractModelAndKeys(fieldConfigMetaData.valueMappings);
    if (!relatedModelPrimaryKeys) {
      throw new InternalError(`Could not identify primary key(s) for ${relatedModelName}`);
    }

    return [
      factory.createVariableStatement(
        undefined,
        factory.createVariableDeclarationList(
          [
            factory.createVariableDeclaration(
              factory.createIdentifier(dataToLinkMap),
              undefined,
              undefined,
              factory.createNewExpression(factory.createIdentifier('Map'), undefined, []),
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
              factory.createIdentifier(dataToUnlinkMap),
              undefined,
              undefined,
              factory.createNewExpression(factory.createIdentifier('Map'), undefined, []),
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
              factory.createIdentifier(updatedMap),
              undefined,
              undefined,
              factory.createNewExpression(factory.createIdentifier('Map'), undefined, []),
            ),
          ],
          NodeFlags.Const,
        ),
      ),
      // const linkedCPKClassesMap  = new Map();
      factory.createVariableStatement(
        undefined,
        factory.createVariableDeclarationList(
          [
            factory.createVariableDeclaration(
              factory.createIdentifier(originalMap),
              undefined,
              undefined,
              factory.createNewExpression(factory.createIdentifier('Map'), undefined, []),
            ),
          ],
          NodeFlags.Const,
        ),
      ),
      factory.createExpressionStatement(
        factory.createCallExpression(
          factory.createPropertyAccessExpression(
            factory.createIdentifier(fieldName),
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
                  factory.createIdentifier('r'),
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
                    // const count = cPKClassesMap.get(getIDValue.CPKClasses?.(r));
                    factory.createVariableDeclarationList(
                      [
                        factory.createVariableDeclaration(
                          factory.createIdentifier('count'),
                          undefined,
                          undefined,
                          factory.createCallExpression(
                            factory.createPropertyAccessExpression(
                              factory.createIdentifier(updatedMap),
                              factory.createIdentifier('get'),
                            ),
                            undefined,
                            [idValueCallChain],
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
                          factory.createIdentifier('newCount'),
                          undefined,
                          undefined,
                          factory.createConditionalExpression(
                            factory.createIdentifier('count'),
                            factory.createToken(SyntaxKind.QuestionToken),
                            factory.createBinaryExpression(
                              factory.createIdentifier('count'),
                              factory.createToken(SyntaxKind.PlusToken),
                              factory.createNumericLiteral('1'),
                            ),
                            factory.createToken(SyntaxKind.ColonToken),
                            factory.createNumericLiteral('1'),
                          ),
                        ),
                      ],
                      NodeFlags.Const,
                    ),
                  ),
                  // cPKClassesMap.set(getIDValue.CPKClasses?.(r), newCount);
                  factory.createExpressionStatement(
                    factory.createCallExpression(
                      factory.createPropertyAccessExpression(
                        factory.createIdentifier(updatedMap),
                        factory.createIdentifier('set'),
                      ),
                      undefined,
                      [idValueCallChain, factory.createIdentifier('newCount')],
                    ),
                  ),
                ],
                true,
              ),
            ),
          ],
        ),
      ),
      factory.createExpressionStatement(
        factory.createCallExpression(
          factory.createPropertyAccessExpression(
            factory.createIdentifier(linkedDataName),
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
                  factory.createIdentifier('r'),
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
                        // const count = linkedCPKClassesMap.get(getIDValue.CPKClasses?.(r));
                        factory.createVariableDeclaration(
                          factory.createIdentifier('count'),
                          undefined,
                          undefined,
                          factory.createCallExpression(
                            factory.createPropertyAccessExpression(
                              factory.createIdentifier(originalMap),
                              factory.createIdentifier('get'),
                            ),
                            undefined,
                            [idValueCallChain],
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
                          factory.createIdentifier('newCount'),
                          undefined,
                          undefined,
                          factory.createConditionalExpression(
                            factory.createIdentifier('count'),
                            factory.createToken(SyntaxKind.QuestionToken),
                            factory.createBinaryExpression(
                              factory.createIdentifier('count'),
                              factory.createToken(SyntaxKind.PlusToken),
                              factory.createNumericLiteral('1'),
                            ),
                            factory.createToken(SyntaxKind.ColonToken),
                            factory.createNumericLiteral('1'),
                          ),
                        ),
                      ],
                      NodeFlags.Const,
                    ),
                  ),
                  factory.createExpressionStatement(
                    //  linkedCPKClassesMap.set(getIDValue.CPKClasses?.(r), newCount);
                    factory.createCallExpression(
                      factory.createPropertyAccessExpression(
                        factory.createIdentifier(originalMap),
                        factory.createIdentifier('set'),
                      ),
                      undefined,
                      [idValueCallChain, factory.createIdentifier('newCount')],
                    ),
                  ),
                ],
                true,
              ),
            ),
          ],
        ),
      ),
      factory.createExpressionStatement(
        factory.createCallExpression(
          factory.createPropertyAccessExpression(
            factory.createIdentifier(originalMap),
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
                  factory.createIdentifier('count'),
                  undefined,
                  undefined,
                  undefined,
                ),
                factory.createParameterDeclaration(
                  undefined,
                  undefined,
                  undefined,
                  factory.createIdentifier('id'),
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
                          factory.createIdentifier('newCount'),
                          undefined,
                          undefined,
                          factory.createCallExpression(
                            factory.createPropertyAccessExpression(
                              factory.createIdentifier(updatedMap),
                              factory.createIdentifier('get'),
                            ),
                            undefined,
                            [factory.createIdentifier('id')],
                          ),
                        ),
                      ],
                      NodeFlags.Const,
                    ),
                  ),
                  factory.createIfStatement(
                    factory.createIdentifier('newCount'),
                    factory.createBlock(
                      [
                        factory.createVariableStatement(
                          undefined,
                          factory.createVariableDeclarationList(
                            [
                              factory.createVariableDeclaration(
                                factory.createIdentifier('diffCount'),
                                undefined,
                                undefined,
                                factory.createBinaryExpression(
                                  factory.createIdentifier('count'),
                                  factory.createToken(SyntaxKind.MinusToken),
                                  factory.createIdentifier('newCount'),
                                ),
                              ),
                            ],
                            NodeFlags.Const,
                          ),
                        ),
                        factory.createIfStatement(
                          factory.createBinaryExpression(
                            factory.createIdentifier('diffCount'),
                            factory.createToken(SyntaxKind.GreaterThanToken),
                            factory.createNumericLiteral('0'),
                          ),
                          factory.createBlock(
                            [
                              factory.createExpressionStatement(
                                factory.createCallExpression(
                                  factory.createPropertyAccessExpression(
                                    factory.createIdentifier(dataToUnlinkMap),
                                    factory.createIdentifier('set'),
                                  ),
                                  undefined,
                                  [factory.createIdentifier('id'), factory.createIdentifier('diffCount')],
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
                    factory.createBlock(
                      [
                        factory.createExpressionStatement(
                          factory.createCallExpression(
                            factory.createPropertyAccessExpression(
                              factory.createIdentifier(dataToUnlinkMap),
                              factory.createIdentifier('set'),
                            ),
                            undefined,
                            [factory.createIdentifier('id'), factory.createIdentifier('count')],
                          ),
                        ),
                      ],
                      true,
                    ),
                  ),
                ],
                true,
              ),
            ),
          ],
        ),
      ),
      factory.createExpressionStatement(
        factory.createCallExpression(
          factory.createPropertyAccessExpression(
            factory.createIdentifier(updatedMap),
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
                  factory.createIdentifier('count'),
                  undefined,
                  undefined,
                  undefined,
                ),
                factory.createParameterDeclaration(
                  undefined,
                  undefined,
                  undefined,
                  factory.createIdentifier('id'),
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
                          factory.createIdentifier('originalCount'),
                          undefined,
                          undefined,
                          factory.createCallExpression(
                            factory.createPropertyAccessExpression(
                              factory.createIdentifier(originalMap),
                              factory.createIdentifier('get'),
                            ),
                            undefined,
                            [factory.createIdentifier('id')],
                          ),
                        ),
                      ],
                      NodeFlags.Const,
                    ),
                  ),
                  factory.createIfStatement(
                    factory.createIdentifier('originalCount'),
                    factory.createBlock(
                      [
                        factory.createVariableStatement(
                          undefined,
                          factory.createVariableDeclarationList(
                            [
                              factory.createVariableDeclaration(
                                factory.createIdentifier('diffCount'),
                                undefined,
                                undefined,
                                factory.createBinaryExpression(
                                  factory.createIdentifier('count'),
                                  factory.createToken(SyntaxKind.MinusToken),
                                  factory.createIdentifier('originalCount'),
                                ),
                              ),
                            ],
                            NodeFlags.Const,
                          ),
                        ),
                        factory.createIfStatement(
                          factory.createBinaryExpression(
                            factory.createIdentifier('diffCount'),
                            factory.createToken(SyntaxKind.GreaterThanToken),
                            factory.createNumericLiteral('0'),
                          ),
                          factory.createBlock(
                            [
                              factory.createExpressionStatement(
                                factory.createCallExpression(
                                  factory.createPropertyAccessExpression(
                                    factory.createIdentifier(dataToLinkMap),
                                    factory.createIdentifier('set'),
                                  ),
                                  undefined,
                                  [factory.createIdentifier('id'), factory.createIdentifier('diffCount')],
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
                    factory.createBlock(
                      [
                        factory.createExpressionStatement(
                          factory.createCallExpression(
                            factory.createPropertyAccessExpression(
                              factory.createIdentifier(dataToLinkMap),
                              factory.createIdentifier('set'),
                            ),
                            undefined,
                            [factory.createIdentifier('id'), factory.createIdentifier('count')],
                          ),
                        ),
                      ],
                      true,
                    ),
                  ),
                ],
                true,
              ),
            ),
          ],
        ),
      ),
      factory.createExpressionStatement(
        factory.createCallExpression(
          factory.createPropertyAccessExpression(
            factory.createIdentifier(dataToUnlinkMap),
            factory.createIdentifier('forEach'),
          ),
          undefined,
          [
            factory.createArrowFunction(
              [factory.createModifier(SyntaxKind.AsyncKeyword)],
              undefined,
              [
                factory.createParameterDeclaration(
                  undefined,
                  undefined,
                  undefined,
                  factory.createIdentifier('count'),
                  undefined,
                  undefined,
                  undefined,
                ),
                factory.createParameterDeclaration(
                  undefined,
                  undefined,
                  undefined,
                  factory.createIdentifier('id'),
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
                          factory.createIdentifier(getRecordsName(relatedJoinTableName)),
                          undefined,
                          undefined,
                          factory.createAwaitExpression(
                            factory.createCallExpression(
                              factory.createPropertyAccessExpression(
                                factory.createIdentifier('DataStore'),
                                factory.createIdentifier('query'),
                              ),
                              undefined,
                              [
                                factory.createIdentifier(relatedJoinTableName),
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
                                  factory.createCallExpression(
                                    factory.createPropertyAccessExpression(
                                      factory.createIdentifier('r'),
                                      factory.createIdentifier('and'),
                                    ),
                                    undefined,
                                    [
                                      getJoinTableQueryArrowFunction({
                                        thisModelPrimaryKeys,
                                        relatedModelPrimaryKeys,
                                        joinTableThisModelFields,
                                        joinTableRelatedModelFields,
                                        thisModelRecord: `${lowerCaseFirst(modelName)}Record`,
                                      }),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                      // eslint-disable-next-line no-bitwise
                      NodeFlags.Const | NodeFlags.AwaitContext | NodeFlags.ContextFlags | NodeFlags.TypeExcludesFlags,
                    ),
                  ),
                  factory.createForStatement(
                    factory.createVariableDeclarationList(
                      [
                        factory.createVariableDeclaration(
                          factory.createIdentifier('i'),
                          undefined,
                          undefined,
                          factory.createNumericLiteral('0'),
                        ),
                      ],
                      // eslint-disable-next-line no-bitwise
                      NodeFlags.Let | NodeFlags.AwaitContext | NodeFlags.ContextFlags | NodeFlags.TypeExcludesFlags,
                    ),
                    factory.createBinaryExpression(
                      factory.createIdentifier('i'),
                      factory.createToken(SyntaxKind.LessThanToken),
                      factory.createIdentifier('count'),
                    ),
                    factory.createPostfixUnaryExpression(factory.createIdentifier('i'), SyntaxKind.PlusPlusToken),
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
                              factory.createCallExpression(
                                factory.createPropertyAccessExpression(
                                  factory.createIdentifier('DataStore'),
                                  factory.createIdentifier('delete'),
                                ),
                                undefined,
                                [
                                  factory.createElementAccessExpression(
                                    factory.createIdentifier(getRecordsName(relatedJoinTableName as string)),
                                    factory.createIdentifier('i'),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                      true,
                    ),
                  ),
                ],
                true,
              ),
            ),
          ],
        ),
      ),
      factory.createExpressionStatement(
        factory.createCallExpression(
          factory.createPropertyAccessExpression(
            factory.createIdentifier(dataToLinkMap),
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
                  factory.createIdentifier('count'),
                  undefined,
                  undefined,
                  undefined,
                ),
                factory.createParameterDeclaration(
                  undefined,
                  undefined,
                  undefined,
                  factory.createIdentifier('id'),
                  undefined,
                  undefined,
                  undefined,
                ),
              ],
              undefined,
              factory.createToken(SyntaxKind.EqualsGreaterThanToken),
              factory.createBlock(
                [
                  factory.createForStatement(
                    factory.createVariableDeclarationList(
                      [
                        factory.createVariableDeclaration(
                          factory.createIdentifier('i'),
                          undefined,
                          undefined,
                          factory.createIdentifier('count'),
                        ),
                      ],
                      NodeFlags.Let,
                    ),
                    factory.createBinaryExpression(
                      factory.createIdentifier('i'),
                      factory.createToken(SyntaxKind.GreaterThanToken),
                      factory.createNumericLiteral('0'),
                    ),
                    factory.createPostfixUnaryExpression(factory.createIdentifier('i'), SyntaxKind.MinusMinusToken),
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
                              factory.createCallExpression(
                                factory.createPropertyAccessExpression(
                                  factory.createIdentifier('DataStore'),
                                  factory.createIdentifier('save'),
                                ),
                                undefined,
                                [
                                  factory.createNewExpression(
                                    factory.createIdentifier(relatedJoinTableName as string),
                                    undefined,
                                    [
                                      factory.createObjectLiteralExpression(
                                        [
                                          // cpkTeacher: cPKTeacherRecord,
                                          factory.createPropertyAssignment(
                                            factory.createIdentifier(joinTableThisModelName),
                                            factory.createIdentifier(`${lowerCaseFirst(modelName)}Record`),
                                          ),
                                          // compositeVet: compositeVetRecords.find(
                                          //   (r) => Object.entries(JSON.parse(id)).every(([key, value]) =>
                                          //   r[key] === value))
                                          factory.createPropertyAssignment(
                                            factory.createIdentifier(joinTableRelatedModelName),
                                            getMatchEveryModelFieldCallExpression({
                                              recordsArrayName: getRecordsName(relatedModelName),
                                              JSONName: 'id',
                                            }),
                                          ),
                                        ],
                                        true,
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                      true,
                    ),
                  ),
                ],
                true,
              ),
            ),
          ],
        ),
      ),
    ];
  }

  return [
    factory.createExpressionStatement(
      factory.createCallExpression(
        factory.createPropertyAccessExpression(factory.createIdentifier('promises'), factory.createIdentifier('push')),
        undefined,
        [
          factory.createSpreadElement(
            factory.createParenthesizedExpression(
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createIdentifier(fieldName),
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
                        factory.createIdentifier(joinTableRelatedModelName),
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
                              factory.createIdentifier('promises'),
                              factory.createIdentifier('push'),
                            ),
                            undefined,
                            [
                              getCreateJoinTableExpression(
                                relatedJoinTableName,
                                savedModelName,
                                joinTableThisModelName,
                                joinTableRelatedModelName,
                                importCollection,
                                dataApi,
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
            ),
          ),
        ],
      ),
    ),
  ];
};

export const buildGetRelationshipModels = (fieldName: string, fieldConfigMetaData: FieldConfigMetadata) => {
  if (fieldConfigMetaData.relationship?.type === 'HAS_MANY') {
    const linkedDataName = getLinkedDataName(fieldName);
    const { relatedJoinFieldName } = fieldConfigMetaData.relationship as HasManyRelationshipType;
    let lazyLoadLinkedDataStatement;
    if (isManyToManyRelationship(fieldConfigMetaData)) {
      lazyLoadLinkedDataStatement = factory.createVariableStatement(
        undefined,
        factory.createVariableDeclarationList(
          [
            factory.createVariableDeclaration(
              factory.createIdentifier(linkedDataName),
              undefined,
              undefined,
              factory.createConditionalExpression(
                factory.createIdentifier('record'),
                factory.createToken(SyntaxKind.QuestionToken),
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
                          factory.createParenthesizedExpression(
                            factory.createAwaitExpression(
                              factory.createCallExpression(
                                factory.createPropertyAccessExpression(
                                  factory.createPropertyAccessExpression(
                                    factory.createIdentifier('record'),
                                    factory.createIdentifier(fieldName),
                                  ),
                                  factory.createIdentifier('toArray'),
                                ),
                                undefined,
                                [],
                              ),
                            ),
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
                                factory.createIdentifier('r'),
                                undefined,
                                undefined,
                                undefined,
                              ),
                            ],
                            undefined,
                            factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                            factory.createBlock(
                              [
                                factory.createReturnStatement(
                                  factory.createPropertyAccessExpression(
                                    factory.createIdentifier('r'),
                                    factory.createIdentifier(relatedJoinFieldName as string),
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
                factory.createToken(SyntaxKind.ColonToken),
                factory.createArrayLiteralExpression([], false),
              ),
            ),
          ],
          // eslint-disable-next-line no-bitwise
          NodeFlags.Const | NodeFlags.AwaitContext | NodeFlags.ContextFlags | NodeFlags.TypeExcludesFlags,
        ),
      );
    } else {
      lazyLoadLinkedDataStatement = factory.createVariableStatement(
        undefined,
        factory.createVariableDeclarationList(
          [
            factory.createVariableDeclaration(
              factory.createIdentifier(linkedDataName),
              undefined,
              undefined,
              factory.createConditionalExpression(
                factory.createIdentifier('record'),
                factory.createToken(SyntaxKind.QuestionToken),
                factory.createAwaitExpression(
                  factory.createCallExpression(
                    factory.createPropertyAccessExpression(
                      factory.createPropertyAccessExpression(
                        factory.createIdentifier('record'),
                        factory.createIdentifier(fieldName),
                      ),
                      factory.createIdentifier('toArray'),
                    ),
                    undefined,
                    [],
                  ),
                ),
                factory.createToken(SyntaxKind.ColonToken),
                factory.createArrayLiteralExpression([], false),
              ),
            ),
          ],
          NodeFlags.Const,
        ),
      );
    }

    const setLinkedDataStateStatement = factory.createExpressionStatement(
      factory.createCallExpression(getSetNameIdentifier(linkedDataName), undefined, [
        factory.createIdentifier(linkedDataName),
      ]),
    );
    return [lazyLoadLinkedDataStatement, setLinkedDataStateStatement];
  }
  return [
    factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(`${fieldName}Record`),
            undefined,
            undefined,
            factory.createConditionalExpression(
              factory.createIdentifier('record'),
              factory.createToken(SyntaxKind.QuestionToken),
              factory.createAwaitExpression(
                factory.createPropertyAccessExpression(
                  factory.createIdentifier('record'),
                  factory.createIdentifier(fieldName),
                ),
              ),
              factory.createToken(SyntaxKind.ColonToken),
              factory.createIdentifier('undefined'),
            ),
          ),
        ],
        NodeFlags.Const,
      ),
    ),
    factory.createExpressionStatement(
      factory.createCallExpression(getSetNameIdentifier(fieldName), undefined, [
        factory.createIdentifier(`${fieldName}Record`),
      ]),
    ),
  ];
};

export const buildHasManyRelationshipStatements = (
  dataStoreActionType: 'update' | 'create',
  modelName: string,
  hasManyFieldConfig: [string, FieldConfigMetadata],
  thisModelPrimaryKeys: string[],
  savedModelName: string,
  importCollection: ImportCollection,
  dataApi?: DataApiKind,
) => {
  let [fieldName] = hasManyFieldConfig;
  const [, fieldConfigMetaData] = hasManyFieldConfig;
  fieldName = fieldConfigMetaData.sanitizedFieldName || fieldName;
  const { relatedModelName, relatedModelFields, belongsToFieldOnRelatedModel } =
    fieldConfigMetaData.relationship as HasManyRelationshipType;
  const relatedModelVariableName = importCollection.getMappedAlias(ImportSource.LOCAL_MODELS, relatedModelName);
  const linkedDataName = getLinkedDataName(fieldName);
  const dataToLink = `${lowerCaseFirst(fieldName)}ToLink`;
  const dataToUnLink = `${lowerCaseFirst(fieldName)}ToUnLink`;
  const dataToLinkSet = `${lowerCaseFirst(fieldName)}Set`;
  const linkedDataSet = `${linkedDataName}Set`;
  const { keys } = extractModelAndKeys(fieldConfigMetaData.valueMappings);
  if (!keys) {
    throw new InternalError(`Could not identify primary key(s) for ${relatedModelName}`);
  }
  if (dataStoreActionType === 'update') {
    const idValueCallChain = getIDValueCallChain({ fieldName, recordString: 'r' });

    return [
      factory.createVariableStatement(
        undefined,
        factory.createVariableDeclarationList(
          [
            factory.createVariableDeclaration(
              factory.createIdentifier(dataToLink),
              undefined,
              undefined,
              factory.createArrayLiteralExpression([], false),
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
              factory.createIdentifier(dataToUnLink),
              undefined,
              undefined,
              factory.createArrayLiteralExpression([], false),
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
              factory.createIdentifier(dataToLinkSet),
              undefined,
              undefined,
              factory.createNewExpression(factory.createIdentifier('Set'), undefined, []),
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
              factory.createIdentifier(linkedDataSet),
              undefined,
              undefined,
              factory.createNewExpression(factory.createIdentifier('Set'), undefined, []),
            ),
          ],
          NodeFlags.Const,
        ),
      ),
      factory.createExpressionStatement(
        factory.createCallExpression(
          // CPKProjects.forEach((r) => cPKProjectsSet.add(getIDValue.CPKProjects?.(r)));
          factory.createPropertyAccessExpression(
            factory.createIdentifier(fieldName),
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
                  factory.createIdentifier('r'),
                  undefined,
                  undefined,
                  undefined,
                ),
              ],
              undefined,
              factory.createToken(SyntaxKind.EqualsGreaterThanToken),
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createIdentifier(dataToLinkSet),
                  factory.createIdentifier('add'),
                ),
                undefined,
                [idValueCallChain],
              ),
            ),
          ],
        ),
      ),
      // linkedCPKProjects.forEach((r) => linkedCPKProjectsSet.add(getIDValue.CPKProjects?.(r)));
      factory.createExpressionStatement(
        factory.createCallExpression(
          factory.createPropertyAccessExpression(
            factory.createIdentifier(linkedDataName),
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
                  factory.createIdentifier('r'),
                  undefined,
                  undefined,
                  undefined,
                ),
              ],
              undefined,
              factory.createToken(SyntaxKind.EqualsGreaterThanToken),
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createIdentifier(linkedDataSet),
                  factory.createIdentifier('add'),
                ),
                undefined,
                [idValueCallChain],
              ),
            ),
          ],
        ),
      ),
      factory.createExpressionStatement(
        factory.createCallExpression(
          factory.createPropertyAccessExpression(
            factory.createIdentifier(linkedDataName),
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
                  factory.createIdentifier('r'),
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
                    factory.createPrefixUnaryExpression(
                      SyntaxKind.ExclamationToken,
                      factory.createCallExpression(
                        factory.createPropertyAccessExpression(
                          factory.createIdentifier(dataToLinkSet),
                          factory.createIdentifier('has'),
                        ),
                        undefined,
                        [idValueCallChain],
                      ),
                    ),
                    factory.createBlock(
                      [
                        factory.createExpressionStatement(
                          factory.createCallExpression(
                            factory.createPropertyAccessExpression(
                              factory.createIdentifier(dataToUnLink),
                              factory.createIdentifier('push'),
                            ),
                            undefined,
                            [factory.createIdentifier('r')],
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
      ),
      factory.createExpressionStatement(
        factory.createCallExpression(
          factory.createPropertyAccessExpression(
            factory.createIdentifier(fieldName),
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
                  factory.createIdentifier('r'),
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
                    factory.createPrefixUnaryExpression(
                      SyntaxKind.ExclamationToken,
                      factory.createCallExpression(
                        factory.createPropertyAccessExpression(
                          factory.createIdentifier(linkedDataSet),
                          factory.createIdentifier('has'),
                        ),
                        undefined,
                        [idValueCallChain],
                      ),
                    ),
                    factory.createBlock(
                      [
                        factory.createExpressionStatement(
                          factory.createCallExpression(
                            factory.createPropertyAccessExpression(
                              factory.createIdentifier(dataToLink),
                              factory.createIdentifier('push'),
                            ),
                            undefined,
                            [factory.createIdentifier('r')],
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
      ),
      factory.createExpressionStatement(
        factory.createCallExpression(
          factory.createPropertyAccessExpression(
            factory.createIdentifier(dataToUnLink),
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
                  factory.createIdentifier('original'),
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
                    factory.createPrefixUnaryExpression(
                      SyntaxKind.ExclamationToken,
                      factory.createIdentifier(getCanUnlinkModelName(fieldName)),
                    ),
                    factory.createBlock(
                      [
                        factory.createThrowStatement(
                          factory.createCallExpression(factory.createIdentifier('Error'), undefined, [
                            factory.createTemplateExpression(factory.createTemplateHead(`${relatedModelName} `), [
                              factory.createTemplateSpan(
                                factory.createPropertyAccessExpression(
                                  factory.createIdentifier('original'),
                                  factory.createIdentifier(keys[0]),
                                ),
                                factory.createTemplateTail(
                                  // eslint-disable-next-line max-len
                                  ` cannot be unlinked from ${modelName} because ${relatedModelFields[0]} is a required field.`,
                                ),
                              ),
                            ]),
                          ]),
                        ),
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
                          factory.createPropertyAccessExpression(
                            factory.createIdentifier('DataStore'),
                            factory.createIdentifier('save'),
                          ),
                          undefined,
                          [
                            factory.createCallExpression(
                              factory.createPropertyAccessExpression(
                                factory.createIdentifier(relatedModelVariableName),
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
                                  createHasManyUpdateRelatedModelBlock({
                                    relatedModelFields,
                                    thisModelPrimaryKeys,
                                    thisModelRecord: `${lowerCaseFirst(modelName)}Record`,
                                    belongsToFieldOnRelatedModel,
                                    setToNull: true,
                                  }),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
                true,
              ),
            ),
          ],
        ),
      ),
      factory.createExpressionStatement(
        factory.createCallExpression(
          factory.createPropertyAccessExpression(
            factory.createIdentifier(dataToLink),
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
                  factory.createIdentifier('original'),
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
                        factory.createIdentifier('promises'),
                        factory.createIdentifier('push'),
                      ),
                      undefined,
                      [
                        factory.createCallExpression(
                          factory.createPropertyAccessExpression(
                            factory.createIdentifier('DataStore'),
                            factory.createIdentifier('save'),
                          ),
                          undefined,
                          [
                            factory.createCallExpression(
                              factory.createPropertyAccessExpression(
                                factory.createIdentifier(relatedModelVariableName),
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
                                  createHasManyUpdateRelatedModelBlock({
                                    relatedModelFields,
                                    thisModelPrimaryKeys,
                                    thisModelRecord: `${lowerCaseFirst(modelName)}Record`,
                                    belongsToFieldOnRelatedModel,
                                  }),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
                true,
              ),
            ),
          ],
        ),
      ),
    ];
  }

  const updateRelatedModelExpression = getUpdateRelatedModelExpression(
    savedModelName,
    relatedModelName,
    relatedModelFields,
    thisModelPrimaryKeys,
    importCollection,
    dataApi,
    belongsToFieldOnRelatedModel,
  );
  return [
    factory.createExpressionStatement(
      factory.createCallExpression(
        factory.createPropertyAccessExpression(factory.createIdentifier('promises'), factory.createIdentifier('push')),
        undefined,
        [
          factory.createSpreadElement(
            factory.createParenthesizedExpression(
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createIdentifier(fieldName),
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
                        factory.createIdentifier('original'),
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
                              factory.createIdentifier('promises'),
                              factory.createIdentifier('push'),
                            ),
                            undefined,
                            [updateRelatedModelExpression],
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
            ),
          ),
        ],
      ),
    ),
  ];
};

export const getRelationshipBasedRecordUpdateStatements = ({
  updatedObjectName,
  savedObjectName,
  fieldConfigs,
}: {
  updatedObjectName: string;
  savedObjectName: string;
  fieldConfigs: Record<string, FieldConfigMetadata>;
}): IfStatement[] => {
  const statements: IfStatement[] = [];
  const modelToFieldsMap: { [modelName: string]: { model: string; scalar: string[] } } = {};

  Object.entries(fieldConfigs).forEach(([fieldName, config]) => {
    if (config.relationship && (config.relationship.type === 'HAS_ONE' || config.relationship?.type === 'BELONGS_TO')) {
      const { associatedFields, relatedModelName } = config.relationship;
      if (isModelDataType(config) && associatedFields) {
        modelToFieldsMap[relatedModelName] = { model: fieldName, scalar: associatedFields };
      } else {
        // if the scalar relationship field is mapped on the form,
        // we do not need to set its value at DataStore.save
        delete modelToFieldsMap[relatedModelName];
      }
    }
  });

  // if(!modelFields.HasOneUser) updated.webUserId = undefined;
  Object.values(modelToFieldsMap).forEach(({ model: modelField, scalar: scalarFields }) => {
    statements.push(
      factory.createIfStatement(
        factory.createPrefixUnaryExpression(
          SyntaxKind.ExclamationToken,
          buildAccessChain([savedObjectName, modelField], false),
        ),
        factory.createBlock(
          scalarFields.map((scalarField) =>
            factory.createExpressionStatement(
              factory.createBinaryExpression(
                buildAccessChain([updatedObjectName, scalarField], false),
                factory.createToken(SyntaxKind.EqualsToken),
                factory.createIdentifier('undefined'),
              ),
            ),
          ),
          true,
        ),
        undefined,
      ),
    );
  });
  return statements;
};

const getUpdateRelatedModelExpression = (
  savedModelName: string,
  relatedModelName: string,
  relatedModelFields: string[],
  thisModelPrimaryKeys: string[],
  importCollection: ImportCollection,
  dataApi?: DataApiKind,
  belongsToFieldOnRelatedModel?: string,
  setToNull?: boolean,
) => {
  if (dataApi === 'GraphQL') {
    const updateMutation = `update${capitalizeFirstLetter(savedModelName)}`;
    const statements: PropertyAssignment[] = relatedModelFields.map((relatedModelField, index) => {
      const correspondingPrimaryKey = thisModelPrimaryKeys[index];

      if (!correspondingPrimaryKey) {
        throw new InternalError(`Corresponding primary key not found for ${relatedModelField}`);
      }

      return factory.createPropertyAssignment(
        factory.createIdentifier(relatedModelField),
        setToNull
          ? factory.createNull()
          : factory.createPropertyAccessExpression(
              factory.createIdentifier(savedModelName),
              factory.createIdentifier(correspondingPrimaryKey),
            ),
      );
    });

    if (belongsToFieldOnRelatedModel) {
      statements.push(
        factory.createPropertyAssignment(
          factory.createIdentifier(belongsToFieldOnRelatedModel),
          setToNull ? factory.createNull() : factory.createIdentifier(savedModelName),
        ),
      );
    }

    /**
     * API.graphql({
     *    query: updateStudent,
     *    variables: { input: { ...original, schoolID: school.id }}
     * })
     */
    return factory.createCallExpression(
      factory.createPropertyAccessExpression(factory.createIdentifier('API'), factory.createIdentifier('graphql')),
      undefined,
      [
        factory.createObjectLiteralExpression(
          [
            factory.createPropertyAssignment(
              factory.createIdentifier('query'),
              factory.createIdentifier(importCollection.addGraphqlMutationImport(updateMutation)),
            ),
            factory.createPropertyAssignment(
              factory.createIdentifier('variables'),
              factory.createObjectLiteralExpression(
                [
                  factory.createPropertyAssignment(
                    factory.createIdentifier('input'),
                    factory.createObjectLiteralExpression(
                      [factory.createSpreadAssignment(factory.createIdentifier('original')), ...statements],
                      false,
                    ),
                  ),
                ],
                false,
              ),
            ),
          ],
          true,
        ),
      ],
    );
  }

  /**
   * Datastore.save(
   *    Student.copyOf(original, (updated) => {
   *        updated.schoolID = school.id
   *    })
   * )
   */
  return factory.createCallExpression(
    factory.createPropertyAccessExpression(factory.createIdentifier('DataStore'), factory.createIdentifier('save')),
    undefined,
    [
      factory.createCallExpression(
        factory.createPropertyAccessExpression(
          factory.createIdentifier(relatedModelName),
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
            createHasManyUpdateRelatedModelBlock({
              relatedModelFields,
              thisModelPrimaryKeys,
              thisModelRecord: savedModelName,
              belongsToFieldOnRelatedModel,
              setToNull,
            }),
          ),
        ],
      ),
    ],
  );
};

const getCreateJoinTableExpression = (
  relatedJoinTableName: string,
  savedModelName: string,
  joinTableThisModelName: string,
  joinTableRelatedModelName: string,
  importCollection: ImportCollection,
  dataApi?: DataApiKind,
): CallExpression => {
  if (dataApi === 'GraphQL') {
    const createMutation = `create${relatedJoinTableName}`;

    return factory.createCallExpression(
      factory.createPropertyAccessExpression(factory.createIdentifier('API'), factory.createIdentifier('graphql')),
      undefined,
      [
        factory.createObjectLiteralExpression(
          [
            factory.createPropertyAssignment(
              factory.createIdentifier('query'),
              factory.createIdentifier(importCollection.addGraphqlMutationImport(createMutation)),
            ),
            factory.createPropertyAssignment(
              factory.createIdentifier('variables'),
              factory.createObjectLiteralExpression(
                [
                  factory.createPropertyAssignment(
                    factory.createIdentifier('input'),
                    factory.createObjectLiteralExpression(
                      [
                        savedModelName === joinTableThisModelName
                          ? factory.createShorthandPropertyAssignment(
                              factory.createIdentifier(joinTableThisModelName),
                              undefined,
                            )
                          : factory.createPropertyAssignment(
                              factory.createIdentifier(joinTableThisModelName),
                              factory.createIdentifier(savedModelName),
                            ),
                        factory.createShorthandPropertyAssignment(
                          factory.createIdentifier(joinTableRelatedModelName),
                          undefined,
                        ),
                      ],
                      true,
                    ),
                  ),
                ],
                true,
              ),
            ),
          ],
          true,
        ),
      ],
    );
  }

  return factory.createCallExpression(
    factory.createPropertyAccessExpression(factory.createIdentifier('DataStore'), factory.createIdentifier('save')),
    undefined,
    [
      factory.createNewExpression(factory.createIdentifier(relatedJoinTableName), undefined, [
        // {
        //   cpkTeacher: cPKTeacher,
        //   cpkClass,
        // }
        factory.createObjectLiteralExpression(
          [
            savedModelName === joinTableThisModelName
              ? factory.createShorthandPropertyAssignment(factory.createIdentifier(joinTableThisModelName), undefined)
              : factory.createPropertyAssignment(
                  factory.createIdentifier(joinTableThisModelName),
                  factory.createIdentifier(savedModelName),
                ),
            factory.createShorthandPropertyAssignment(factory.createIdentifier(joinTableRelatedModelName), undefined),
          ],
          true,
        ),
      ]),
    ],
  );
};
