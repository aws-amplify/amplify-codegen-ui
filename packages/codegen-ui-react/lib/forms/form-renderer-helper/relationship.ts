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
  CallExpression,
  factory,
  IfStatement,
  NodeFlags,
  ObjectLiteralExpression,
  PropertyAssignment,
  Statement,
  SyntaxKind,
} from 'typescript';
import {
  FieldConfigMetadata,
  HasManyRelationshipType,
  InternalError,
  GenericDataModel,
  GenericDataField,
  GenericDataSchema,
} from '@aws-amplify/codegen-ui';
import { plural } from 'pluralize';
import {
  getRecordsName,
  getLinkedDataName,
  buildAccessChain,
  getCanUnlinkModelName,
  getRecordName,
} from './form-state';
import { buildBaseCollectionVariableStatement } from '../../react-studio-template-renderer-helper';
import { ImportCollection } from '../../imports';
import { lowerCaseFirst, getSetNameIdentifier, capitalizeFirstLetter } from '../../helpers';
import { isManyToManyRelationship } from './map-from-fieldConfigs';
import { extractModelAndKeys, getIDValueCallChain, getMatchEveryModelFieldCallExpression } from './model-values';
import { isModelDataType } from './render-checkers';
import { DataApiKind } from '../../react-render-config';
import {
  ActionType,
  getGraphqlCallExpression,
  getGraphQLJoinTableCreateExpression,
  getGraphqlQueryForModel,
  mapFieldArraysToPropertyAssignments,
  wrapInParenthesizedExpression,
} from '../../utils/graphql';
import { AMPLIFY_JS_V5 } from '../../utils/constants';
import { getAmplifyJSVersionToRender } from '../../helpers/amplify-js-versioning';

