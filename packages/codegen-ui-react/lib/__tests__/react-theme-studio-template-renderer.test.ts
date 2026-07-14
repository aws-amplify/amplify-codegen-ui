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
import { isIdentifier, isStringLiteral } from 'typescript';
import { StudioTemplateRendererFactory, StudioTheme } from '@aws-amplify/codegen-ui';
import { ScriptTarget, ScriptKind, ReactRenderConfig } from '..';
import {
  ReactThemeStudioTemplateRenderer,
  ReactThemeStudioTemplateRendererOptions,
  buildThemePropertyName,
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

  // SECURITY: theme keys are attacker-controllable and reach factory.createIdentifier()
  // (CVE-2025-4318 class). buildThemePropertyName must emit only valid identifiers as
  // identifiers and everything else as an inert quoted string-literal key.
  describe('buildThemePropertyName', () => {
    it.each([
      ['simple identifier', 'colors'],
      ['underscore prefix', '_private'],
      ['dollar prefix', '$ref'],
      ['digits after letter', 'space2'],
    ])('emits a valid identifier (%s) as an Identifier node', (_label, key) => {
      const node = buildThemePropertyName(key);
      expect(isIdentifier(node)).toBe(true);
      expect(isStringLiteral(node)).toBe(false);
    });

    it.each([
      ['empty string', ''],
      ['leading digit', '2xl'],
      ['css custom property', '--spacing-1'],
      ['hyphenated css key', 'font-size'],
      ['object-literal breakout', '}};process.exit(1);//'],
      ['indirect eval', '(0,eval)("x")'],
      ['string-concat obfuscation', '"a"+"b"'],
      ['null-byte smuggling', 'foo\x00bar'],
    ])('emits a non-identifier key (%s) as a StringLiteral node', (_label, key) => {
      const node = buildThemePropertyName(key);
      expect(isStringLiteral(node)).toBe(true);
      expect(isIdentifier(node)).toBe(false);
    });
  });

  describe('theme keys that are not valid identifiers', () => {
    const rendererFactory = new StudioTemplateRendererFactory(
      (t: StudioTheme) => new ReactThemeStudioTemplateRenderer(t, {}),
    );

    const renderWithKey = (key: string, values: StudioTheme['values']): string =>
      rendererFactory.buildRenderer({ name: 'MyTheme', values }).renderComponent().componentText;

    it('emits a legitimate non-identifier CSS key as a quoted string-literal key', () => {
      // Documents the legitimate path: CSS custom-property-style keys are valid data,
      // just not valid JS identifiers, so they are emitted as quoted keys.
      const componentText = renderWithKey('font-size', [{ key: 'font-size', value: { value: 'red' } }]);
      expect(componentText).toMatch(/['"]font-size['"]\s*:/);
    });

    const escapeRe = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Assert `key` is emitted only as a quoted property name (either quote style),
    // and never as a bare (unquoted) property key that would execute as source.
    const expectNeutralized = (componentText: string, key: string): void => {
      const escaped = escapeRe(key);
      expect(componentText).toMatch(new RegExp(`['"]${escaped}['"]\\s*:`));
      expect(componentText).not.toMatch(new RegExp(`(?<!['"])${escaped}(?!['"])\\s*:`));
    };

    // SECURITY: each payload is a known CVE-2025-4318-class bypass form.
    it.each([
      ['object-literal breakout', '}};process.exit(1);//'],
      ['indirect eval', '(0,eval)("x")'],
      ['string-concat obfuscation', '"a"+"b"'],
    ])('neutralizes attack key at the values sink: %s', (_label, key) => {
      expectNeutralized(renderWithKey(key, [{ key, value: { value: 'red' } }]), key);
    });

    // Per-sink coverage: buildThemeValues (nested token keys) and buildThemeBreakpointValues
    // (breakpoint token keys) both delegate to buildThemePropertyName. Exercise each so a
    // future refactor that inlines the call differently cannot silently regress.
    it('neutralizes attack key at the nested buildThemeValues sink', () => {
      const attackKey = '(0,eval)("x")';
      const componentText = renderWithKey('tokens', [
        { key: 'tokens', value: { children: [{ key: attackKey, value: { value: 'red' } }] } },
      ]);
      expectNeutralized(componentText, attackKey);
    });

    it('neutralizes attack key at the buildThemeBreakpointValues sink', () => {
      const attackKey = '(0,eval)("x")';
      const componentText = renderWithKey('breakpoints', [
        { key: 'breakpoints', value: { children: [{ key: attackKey, value: { value: '480' } }] } },
      ]);
      expectNeutralized(componentText, attackKey);
    });
  });
});
