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
import { StudioTemplateRendererFactory, StudioTheme } from '@aws-amplify/codegen-ui';
import { ScriptTarget, ScriptKind, ReactRenderConfig } from '..';
import { ReactThemeStudioTemplateRenderer } from '../react-theme-studio-template-renderer';
import { loadSchemaFromJSONFile } from './__utils__';

function generateWithThemeRenderer(jsonFile: string, renderConfig: ReactRenderConfig = {}): string {
  const rendererFactory = new StudioTemplateRendererFactory(
    (theme: StudioTheme) => new ReactThemeStudioTemplateRenderer(theme, renderConfig),
  );
  return rendererFactory.buildRenderer(loadSchemaFromJSONFile(jsonFile)).renderComponent().componentText;
}

describe('react theme renderer tests', () => {
  describe('theme', () => {
    it('should render the theme', () => {
      expect(generateWithThemeRenderer('theme')).toMatchSnapshot();
    });

    it('should render the theme with TSX', () => {
      expect(generateWithThemeRenderer('theme', { script: ScriptKind.TSX })).toMatchSnapshot();
    });

    it('should render the theme with ES5', () => {
      expect(generateWithThemeRenderer('theme', { target: ScriptTarget.ES5, script: ScriptKind.JS })).toMatchSnapshot();
    });
  });

  describe('renderThemeJson', () => {
    it('should render theme json correctly', () => {
      const rendererFactory = new StudioTemplateRendererFactory(
        (theme: StudioTheme) => new ReactThemeStudioTemplateRenderer(theme, {}),
      );
      expect(rendererFactory.buildRenderer(loadSchemaFromJSONFile('theme')).renderThemeJson()).toMatchSnapshot();
    });
  });
});
