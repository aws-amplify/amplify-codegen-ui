/* eslint-disable max-classes-per-file */
import { FrameworkOutputManager } from '../framework-output-manager';
import { StudioTemplateRenderer } from '../studio-template-renderer';
import { StudioTemplateRendererFactory } from '../template-renderer-factory';

class MockOutputManager extends FrameworkOutputManager<string> {
  writeComponent(): Promise<void> {
    return new Promise((resolve) => {
      resolve();
    });
  }
}

const renderComponentToFilesystem = jest.fn();

class MockTemplateRenderer extends StudioTemplateRenderer<
  string,
  MockOutputManager,
  { componentText: string; renderComponentToFilesystem: (outputPath: string) => Promise<void> }
> {
  renderComponent() {
    return {
      componentText: this.component.name || '',
      renderComponentToFilesystem,
    };
  }
}

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
      renderComponentToFilesystem,
    });
  });
});
