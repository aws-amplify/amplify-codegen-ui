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
import { MockOutputManager, MockTemplateRenderer } from './__utils__/mock-classes';

describe('FrontendManagerTemplateRenderer', () => {
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
    expect(outputManager.writeComponent).toHaveBeenCalledWith(componentText, `${outputPath}/${fileName}`);
  });
});
