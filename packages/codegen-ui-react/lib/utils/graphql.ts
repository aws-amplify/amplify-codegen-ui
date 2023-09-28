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

import { plural } from 'pluralize';
import { FieldConfigMetadata, InternalError, InvalidInputError } from '@aws-amplify/codegen-ui';
import {
  AwaitExpression,
  CallExpression,
  NodeFlags,
  ObjectLiteralElementLike,
  Statement,
  SyntaxKind,
  factory,
} from 'typescript';
import { ImportCollection } from '../imports';
import { capitalizeFirstLetter, getSetNameIdentifier, lowerCaseFirst } from '../helpers';
import { isBoundProperty, isConcatenatedProperty } from '../react-component-render-helper';
import { Primitive } from '../primitive';
import { DataApiKind, DataStoreRenderConfig, GraphqlRenderConfig, NoApiRenderConfig } from '../react-render-config';
import { isModelDataType } from '../forms/form-renderer-helper/render-checkers';
import { AMPLIFY_JS_V5 } from './constants';
import { getAmplifyJSAPIImport, getAmplifyJSVersionToRender } from '../helpers/amplify-js-versioning';

export enum ActionType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  GET_BY_RELATIONSHIP = 'getByRelationship',
}

/* istanbul ignore next */
export const isGraphqlConfig = (
  apiConfiguration?: GraphqlRenderConfig | DataStoreRenderConfig | NoApiRenderConfig,
): apiConfiguration is GraphqlRenderConfig => {
  return apiConfiguration?.dataApi === 'GraphQL';
};

export const getGraphqlQueryForModel = (action: ActionType, model: string, byFieldName = ''): string => {
  switch (action) {
    case ActionType.CREATE:
      return `create${model}`;
    case ActionType.UPDATE:
      return `update${model}`;
    case ActionType.DELETE:
      return `delete${model}`;
    case ActionType.GET:
      return `get${model}`;
    case ActionType.LIST:
      return `list${plural(model)}`;
    case ActionType.GET_BY_RELATIONSHIP:
      return `${lowerCaseFirst(plural(model))}By${capitalizeFirstLetter(byFieldName)}`;
    default:
      throw new InvalidInputError(`Action ${action} has no corresponding GraphQL operation`);
  }
};

/* istanbul ignore next */
export const isGraphqlQueryAction = (action: ActionType) => {
  return [ActionType.GET_BY_RELATIONSHIP, ActionType.GET, ActionType.LIST].includes(action);
};

/**
 * Returns a GraphQL call expression and adds to importCollection.
 *
 * @example
 * ```
 * API.graphql({
 *  query: createTodo,
 *  variables: {
 *    input: {
 *      inputs
 *    },
 *  },
 * });
 * ```
 */
/* istanbul ignore next */
export const getGraphqlCallExpression = (
  action: ActionType,
  model: string,
  importCollection: ImportCollection,
  variables?:
    | {
        inputs?: ObjectLiteralElementLike[];
        filters?: ObjectLiteralElementLike[];
      }
    | ObjectLiteralElementLike[],
  byFieldName?: string,
  renderConfigDependencies?: { [key: string]: string },
): CallExpression => {
  const query = getGraphqlQueryForModel(action, model, byFieldName);
  const graphqlVariables: ObjectLiteralElementLike[] = [];
  const graphqlOptions: ObjectLiteralElementLike[] = [
    factory.createPropertyAssignment(
      factory.createIdentifier('query'),
      factory.createCallExpression(
        factory.createPropertyAccessExpression(factory.createIdentifier(query), factory.createIdentifier('replaceAll')),
        undefined,
        [factory.createStringLiteral('__typename'), factory.createStringLiteral('')],
      ),
    ),
  ];

  const mappedImport = getAmplifyJSAPIImport(renderConfigDependencies);
  importCollection.addMappedImport(mappedImport);

  if (isGraphqlQueryAction(action)) {
    importCollection.addGraphqlQueryImport(query);
  } else {
    importCollection.addGraphqlMutationImport(query);
  }

  if (Array.isArray(variables)) {
    graphqlOptions.push(...variables);
  } else {
    if (variables?.inputs) {
      if (isGraphqlQueryAction(action)) {
        variables.inputs.forEach((variable) => {
          graphqlVariables.push(variable);
        });
      } else {
        graphqlVariables.push(
          factory.createPropertyAssignment(
            factory.createIdentifier('input'),
            factory.createObjectLiteralExpression(variables.inputs, true),
          ),
        );
      }
    }
    // filter applies to list
    if ((action === ActionType.LIST || action === ActionType.GET_BY_RELATIONSHIP) && variables?.filters) {
      graphqlVariables.push(
        factory.createPropertyAssignment(
          factory.createIdentifier('filter'),
          factory.createObjectLiteralExpression(variables?.filters, true),
        ),
      );
    }

    if (graphqlVariables.length > 0) {
      graphqlOptions.push(
        factory.createPropertyAssignment(
          factory.createIdentifier('variables'),
          factory.createObjectLiteralExpression(graphqlVariables),
        ),
      );
    }
  }

  importCollection.addModelImport(model);
  const amplifyJSVersion = getAmplifyJSVersionToRender(renderConfigDependencies);
  return factory.createCallExpression(
    factory.createPropertyAccessExpression(
      factory.createIdentifier(amplifyJSVersion === AMPLIFY_JS_V5 ? 'API' : 'client'),
      factory.createIdentifier('graphql'),
    ),
    undefined,
    [factory.createObjectLiteralExpression(graphqlOptions, true)],
  );
};

