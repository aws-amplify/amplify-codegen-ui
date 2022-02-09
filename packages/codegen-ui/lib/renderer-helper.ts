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
  StudioComponent,
  StudioComponentAuthProperty,
  StudioComponentChild,
  StudioComponentDataPropertyBinding,
  StudioComponentEventPropertyBinding,
  StudioComponentPropertyType,
  StudioComponentSimplePropertyBinding,
  StudioComponentStoragePropertyBinding,
  StudioComponentPropertyBinding,
  StudioComponentProperty,
  ActionStudioComponentEvent,
} from './types';

export const StudioRendererConstants = {
  unknownName: 'unknown_component_name',
};

export function isStudioComponentWithBinding(
  component: StudioComponent | StudioComponentChild,
): component is StudioComponent {
  return 'bindingProperties' in component;
}

export function hasAuthProperty(component: StudioComponent | StudioComponentChild): boolean {
  return Object.values(component.properties).some((val) => isAuthProperty(val));
}

function hasAuthAction(component: StudioComponent | StudioComponentChild): boolean {
  const actions = component.events
    ? (Object.values(component.events).filter((event) => 'action' in event) as ActionStudioComponentEvent[])
    : [];
  return actions.some(doesActionHaveAuthBinding);
}

/**
 * This should be written in a more generic way. Enumerating each case to get it out quickly.
 */
function doesActionHaveAuthBinding(action: ActionStudioComponentEvent): boolean {
  switch (action.action) {
    case 'Amplify.Navigation':
      return Object.values(action.parameters).some(isAuthProperty);
    case 'Amplify.AuthSignOut':
      return Object.values(action.parameters).some(isAuthProperty);
    case 'Amplify.DataStoreCreateItemAction':
      return Object.values(action.parameters.fields).some(isAuthProperty);
    case 'Amplify.DataStoreUpdateItemAction':
      return isAuthProperty(action.parameters.id) || Object.values(action.parameters.fields).some(isAuthProperty);
    case 'Amplify.DataStoreDeleteItemAction':
      return isAuthProperty(action.parameters.id);
    case 'Amplify.Mutation':
      return action.parameters.state.set && isAuthProperty(action.parameters.state.set);
    default:
      throw new Error(`Action ${JSON.stringify(action)} could not be scanned for auth bindings.`);
  }
}

export function isAuthProperty(prop: StudioComponentProperty): prop is StudioComponentAuthProperty {
  return 'userAttribute' in prop;
}

export function isStudioComponentWithAuthDependency(
  component: StudioComponent | StudioComponentChild,
): component is StudioComponent {
  if (hasAuthProperty(component) || hasAuthAction(component)) {
    return true;
  }
  if (component.children) {
    return component.children.some(isStudioComponentWithAuthDependency);
  }
  return false;
}

/**
 * Verify if this is 1) a type that has the collectionProperties, and 2) that the collection
 * properties object is set. Then provide the typehint back to the compiler that this attribute exists.
 */
export function isStudioComponentWithCollectionProperties(
  component: StudioComponent | StudioComponentChild,
): component is StudioComponent & Required<Pick<StudioComponent, 'collectionProperties'>> {
  return 'collectionProperties' in component && component.collectionProperties !== undefined;
}

export function isStudioComponentWithVariants(
  component: StudioComponent | StudioComponentChild,
): component is StudioComponent & Required<Pick<StudioComponent, 'variants'>> {
  return 'variants' in component && component.variants !== undefined && component.variants.length > 0;
}

export function isDataPropertyBinding(
  prop: StudioComponentPropertyBinding,
): prop is StudioComponentDataPropertyBinding {
  return 'type' in prop && prop.type === 'Data';
}

export function isStoragePropertyBinding(
  prop: StudioComponentPropertyBinding,
): prop is StudioComponentStoragePropertyBinding {
  return 'type' in prop && prop.type === 'Storage';
}

export function isSimplePropertyBinding(
  prop: StudioComponentPropertyBinding,
): prop is StudioComponentSimplePropertyBinding {
  return (
    'type' in prop &&
    [
      StudioComponentPropertyType.Boolean.toString(),
      StudioComponentPropertyType.Number.toString(),
      StudioComponentPropertyType.String.toString(),
      StudioComponentPropertyType.Date.toString(),
    ].includes(prop.type)
  );
}

export function isEventPropertyBinding(
  prop: StudioComponentPropertyBinding,
): prop is StudioComponentEventPropertyBinding {
  return 'type' in prop && prop.type === 'Event';
}
