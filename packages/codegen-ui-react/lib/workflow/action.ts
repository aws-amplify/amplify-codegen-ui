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

import ts, { Statement, factory, ObjectLiteralExpression, Expression } from 'typescript';
import {
  InvalidInputError,
  StudioComponent,
  StudioComponentChild,
  ActionStudioComponentEvent,
  StudioComponentProperty,
  MutationAction,
} from '@aws-amplify/codegen-ui';
import { isActionEvent, propertyToExpression, getSetStateName } from '../react-component-render-helper';
import { ImportCollection, ImportSource, ImportValue } from '../imports';

enum Action {
  'Amplify.Navigate' = 'Amplify.Navigate',
  'Amplify.DataStoreCreateItem' = 'Amplify.DataStoreCreateItem',
  'Amplify.DataStoreUpdateItem' = 'Amplify.DataStoreUpdateItem',
  'Amplify.DataStoreDeleteItem' = 'Amplify.DataStoreDeleteItem',
  'Amplify.AuthSignOut' = 'Amplify.AuthSignOut',
  'Amplify.Mutation' = 'Amplify.Mutation',
}

export default Action;

export const ActionNameMapping: Partial<Record<Action, ImportValue>> = {
  [Action['Amplify.Navigate']]: ImportValue.USE_NAVIGATE_ACTION,
  [Action['Amplify.DataStoreCreateItem']]: ImportValue.USE_DATA_STORE_CREATE_ACTION,
  [Action['Amplify.DataStoreUpdateItem']]: ImportValue.USE_DATA_STORE_UPDATE_ACTION,
  [Action['Amplify.DataStoreDeleteItem']]: ImportValue.USE_DATA_STORE_DELETE_ACTION,
  [Action['Amplify.AuthSignOut']]: ImportValue.USE_AUTH_SIGN_OUT_ACTION,
  [Action['Amplify.Mutation']]: ImportValue.USE_STATE_MUTATION_ACTION,
};

export function isAction(action: string): action is Action {
  return Object.values(Action).includes(action as Action);
}

export function isMutationAction(action: ActionStudioComponentEvent): action is MutationAction {
  return (action.action as Action) === Action['Amplify.Mutation'];
}

export function getActionHookImportValue(action: string): ImportValue {
  const actionName = ActionNameMapping[Action[action as Action]];
  if (actionName === undefined) {
    throw new InvalidInputError(`${action} is not a valid action.`);
  }
  return actionName;
}

export function getComponentActions(component: StudioComponent | StudioComponentChild): {
  action: ActionStudioComponentEvent;
  identifier: string;
}[] {
  const actions = [];
  if (component.events) {
    actions.push(
      ...Object.entries(component.events)
        // need 'action is ...' so that typescript will know all items after filter are ActionStudioComponentEvent type
        .filter((action): action is [string, ActionStudioComponentEvent] => isActionEvent(action[1]))
        .map(([event, action]) => ({ action, identifier: getActionIdentifier(component.name, event) })),
    );
  }
  if (component.children) {
    actions.push(...component.children.map(getComponentActions).flat());
  }
  return actions;
}

export function getActionIdentifier(componentName: string | undefined, event: string) {
  const name = componentName || '';
  return [name.charAt(0).toLowerCase() + name.slice(1), event.charAt(0).toUpperCase() + event.slice(1)].join('');
}

export function buildUseActionStatement(
  action: ActionStudioComponentEvent,
  identifier: string,
  importCollection: ImportCollection,
): Statement {
  if (isMutationAction(action)) {
    return buildMutationActionStatement(action, identifier);
  }

  const actionHookImportValue = getActionHookImportValue(action.action);
  importCollection.addMappedImport(actionHookImportValue);
  return factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(identifier),
          undefined,
          undefined,
          factory.createCallExpression(factory.createIdentifier(actionHookImportValue), undefined, [
            buildActionParameters(action, importCollection),
          ]),
        ),
      ],
      ts.NodeFlags.Const,
    ),
  );
}

export function buildMutationActionStatement(action: MutationAction, identifier: string) {
  const setState = getSetStateName(action.parameters.state);

  return factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(identifier),
          undefined,
          undefined,
          factory.createArrowFunction(
            undefined,
            undefined,
            [],
            undefined,
            factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
            factory.createBlock(
              [
                factory.createExpressionStatement(
                  factory.createCallExpression(factory.createIdentifier(setState), undefined, [
                    propertyToExpression(action.parameters.state.set),
                  ]),
                ),
              ],
              true,
            ),
          ),
        ),
      ],
      ts.NodeFlags.Const,
    ),
  );
}

/* Transform the action parameters field to literal
 *
 * model and fields are special cases. All other fields are StudioComponentProperty
 */
export function buildActionParameters(
  action: ActionStudioComponentEvent,
  importCollection: ImportCollection,
): ObjectLiteralExpression {
  if (action.parameters) {
    // TODO: add special case for model and fields
    return factory.createObjectLiteralExpression(
      Object.entries(action.parameters).map(([key, value]) =>
        factory.createPropertyAssignment(
          factory.createIdentifier(key),
          getActionParameterValue(key, value, importCollection),
        ),
      ),
      false,
    );
  }
  // TODO: determine what should be used when no parameters
  return factory.createObjectLiteralExpression([], false);
}

export function getActionParameterValue(
  key: string,
  value: StudioComponentProperty | { [key: string]: StudioComponentProperty } | string,
  importCollection: ImportCollection,
): Expression {
  if (key === 'model') {
    importCollection.addImport(ImportSource.LOCAL_MODELS, value as string);
    return factory.createIdentifier(value as string);
  }
  if (key === 'fields') {
    return factory.createObjectLiteralExpression(
      Object.entries(value).map(([nestedKey, nestedValue]) =>
        factory.createPropertyAssignment(
          factory.createIdentifier(nestedKey),
          getActionParameterValue(nestedKey, nestedValue, importCollection),
        ),
      ),
      false,
    );
  }
  return propertyToExpression(value as StudioComponentProperty);
}
