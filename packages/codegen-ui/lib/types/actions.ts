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
import { StudioComponentProperty, StateStudioComponentProperty } from './properties';

export type StateReference = StateStudioComponentProperty | MutationActionSetStateParameter;

export type MutationAction = {
  action: 'Amplify.Mutation';
  parameters: {
    state: MutationActionSetStateParameter;
  };
};

export type MutationActionSetStateParameter = {
  componentName: string;
  property: string;
  set: StudioComponentProperty;
};

export type ActionStudioComponentEvent =
  | NavigationAction
  | AuthSignOutAction
  | DataStoreCreateItemAction
  | DataStoreUpdateItemAction
  | DataStoreDeleteItemAction
  | MutationAction;

export type NavigationAction = {
  action: 'Amplify.Navigation';
  parameters: {
    type: StudioComponentProperty;
    url?: StudioComponentProperty;
    anchor?: StudioComponentProperty;
    target?: StudioComponentProperty;
  };
};

export type AuthSignOutAction = {
  action: 'Amplify.AuthSignOut';
  parameters: {
    global: StudioComponentProperty;
  };
};

export type DataStoreCreateItemAction = {
  action: 'Amplify.DataStoreCreateItemAction';
  parameters: {
    model: string;
    fields: {
      [propertyName: string]: StudioComponentProperty;
    };
  };
};

export type DataStoreUpdateItemAction = {
  action: 'Amplify.DataStoreUpdateItemAction';
  parameters: {
    model: string;
    id: StudioComponentProperty;
    fields: {
      [propertyName: string]: StudioComponentProperty;
    };
  };
};

export type DataStoreDeleteItemAction = {
  action: 'Amplify.DataStoreDeleteItemAction';
  parameters: {
    model: string;
    id: StudioComponentProperty;
  };
};
