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
import { InvalidInputError } from '@aws-amplify/codegen-ui';
import { CallExpression, factory } from 'typescript';
import { ImportCollection, ImportValue } from '../imports';

export enum ActionType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
}

export const getGraphqlQueryForModel = (action: ActionType, model: string): string => {
  switch (action) {
    case ActionType.CREATE:
      return `create${model}`;
    case ActionType.UPDATE:
      return `update${model}`;
    case ActionType.DELETE:
      return `delete${model}`;
    case ActionType.LIST:
      return `list${plural(model)}`;
    default:
      throw new InvalidInputError(`Action ${action} has no corresponding GraphQL operation`);
  }
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
export const getGraphqlCallExpression = (
  action: ActionType,
  model: string,
  importCollection: ImportCollection,
  inputs?: any[],
): CallExpression => {
  const query = getGraphqlQueryForModel(action, model);

  importCollection.addMappedImport(ImportValue.API);

  if (action === ActionType.LIST) {
    importCollection.addGraphqlQueryImport(query);
  } else {
    importCollection.addGraphqlMutationImport(query);
  }
  importCollection.addModelImport(model);

  return factory.createCallExpression(
    factory.createPropertyAccessExpression(factory.createIdentifier('API'), factory.createIdentifier('graphql')),
    undefined,
    [
      factory.createObjectLiteralExpression(
        inputs
          ? [
              factory.createPropertyAssignment(factory.createIdentifier('query'), factory.createIdentifier(query)),
              factory.createPropertyAssignment(
                factory.createIdentifier('variables'),
                factory.createObjectLiteralExpression(
                  [
                    factory.createPropertyAssignment(
                      factory.createIdentifier('input'),
                      factory.createObjectLiteralExpression(inputs, true),
                    ),
                  ],
                  true,
                ),
              ),
            ]
          : [factory.createPropertyAssignment(factory.createIdentifier('query'), factory.createIdentifier(query))],
        true,
      ),
    ],
  );
};