/* istanbul ignore next */
export const mapFieldArraysToPropertyAssignments = (
  joinTableFields: string[],
  modelFields: string[],
  modelRecord: string,
) => {
  return joinTableFields.map((key, i) => {
    const recordKey = modelFields[i];
    if (!recordKey) {
      throw new InternalError(`Cannot find corresponding key for ${key}`);
    }

    return factory.createPropertyAssignment(
      factory.createIdentifier(key),
      factory.createPropertyAccessExpression(
        factory.createIdentifier(modelRecord),
        factory.createIdentifier(recordKey),
      ),
    );
  });
};

/* istanbul ignore next */
export const getGraphQLJoinTableCreateExpression = (
  relatedJoinTableName: string,
  thisModelRecord: string,
  thisModelPrimaryKeys: string[],
  joinTableThisModelFields: string[],
  relatedModelRecord: string,
  relatedModelPrimaryKeys: string[],
  joinTableRelatedModelFields: string[],
  importCollection: ImportCollection,
  renderConfigDependencies?: { [key: string]: string },
) => {
  const thisModelAssignments = mapFieldArraysToPropertyAssignments(
    joinTableThisModelFields,
    thisModelPrimaryKeys,
    thisModelRecord,
  );
  const relatedModelAssignments = mapFieldArraysToPropertyAssignments(
    joinTableRelatedModelFields,
    relatedModelPrimaryKeys,
    relatedModelRecord,
  );

  return getGraphqlCallExpression(
    ActionType.CREATE,
    relatedJoinTableName,
    importCollection,
    {
      inputs: [...thisModelAssignments, ...relatedModelAssignments],
    },
    undefined,
    renderConfigDependencies,
  );
};

const fetchRelatedRecordEffect = (fetchRecordFunctions: string[]) => {
  return factory.createExpressionStatement(
    factory.createCallExpression(
      factory.createPropertyAccessExpression(factory.createIdentifier('React'), factory.createIdentifier('useEffect')),
      undefined,
      [
        factory.createArrowFunction(
          undefined,
          undefined,
          [],
          undefined,
          factory.createToken(SyntaxKind.EqualsGreaterThanToken),
          factory.createBlock(
            fetchRecordFunctions.map((fetchFunction) => {
              return factory.createExpressionStatement(
                factory.createCallExpression(factory.createIdentifier(fetchFunction), undefined, [
                  factory.createStringLiteral(''),
                ]),
              );
            }),
            true,
          ),
        ),
        factory.createArrayLiteralExpression([], false),
      ],
    ),
  );
};

/* istanbul ignore next */
export const getFetchRelatedRecords = (relatedModelName: string) =>
  `fetch${capitalizeFirstLetter(relatedModelName)}Records`;

