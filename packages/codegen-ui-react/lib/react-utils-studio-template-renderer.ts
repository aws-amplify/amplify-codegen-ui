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
import { ReactRenderConfig, scriptKindToFileExtension, scriptKindToFileExtensionNonReact } from './react-render-config';
import { ImportCollection, ImportSource, ImportValue } from './imports';
import { ReactOutputManager } from './react-output-manager';
import { RequiredKeys } from './utils/type-utils';
import { transpile, buildPrinter, defaultRenderConfig } from './react-studio-template-renderer-helper';
import { generateValidationFunction } from './utils/forms/validation';
import { generateFormatUtil } from './utils/string-formatter';
import { generateArrayFieldComponent } from './utils/forms/array-field-component';

export type UtilTemplateType = 'validation' | 'formatter' | 'arrayField';

export class ReactUtilsStudioTemplateRenderer extends StudioTemplateRenderer<
  string,
  UtilTemplateType[],
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
  utils: UtilTemplateType[];

  constructor(utils: UtilTemplateType[], renderConfig: ReactRenderConfig) {
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
    const utilsStatements: (ts.VariableStatement | ts.TypeAliasDeclaration | ts.FunctionDeclaration)[] = [];
    let skipReactImport = true;

    this.utils.forEach((util) => {
      if (util === 'validation') {
        utilsStatements.push(...generateValidationFunction());
      } else if (util === 'formatter') {
        utilsStatements.push(...generateFormatUtil());
      } else if (util === 'arrayField') {
        skipReactImport = false;
        this.fileName = `utils.${scriptKindToFileExtension(this.renderConfig.script)}`;
        this.importCollection.addMappedImport(ImportValue.UI_REACT_STYLES);
        ['Grid', 'TextField', 'Badge', 'ScrollView', 'Icon', 'Divider', 'Flex', 'Button'].forEach((component) => {
          this.importCollection.addImport(ImportSource.UI_REACT, component);
        });
        utilsStatements.push(generateArrayFieldComponent());
      }
    });
    utilsStatements.push(...generateFormatUtil());

    let componentText = `/* eslint-disable */${EOL}`;
    const imports = this.importCollection.buildImportStatements(skipReactImport);
    imports.forEach((importStatement) => {
      const result = printer.printNode(EmitHint.Unspecified, importStatement, file);
      componentText += result + EOL;
    });
    componentText += EOL;

    utilsStatements.forEach((util) => {
      const result = printer.printNode(EmitHint.Unspecified, util, file);
      componentText += result + EOL;
    });

    componentText += EOL;

    const { componentText: transpliedText } = transpile(componentText, this.renderConfig);

    return {
      componentText: transpliedText,
      renderComponentToFilesystem: async (outputPath: string) => {
        await this.renderComponentToFilesystem(transpliedText)(this.fileName)(outputPath);
      },
    };
  }

  // no-op
  validateSchema() {}
}
