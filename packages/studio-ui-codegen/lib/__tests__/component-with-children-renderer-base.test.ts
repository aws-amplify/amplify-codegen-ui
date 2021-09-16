import { ButtonProps } from '@amzn/amplify-ui-react-types';
import { StudioComponent, StudioComponentChild } from '@amzn/amplify-ui-codegen-schema';
import { ComponentWithChildrenRendererBase } from '../component-with-children-renderer-base';

class MockComponentRenderer extends ComponentWithChildrenRendererBase<ButtonProps, string, string> {
  renderElement(renderChildren: (children: StudioComponentChild[], component?: string) => string[]): string {
    return `${this.component.name},${renderChildren(this.component.children || []).join(',')}`;
  }
}

describe('ComponentWithChildrenRendererBase', () => {
  test('renderElement', () => {
    expect(
      new MockComponentRenderer({
        componentType: 'Button',
        name: 'MyButton',
        properties: {},
        children: [
          {
            componentType: 'Text',
            name: 'MyText',
            properties: {},
          },
        ],
      }).renderElement((children) => children.map((child) => child.name)),
    ).toEqual('MyButton,MyText');
  });
});
