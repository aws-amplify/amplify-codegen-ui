import { StudioComponent } from '@amzn/amplify-ui-codegen-schema';
import { ImportCollection } from '../../import-collection';

import BadgeRenderer from '../../amplify-ui-renderers/badge';
import ButtonRenderer from '../../amplify-ui-renderers/button';
import BoxRenderer from '../../amplify-ui-renderers/box';
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
    | typeof BoxRenderer
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
  expect(new Renderer(component, new ImportCollection()).renderElement(renderChildren)).toMatchSnapshot();
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
      componentType: 'Box',
      name: 'MyBox',
      properties: {},
      bindingProperties: {},
    };
    testComponentRenderer(BoxRenderer, component);
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
      expect(renderString(component)).toMatchSnapshot();
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
