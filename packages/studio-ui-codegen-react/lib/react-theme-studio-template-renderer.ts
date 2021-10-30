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
import { StudioTemplateRenderer, StudioTheme, StudioThemeValues, StudioThemeValue } from '@amzn/studio-ui-codegen';

import { ReactRenderConfig, ScriptKind, scriptKindToFileExtension } from './react-render-config';
import { ImportCollection } from './import-collection';
import { ReactOutputManager } from './react-output-manager';
import {
  transpile,
  buildPrinter,
  defaultRenderConfig,
  getDeclarationFilename,
} from './react-studio-template-renderer-helper';

export class ReactThemeStudioTemplateRenderer extends StudioTemplateRenderer<
  string,
  StudioTheme,
  ReactOutputManager,
  {
    componentText: string;
    renderComponentToFilesystem: (outputPath: string) => Promise<void>;
  }
> {
  protected importCollection = new ImportCollection();

  fileName = `${this.component.name}.tsx`;

  constructor(theme: StudioTheme, protected renderConfig: ReactRenderConfig) {
    super(theme, new ReactOutputManager(), renderConfig);
    const { script } = this.renderConfig;
    if (script !== ScriptKind.TSX) {
      this.fileName = `${this.component.name}.${scriptKindToFileExtension(renderConfig.script || ScriptKind.TSX)}`;
    }

    this.renderConfig = {
      ...defaultRenderConfig,
      ...this.renderConfig,
    };
  }

  renderComponent() {
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
   * import React from "react";
   * import { createTheme } from "@aws-amplify/ui-react";
   */
  private buildImports() {
    this.importCollection.addImport('@aws-amplify/ui-react', 'createTheme');

    return this.importCollection.buildImportStatements();
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
  private buildThemeValues(values: StudioThemeValues): PropertyAssignment[] {
    return Object.entries(values).map(([key, value]) =>
      factory.createPropertyAssignment(factory.createIdentifier(key), this.buildThemeValue(value)),
    );
  }

  private buildThemeValue(value: StudioThemeValue): ObjectLiteralExpression | StringLiteral {
    if ('children' in value && value.children !== undefined) {
      return factory.createObjectLiteralExpression(this.buildThemeValues(value.children));
    }
    if ('value' in value && value.value !== undefined) {
      return factory.createStringLiteral(value.value);
    }

    throw new Error(`Invalid theme value: ${JSON.stringify(value)}`);
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
    if (overrides !== undefined) {
      return factory.createPropertyAssignment(
        factory.createIdentifier('overrides'),
        factory.createArrayLiteralExpression(
          overrides.map((override) => factory.createObjectLiteralExpression(this.buildThemeValues(override), true)),
          false,
        ),
      );
    }

    return [];
  }
}
