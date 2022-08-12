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
import ts, { EmitHint } from 'typescript';
import { StudioTemplateRenderer } from '@aws-amplify/codegen-ui';
import { ReactRenderConfig, scriptKindToFileExtensionNonReact } from './react-render-config';
import { ImportCollection } from './imports';
import { ReactOutputManager } from './react-output-manager';
import { RequiredKeys } from './utils/type-utils';
import { transpile, buildPrinter, defaultRenderConfig } from './react-studio-template-renderer-helper';
import { generateValidationFunction } from './utils/forms/validation';
import { generateFormatUtil } from './utils/format';

export type Util = string;

export class ReactUtilsStudioTemplateRenderer extends StudioTemplateRenderer<
  string,
  string[],
  ReactOutputManager,
  {
    componentText: string;
    renderComponentToFilesystem: (outputPath: string) => Promise<void>;
  }
> {
  protected importCollection = new ImportCollection();

  protected renderConfig: RequiredKeys<ReactRenderConfig, keyof typeof defaultRenderConfig>;

  fileName: string;

  /*
   * list of util functions to generate
   */
  utils: Util[];

  constructor(utils: Util[], renderConfig: ReactRenderConfig) {
    super(utils, new ReactOutputManager(), renderConfig);
    this.utils = utils;
    this.renderConfig = {
      ...defaultRenderConfig,
      ...renderConfig,
      renderTypeDeclarations: false, // Never render type declarations for index.js|ts file.
    };
    this.fileName = `utils.${scriptKindToFileExtensionNonReact(this.renderConfig.script)}`;
  }

  renderComponentInternal() {
    const { printer, file } = buildPrinter(this.fileName, this.renderConfig);
    const utilsStatements: (
      | ts.TypeAliasDeclaration
      | ts.VariableStatement
      | ts.FunctionDeclaration
      | ts.ImportDeclaration
    )[] = [];

    this.utils.forEach((util) => {
      if (util === 'validation') {
        utilsStatements.push(...generateValidationFunction());
      } else if (util === 'format') {
        utilsStatements.push(...generateFormatUtil());
      }
    });

    const { componentText } = transpile(
      utilsStatements.map((util) => printer.printNode(EmitHint.Unspecified, util, file)).join(EOL),
      this.renderConfig,
    );

    return {
      componentText,
      renderComponentToFilesystem: async (outputPath: string) => {
        await this.renderComponentToFilesystem(componentText)(this.fileName)(outputPath);
      },
    };
  }

  // no-op
  validateSchema() {}
}
