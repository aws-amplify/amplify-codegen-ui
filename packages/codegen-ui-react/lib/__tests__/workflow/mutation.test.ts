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
import { MutationAction, DataStoreUpdateItemAction } from '@aws-amplify/codegen-ui';
import { getComponentStateReferences, getActionStateParameters } from '../../workflow/mutation';

describe('getComponentStateReferences', () => {
  test('basic', () => {
    const clickEvent: DataStoreUpdateItemAction = {
      action: 'Amplify.DataStoreUpdateItemAction',
      parameters: {
        model: 'Customer',
        id: {
          value: 'd9887268-47dd-4899-9568-db5809218751',
        },
        fields: {
          username: {
            componentName: 'UserNameTextField',
            property: 'value',
          },
        },
      },
    };

    const component = {
      id: '1234-5678-9010',
      componentType: 'Flex',
      name: 'MyForm',
      properties: {},
      bindingProperties: {},
      children: [
        {
          componentType: 'TextField',
          name: 'UsernameTextField',
          properties: {
            label: {
              value: 'Username',
            },
            value: {
              value: 'vizsla',
            },
          },
          bindingProperties: {},
        },
        {
          componentType: 'Button',
          name: 'SubmitButton',
          properties: {
            label: {
              value: 'Username',
            },
            value: {
              value: 'vizsla',
            },
          },
          bindingProperties: {},
          events: {
            click: clickEvent,
          },
        },
      ],
    };
    expect(getComponentStateReferences(component)).toMatchSnapshot();
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
