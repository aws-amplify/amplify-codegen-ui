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
) {
  const rendererFactory = new StudioTemplateRendererFactory(
    (theme: StudioTheme) => new ReactThemeStudioTemplateRenderer(theme, renderConfig, options),
  );
  const { componentText, declaration } = rendererFactory
    .buildRenderer(loadSchemaFromJSONFile(jsonFile))
    .renderComponent();
  return { componentText, declaration };
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
      expect(generateWithThemeRenderer('theme').componentText).toMatchSnapshot();
    });

    it('should render the theme with TSX', () => {
      const { componentText, declaration } = generateWithThemeRenderer('theme', { script: ScriptKind.TSX });
      expect(componentText).toMatchSnapshot();
      expect(declaration).toBeUndefined();
    });

    it('should render the theme with ES5', () => {
      const { componentText, declaration } = generateWithThemeRenderer('theme', {
        target: ScriptTarget.ES5,
        script: ScriptKind.JS,
        renderTypeDeclarations: true,
      });
      expect(componentText).toMatchSnapshot();
      expect(declaration).toBeDefined();
      expect(declaration).toMatchSnapshot();
    });

    it('should render the default theme', () => {
      expect(generateWithThemeRenderer('theme', {}, { renderDefaultTheme: true }).componentText).toMatchSnapshot();
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
