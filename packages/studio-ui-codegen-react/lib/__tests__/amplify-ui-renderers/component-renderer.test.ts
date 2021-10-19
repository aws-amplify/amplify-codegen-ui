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
import { StudioComponent } from '@amzn/amplify-ui-codegen-schema';
import { createPrinter, EmitHint, createSourceFile, ScriptTarget, ScriptKind } from 'typescript';
import { ImportCollection } from '../../import-collection';
import { assertASTMatchesSnapshot } from '../__utils__/snapshot-helpers';

import BadgeRenderer from '../../amplify-ui-renderers/badge';
import ButtonRenderer from '../../amplify-ui-renderers/button';
import ViewRenderer from '../../amplify-ui-renderers/view';
import CardRenderer from '../../amplify-ui-renderers/card';
import DividerRenderer from '../../amplify-ui-renderers/divider';
import FlexRenderer from '../../amplify-ui-renderers/flex';
import ImageRenderer from '../../amplify-ui-renderers/image';
import TextRenderer from '../../amplify-ui-renderers/text';
import renderString from '../../amplify-ui-renderers/string';
import CustomComponentRenderer from '../../amplify-ui-renderers/customComponent';
import CollectionRenderer from '../../amplify-ui-renderers/collection';

function testComponentRenderer(
  Renderer:
    | typeof BadgeRenderer
    | typeof ButtonRenderer
    | typeof ViewRenderer
    | typeof CardRenderer
    | typeof DividerRenderer
    | typeof FlexRenderer
    | typeof ImageRenderer
    | typeof TextRenderer
    | typeof CustomComponentRenderer
    | typeof CollectionRenderer,
  component: StudioComponent,
) {
  const renderChildren = jest.fn();
  const renderedComponent = new Renderer(component, new ImportCollection()).renderElement(renderChildren);

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
    testComponentRenderer(BadgeRenderer, component);
  });

  test('ButtonRenderer', () => {
    const component = {
      componentType: 'Button',
      name: 'MyButton',
      properties: {},
      bindingProperties: {},
    };
    testComponentRenderer(ButtonRenderer, component);
  });

  test('BoxRenderer', () => {
    const component = {
      componentType: 'View',
      name: 'MyView',
      properties: {},
      bindingProperties: {},
    };
    testComponentRenderer(ViewRenderer, component);
  });

  test('CardRenderer', () => {
    const component = {
      componentType: 'Card',
      name: 'MyCard',
      properties: {},
      bindingProperties: {},
    };
    testComponentRenderer(CardRenderer, component);
  });

  test('DividerRenderer', () => {
    const component = {
      componentType: 'Divider',
      name: 'MyDivider',
      properties: {},
      bindingProperties: {},
    };
    testComponentRenderer(DividerRenderer, component);
  });

  test('FlexRenderer', () => {
    const component = {
      componentType: 'Flex',
      name: 'MyFlex',
      properties: {},
      bindingProperties: {},
    };
    testComponentRenderer(FlexRenderer, component);
  });

  test('ImageRenderer', () => {
    const component = {
      componentType: 'Image',
      name: 'MyImage',
      properties: {},
      bindingProperties: {},
    };
    testComponentRenderer(ImageRenderer, component);
  });

  test('TextRenderer', () => {
    const component = {
      componentType: 'Text',
      name: 'MyText',
      properties: { value: { value: 'test' } },
      bindingProperties: {},
    };
    testComponentRenderer(TextRenderer, component);
  });

  test('CustomComponentRenderer', () => {
    const component = {
      componentType: 'Custom',
      name: 'MyCustom',
      properties: {},
      bindingProperties: {},
    };
    testComponentRenderer(CustomComponentRenderer, component);
  });

  test('CollectionRenderer', () => {
    const component = {
      componentType: 'Collection',
      name: 'MyCollection',
      properties: {},
      bindingProperties: {},
    };
    testComponentRenderer(CollectionRenderer, component);
  });

  describe('StringRenderer', () => {
    test('basic', () => {
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

      const renderedString = renderString(component);
      const file = createSourceFile('test.ts', '', ScriptTarget.ES2015, true, ScriptKind.TS);
      const printer = createPrinter();
      expect(printer.printNode(EmitHint.Unspecified, renderedString, file)).toMatchSnapshot();
    });

    test('missing props', () => {
      const component = {
        componentType: 'String',
        name: 'MyString',
        properties: {},
        bindingProperties: {},
      };
      expect(() => renderString(component)).toThrowErrorMatchingSnapshot();
    });
  });
});
