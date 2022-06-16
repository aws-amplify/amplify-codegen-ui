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
import { StudioNode } from '../studio-node';
import { CommonComponentRenderer } from '../common-component-renderer';

class MockComponentRenderer extends CommonComponentRenderer<{ mockProp: any }> {}

describe('common-component-renderer', () => {
  test('constructor', () => {
    const component = {
      componentType: 'Button',
      name: 'MyButton',
      properties: {
        value: { value: 'Confirm' },
      },
    };
    const parent = new StudioNode({
      componentType: 'View',
      name: 'MyView',
      properties: {},
    });
    const renderer = new MockComponentRenderer(component, parent);
    expect(renderer).toMatchSnapshot();
  });
});