export const buildRelationshipQuery = (
  relatedModelName: string,
  importCollection: ImportCollection,
  fieldName: string,
  dataApi?: DataApiKind,
  renderConfigDependencies?: { [key: string]: string },
) => {
  /* istanbul ignore next */
  if (dataApi === 'GraphQL') {
    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(getRecordsName(fieldName)),
            undefined,
            undefined,
            wrapInParenthesizedExpression(
              getGraphqlCallExpression(
                ActionType.LIST,
                relatedModelName,
                importCollection,
                undefined,
                undefined,
                renderConfigDependencies,
              ),
              ['data', getGraphqlQueryForModel(ActionType.LIST, relatedModelName), 'items'],
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
    getRecordsName(relatedModelName),
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
  const recordKeysString = 'recordKeys';

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
      [factory.createReturnStatement(factory.createArrayLiteralExpression(queryCallExpressions, true))],
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

function graphqlLinkedRecordsFallback(modelName: string) {
  return factory.createBinaryExpression(
    factory.createPropertyAccessChain(
      factory.createPropertyAccessChain(
        factory.createIdentifier('record'),
        factory.createToken(SyntaxKind.QuestionDotToken),
        factory.createIdentifier(modelName),
      ),
      factory.createToken(SyntaxKind.QuestionDotToken),
      factory.createIdentifier('items'),
    ),
    factory.createToken(SyntaxKind.QuestionQuestionToken),
    factory.createArrayLiteralExpression([], false),
  );
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
  renderConfigDependencies?: { [key: string]: string },
) => {
  let [fieldName] = hasManyFieldConfig;
  const [, fieldConfigMetaData] = hasManyFieldConfig;
  fieldName = fieldConfigMetaData.sanitizedFieldName || fieldName;
  const { relatedModelFields, relatedJoinFieldName, relatedJoinTableName, relatedModelName } =
    fieldConfigMetaData.relationship as HasManyRelationshipType;
  const joinTableThisModelName = relatedModelFields[0];
  const joinTableRelatedModelName = relatedJoinFieldName;
  const isGraphql = dataApi === 'GraphQL';

  if (!relatedJoinTableName) {
    throw new InternalError(`Cannot find join table for ${fieldName}`);
  }
  if (!joinTableRelatedModelName) {
    throw new InternalError(`Cannot find corresponding field in join table for ${fieldName}`);
  }
  const joinTableThisModelFields = extractAssociatedFields(joinTable.fields[joinTableThisModelName]);
  const joinTableRelatedModelFields = extractAssociatedFields(joinTable.fields[joinTableRelatedModelName]);
  const { keys: relatedModelPrimaryKeys } = extractModelAndKeys(fieldConfigMetaData.valueMappings);

  if (!relatedModelPrimaryKeys) {
    throw new InternalError(`Could not identify primary key(s) for ${relatedModelName}`);
  }

  if (!joinTableThisModelFields || !joinTableRelatedModelFields) {
    throw new InternalError(`Cannot find associated fields to build ${fieldName}`);
  }
  if (dataStoreActionType === 'update') {
    const idValueCallChain = getIDValueCallChain({ fieldName, recordString: 'r' });
    const linkedDataName = getLinkedDataName(fieldName);
    const dataToLink = `${lowerCaseFirst(relatedModelName)}ToLink`;
    const dataToLinkMap = `${lowerCaseFirst(fieldName)}ToLinkMap`;
    const dataToUnlinkMap = `${lowerCaseFirst(fieldName)}ToUnLinkMap`;
    const thisModelRecord = getRecordName(modelName);
    const updatedMap = `${lowerCaseFirst(fieldName)}Map`;
    const originalMap = `${linkedDataName}Map`;

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
      // unlink many:many records
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
              buildUnlinkForEachBlock(
                relatedJoinTableName,
                thisModelPrimaryKeys,
                relatedModelPrimaryKeys,
                joinTableThisModelFields,
                joinTableRelatedModelFields,
                thisModelRecord,
                isGraphql,
                importCollection,
                renderConfigDependencies,
              ),
            ),
          ],
        ),
      ),
      // link many:many records
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
                  factory.createVariableStatement(
                    undefined,
                    factory.createVariableDeclarationList(
                      [
                        factory.createVariableDeclaration(
                          factory.createIdentifier(dataToLink),
                          undefined,
                          undefined,
                          getMatchEveryModelFieldCallExpression({
                            // Special and needs a ref to the model for DataStore because the
                            // fieldName will not be the same as when the reference was created.
                            recordsArrayName: getRecordsName(dataApi === 'GraphQL' ? fieldName : relatedModelName),
                            JSONName: 'id',
                          }),
                        ),
                      ],
                      NodeFlags.Const,
                    ),
                  ),
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
                              isGraphql
                                ? getGraphQLJoinTableCreateExpression(
                                    relatedJoinTableName,
                                    thisModelRecord,
                                    thisModelPrimaryKeys,
                                    joinTableThisModelFields,
                                    dataToLink,
                                    relatedModelPrimaryKeys,
                                    joinTableRelatedModelFields,
                                    importCollection,
                                    renderConfigDependencies,
                                  )
                                : factory.createCallExpression(
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
                                                factory.createIdentifier(getRecordName(modelName)),
                                              ),
                                              // compositeVet: compositeVetRecords.find(
                                              //   (r) => Object.entries(JSON.parse(id)).every(([key, value]) =>
                                              //   r[key] === value))
                                              factory.createPropertyAssignment(
                                                factory.createIdentifier(joinTableRelatedModelName),
                                                factory.createIdentifier(dataToLink),
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
                              isGraphql
                                ? getGraphQLJoinTableCreateExpression(
                                    relatedJoinTableName,
                                    savedModelName,
                                    thisModelPrimaryKeys,
                                    joinTableThisModelFields,
                                    joinTableRelatedModelName,
                                    relatedModelPrimaryKeys,
                                    joinTableRelatedModelFields,
                                    importCollection,
                                    renderConfigDependencies,
                                  )
                                : getCreateJoinTableExpression(
                                    relatedJoinTableName,
                                    savedModelName,
                                    joinTableThisModelName,
                                    joinTableRelatedModelName,
                                    importCollection,
                                    dataApi,
                                    renderConfigDependencies,
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

export const buildGetRelationshipModels = (
  fieldName: string,
  fieldConfigMetaData: FieldConfigMetadata,
  dataSchemaMetadata: GenericDataSchema | undefined,
  primaryKeys: string[],
  importCollection: ImportCollection,
  dataApi?: DataApiKind,
  renderConfigDependencies?: { [key: string]: string },
) => {
  const recordIdentifier = factory.createIdentifier('record');
  const amplifyJSVersion = getAmplifyJSVersionToRender(renderConfigDependencies);

  if (fieldConfigMetaData.relationship?.type === 'HAS_MANY') {
    const linkedDataName = getLinkedDataName(fieldName);
    let lazyLoadLinkedDataStatement;
    if (isManyToManyRelationship(fieldConfigMetaData)) {
      const { relatedJoinFieldName, relatedJoinTableName } = fieldConfigMetaData.relationship;
      /* istanbul ignore next */
      if (dataApi === 'GraphQL') {
        const joinTableMetadata = dataSchemaMetadata?.models[relatedJoinTableName];
        const joinTableThisModelName = fieldConfigMetaData.relationship.relatedModelFields[0];
        const joinTableThisModelFields =
          extractAssociatedFields(joinTableMetadata!.fields[joinTableThisModelName]) || [];
        const joinTableIndexedQuery = `${plural(lowerCaseFirst(relatedJoinTableName))}By${joinTableThisModelFields
          .map(capitalizeFirstLetter)
          .join('And')}`;
        importCollection.addGraphqlQueryImport(joinTableIndexedQuery);
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
                  factory.createCallExpression(
                    factory.createPropertyAccessExpression(
                      factory.createPropertyAccessExpression(
                        factory.createPropertyAccessExpression(
                          factory.createPropertyAccessExpression(
                            factory.createParenthesizedExpression(
                              factory.createAwaitExpression(
                                factory.createCallExpression(
                                  factory.createPropertyAccessExpression(
                                    factory.createIdentifier(amplifyJSVersion === AMPLIFY_JS_V5 ? 'API' : 'client'),
                                    factory.createIdentifier('graphql'),
                                  ),
                                  undefined,
                                  [
                                    factory.createObjectLiteralExpression(
                                      [
                                        factory.createPropertyAssignment(
                                          factory.createIdentifier('query'),
                                          factory.createCallExpression(
                                            factory.createPropertyAccessExpression(
                                              factory.createIdentifier(joinTableIndexedQuery),
                                              factory.createIdentifier('replaceAll'),
                                            ),
                                            undefined,
                                            [
                                              factory.createStringLiteral('__typename'),
                                              factory.createStringLiteral(''),
                                            ],
                                          ),
                                        ),
                                        factory.createPropertyAssignment(
                                          factory.createIdentifier('variables'),
                                          factory.createObjectLiteralExpression(
                                            [
                                              ...mapFieldArraysToPropertyAssignments(
                                                joinTableThisModelFields,
                                                primaryKeys,
                                                'record',
                                              ),
                                            ],
                                            true,
                                          ),
                                        ),
                                      ],
                                      true,
                                    ),
                                  ],
                                ),
                              ),
                            ),
                            factory.createIdentifier('data'),
                          ),
                          factory.createIdentifier(joinTableIndexedQuery),
                        ),
                        factory.createIdentifier('items'),
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
                            factory.createIdentifier('t'),
                            undefined,
                            undefined,
                            undefined,
                          ),
                        ],
                        undefined,
                        factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                        factory.createPropertyAccessExpression(
                          factory.createIdentifier('t'),
                          factory.createIdentifier(relatedJoinFieldName || fieldName),
                        ),
                      ),
                    ],
                  ),
                  factory.createToken(SyntaxKind.ColonToken),
                  factory.createArrayLiteralExpression([], false),
                ),
              ),
            ],
            NodeFlags.Const,
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
                  recordIdentifier,
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
                              factory.createBinaryExpression(
                                factory.createAwaitExpression(
                                  factory.createCallChain(
                                    factory.createPropertyAccessChain(
                                      factory.createPropertyAccessExpression(
                                        factory.createIdentifier('record'),
                                        factory.createIdentifier(fieldName),
                                      ),
                                      factory.createToken(SyntaxKind.QuestionDotToken),
                                      factory.createIdentifier('toArray'),
                                    ),
                                    undefined,
                                    undefined,
                                    [],
                                  ),
                                ),
                                factory.createToken(SyntaxKind.BarBarToken),
                                factory.createArrayLiteralExpression([], false),
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
      }
    } else {
      // hasMany relationship has one related field.
      lazyLoadLinkedDataStatement = factory.createVariableStatement(
        undefined,
        factory.createVariableDeclarationList(
          [
            factory.createVariableDeclaration(
              factory.createIdentifier(linkedDataName),
              undefined,
              undefined,
              dataApi === 'GraphQL'
                ? graphqlLinkedRecordsFallback(fieldName)
                : factory.createBinaryExpression(
                    factory.createBinaryExpression(
                      recordIdentifier,
                      factory.createToken(SyntaxKind.AmpersandAmpersandToken),
                      factory.createAwaitExpression(
                        factory.createCallExpression(
                          factory.createPropertyAccessChain(
                            factory.createPropertyAccessExpression(
                              recordIdentifier,
                              factory.createIdentifier(fieldName),
                            ),
                            factory.createToken(SyntaxKind.QuestionDotToken),
                            factory.createIdentifier('toArray'),
                          ),
                          undefined,
                          [],
                        ),
                      ),
                    ),
                    factory.createToken(SyntaxKind.BarBarToken),
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

  if (dataApi === 'GraphQL' && fieldConfigMetaData.relationship && !isModelDataType(fieldConfigMetaData)) {
    const relatedModelName = lowerCaseFirst(fieldConfigMetaData.relationship.relatedModelName);
    const queryCall = wrapInParenthesizedExpression(
      getGraphqlCallExpression(
        ActionType.GET,
        fieldConfigMetaData.relationship.relatedModelName,
        importCollection,
        {
          inputs: [
            factory.createPropertyAssignment(
              factory.createIdentifier('id'),
              factory.createIdentifier(`${fieldName}Record`),
            ),
          ],
        },
        undefined,
        renderConfigDependencies,
      ),
      ['data', getGraphqlQueryForModel(ActionType.GET, fieldConfigMetaData.relationship.relatedModelName)],
    );

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
                factory.createPropertyAccessExpression(
                  factory.createIdentifier('record'),
                  factory.createIdentifier(fieldName),
                ),
                factory.createToken(SyntaxKind.ColonToken),
                factory.createIdentifier('undefined'),
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
              factory.createIdentifier(`${relatedModelName}Record`),
              undefined,
              undefined,
              factory.createConditionalExpression(
                factory.createIdentifier(`${fieldName}Record`),
                factory.createToken(SyntaxKind.QuestionToken),
                queryCall,
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
      factory.createExpressionStatement(
        factory.createCallExpression(
          getSetNameIdentifier(`selected${capitalizeFirstLetter(fieldName)}Records`),
          undefined,
          [factory.createArrayLiteralExpression([factory.createIdentifier(`${relatedModelName}Record`)])],
        ),
      ),
    ];
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
  renderConfigDependencies?: { [key: string]: string },
) => {
  let [fieldName] = hasManyFieldConfig;
  const [, fieldConfigMetaData] = hasManyFieldConfig;
  fieldName = fieldConfigMetaData.sanitizedFieldName || fieldName;
  const { relatedModelName, relatedModelFields, belongsToFieldOnRelatedModel } =
    fieldConfigMetaData.relationship as HasManyRelationshipType;
  const relatedModelVariableName = importCollection.getMappedModelAlias(relatedModelName);
  const linkedDataName = getLinkedDataName(fieldName);
  const dataToLink = `${lowerCaseFirst(fieldName)}ToLink`;
  const dataToUnLink = `${lowerCaseFirst(fieldName)}ToUnLink`;
  const dataToLinkSet = `${lowerCaseFirst(fieldName)}Set`;
  const linkedDataSet = `${linkedDataName}Set`;
  const thisModelRecord = getRecordName(modelName);

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
      // unlink items
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
                        dataApi === 'GraphQL'
                          ? getGraphqlCallExpression(
                              ActionType.UPDATE,
                              relatedModelName,
                              importCollection,
                              {
                                inputs: keys
                                  .map((key) =>
                                    factory.createPropertyAssignment(
                                      factory.createIdentifier(key),
                                      factory.createPropertyAccessExpression(
                                        factory.createIdentifier('original'),
                                        factory.createIdentifier(key),
                                      ),
                                    ),
                                  )
                                  .concat(
                                    relatedModelFields.map((key) =>
                                      factory.createPropertyAssignment(
                                        factory.createIdentifier(key),
                                        factory.createNull(),
                                      ),
                                    ),
                                  ),
                              },
                              undefined,
                              renderConfigDependencies,
                            )
                          : getUpdateRelatedModelExpression(
                              keys,
                              thisModelRecord,
                              relatedModelVariableName,
                              relatedModelFields,
                              thisModelPrimaryKeys,
                              importCollection,
                              dataApi,
                              belongsToFieldOnRelatedModel,
                              true,
                              renderConfigDependencies,
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
      // link items
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
                        dataApi === 'GraphQL'
                          ? getGraphqlCallExpression(
                              ActionType.UPDATE,
                              relatedModelName,
                              importCollection,
                              {
                                inputs: [
                                  ...keys.map((key) =>
                                    factory.createPropertyAssignment(
                                      factory.createIdentifier(key),
                                      factory.createPropertyAccessExpression(
                                        factory.createIdentifier('original'),
                                        factory.createIdentifier(key),
                                      ),
                                    ),
                                  ),
                                  ...relatedModelFields.map((relatedModelField) =>
                                    factory.createPropertyAssignment(
                                      factory.createIdentifier(relatedModelField),
                                      factory.createPropertyAccessExpression(
                                        factory.createIdentifier(thisModelRecord),
                                        factory.createIdentifier(thisModelPrimaryKeys[0]),
                                      ),
                                    ),
                                  ),
                                ],
                              },
                              undefined,
                              renderConfigDependencies,
                            )
                          : getUpdateRelatedModelExpression(
                              keys,
                              thisModelRecord,
                              relatedModelVariableName,
                              relatedModelFields,
                              thisModelPrimaryKeys,
                              importCollection,
                              dataApi,
                              belongsToFieldOnRelatedModel,
                              undefined,
                              renderConfigDependencies,
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
    keys,
    savedModelName,
    relatedModelName,
    relatedModelFields,
    thisModelPrimaryKeys,
    importCollection,
    dataApi,
    belongsToFieldOnRelatedModel,
    undefined,
    renderConfigDependencies,
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
  primaryKeys: string[],
  savedModelName: string,
  relatedModelName: string,
  relatedModelFields: string[],
  thisModelPrimaryKeys: string[],
  importCollection: ImportCollection,
  dataApi?: DataApiKind,
  belongsToFieldOnRelatedModel?: string,
  setToNull?: boolean,
  renderConfigDependencies?: { [key: string]: string },
) => {
  /* istanbul ignore next */
  if (dataApi === 'GraphQL') {
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

    /**
     * API.graphql({
     *    query: updateStudent,
     *    variables: {
     *      input: {
     *        id: original.id,
     *        schoolID: school.id
     *      }
     *    }
     * })
     */
    const inputs = [
      ...primaryKeys.map((key) =>
        factory.createPropertyAssignment(
          factory.createIdentifier(key),
          factory.createPropertyAccessExpression(factory.createIdentifier('original'), factory.createIdentifier(key)),
        ),
      ),
      ...statements,
    ];

    return getGraphqlCallExpression(
      ActionType.UPDATE,
      capitalizeFirstLetter(relatedModelName),
      importCollection,
      {
        inputs,
      },
      undefined,
      renderConfigDependencies,
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
  renderConfigDependencies?: { [key: string]: string },
): CallExpression => {
  /* istanbul ignore next */
  if (dataApi === 'GraphQL') {
    const inputs = [
      savedModelName === joinTableThisModelName
        ? factory.createShorthandPropertyAssignment(factory.createIdentifier(joinTableThisModelName), undefined)
        : factory.createPropertyAssignment(
            factory.createIdentifier(joinTableThisModelName),
            factory.createIdentifier(savedModelName),
          ),
      factory.createShorthandPropertyAssignment(factory.createIdentifier(joinTableRelatedModelName), undefined),
    ];

    return getGraphqlCallExpression(
      ActionType.CREATE,
      relatedJoinTableName,
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

/*
  GraphQL:
    const recordKeys = JSON.parse(id);
      const studentClassRecords = await API.graphql({
        query: listStudentClasses,
        variables: {
          filter: {
            and: [
              { studentId: { eq: recordKeys.id } },
              { classId: { eq: classRecord.id } },
            ],
          },
        },
      });
      for (let i = 0; i < count; i++) {
        promises.push(
          API.graphql({
            query: deleteStudentClass,
            variables: {
              input: {
                input: studentClassRecords[i],
              },
            },
          })
        );
      }
  
  DataStore:
    const recordKeys = JSON.parse(id);
    const studentClassRecords = await DataStore.query(
      StudentClass,
      (r) =>
        r.and((r) => {
          const recordKeys = JSON.parse(id);
          return [
            r.studentID.eq(recordKeys.id),
            r.classID.eq(classRecord.id),
          ];
        })
    );

    for (let i = 0; i < count; i++) {
      promises.push(DataStore.delete(studentClassRecords[i]));
    }
*/
function buildUnlinkForEachBlock(
  relatedJoinTableName: string,
  thisModelPrimaryKeys: string[],
  relatedModelPrimaryKeys: string[],
  joinTableThisModelFields: string[],
  joinTableRelatedModelFields: string[],
  thisModelRecord: string,
  isGraphql: boolean,
  importCollection: ImportCollection,
  renderConfigDependencies?: { [key: string]: string },
) {
  const recordKeysString = 'recordKeys';
  const joinTableFilterExpressions: ObjectLiteralExpression[] = [];

  const graphqlFilterInput = (field: string, recordModel: string, recordKey: string) => {
    return factory.createObjectLiteralExpression(
      [
        factory.createPropertyAssignment(
          factory.createIdentifier(field),
          factory.createObjectLiteralExpression(
            [
              factory.createPropertyAssignment(
                factory.createIdentifier('eq'),
                factory.createPropertyAccessExpression(
                  factory.createIdentifier(recordModel),
                  factory.createIdentifier(recordKey),
                ),
              ),
            ],
            false,
          ),
        ),
      ],
      false,
    );
  };

  joinTableRelatedModelFields.forEach((field, index) => {
    const recordKey = relatedModelPrimaryKeys[index];
    if (!recordKey) {
      throw new InternalError(`Cannot find corresponding key for ${field}`);
    }
    joinTableFilterExpressions.push(graphqlFilterInput(field, recordKeysString, recordKey));
  });

  joinTableThisModelFields.forEach((field, index) => {
    const recordKey = thisModelPrimaryKeys[index];
    if (!recordKey) {
      throw new InternalError(`Cannot find corresponding key for ${field}`);
    }
    joinTableFilterExpressions.push(graphqlFilterInput(field, thisModelRecord, recordKey));
  });

  const filters = [
    factory.createPropertyAssignment(
      factory.createIdentifier('and'),
      factory.createArrayLiteralExpression(joinTableFilterExpressions, true),
    ),
  ];

  return factory.createBlock(
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

      factory.createVariableStatement(
        undefined,
        factory.createVariableDeclarationList(
          [
            factory.createVariableDeclaration(
              factory.createIdentifier(getRecordsName(relatedJoinTableName)),
              undefined,
              undefined,
              wrapInParenthesizedExpression(
                isGraphql
                  ? getGraphqlCallExpression(
                      ActionType.LIST,
                      relatedJoinTableName,
                      importCollection,
                      { filters },
                      undefined,
                      renderConfigDependencies,
                    )
                  : factory.createCallExpression(
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
                                thisModelRecord,
                              }),
                            ],
                          ),
                        ),
                      ],
                    ),
                isGraphql ? ['data', getGraphqlQueryForModel(ActionType.LIST, relatedJoinTableName), 'items'] : [],
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
                  isGraphql
                    ? getGraphqlCallExpression(
                        ActionType.DELETE,
                        relatedJoinTableName,
                        importCollection,
                        {
                          inputs: [
                            factory.createPropertyAssignment(
                              factory.createIdentifier('id'),
                              factory.createPropertyAccessExpression(
                                factory.createElementAccessExpression(
                                  factory.createIdentifier(getRecordsName(relatedJoinTableName)),
                                  factory.createIdentifier('i'),
                                ),
                                factory.createIdentifier('id'),
                              ),
                            ),
                          ],
                        },
                        undefined,
                        renderConfigDependencies,
                      )
                    : factory.createCallExpression(
                        factory.createPropertyAccessExpression(
                          factory.createIdentifier('DataStore'),
                          factory.createIdentifier('delete'),
                        ),
                        undefined,
                        [
                          factory.createElementAccessExpression(
                            factory.createIdentifier(getRecordsName(relatedJoinTableName)),
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
  );
}
