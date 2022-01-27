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
} from '@aws-amplify/codegen-ui';
import {
  isFixedPropertyWithValue,
  isBoundProperty,
  isConcatenatedProperty,
  isConditionalProperty,
  buildBindingExpression,
  buildBindingWithDefaultExpression,
  buildConcatExpression,
  buildConditionalExpression,
  buildFixedLiteralExpression,
  isActionEvent,
} from '../react-component-render-helper';
import { ImportCollection, ImportSource } from '../imports';

enum Action {
  'Amplify.Navigate' = 'Amplify.Navigate',
  'Amplify.DataStoreCreateItem' = 'Amplify.DataStoreCreateItem',
  'Amplify.DataStoreUpdateItem' = 'Amplify.DataStoreUpdateItem',
  'Amplify.DataStoreDeleteItem' = 'Amplify.DataStoreDeleteItem',
  'Amplify.AuthSignOut' = 'Amplify.AuthSignOut',
  'Amplify.AuthUpdateUserAttributes' = 'Amplify.AuthUpdateUserAttributes',
}

export default Action;

export const ActionNameMapping: Partial<Record<Action, string>> = {
  [Action['Amplify.Navigate']]: 'useNavigateAction',
  [Action['Amplify.DataStoreCreateItem']]: 'useDataStoreCreateAction',
  [Action['Amplify.DataStoreUpdateItem']]: 'useDataStoreUpdateAction',
  [Action['Amplify.DataStoreDeleteItem']]: 'useDataStoreDeleteAction',
  [Action['Amplify.AuthSignOut']]: 'useAuthSignOutAction',
  [Action['Amplify.AuthUpdateUserAttributes']]: 'updateUserAttributesAction',
};

export function isAction(action: string): action is Action {
  return Object.values(Action).includes(action as Action);
}

export function getActionHookName(action: string): string {
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
  const actionHookName = getActionHookName(action.action);
  importCollection.addImport(ImportSource.UI_REACT_INTERNAL, actionHookName);
  return factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(identifier),
          undefined,
          undefined,
          factory.createCallExpression(factory.createIdentifier(actionHookName), undefined, [
            buildActionParameters(action, importCollection),
          ]),
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
  if (key === 'fields' || key === 'attributes') {
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
  return actionParameterToExpression(value as StudioComponentProperty);
}

export function actionParameterToExpression(parameter: StudioComponentProperty): Expression {
  if (isFixedPropertyWithValue(parameter)) {
    return buildFixedLiteralExpression(parameter);
  }

  if (isBoundProperty(parameter)) {
    return parameter.defaultValue === undefined
      ? buildBindingExpression(parameter)
      : buildBindingWithDefaultExpression(parameter, parameter.defaultValue);
  }

  if (isConcatenatedProperty(parameter)) {
    return buildConcatExpression(parameter);
  }

  if (isConditionalProperty(parameter)) {
    return buildConditionalExpression(parameter);
  }

  // TODO add user specific attributes

  throw new Error(`Invalid action parameter: ${JSON.stringify(parameter)}.`);
}
