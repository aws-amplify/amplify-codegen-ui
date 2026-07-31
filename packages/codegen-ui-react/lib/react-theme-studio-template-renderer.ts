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
import { EOL } from 'os';
import {
  factory,
  EmitHint,
  ExportAssignment,
  Identifier,
  ObjectLiteralExpression,
  StringLiteral,
  PropertyAssignment,
  NumericLiteral,
} from 'typescript';
import {
  StudioTemplateRenderer,
  StudioTheme,
  StudioThemeValues,
  StudioThemeValue,
  validateThemeSchema,
  InvalidInputError,
  handleCodegenErrors,
} from '@aws-amplify/codegen-ui';
import { buildIdentifierOrStringLiteral } from './utils/identifiers';
import { ReactRenderConfig, scriptKindToFileExtensionNonReact } from './react-render-config';
import { ImportCollection, ImportValue } from './imports';
import { ReactOutputManager } from './react-output-manager';
import {
  transpile,
  buildPrinter,
  defaultRenderConfig,
  getDeclarationFilename,
  formatCode,
} from './react-studio-template-renderer-helper';

export type ReactThemeStudioTemplateRendererOptions = {
  renderDefaultTheme?: boolean;
};

// SECURITY: passing attacker-controlled StudioTheme keys directly to
// factory.createIdentifier() allows code injection in generated .tsx output
// (CVE-2025-4318 class -- theme-renderer surface). createIdentifier() emits its
// argument verbatim as source, so only valid JS identifiers are emitted as
// identifiers; any other key is emitted as a (properly escaped) string-literal
// key instead.
//
// Note: unlike escapePropertyValue()/buildBindingEvent() in the component path
// -- which fall back to '' (an empty identifier) -- we intentionally fall back
// to the full key as a string literal. This keeps the generated object literal
// well-formed (valid syntax, no empty identifier) and preserves legitimate
// non-identifier CSS token keys such as '--spacing-1' and '2xl'. Do not
// normalize this to the '' fallback.
export function buildThemePropertyName(key: string): Identifier | StringLiteral {
  return buildIdentifierOrStringLiteral(key);
}

export class ReactThemeStudioTemplateRenderer extends StudioTemplateRenderer<
  string,
  StudioTheme,
  ReactOutputManager,
  {
    componentText: string;
    declaration: string | undefined;
    renderComponentToFilesystem: (outputPath: string) => Promise<void>;
  }
