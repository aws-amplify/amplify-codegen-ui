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

/* Test Generator to be used in the browser environment */
import {
  FormMetadata,
  getGenericFromDataStore,
  StudioComponent,
  StudioForm,
  StudioTheme,
} from '@aws-amplify/codegen-ui';
import {
  AmplifyRenderer,
  ReactThemeStudioTemplateRenderer,
  ReactIndexStudioTemplateRenderer,
  ReactUtilsStudioTemplateRenderer,
  AmplifyFormRenderer,
  UtilTemplateType,
} from '@aws-amplify/codegen-ui-react';
import schema from '../models/schema';
import { TestGenerator } from './TestGenerator';

export class BrowserTestGenerator extends TestGenerator {
  writeComponentToDisk() {} // no-op

  writeThemeToDisk() {} // no-op

  writeFormToDisk() {
    return { formMetadata: {} as FormMetadata };
  } // no-op

  writeIndexFileToDisk() {} // no-op

  writeUtilsFileToDisk() {} // no-op

  writeSnippetToDisk() {} // no-op

  renderIndexFile(schemas: (StudioComponent | StudioForm | StudioTheme)[]) {
    return new ReactIndexStudioTemplateRenderer(schemas, this.renderConfig).renderComponent();
  }

  renderUtilsFile(utils: UtilTemplateType[]) {
    return new ReactUtilsStudioTemplateRenderer(utils, this.renderConfig).renderComponent();
  }

  renderComponent(component: StudioComponent) {
    return new AmplifyRenderer(component, this.renderConfig).renderComponentOnly();
  }

  renderForm(form: StudioForm) {
    return new AmplifyFormRenderer(form, getGenericFromDataStore(schema), this.renderConfig).renderComponentOnly();
  }

  renderTheme(theme: StudioTheme) {
    return new ReactThemeStudioTemplateRenderer(theme, this.renderConfig).renderComponent();
  }

  renderSnippet(components: StudioComponent[]) {
    const snippet = components
      .map((component) => new AmplifyRenderer(component, this.renderConfig).renderSampleCodeSnippet())
      .reduce(
        (prev, curr): { importsText: string; compText: string } => ({
          importsText: prev.importsText + curr.importsText,
          compText: `${prev.compText}\n${curr.compText}`,
        }),
        { importsText: '', compText: 'export default function SnippetTests() {\nreturn (\n<>\n' },
      );

    return { ...snippet, compText: `${snippet.compText}\n</>\n);\n}` };
  }
}
