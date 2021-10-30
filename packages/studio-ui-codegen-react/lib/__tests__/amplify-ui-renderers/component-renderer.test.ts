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
import { StudioComponent } from '@amzn/studio-ui-codegen';
import { assertASTMatchesSnapshot } from '../__utils__/snapshot-helpers';

import renderString from '../../amplify-ui-renderers/string';
import { AmplifyRenderer } from '../../amplify-ui-renderers/amplify-renderer';

function testComponentRenderer(component: StudioComponent) {
  const renderedComponent = new AmplifyRenderer(component, {}).renderJsx(component);
  assertASTMatchesSnapshot(renderedComponent);
}

describe('Component Renderers', () => {
  test('BadgeRenderer', () => {
    const component = {
      componentType: 'Badge',
      name: 'MyBadge',
      properties: {},
      bindingProperties: {},
    };
    testComponentRenderer(component);
  });

  test('ButtonRenderer', () => {
    const component = {
      componentType: 'Button',
      name: 'MyButton',
      properties: {},
      bindingProperties: {},
    };
    testComponentRenderer(component);
  });

  test('BoxRenderer', () => {
    const component = {
      componentType: 'View',
      name: 'MyView',
      properties: {},
      bindingProperties: {},
    };
    testComponentRenderer(component);
  });

  test('CardRenderer', () => {
    const component = {
      componentType: 'Card',
      name: 'MyCard',
      properties: {},
      bindingProperties: {},
    };
    testComponentRenderer(component);
  });

  test('DividerRenderer', () => {
    const component = {
      componentType: 'Divider',
      name: 'MyDivider',
      properties: {},
      bindingProperties: {},
    };
    testComponentRenderer(component);
  });

  test('FlexRenderer', () => {
    const component = {
      componentType: 'Flex',
      name: 'MyFlex',
      properties: {},
      bindingProperties: {},
    };
    testComponentRenderer(component);
  });

  test('ImageRenderer', () => {
    const component = {
      componentType: 'Image',
      name: 'MyImage',
      properties: {},
      bindingProperties: {},
    };
    testComponentRenderer(component);
  });

  test('TextRenderer', () => {
    const component = {
      componentType: 'Text',
      name: 'MyText',
      properties: { value: { value: 'test' } },
      bindingProperties: {},
    };
    testComponentRenderer(component);
  });

  test('CustomComponentRenderer', () => {
    const component = {
      componentType: 'Custom',
      name: 'MyCustom',
      properties: {},
      bindingProperties: {},
    };
    testComponentRenderer(component);
  });

  test('CollectionRenderer', () => {
    const component = {
      componentType: 'Collection',
      name: 'MyCollection',
      properties: {},
      bindingProperties: {},
    };
    testComponentRenderer(component);
  });

  test('StringRenderer', () => {
    const component = {
      componentType: 'String',
      name: 'MyString',
      properties: {
        value: {
          value: 'test',
        },
      },
      bindingProperties: {},
    };
    testComponentRenderer(component);
  });

  test('StringRenderer throws on missing props', () => {
    const component = {
      componentType: 'String',
      name: 'MyString',
      properties: {},
      bindingProperties: {},
    };
    expect(() => renderString(component)).toThrowErrorMatchingSnapshot();
  });
});