/* istanbul ignore next */
export const getFetchRelatedRecordsCallbacks = (
  fieldConfigs: Record<string, FieldConfigMetadata>,
  importCollection: ImportCollection,
  dataApi: DataApiKind = 'DataStore',
  renderConfigDependencies?: { [key: string]: string },
) => {
  const initalFetchRecords: string[] = [];
  const fetchRecordsStatements = Object.entries(fieldConfigs).reduce<Statement[]>(
    (acc, [name, { sanitizedFieldName, relationship, valueMappings, componentType }]) => {
      if (relationship && componentType === Primitive.Autocomplete) {
        const fieldName = name.split('.')[0];
        const renderedFieldName = sanitizedFieldName || fieldName;
        const fetchRecordsVariable = getFetchRelatedRecords(renderedFieldName);
        initalFetchRecords.push(fetchRecordsVariable);
        const setModelLoading = getSetNameIdentifier(`${renderedFieldName}Loading`);
        const setModelFetchOption = getSetNameIdentifier(`${renderedFieldName}Records`);

        const valueConfig = valueMappings?.values[0];
        if (!valueConfig) {
          return acc;
        }
        const displayValueProperty = valueConfig.displayValue || valueConfig.value;

        let displayValues = [];

        if (isConcatenatedProperty(displayValueProperty)) {
          displayValues = displayValueProperty.concat.reduce((displayValue: any, displayValueProp) => {
            if (
              'bindingProperties' in displayValueProp &&
              'field' in displayValueProp.bindingProperties &&
              displayValueProp.bindingProperties.field
            ) {
              displayValue.push(displayValueProp.bindingProperties.field);
            }
            return displayValue;
          }, []);
        } else if (isBoundProperty(displayValueProperty)) {
          displayValues = [displayValueProperty.bindingProperties.field];
        }

        acc.push(
          factory.createVariableStatement(
            undefined,
            factory.createVariableDeclarationList(
              [
                factory.createVariableDeclaration(
                  factory.createIdentifier(fetchRecordsVariable),
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
                        factory.createExpressionStatement(
                          factory.createCallExpression(setModelLoading, undefined, [factory.createTrue()]),
                        ),
                        factory.createVariableStatement(
                          undefined,
                          factory.createVariableDeclarationList(
                            [
                              factory.createVariableDeclaration(
                                factory.createIdentifier('newOptions'),
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
                                factory.createIdentifier('newNext'),
                                undefined,
                                undefined,
                                factory.createStringLiteral(''),
                              ),
                            ],
                            NodeFlags.Let,
                          ),
                        ),
                        factory.createWhileStatement(
                          factory.createBinaryExpression(
                            factory.createBinaryExpression(
                              factory.createPropertyAccessExpression(
                                factory.createIdentifier('newOptions'),
                                factory.createIdentifier('length'),
                              ),
                              factory.createToken(SyntaxKind.LessThanToken),
                              factory.createIdentifier('autocompleteLength'),
                            ),
                            factory.createToken(SyntaxKind.AmpersandAmpersandToken),
                            factory.createParenthesizedExpression(
                              factory.createBinaryExpression(
                                factory.createIdentifier('newNext'),
                                factory.createToken(SyntaxKind.ExclamationEqualsToken),
                                factory.createNull(),
                              ),
                            ),
                          ),
                          factory.createBlock(
                            [
                              factory.createVariableStatement(
                                undefined,
                                factory.createVariableDeclarationList(
                                  [
                                    factory.createVariableDeclaration(
                                      factory.createIdentifier('variables'),
                                      undefined,
                                      undefined,
                                      factory.createObjectLiteralExpression(
                                        [
                                          factory.createPropertyAssignment(
                                            factory.createIdentifier('limit'),
                                            factory.createBinaryExpression(
                                              factory.createIdentifier('autocompleteLength'),
                                              factory.createToken(SyntaxKind.AsteriskToken),
                                              factory.createNumericLiteral('5'),
                                            ),
                                          ),
                                          factory.createPropertyAssignment(
                                            factory.createIdentifier('filter'),
                                            factory.createObjectLiteralExpression(
                                              [
                                                factory.createPropertyAssignment(
                                                  factory.createIdentifier('or'),
                                                  factory.createArrayLiteralExpression(
                                                    displayValues.map((value: string) =>
                                                      factory.createObjectLiteralExpression(
                                                        [
                                                          factory.createPropertyAssignment(
                                                            factory.createIdentifier(value),
                                                            factory.createObjectLiteralExpression(
                                                              [
                                                                factory.createPropertyAssignment(
                                                                  factory.createIdentifier('contains'),
                                                                  factory.createIdentifier('value'),
                                                                ),
                                                              ],
                                                              false,
                                                            ),
                                                          ),
                                                        ],
                                                        false,
                                                      ),
                                                    ),
                                                  ),
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
                                  NodeFlags.Const,
                                ),
                              ),
                              factory.createIfStatement(
                                factory.createIdentifier('newNext'),
                                factory.createBlock(
                                  [
                                    factory.createExpressionStatement(
                                      factory.createBinaryExpression(
                                        factory.createElementAccessExpression(
                                          factory.createIdentifier('variables'),
                                          factory.createStringLiteral('nextToken'),
                                        ),
                                        factory.createToken(SyntaxKind.EqualsToken),
                                        factory.createIdentifier('newNext'),
                                      ),
                                    ),
                                  ],
                                  true,
                                ),
                                undefined,
                              ),
                              factory.createVariableStatement(
                                undefined,
                                factory.createVariableDeclarationList(
                                  [
                                    factory.createVariableDeclaration(
                                      factory.createIdentifier('result'),
                                      undefined,
                                      undefined,
                                      wrapInParenthesizedExpression(
                                        getGraphqlCallExpression(
                                          ActionType.LIST,
                                          relationship.relatedModelName,
                                          importCollection,
                                          [
                                            factory.createShorthandPropertyAssignment(
                                              factory.createIdentifier('variables'),
                                              undefined,
                                            ),
                                          ],
                                          undefined,
                                          renderConfigDependencies,
                                        ),
                                        [
                                          'data',
                                          getGraphqlQueryForModel(
                                            ActionType.LIST,
                                            capitalizeFirstLetter(relationship.relatedModelName),
                                          ),
                                          'items',
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
                                      factory.createIdentifier('loaded'),
                                      undefined,
                                      undefined,
                                      factory.createCallExpression(
                                        factory.createPropertyAccessExpression(
                                          factory.createIdentifier('result'),
                                          factory.createIdentifier('filter'),
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
                                            dataApi === 'GraphQL' && !isModelDataType(fieldConfigs[fieldName])
                                              ? factory.createBinaryExpression(
                                                  factory.createIdentifier(fieldName),
                                                  factory.createToken(SyntaxKind.ExclamationEqualsEqualsToken),
                                                  factory.createPropertyAccessExpression(
                                                    factory.createIdentifier('item'),
                                                    factory.createIdentifier('id'),
                                                  ),
                                                )
                                              : factory.createPrefixUnaryExpression(
                                                  SyntaxKind.ExclamationToken,
                                                  factory.createCallExpression(
                                                    factory.createPropertyAccessExpression(
                                                      factory.createIdentifier(`${fieldName}IdSet`),
                                                      factory.createIdentifier('has'),
                                                    ),
                                                    undefined,
                                                    [
                                                      factory.createCallChain(
                                                        factory.createPropertyAccessExpression(
                                                          factory.createIdentifier('getIDValue'),
                                                          factory.createIdentifier(fieldName),
                                                        ),
                                                        factory.createToken(SyntaxKind.QuestionDotToken),
                                                        undefined,
                                                        [factory.createIdentifier('item')],
                                                      ),
                                                    ],
                                                  ),
                                                ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                  NodeFlags.AwaitContext,
                                ),
                              ),
                              factory.createExpressionStatement(
                                factory.createCallExpression(
                                  factory.createPropertyAccessExpression(
                                    factory.createIdentifier('newOptions'),
                                    factory.createIdentifier('push'),
                                  ),
                                  undefined,
                                  [factory.createSpreadElement(factory.createIdentifier('loaded'))],
                                ),
                              ),
                              factory.createExpressionStatement(
                                factory.createBinaryExpression(
                                  factory.createIdentifier('newNext'),
                                  factory.createToken(SyntaxKind.EqualsToken),
                                  factory.createPropertyAccessExpression(
                                    factory.createIdentifier('result'),
                                    factory.createIdentifier('nextToken'),
                                  ),
                                ),
                              ),
                            ],
                            true,
                          ),
                        ),
                        factory.createExpressionStatement(
                          factory.createCallExpression(setModelFetchOption, undefined, [
                            factory.createCallExpression(
                              factory.createPropertyAccessExpression(
                                factory.createIdentifier('newOptions'),
                                factory.createIdentifier('slice'),
                              ),
                              undefined,
                              [factory.createNumericLiteral('0'), factory.createIdentifier('autocompleteLength')],
                            ),
                          ]),
                        ),
                        factory.createExpressionStatement(
                          factory.createCallExpression(setModelLoading, undefined, [factory.createFalse()]),
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
        );
      }

      return acc;
    },
    [],
  );
  return [...fetchRecordsStatements, fetchRelatedRecordEffect(initalFetchRecords)];
};

export function wrapInParenthesizedExpression(callExpression: CallExpression, accessors: string[]): AwaitExpression {
  return accessors.reduce(
    (acc: any, _, index: any, initialValue: string[]) =>
      factory.createPropertyAccessChain(
        acc,
        factory.createToken(SyntaxKind.QuestionDotToken),
        factory.createIdentifier(initialValue[index]),
      ),
    factory.createAwaitExpression(callExpression),
  );
}
