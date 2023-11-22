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
import { EmitHint } from 'typescript';
import { StudioTemplateRenderer } from '@aws-amplify/codegen-ui';
import { ReactRenderConfig, scriptKindToFileExtensionNonReact } from './react-render-config';
import { ImportCollection, ImportSource, ImportValue } from './imports';
import { ReactOutputManager } from './react-output-manager';
import { transpile, buildPrinter, defaultRenderConfig } from './react-studio-template-renderer-helper';
import {
  constantsString,
  amplifySymbolString,
  useNavigateActionString,
  useStateMutationActionString,
  getOverridePropsString,
  getOverridesFromVariantsString,
  mergeVariantsAndOverridesString,
  formatterString,
  fetchByPathString,
  processFileString,
  validationString,
  findChildOverridesString,
  getErrorMessageString,
  useAuthSignOutActionString,
  useTypeCastFieldsString,
  useDataStoreCreateActionString,
  useDataStoreUpdateActionString,
  useDataStoreDeleteActionString,
  createDataStorePredicateString,
  useDataStoreBindingString,
  useAuthSignOutActionStringV6,
  useAuthString,
} from './utils-file-functions';
import { getAmplifyJSVersionToRender } from './helpers/amplify-js-versioning';
import { AMPLIFY_JS_V6 } from './utils/constants';

export type UtilTemplateType = 'validation' | 'formatter' | 'fetchByPath' | 'processFile';

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

  protected renderConfig: ReactRenderConfig & typeof defaultRenderConfig;

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
    const parsedUtils: string[] = [
      constantsString,
      amplifySymbolString,
      useStateMutationActionString,
      useNavigateActionString,
      findChildOverridesString,
      getOverridePropsString,
      getOverridesFromVariantsString,
      mergeVariantsAndOverridesString,
      getErrorMessageString,
      useTypeCastFieldsString,
      useDataStoreCreateActionString,
      useDataStoreUpdateActionString,
      useDataStoreDeleteActionString,
      createDataStorePredicateString,
      useDataStoreBindingString,
    ];

    if (getAmplifyJSVersionToRender(this.renderConfig.dependencies) === AMPLIFY_JS_V6) {
      this.importCollection.addImport(ImportSource.AMPLIFY_AUTH, ImportValue.SIGN_OUT);
      this.importCollection.addImport(ImportSource.AMPLIFY_AUTH, ImportValue.FETCH_USER_ATTRIBUTES);
      this.importCollection.addImport(ImportSource.AMPLIFY_DATASTORE_V6, ImportValue.DATASTORE);
      this.importCollection.addImport(ImportSource.AMPLIFY_UTILS, ImportValue.HUB);
      parsedUtils.push(useAuthSignOutActionStringV6);
      parsedUtils.push(useAuthString);
    } else {
      this.importCollection.addMappedImport(ImportValue.HUB, ImportValue.DATASTORE, ImportValue.AUTH);
      parsedUtils.push(useAuthSignOutActionString);
    }

    const utilsSet = new Set(this.utils);

    if (utilsSet.has('validation')) {
      parsedUtils.push(validationString);
    }

    if (utilsSet.has('formatter')) {
      parsedUtils.push(formatterString);
    }

    if (utilsSet.has('fetchByPath')) {
      parsedUtils.push(fetchByPathString);
    }

    if (utilsSet.has('processFile')) {
      parsedUtils.push(processFileString);
    }

    let componentText = `/* eslint-disable */${EOL}`;
    const imports = this.importCollection.buildImportStatements(false);
    imports.forEach((importStatement) => {
      const result = printer.printNode(EmitHint.Unspecified, importStatement, file);
      componentText += result + EOL;
    });
    componentText += EOL;

    componentText += parsedUtils.join(EOL) + EOL;

    const { componentText: transpliedText } = transpile(componentText, this.renderConfig, true);

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
