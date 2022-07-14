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
import { StudioTemplateRendererFactory, GenericDataSchema, StudioComponent } from '@aws-amplify/codegen-ui';
import { AmplifyRenderer } from '../../amplify-ui-renderers/amplify-renderer';
import { ReactRenderConfig } from '../../react-render-config';
import { loadSchemaFromJSONFile } from './example-schema';

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
