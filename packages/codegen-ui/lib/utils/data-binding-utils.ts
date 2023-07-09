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
  ActionStudioComponentEvent,
  StudioComponent,
  StudioComponentChild,
  StudioComponentEvent,
  StudioForm,
} from '../types';

const dataActions = [
  'Amplify.DataStoreCreateItemAction',
  'Amplify.DataStoreUpdateItemAction',
  'Amplify.DataStoreDeleteItemAction',
];

export function formRequiresDataApi(form: StudioForm): boolean {
  return form.dataType.dataSourceType === 'DataStore';
}

export function componentRequiresDataApi(component: StudioComponent): boolean {
  // data-bound collections have their data dependency persisted as a collection property
  if (component.componentType === 'Collection' && component.collectionProperties) {
    return Object.values(component.collectionProperties).length > 0;
  }

  // data-bound components need to be searched recursively for datastore actions
  return hasDataAction(component);
}

function isActionEvent(event: StudioComponentEvent): event is ActionStudioComponentEvent {
  return 'action' in event && !!event.action;
}

function hasDataAction(component: StudioComponentChild): boolean {
  const actions = Object.values(component.events || {})
    .filter(isActionEvent)
    .map((e) => e.action);
  if (actions.length && actions.some((a) => dataActions.includes(a))) {
    return true;
  }

  return (component.children || []).some(hasDataAction);
}
