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
import { CallExpression, ObjectLiteralElementLike, factory } from 'typescript';
import { ImportCollection, ImportValue } from '../imports';

export enum ActionType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
}

export const getGraphqlQueryForModel = (action: ActionType, model: string): string => {
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
  inputs?: ObjectLiteralElementLike[],
  filters?: ObjectLiteralElementLike[],
): CallExpression => {
  const query = getGraphqlQueryForModel(action, model);
  const graphqlVariables: ObjectLiteralElementLike[] = [];

  importCollection.addMappedImport(ImportValue.API);

  if (inputs) {
    graphqlVariables.push(
      factory.createPropertyAssignment(
        factory.createIdentifier('input'),
        factory.createObjectLiteralExpression(inputs, true),
      ),
    );
  }

  if (action === ActionType.LIST || action === ActionType.GET) {
    importCollection.addGraphqlQueryImport(query);
    // filter applies to list
    if (filters) {
      graphqlVariables.push(
        factory.createPropertyAssignment(
          factory.createIdentifier('filter'),
          factory.createObjectLiteralExpression(filters, true),
        ),
      );
    }
  } else {
    importCollection.addGraphqlMutationImport(query);
  }
  importCollection.addModelImport(model);

  const graphqlOptions: ObjectLiteralElementLike[] = [
    factory.createPropertyAssignment(factory.createIdentifier('query'), factory.createIdentifier(query)),
  ];

  if (graphqlVariables.length > 0) {
    graphqlOptions.push(
      factory.createPropertyAssignment(
        factory.createIdentifier('variables'),
        factory.createObjectLiteralExpression(graphqlVariables),
      ),
    );
  }
  return factory.createCallExpression(
    factory.createPropertyAccessExpression(factory.createIdentifier('API'), factory.createIdentifier('graphql')),
    undefined,
    [factory.createObjectLiteralExpression(graphqlOptions, true)],
  );
};
