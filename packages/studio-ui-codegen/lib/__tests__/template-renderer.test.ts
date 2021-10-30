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
import { mocked } from 'ts-jest/utils'; // eslint-disable-line import/no-extraneous-dependencies
import { existsSync, mkdirSync } from 'fs';
import { StudioComponent } from '../types';
import { StudioTemplateRendererFactory } from '../template-renderer-factory';
import { StudioTemplateRendererManager } from '../template-renderer';
import { MockOutputManager, MockTemplateRenderer } from './__utils__/mock-classes';

jest.mock('fs');

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
