/* eslint-disable max-classes-per-file */
import { mocked } from 'ts-jest/utils'; // eslint-disable-line import/no-extraneous-dependencies
import { StudioComponent } from '@amzn/amplify-ui-codegen-schema';
import { existsSync, mkdirSync } from 'fs';
import { StudioTemplateRenderer } from '../studio-template-renderer';
import { StudioTemplateRendererFactory } from '../template-renderer-factory';
import { StudioTemplateRendererManager } from '../template-renderer';
import { FrameworkOutputManager } from '../framework-output-manager';

jest.mock('fs');

class MockOutputManager extends FrameworkOutputManager<string> {
  writeComponent(): Promise<void> {
    return new Promise((resolve) => {
      resolve();
    });
  }
}

class MockTemplateRenderer extends StudioTemplateRenderer<
  string,
  MockOutputManager,
  { componentText: string; renderComponentToFilesystem: (outputPath: string) => Promise<void> }
> {
  renderComponent() {
    return {
      componentText: this.component.name || '',
      renderComponentToFilesystem: jest.fn(),
    };
  }
}

describe('StudioTemplateRendererManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('constructor - outputPathDir does not exist', () => {
    const outputPathDir = 'mock-output';
    const outputManager = new MockOutputManager();
    const rendererFactory = new StudioTemplateRendererFactory(
      (component: StudioComponent) => new MockTemplateRenderer(component, outputManager, {}),
    );

    mocked(existsSync).mockImplementation(() => false);
    new StudioTemplateRendererManager(rendererFactory, { outputPathDir }); // eslint-disable-line no-new
    expect(existsSync).toHaveBeenCalled();
    expect(mkdirSync).toHaveBeenCalledWith(outputPathDir);
  });

  test('constructor - outputPathDir does exist', () => {
    const outputPathDir = 'mock-output';
    const outputManager = new MockOutputManager();
    const rendererFactory = new StudioTemplateRendererFactory(
      (component: StudioComponent) => new MockTemplateRenderer(component, outputManager, {}),
    );

    mocked(existsSync).mockImplementation(() => true);
    new StudioTemplateRendererManager(rendererFactory, { outputPathDir }); // eslint-disable-line no-new
    expect(existsSync).toHaveBeenCalled();
    expect(mkdirSync).not.toHaveBeenCalled();
  });

  describe('renderSchemaToTemplate', () => {
    test('render component', () => {
      const outputPathDir = 'mock-output';
      const outputManager = new MockOutputManager();
      const rendererFactory = new StudioTemplateRendererFactory(
        (component: StudioComponent) => new MockTemplateRenderer(component, outputManager, {}),
      );
      const rendererManager = new StudioTemplateRendererManager(rendererFactory, { outputPathDir });

      const component = {
        componentType: 'Text',
        name: 'MyText',
        properties: {},
        bindingProperties: {},
      };
      const result = rendererManager.renderSchemaToTemplate(component);
      expect(result).toMatchSnapshot();
      expect(result.renderComponentToFilesystem).toHaveBeenCalledWith(outputPathDir);
    });

    test('throw error when component is not defined', () => {
      const outputPathDir = 'mock-output';
      const outputManager = new MockOutputManager();
      const rendererFactory = new StudioTemplateRendererFactory(
        (component: StudioComponent) => new MockTemplateRenderer(component, outputManager, {}),
      );
      const rendererManager = new StudioTemplateRendererManager(rendererFactory, { outputPathDir });

      expect(() => rendererManager.renderSchemaToTemplate(undefined)).toThrowErrorMatchingSnapshot();
    });
  });

  describe('renderSchemaToTemplates', () => {
    test('render components', () => {
      const outputPathDir = 'mock-output';
      const outputManager = new MockOutputManager();
      const mockRender = jest.fn(
        (component: StudioComponent) => new MockTemplateRenderer(component, outputManager, {}),
      );
      const rendererFactory = new StudioTemplateRendererFactory(mockRender);
      const rendererManager = new StudioTemplateRendererManager(rendererFactory, { outputPathDir });

      const component = {
        componentType: 'Text',
        name: 'MyText',
        properties: {},
        bindingProperties: {},
      };
      rendererManager.renderSchemaToTemplates([component]);
      expect(mockRender).toHaveBeenCalledWith(component);
    });

    test('throw error when component is not defined', () => {
      const outputPathDir = 'mock-output';
      const outputManager = new MockOutputManager();
      const rendererFactory = new StudioTemplateRendererFactory(
        (component: StudioComponent) => new MockTemplateRenderer(component, outputManager, {}),
      );
      const rendererManager = new StudioTemplateRendererManager(rendererFactory, { outputPathDir });

      expect(() => rendererManager.renderSchemaToTemplates(undefined)).toThrowErrorMatchingSnapshot();
    });
  });
});
