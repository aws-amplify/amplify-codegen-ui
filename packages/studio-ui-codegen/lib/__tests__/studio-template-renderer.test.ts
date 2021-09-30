/* eslint-disable max-classes-per-file */
import { MockOutputManager, MockTemplateRenderer } from './__utils__/mock-classes';

describe('StudioTemplateRenderer', () => {
  test('renderComponentToFilesystem', () => {
    const component = {
      componentType: 'Text',
      name: 'MyText',
      properties: {},
      bindingProperties: {},
    };
    const outputManager = new MockOutputManager();
    outputManager.writeComponent = jest.fn();
    const componentText = 'component';
    const fileName = 'MyText.ts';
    const outputPath = 'ui-components';
    new MockTemplateRenderer(component, outputManager, {}).renderComponentToFilesystem(componentText)(fileName)(
      outputPath,
    );
    expect(outputManager.writeComponent).toHaveBeenCalledWith(
      componentText,
      `${outputPath}/${fileName}`,
      component.name,
    );
  });

  test('renderComponentToFilesystem with unkown name', () => {
    const component = {
      componentType: 'Text',
      properties: {},
      bindingProperties: {},
    };
    const outputManager = new MockOutputManager();
    outputManager.writeComponent = jest.fn();
    const componentText = 'component';
    const fileName = 'MyText.ts';
    const outputPath = 'ui-components';
    new MockTemplateRenderer(component, outputManager, {}).renderComponentToFilesystem(componentText)(fileName)(
      outputPath,
    );
    expect(outputManager.writeComponent).toHaveBeenCalledWith(
      componentText,
      `${outputPath}/${fileName}`,
      'unknown_component_name',
    );
  });
});
