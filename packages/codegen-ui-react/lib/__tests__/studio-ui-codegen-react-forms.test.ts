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

import { StudioTemplateRendererFactory } from '@aws-amplify/codegen-ui/lib/template-renderer-factory';
import { StudioForm, Schema, GenericDataSchema, getGenericFromDataStore } from '@aws-amplify/codegen-ui';
import { ReactRenderConfig, AmplifyFormRenderer, ModuleKind, ScriptKind, ScriptTarget } from '..';
import { loadSchemaFromJSONFile } from './__utils__';

export const defaultCLIRenderConfig: ReactRenderConfig = {
  module: ModuleKind.ES2020,
  target: ScriptTarget.ES2020,
  script: ScriptKind.JSX,
  renderTypeDeclarations: true,
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

describe('amplify form renderer tests', () => {
  describe('datastore form tests', () => {
    it('should generate a create form', () => {
      const { componentText, declaration } = generateWithAmplifyFormRenderer(
        'forms/post-datastore-create',
        'datastore/post',
      );
      expect(componentText).toContain('useDataStoreCreateAction');
      expect(componentText).toMatchSnapshot();
      expect(declaration).toMatchSnapshot();
    });

    it('should generate a update form', () => {
      const { componentText, declaration } = generateWithAmplifyFormRenderer(
        'forms/post-datastore-update',
        'datastore/post',
      );
      expect(componentText).toContain('useDataStoreUpdateAction');
      expect(componentText).toMatchSnapshot();
      expect(declaration).toMatchSnapshot();
    });
  });

  describe('custom form tests', () => {
    it('should render a custom backed form', () => {
      const { componentText, declaration } = generateWithAmplifyFormRenderer('forms/post-custom-create', undefined);
      expect(componentText.replace(/\s/g, '')).toContain('setCustomDataFormFields(onSubmitBefore');
      expect(componentText).toMatchSnapshot();
      expect(declaration).toMatchSnapshot();
    });
  });
});
