import { StudioTemplateRendererFactory } from '../template-renderer-factory';
import { MockOutputManager, MockTemplateRenderer } from './__utils__/mock-classes';

describe('StudioTemplateRendererFactory', () => {
  test('buildRenerer', () => {
    const componentName = 'MyText';
    const outputManager = new MockOutputManager();
    const renderer = new StudioTemplateRendererFactory(
      (component) => new MockTemplateRenderer(component, outputManager, {}),
    ).buildRenderer({
      componentType: 'Text',
      name: componentName,
      properties: {},
      bindingProperties: {},
    });

    expect(renderer.renderComponent()).toEqual({
      componentText: componentName,
      renderComponentToFilesystem: expect.any(Function),
    });
  });
});
