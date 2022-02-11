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
import { MutationAction, ComponentMetadata } from '@aws-amplify/codegen-ui';
import {
  getComponentStateReferences,
  getActionStateParameters,
  getComponentFromComponentTree,
} from '../../workflow/mutation';

describe('getComponentStateReferences', () => {
  test('basic', () => {
    const componentMetadata: ComponentMetadata = {
      hasAuthBindings: false,
      requiredDataModels: [],
      stateReferences: [{ componentName: 'UserNameTextField', property: 'value' }],
      componentNameToTypeMap: { UserNameTextField: 'TextField' },
    };
    expect(getComponentStateReferences(componentMetadata)).toMatchSnapshot();
  });
});

describe('getActionStateParameters', () => {
  test('basic', () => {
    const action: MutationAction = {
      action: 'Amplify.Mutation',
      parameters: {
        state: {
          componentName: 'ColoredBox',
          property: 'backgroundColor',
          set: {
            value: 'something',
          },
        },
      },
    };
    expect(getActionStateParameters(action)).toMatchSnapshot();
  });
});

describe('getComponentFromComponentTree', () => {
  const grandChildComponent = {
    componentType: 'TextField',
    name: 'GrandChildComponent',
    properties: {},
  };
  const childComponent = {
    componentType: 'Flex',
    name: 'ChildComponent',
    properties: {},
    children: [grandChildComponent],
  };
  const component = {
    componentType: 'Flex',
    name: 'Component',
    properties: {},
    bindingProperties: {},
    children: [childComponent],
  };
  test('same as root component', () => {
    expect(getComponentFromComponentTree(component, 'Component')).toEqual(component);
  });

  test('child component', () => {
    expect(getComponentFromComponentTree(component, 'ChildComponent')).toEqual(childComponent);
  });

  test('grandchild component', () => {
    expect(getComponentFromComponentTree(component, 'GrandChildComponent')).toEqual(grandChildComponent);
  });

  test('not found', () => {
    expect(() => getComponentFromComponentTree(component, 'NotFoundComponent')).toThrowErrorMatchingSnapshot();
  });
});
