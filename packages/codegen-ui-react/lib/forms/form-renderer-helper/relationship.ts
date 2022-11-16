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
import { factory, NodeFlags, SyntaxKind } from 'typescript';
import { FieldConfigMetadata, GenericDataRelationshipType, HasManyRelationshipType } from '@aws-amplify/codegen-ui';
import { getRecordsName } from './form-state';
import { buildBaseCollectionVariableStatement } from '../../react-studio-template-renderer-helper';

export const buildRelationshipQuery = (relationship: GenericDataRelationshipType) => {
  const { relatedModelName } = relationship;
  const itemsName = getRecordsName(relatedModelName);
  const objectProperties = [
    factory.createPropertyAssignment(factory.createIdentifier('type'), factory.createStringLiteral('collection')),
    factory.createPropertyAssignment(factory.createIdentifier('model'), factory.createIdentifier(relatedModelName)),
  ];
  return buildBaseCollectionVariableStatement(
    itemsName,
    factory.createCallExpression(factory.createIdentifier('useDataStoreBinding'), undefined, [
      factory.createObjectLiteralExpression(objectProperties, true),
    ]),
  );
};

export const buildManyToManyRelationshipCreateStatements = (
  modelName: string,
  hasManyFieldConfig: [string, FieldConfigMetadata],
) => {
  const [fieldName, fieldConfigMetaData] = hasManyFieldConfig;
  const { relatedModelField, relatedJoinFieldName, relatedJoinTableName } =
    fieldConfigMetaData.relationship as HasManyRelationshipType;
  return [
    factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(relatedModelField),
            undefined,
            undefined,
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
        ],
        NodeFlags.Const,
      ),
    ),
    factory.createExpressionStatement(
      factory.createAwaitExpression(
        factory.createCallExpression(
          factory.createPropertyAccessExpression(factory.createIdentifier('Promise'), factory.createIdentifier('all')),
          undefined,
          [
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
                      factory.createIdentifier(relatedJoinFieldName as string),
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
                                factory.createNewExpression(
                                  factory.createIdentifier(relatedJoinTableName as string),
                                  undefined,
                                  [
                                    factory.createObjectLiteralExpression(
                                      [
                                        factory.createShorthandPropertyAssignment(
                                          factory.createIdentifier(relatedModelField),
                                          undefined,
                                        ),
                                        factory.createShorthandPropertyAssignment(
                                          factory.createIdentifier(relatedJoinFieldName as string),
                                          undefined,
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
  ];
};
