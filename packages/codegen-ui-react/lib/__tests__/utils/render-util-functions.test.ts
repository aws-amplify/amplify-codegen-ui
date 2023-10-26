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
import { ModuleKind, ScriptKind, ScriptTarget } from 'typescript';
import { ReactUtilsStudioTemplateRenderer, UtilTemplateType } from '../../react-utils-studio-template-renderer';

describe('render utils file', () => {
  test('render all', () => {
    const utilsSet: UtilTemplateType[] = ['validation', 'formatter', 'fetchByPath', 'processFile'];
    const { componentText } = new ReactUtilsStudioTemplateRenderer(utilsSet, {
      module: ModuleKind.ES2020,
      target: ScriptTarget.ES2020,
      script: ScriptKind.JSX,
      renderTypeDeclarations: true,
    }).renderComponent();

    expect(componentText).toMatchSnapshot();
  });
  test('render all utils - amplify v6', () => {
    const utilsSet: UtilTemplateType[] = ['validation', 'formatter', 'fetchByPath', 'processFile'];
    const { componentText } = new ReactUtilsStudioTemplateRenderer(utilsSet, {
      module: ModuleKind.ES2020,
      target: ScriptTarget.ES2020,
      script: ScriptKind.JSX,
      renderTypeDeclarations: false,
      dependencies: { 'aws-amplify': '^6.0.0' },
    }).renderComponentInternal();

    expect(componentText).toMatchSnapshot();
    expect(componentText).toContain('await signOut(options)');
    expect(componentText).toContain('aws-amplify/utils');
    expect(componentText).toContain('aws-amplify/auth');
    expect(componentText).toContain('aws-amplify/datastore');
  });
});