> {
  protected importCollection = new ImportCollection();

  protected renderConfig: ReactRenderConfig & typeof defaultRenderConfig;

  protected options: ReactThemeStudioTemplateRendererOptions | undefined;

  fileName: string;

  constructor(theme: StudioTheme, renderConfig: ReactRenderConfig, options?: ReactThemeStudioTemplateRendererOptions) {
    super(theme, new ReactOutputManager(), renderConfig);
    this.renderConfig = {
      ...defaultRenderConfig,
      ...renderConfig,
    };
    this.fileName = `${this.component.name}.${scriptKindToFileExtensionNonReact(this.renderConfig.script)}`;
    this.options = options;
  }

  renderComponentInternal() {
    const { printer, file } = buildPrinter(this.fileName, this.renderConfig);

    const renderedImports = this.buildImports().map((importStatement) =>
      printer.printNode(EmitHint.Unspecified, importStatement, file),
    );
    const renderedFunction = printer.printNode(EmitHint.Unspecified, this.buildTheme(), file);
    const componentText = ['/* eslint-disable */', ...renderedImports, renderedFunction].join(EOL);
    const { componentText: transpiledComponentText, declaration } = transpile(componentText, this.renderConfig);

    return {
      componentText: transpiledComponentText,
      declaration,
      renderComponentToFilesystem: async (outputPath: string) => {
        await this.renderComponentToFilesystem(transpiledComponentText)(this.fileName)(outputPath);
        if (declaration) {
          await this.renderComponentToFilesystem(declaration)(getDeclarationFilename(this.fileName))(outputPath);
        }
      },
    };
  }

  /**
   * Exposing an additional method to allow rendering the theme json object
   * from the API response type.
   */
  @handleCodegenErrors
  renderThemeJson(): string {
    const { printer, file } = buildPrinter(this.fileName, this.renderConfig);
    const themeJson = printer.printNode(EmitHint.Unspecified, this.buildThemeObject(), file);
    // prettier fails if we don't provide a valid statement, so wrapping in a statement and removing after formatting
    return formatCode(`const a = ${themeJson};`).replace('const a =', '').replace(';', '').trim();
  }

  /*
   * import { createTheme } from "@aws-amplify/ui-react";
   */
  private buildImports() {
    this.importCollection.addMappedImport(ImportValue.CREATE_THEME);
    if (this.options?.renderDefaultTheme) {
      this.importCollection.addMappedImport(ImportValue.DEFAULT_THEME);
    }

    return this.importCollection.buildImportStatements(true);
  }

  /*
   * export default createTheme({ ... });
   */
  private buildTheme(): ExportAssignment {
    return factory.createExportAssignment(
      undefined,
      undefined,
      undefined,
      factory.createCallExpression(factory.createIdentifier('createTheme'), undefined, [
        this.options?.renderDefaultTheme
          ? factory.createIdentifier(ImportValue.DEFAULT_THEME)
          : this.buildThemeObject(),
      ]),
    );
  }

  /*
   * {
   *   id: '123',
   *   name: 'MyTheme',
   *   tokens: {},
   *   overrides: {},
   * }
   */
  private buildThemeObject(): ObjectLiteralExpression {
    return factory.createObjectLiteralExpression(
      [
        factory.createPropertyAssignment(
          factory.createIdentifier('name'),
          factory.createStringLiteral(this.component.name),
        ),
      ]
        .concat(this.splitAndBuildThemeValues(this.component.values))
        .concat(this.buildThemeOverrides(this.component.overrides)),
      true,
    );
  }

  splitAndBuildThemeValues(values: StudioThemeValues[]): PropertyAssignment[] {
    return values.map(({ key, value }) => {
      if (key !== 'breakpoints') {
        return factory.createPropertyAssignment(buildThemePropertyName(key), this.buildThemeValue(value));
      }
      return factory.createPropertyAssignment(buildThemePropertyName(key), this.buildThemeBreakpointValue(value));
    });
  }

  /* Removes children and value (needed for smithy) from theme values json
   *
   * tokens: {
   *   components: {
   *     alert: {
   *       backgroundcolor: \\"hsl(210, 5%, 90%)\\",
   * ...
   */
  private buildThemeValues(values: StudioThemeValues[]): PropertyAssignment[] {
    return values.map(({ key, value }) =>
      factory.createPropertyAssignment(buildThemePropertyName(key), this.buildThemeValue(value)),
    );
  }

  private buildThemeValue(themeValue: StudioThemeValue): ObjectLiteralExpression | StringLiteral {
    const { children, value } = themeValue;
    if (children) {
      return factory.createObjectLiteralExpression(this.buildThemeValues(children));
    }
    if (value) {
      return factory.createStringLiteral(value);
    }

    throw new InvalidInputError(`Invalid theme value: ${JSON.stringify(value)}`);
  }

  /* Removes children and value (needed for smithy) from theme values json
   *
   * breakpoints: {
   *   values: {
   *     base: 0,
   *     small: 480,
   *     ...
   *   }
   *   defaultBreakpoint: "base",
   * ...
   */
  buildThemeBreakpointValues(values: StudioThemeValues[]): PropertyAssignment[] {
    return values.map(({ key, value }) =>
      factory.createPropertyAssignment(buildThemePropertyName(key), this.buildThemeBreakpointValue(value)),
    );
  }

  buildThemeBreakpointValue(themeValue: StudioThemeValue): ObjectLiteralExpression | StringLiteral | NumericLiteral {
    const { children, value } = themeValue;
    if (children) {
      if (children[0].key === 'value') {
        return this.buildThemeBreakpointValue({ value: children[0].value.value });
      }
      return factory.createObjectLiteralExpression(this.buildThemeBreakpointValues(children));
    }
    if (value) {
      if (/^[0-9]+$/.test(value)) {
        return factory.createNumericLiteral(parseInt(value, 10));
      }
      return factory.createStringLiteral(value);
    }
    throw new InvalidInputError(`Invalid theme value: ${JSON.stringify(value)}`);
  }

  /* builds special case theme value overrides becuase it is an array
   *
   * overrides: [
   *   {
   *     colorMode: \\"dark\\",
   *     tokens: {
   *       colors: { black: { value: \\"#fff\\" }, white: { value: \\"#000\\" } },
   *     },
   *   },
   * ],
   */
  private buildThemeOverrides(overrides?: StudioThemeValues[]) {
    if (overrides === undefined) {
      return [];
    }

    return factory.createPropertyAssignment(
      factory.createIdentifier('overrides'),
      factory.createArrayLiteralExpression(
        [factory.createObjectLiteralExpression(this.buildThemeValues(overrides), true)],
        false,
      ),
    );
  }

  validateSchema(theme: StudioTheme) {
    validateThemeSchema(theme);
  }
}
