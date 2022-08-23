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
import { StudioForm } from '@aws-amplify/codegen-ui';
import { EmitHint, Node } from 'typescript';
import { buildFormPropNode } from '../../forms';
import { buildPrinter, defaultRenderConfig } from '../../react-studio-template-renderer-helper';

describe('form-render utils', () => {
  let printNode: (node: Node) => string;

  beforeAll(() => {
    const { printer, file } = buildPrinter('myFileMock', defaultRenderConfig);
    printNode = (node: Node) => {
      return printer.printNode(EmitHint.Unspecified, node, file);
    };
  });

  it('should generate before & complete types if datastore config is set', () => {
    const form: StudioForm = {
      id: '123',
      name: 'mySampleForm',
      formActionType: 'create',
      dataType: { dataSourceType: 'DataStore', dataTypeName: 'Post' },
      fields: {},
      sectionalElements: {},
      style: {},
      cta: {},
    };

    const propSignatures = buildFormPropNode(form);
    const node = printNode(propSignatures);
    expect(node).toMatchSnapshot();
  });

  it('should generate regular onsubmit if dataSourceType is custom', () => {
    const form: StudioForm = {
      id: '123',
      name: 'myCustomForm',
      formActionType: 'create',
      dataType: { dataSourceType: 'Custom', dataTypeName: 'Custom' },
      fields: {},
      sectionalElements: {},
      style: {},
      cta: {},
    };
    const propSignatures = buildFormPropNode(form);
    const node = printNode(propSignatures);
    expect(node).toMatchSnapshot();
  });
});
