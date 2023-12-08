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
  StudioForm,
  StudioView,
  FormFeatureFlags,
} from '@aws-amplify/codegen-ui';
import { Schema as DataStoreSchema } from '@aws-amplify/datastore';
import { ModelIntrospectionSchema } from '@aws-amplify/appsync-modelgen-plugin';
import { createPrinter, createSourceFile, EmitHint, NewLineKind, Node } from 'typescript';
import { AmplifyFormRenderer } from '../../amplify-ui-renderers/amplify-form-renderer';
import { AmplifyRenderer } from '../../amplify-ui-renderers/amplify-renderer';
import { AmplifyViewRenderer } from '../../amplify-ui-renderers/amplify-view-renderer';
import { ModuleKind, ReactRenderConfig, ScriptKind, ScriptTarget } from '../../react-render-config';
import { loadSchemaFromJSONFile } from './example-schema';
import { defaultRenderConfig, transpile } from '../../react-studio-template-renderer-helper';

export const defaultCLIRenderConfig = {
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
  featureFlags?: FormFeatureFlags,
): { componentText: string; declaration?: string } => {
  let dataSchema: GenericDataSchema | undefined;
  if (dataSchemaJsonFile) {
    const dataStoreSchema = loadSchemaFromJSONFile<DataStoreSchema | ModelIntrospectionSchema>(dataSchemaJsonFile);
    dataSchema = getGenericFromDataStore(dataStoreSchema);
  }
  const rendererFactory = new StudioTemplateRendererFactory(
    (component: StudioForm) => new AmplifyFormRenderer(component, dataSchema, renderConfig, featureFlags),
  );

  const renderer = rendererFactory.buildRenderer(loadSchemaFromJSONFile<StudioForm>(formJsonFile));
  return renderer.renderComponent();
};

export const generateComponentOnlyWithAmplifyFormRenderer = (
  formJsonFile: string,
  dataSchemaJsonFile: string | undefined,
  renderConfig: ReactRenderConfig = defaultCLIRenderConfig,
  featureFlags?: FormFeatureFlags,
) => {
  let dataSchema: GenericDataSchema | undefined;
  if (dataSchemaJsonFile) {
    const dataStoreSchema = loadSchemaFromJSONFile<DataStoreSchema | ModelIntrospectionSchema>(dataSchemaJsonFile);
    dataSchema = getGenericFromDataStore(dataStoreSchema);
  }
  const rendererFactory = new StudioTemplateRendererFactory(
    (component: StudioForm) => new AmplifyFormRenderer(component, dataSchema, renderConfig, featureFlags),
  );

  const renderer = rendererFactory.buildRenderer(loadSchemaFromJSONFile<StudioForm>(formJsonFile));
  return renderer.renderComponentOnly();
};

export const renderWithAmplifyViewRenderer = (
  viewJsonFile: string,
  dataSchemaJsonFile: string | undefined,
  renderConfig: ReactRenderConfig = defaultCLIRenderConfig,
): { componentText: string; declaration?: string } => {
  let dataSchema: GenericDataSchema | undefined;
  if (dataSchemaJsonFile) {
    const dataStoreSchema = loadSchemaFromJSONFile<DataStoreSchema | ModelIntrospectionSchema>(dataSchemaJsonFile);
    dataSchema = getGenericFromDataStore(dataStoreSchema);
  }
  const rendererFactory = new StudioTemplateRendererFactory(
    (view: StudioView) => new AmplifyViewRenderer(view, dataSchema, renderConfig),
  );

  const renderer = rendererFactory.buildRenderer(loadSchemaFromJSONFile<StudioView>(viewJsonFile));
  return renderer.renderComponent();
};

export const renderTableJsxElement = (
  tableFilePath: string,
  dataSchemaFilePath: string | undefined,
  snapshotFileName: string,
  renderConfig: ReactRenderConfig = defaultCLIRenderConfig,
): string => {
  const table = loadSchemaFromJSONFile<StudioView>(tableFilePath);
  const dataSchema = dataSchemaFilePath ? loadSchemaFromJSONFile<GenericDataSchema>(dataSchemaFilePath) : undefined;
  const tableJsx = new AmplifyViewRenderer(table, dataSchema, renderConfig).renderJsx();

  const file = createSourceFile(snapshotFileName, '', ScriptTarget.ES2015, true, ScriptKind.TS);
  const printer = createPrinter();
  const tableNode = printer.printNode(EmitHint.Unspecified, tableJsx, file);

  return transpile(tableNode, {}).componentText;
};

export const genericPrinter = (node: Node): string => {
  const file = createSourceFile(
    'sampleFileName.js',
    '',
    defaultCLIRenderConfig.target,
    false,
    defaultRenderConfig.script,
  );
  const printer = createPrinter({
    newLine: NewLineKind.LineFeed,
  });
  return printer.printNode(EmitHint.Unspecified, node, file);
};

export const renderExpanderJsxElement = (
  filePath: string,
  dataSchemaFilePath: string | undefined,
  snapshotFileName: string,
  renderConfig: ReactRenderConfig = defaultCLIRenderConfig,
): string => {
  const expander = loadSchemaFromJSONFile<StudioView>(filePath);
  const dataSchema = dataSchemaFilePath ? loadSchemaFromJSONFile<GenericDataSchema>(dataSchemaFilePath) : undefined;
  const expanderJsx = new AmplifyViewRenderer(expander, dataSchema, renderConfig).renderJsx();

  const file = createSourceFile(snapshotFileName, '', ScriptTarget.ES2015, true, ScriptKind.TS);
  const printer = createPrinter();
  const expanderNode = printer.printNode(EmitHint.Unspecified, expanderJsx, file);

  return transpile(expanderNode, {}).componentText;
};

export const rendererConfigWithGraphQL: ReactRenderConfig = {
  apiConfiguration: {
    dataApi: 'GraphQL',
    typesFilePath: '../API',
    queriesFilePath: '../graphql/queries',
    mutationsFilePath: '../graphql/mutations',
    subscriptionsFilePath: '../graphql/subscriptions',
    fragmentsFilePath: '../graphql/fragments',
  },
};

export const rendererConfigWithNoApi: ReactRenderConfig = {
  apiConfiguration: {
    dataApi: 'NoApi',
  },
};
