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
import { StudioForm, ValidationTypeMapping } from '@aws-amplify/codegen-ui';
import { EmitHint, Node } from 'typescript';
import { buildFormPropNode } from '../../forms';
import { buildPrinter, defaultRenderConfig } from '../../react-studio-template-renderer-helper';
import { createValidationExpression } from '../../forms/form-renderer-helper/validation';

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

    const propSignatures = buildFormPropNode(form, {});
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
    const propSignatures = buildFormPropNode(form, {});
    const node = printNode(propSignatures);
    expect(node).toMatchSnapshot();
  });

  it('should render cancel props if included cancel object is an empty object', () => {
    const form: StudioForm = {
      id: '123',
      name: 'myCustomForm',
      formActionType: 'create',
      dataType: { dataSourceType: 'Custom', dataTypeName: 'Custom' },
      fields: {},
      sectionalElements: {},
      style: {},
      cta: {
        cancel: {},
      },
    };
    const propSignatures = buildFormPropNode(form, {});
    const node = printNode(propSignatures);
    expect(node).toContain('onCancel?: () => void;');
    expect(node).toMatchSnapshot();
  });

  it('should render composite primary keys', () => {
    const form: StudioForm = {
      id: '123',
      name: 'mySampleForm',
      formActionType: 'update',
      dataType: { dataSourceType: 'DataStore', dataTypeName: 'Post' },
      fields: {},
      sectionalElements: {},
      style: {},
      cta: {
        cancel: {},
      },
    };
    const propSignatures = buildFormPropNode(
      form,
      { description: { dataType: 'Int', validationRules: [], componentType: 'TextField' } },
      undefined,
      ['myKey', 'description'],
    );
    const node = printNode(propSignatures);
    expect(node).toContain('id?: {');
    expect(node).toContain('myKey: string;');
    expect(node).toContain('description: number;');
    expect(node).toMatchSnapshot();
  });

  test.each(
    ValidationTypeMapping.StringType.map<[string, any[]]>((type) => [
      `${type} with undefined numValues`,
      [
        {
          strValues: ['chard'],
          numValues: undefined,
          type,
        } as any,
      ],
    ]).concat(
      ValidationTypeMapping.NumberType.map<[string, any[]]>((type) => [
        `${type} with undefined strValues`,
        [
          {
            strValues: undefined,
            numValues: [9],
            type,
          } as any,
        ],
      ]),
    ),
  )('createValidationExpression handles %s', (description, rules) => {
    const expression = createValidationExpression(rules);
    const node = printNode(expression);
    expect(node).toMatchSnapshot();
  });
});
