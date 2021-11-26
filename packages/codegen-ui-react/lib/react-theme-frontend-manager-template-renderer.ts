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
  ObjectLiteralExpression,
  StringLiteral,
  PropertyAssignment,
} from 'typescript';
import {
  FrontendManagerTemplateRenderer,
  FrontendManagerTheme,
  FrontendManagerThemeValues,
  FrontendManagerThemeValue,
  validateThemeSchema,
  InvalidInputError,
} from '@aws-amplify/codegen-ui';
import { ReactRenderConfig, scriptKindToFileExtensionNonReact } from './react-render-config';
import { ImportCollection } from './import-collection';
import { ReactOutputManager } from './react-output-manager';
import {
  transpile,
  buildPrinter,
  defaultRenderConfig,
  getDeclarationFilename,
} from './react-frontend-manager-template-renderer-helper';
import { RequiredKeys } from './utils/type-utils';

export class ReactThemeFrontendManagerTemplateRenderer extends FrontendManagerTemplateRenderer<
  string,
  FrontendManagerTheme,
  ReactOutputManager,
  {
    componentText: string;
    renderComponentToFilesystem: (outputPath: string) => Promise<void>;
  }
> {
  protected importCollection = new ImportCollection();

  protected renderConfig: RequiredKeys<ReactRenderConfig, keyof typeof defaultRenderConfig>;

  fileName: string;

  constructor(theme: FrontendManagerTheme, renderConfig: ReactRenderConfig) {
    super(theme, new ReactOutputManager(), renderConfig);
    validateThemeSchema(theme);
    this.renderConfig = {
      ...defaultRenderConfig,
      ...renderConfig,
    };
    this.fileName = `${this.component.name}.${scriptKindToFileExtensionNonReact(this.renderConfig.script)}`;
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
      renderComponentToFilesystem: async (outputPath: string) => {
        await this.renderComponentToFilesystem(transpiledComponentText)(this.fileName)(outputPath);
        if (declaration) {
          await this.renderComponentToFilesystem(declaration)(getDeclarationFilename(this.fileName))(outputPath);
        }
      },
    };
  }

  /*
   * import { createTheme } from "@aws-amplify/ui-react";
   */
  private buildImports() {
    this.importCollection.addImport('@aws-amplify/ui-react', 'createTheme');

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
      factory.createCallExpression(factory.createIdentifier('createTheme'), undefined, [this.buildThemeObject()]),
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
        .concat(this.buildThemeValues(this.component.values))
        .concat(this.buildThemeOverrides(this.component.overrides)),
      true,
    );
  }

  /* Removes children and value (needed for smithy) from theme values json
   *
   * tokens: {
   *   components: {
   *     alert: {
   *       backgroundcolor: \\"hsl(210, 5%, 90%)\\",
   * ...
   */
  private buildThemeValues(values: FrontendManagerThemeValues[]): PropertyAssignment[] {
    return values.map(({ key, value }) =>
      factory.createPropertyAssignment(factory.createIdentifier(key), this.buildThemeValue(value)),
    );
  }

  private buildThemeValue(themeValue: FrontendManagerThemeValue): ObjectLiteralExpression | StringLiteral {
    const { children, value } = themeValue;
    if (children) {
      return factory.createObjectLiteralExpression(this.buildThemeValues(children));
    }
    if (value) {
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
  private buildThemeOverrides(overrides?: FrontendManagerThemeValues[]) {
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
}
