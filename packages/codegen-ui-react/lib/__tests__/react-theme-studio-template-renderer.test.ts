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
import {
  ReactThemeStudioTemplateRenderer,
  ReactThemeStudioTemplateRendererOptions,
} from '../react-theme-studio-template-renderer';
import { loadSchemaFromJSONFile } from './__utils__';

function generateWithThemeRenderer(
  jsonFile: string,
  renderConfig: ReactRenderConfig = {},
  options?: ReactThemeStudioTemplateRendererOptions,
): string {
  const rendererFactory = new StudioTemplateRendererFactory(
    (theme: StudioTheme) => new ReactThemeStudioTemplateRenderer(theme, renderConfig, options),
  );
  return rendererFactory.buildRenderer(loadSchemaFromJSONFile(jsonFile)).renderComponent().componentText;
}

function generateThemeObject(jsonFile: string): any {
  const rendererFactory = new StudioTemplateRendererFactory(
    (theme: StudioTheme) => new ReactThemeStudioTemplateRenderer(theme, {}),
  );
  const themeJson = rendererFactory.buildRenderer(loadSchemaFromJSONFile(jsonFile)).renderThemeJson();
  /* eslint-disable @typescript-eslint/no-implied-eval */
  const themeObject = new Function(`return ${themeJson}`);
  /* eslint-enable @typescript-eslint/no-implied-eval */
  return themeObject();
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

    it('should render the default theme', () => {
      expect(generateWithThemeRenderer('theme', {}, { renderDefaultTheme: true })).toMatchSnapshot();
    });
  });

  describe('renderThemeJson', () => {
    it('should render theme json successfully', () => {
      const rendererFactory = new StudioTemplateRendererFactory(
        (theme: StudioTheme) => new ReactThemeStudioTemplateRenderer(theme, {}),
      );
      expect(rendererFactory.buildRenderer(loadSchemaFromJSONFile('theme')).renderThemeJson()).toMatchSnapshot();
    });

    it('should render theme json with breakpoints successfully', () => {
      const themeObject = generateThemeObject('themeWithBreakpoints');
      expect(themeObject).toBeDefined();
      expect(typeof themeObject.breakpoints.values.base).toBe('number');
      expect(themeObject.breakpoints.values.base).toEqual(0);
      expect(typeof themeObject.breakpoints.defaultBreakpoint).toBe('string');
      expect(themeObject.breakpoints.defaultBreakpoint).toBe('base');
    });
  });
});
