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
import {
  StudioTemplateRendererFactory,
  GenericDataSchema,
  StudioComponent,
  getGenericFromDataStore,
  Schema,
  StudioForm,
  StudioView,
} from '@aws-amplify/codegen-ui';
import { createPrinter, createSourceFile, EmitHint } from 'typescript';
import { AmplifyFormRenderer } from '../../amplify-ui-renderers/amplify-form-renderer';
import { AmplifyRenderer } from '../../amplify-ui-renderers/amplify-renderer';
import { AmplifyViewRenderer } from '../../amplify-ui-renderers/amplify-view-renderer';
import { ModuleKind, ReactRenderConfig, ScriptKind, ScriptTarget } from '../../react-render-config';
import { loadSchemaFromJSONFile } from './example-schema';
import { transpile } from '../../react-studio-template-renderer-helper';

export const defaultCLIRenderConfig: ReactRenderConfig = {
  module: ModuleKind.ES2020,
  target: ScriptTarget.ES2020,
  script: ScriptKind.JSX,
  renderTypeDeclarations: true,
};

export const generateWithAmplifyRenderer = (
  jsonSchemaFile: string,
  renderConfig: ReactRenderConfig = {},
  isSampleCodeSnippet = false,
  dataSchema?: GenericDataSchema | undefined,
): { componentText: string; declaration?: string } => {
  const rendererFactory = new StudioTemplateRendererFactory(
    (component: StudioComponent) => new AmplifyRenderer(component, renderConfig, dataSchema),
  );
  const renderer = rendererFactory.buildRenderer(loadSchemaFromJSONFile(jsonSchemaFile));
  return isSampleCodeSnippet
    ? { componentText: renderer.renderSampleCodeSnippet().compText }
    : renderer.renderComponent();
};

export const generateWithAmplifyFormRenderer = (
  formJsonFile: string,
  dataSchemaJsonFile: string | undefined,
  renderConfig: ReactRenderConfig = defaultCLIRenderConfig,
): { componentText: string; declaration?: string } => {
  let dataSchema: GenericDataSchema | undefined;
  if (dataSchemaJsonFile) {
    const dataStoreSchema = loadSchemaFromJSONFile<Schema>(dataSchemaJsonFile);
    dataSchema = getGenericFromDataStore(dataStoreSchema);
  }
  const rendererFactory = new StudioTemplateRendererFactory(
    (component: StudioForm) => new AmplifyFormRenderer(component, dataSchema, renderConfig),
  );

  const renderer = rendererFactory.buildRenderer(loadSchemaFromJSONFile<StudioForm>(formJsonFile));
  return renderer.renderComponent();
};

export const renderTableJsxElement = (
  tableFilePath: string,
  dataSchemaFilePath: string,
  snapshotFileName: string,
  renderConfig: ReactRenderConfig = defaultCLIRenderConfig,
): string => {
  const table = loadSchemaFromJSONFile<StudioView>(tableFilePath);
  const dataSchema = loadSchemaFromJSONFile<GenericDataSchema>(dataSchemaFilePath);
  const tableJsx = new AmplifyViewRenderer(table, dataSchema, renderConfig).renderJsx();

  const file = createSourceFile(snapshotFileName, '', ScriptTarget.ES2015, true, ScriptKind.TS);
  const printer = createPrinter();
  const tableNode = printer.printNode(EmitHint.Unspecified, tableJsx, file);

  return transpile(tableNode, {}).componentText;
};
