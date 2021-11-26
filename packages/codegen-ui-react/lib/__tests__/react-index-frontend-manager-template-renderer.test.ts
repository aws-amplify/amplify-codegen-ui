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
import { ReactIndexFrontendManagerTemplateRenderer } from '../react-index-frontend-manager-template-renderer';

// eslint-disable-next-line max-len
class ReactIndexFrontendManagerTemplateRendererWithExposedRenderConfig extends ReactIndexFrontendManagerTemplateRenderer {
  getRenderConfig(): ReactRenderConfig {
    return this.renderConfig;
  }
}

describe('ReactIndexFrontendManagerTemplateRenderer', () => {
  describe('constructor', () => {
    test('overrides renderTypeDeclarations to false', () => {
      const renderer = new ReactIndexFrontendManagerTemplateRendererWithExposedRenderConfig([], {
        renderTypeDeclarations: true,
      });
      expect(renderer.getRenderConfig().renderTypeDeclarations).toBeFalsy();
    });
  });
});
