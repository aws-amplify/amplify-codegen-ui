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
import { FrontendManagerComponent } from '../types';
import { FrontendManagerTemplateRendererFactory } from '../template-renderer-factory';
import { MockOutputManager, MockTemplateRenderer } from './__utils__/mock-classes';

describe('FrontendManagerTemplateRendererFactory', () => {
  test('buildRenderer', () => {
    const componentName = 'MyText';
    const outputManager = new MockOutputManager();
    const renderer = new FrontendManagerTemplateRendererFactory(
      (component: FrontendManagerComponent) => new MockTemplateRenderer(component, outputManager, {}),
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
