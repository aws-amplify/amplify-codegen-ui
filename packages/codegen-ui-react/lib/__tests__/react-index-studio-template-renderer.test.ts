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
import { ReactRenderConfig } from '..';
import { ReactIndexStudioTemplateRenderer } from '../react-index-studio-template-renderer';

class MockReactIndexStudioTemplateRenderer extends ReactIndexStudioTemplateRenderer {
  getRenderConfig(): ReactRenderConfig {
    return this.renderConfig;
  }

  renderComponentToFilesystem = jest.fn(() => jest.fn(() => jest.fn()));
}

describe('ReactIndexStudioTemplateRenderer', () => {
  describe('constructor', () => {
    test('overrides renderTypeDeclarations to false', () => {
      const renderer = new MockReactIndexStudioTemplateRenderer([], {
        renderTypeDeclarations: true,
      });
      expect(renderer.getRenderConfig().renderTypeDeclarations).toBeFalsy();
    });

    test('sets correct filename', () => {
      expect(new MockReactIndexStudioTemplateRenderer([], {}).fileName).toEqual('index.ts');
    });
  });

  describe('renderComponentInternal', () => {
    const components = [
      {
        componentType: 'Text',
        name: 'MyText',
        properties: {},
        bindingProperties: {},
      },
      {
        componentType: 'Button',
        name: 'MyButton',
        properties: {},
        bindingProperties: {},
      },
    ];

    test('renders correct component text', () => {
      const renderer = new MockReactIndexStudioTemplateRenderer(components, {});
      const { componentText } = renderer.renderComponentInternal();
      expect(componentText).toMatchSnapshot();
    });

    test('does not crash with no schemas', () => {
      const renderer = new MockReactIndexStudioTemplateRenderer([], {});
      const { componentText } = renderer.renderComponentInternal();
      expect(componentText).toMatchSnapshot();
    });

    test('renderComponentToFilesystem', async () => {
      const outputPath = 'output';
      const renderer = new MockReactIndexStudioTemplateRenderer(components, {});
      const { componentText, renderComponentToFilesystem } = renderer.renderComponentInternal();
      await renderComponentToFilesystem(outputPath);
      expect(renderer.renderComponentToFilesystem).toHaveBeenCalledWith(componentText);
    });
  });
});
