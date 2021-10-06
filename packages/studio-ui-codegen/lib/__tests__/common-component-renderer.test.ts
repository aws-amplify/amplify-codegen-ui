import { BaseComponentProps } from '@aws-amplify/ui-react';
import { StudioNode } from '../studio-node';
import { CommonComponentRenderer } from '../common-component-renderer';

class MockComponentRenderer extends CommonComponentRenderer<BaseComponentProps> {}

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
