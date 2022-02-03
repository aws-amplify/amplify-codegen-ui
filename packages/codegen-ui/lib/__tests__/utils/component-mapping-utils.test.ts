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
import { StudioComponent } from '../../types';
import { buildComponentNameToTypeMap } from '../../utils';

describe('buildComponentNameToTypeMap', () => {
  test('builds for a single component', () => {
    const component: StudioComponent = {
      componentType: 'Flex',
      name: 'SingleFlexComponent',
      properties: {},
      bindingProperties: {},
    };
    const expectedNameToTypeMapping = {
      SingleFlexComponent: 'Flex',
    };
    expect(buildComponentNameToTypeMap(component)).toEqual(expectedNameToTypeMapping);
  });

  test('builds for a single component with no name', () => {
    const component: StudioComponent = {
      componentType: 'Flex',
      properties: {},
      bindingProperties: {},
    };
    expect(buildComponentNameToTypeMap(component)).toEqual({});
  });

  test('builds deeply nested objects', () => {
    const component: StudioComponent = {
      componentType: 'Flex',
      name: 'TopLevelComponent',
      properties: {},
      bindingProperties: {},
      children: [
        {
          componentType: 'Flex',
          name: 'NestedComponent',
          properties: {},
          children: [
            {
              componentType: 'Button',
              name: 'NestedButton',
              properties: {},
            },
          ],
        },
        {
          componentType: 'Button',
          name: 'MyButton',
          properties: {},
        },
      ],
    };
    const expectedNameToTypeMapping = {
      TopLevelComponent: 'Flex',
      NestedComponent: 'Flex',
      MyButton: 'Button',
      NestedButton: 'Button',
    };
    expect(buildComponentNameToTypeMap(component)).toEqual(expectedNameToTypeMapping);
  });
});
