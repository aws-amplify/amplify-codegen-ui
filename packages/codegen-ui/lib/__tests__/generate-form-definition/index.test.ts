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
import { generateFormDefinition } from '../../generate-form-definition';

describe('generateFormDefinition', () => {
  it('should map DataStore model fields', () => {
    const formDefinition = generateFormDefinition({
      form: {
        name: 'sampleForm',
        formActionType: 'create',
        dataType: { dataSourceType: 'DataStore', dataTypeName: 'Dog' },
        fields: {},
        sectionalElements: [],
        style: {},
      },
      modelInfo: { fields: [{ name: 'name', type: 'String', isReadOnly: false, isRequired: true, isArray: false }] },
    });
    expect(formDefinition.elements).toStrictEqual({
      name: {
        componentType: 'TextField',
        props: { label: 'name', isRequired: true, isReadOnly: false },
        dataType: 'String',
      },
    });
  });

  it('should override field configurations from DataStore', () => {
    const formDefinition = generateFormDefinition({
      form: {
        name: 'mySampleForm',
        formActionType: 'create',
        dataType: { dataSourceType: 'DataStore', dataTypeName: 'Dog' },
        fields: { weight: { inputType: { type: 'SliderField', minValue: 1, maxValue: 100, step: 2 } } },
        sectionalElements: [],
        style: {},
      },
      modelInfo: { fields: [{ name: 'weight', type: 'Float', isReadOnly: false, isRequired: true, isArray: false }] },
    });
    expect(formDefinition.elements).toStrictEqual({
      weight: {
        componentType: 'SliderField',
        props: { label: 'weight', minValue: 1, maxValue: 100, step: 2, isReadOnly: false, isRequired: true },
        dataType: 'Float',
      },
    });
  });

  it('should not add overrides to the matrix', () => {
    const formDefinition = generateFormDefinition({
      form: {
        name: 'mySampleForm',
        formActionType: 'create',
        dataType: { dataSourceType: 'DataStore', dataTypeName: 'Dog' },
        fields: { weight: { inputType: { type: 'SliderField', minValue: 1, maxValue: 100, step: 2 } } },
        sectionalElements: [],
        style: {},
      },
      modelInfo: { fields: [{ name: 'weight', type: 'Float', isReadOnly: false, isRequired: true, isArray: false }] },
    });

    expect(formDefinition.elementMatrix).toStrictEqual([['weight']]);
  });

  it('should add fields that do not exist in DataStore', () => {
    const formDefinition = generateFormDefinition({
      form: {
        name: 'mySampleForm',
        formActionType: 'create',
        dataType: { dataSourceType: 'DataStore', dataTypeName: 'Dog' },
        fields: { weight: { inputType: { type: 'SliderField', minValue: 1, maxValue: 100, step: 2 } } },
        sectionalElements: [],
        style: {},
      },
      modelInfo: { fields: [] },
    });
    expect(formDefinition.elements).toStrictEqual({
      weight: { componentType: 'SliderField', props: { minValue: 1, maxValue: 100, step: 2 } },
    });
  });

  it('should add fields that do not exist in DataStore to the matrix', () => {
    const formDefinition = generateFormDefinition({
      form: {
        name: 'mySampleForm',
        formActionType: 'create',
        dataType: { dataSourceType: 'DataStore', dataTypeName: 'Dog' },
        fields: { weight: { inputType: { type: 'SliderField', minValue: 1, maxValue: 100, step: 2 } } },
        sectionalElements: [],
        style: {},
      },
      modelInfo: { fields: [] },
    });
    expect(formDefinition.elementMatrix).toStrictEqual([['weight']]);
  });

  it('should add sectional elements', () => {
    const formDefinition = generateFormDefinition({
      form: {
        name: 'mySampleForm',
        formActionType: 'create',
        dataType: { dataSourceType: 'DataStore', dataTypeName: 'Dog' },
        fields: {},
        sectionalElements: [
          { type: 'Heading', name: 'Heading123', position: { fixed: 'first' }, level: 1, text: 'Create Dog' },
        ],
        style: {},
      },
      modelInfo: { fields: [{ name: 'weight', type: 'Float', isReadOnly: false, isRequired: true, isArray: false }] },
    });
    expect(formDefinition.elements.Heading123).toStrictEqual({
      componentType: 'Heading',
      props: { level: 1, text: 'Create Dog' },
    });
  });

  it('should apply layout style', () => {
    const style = { verticalGap: { value: '10px' }, horizontalGap: { tokenReference: 'color.primary.solid' } };
    const formDefinition = generateFormDefinition({
      form: {
        name: 'mySampleForm',
        formActionType: 'create',
        dataType: { dataSourceType: 'DataStore', dataTypeName: 'Dog' },
        fields: {},
        sectionalElements: [],
        style,
      },
      modelInfo: { fields: [] },
    });
    expect(formDefinition.form.props.layoutStyle).toStrictEqual(style);
  });

  it('should not leave empty rows in the matrix', () => {
    const formDefinition = generateFormDefinition({
      form: {
        name: 'mySampleForm',
        formActionType: 'create',
        dataType: { dataSourceType: 'DataStore', dataTypeName: 'Dog' },
        fields: {
          weight: { excluded: true },
          name: { excluded: true },
          age: { excluded: true },
        },
        sectionalElements: [
          { type: 'Heading', name: 'Heading123', position: { fixed: 'first' }, level: 1, text: 'Create Dog' },
        ],
        style: {},
      },
      modelInfo: {
        fields: [
          { name: 'name', type: 'String', isReadOnly: false, isRequired: true, isArray: false },
          { name: 'weight', type: 'Float', isReadOnly: false, isRequired: true, isArray: false },
          { name: 'age', type: 'Int', isReadOnly: false, isRequired: true, isArray: false },
        ],
      },
    });
    expect(formDefinition.elementMatrix).toStrictEqual([['Heading123']]);
  });

  it('should correctly map positions', () => {
    const formDefinition = generateFormDefinition({
      form: {
        name: 'mySampleForm',
        formActionType: 'create',
        dataType: { dataSourceType: 'DataStore', dataTypeName: 'Dog' },
        fields: {
          weight: { position: { rightOf: 'age' } },
          name: { position: { below: 'Heading123' } },
          age: { position: { rightOf: 'name' } },
        },
        sectionalElements: [
          { type: 'Heading', name: 'Heading123', position: { fixed: 'first' }, level: 1, text: 'Create Dog' },
        ],
        style: {},
      },
      modelInfo: {
        fields: [
          { name: 'name', type: 'String', isReadOnly: false, isRequired: true, isArray: false },
          { name: 'weight', type: 'Float', isReadOnly: false, isRequired: true, isArray: false },
          { name: 'age', type: 'Int', isReadOnly: false, isRequired: true, isArray: false },
        ],
      },
    });
    expect(formDefinition.elementMatrix).toStrictEqual([['Heading123'], ['name', 'age', 'weight']]);
  });
});

it('should requeue if related element is not yet found', () => {
  const formDefinition = generateFormDefinition({
    form: {
      name: 'mySampleForm',
      formActionType: 'create',
      dataType: { dataSourceType: 'DataStore', dataTypeName: 'Dog' },
      fields: {
        color: { position: { below: 'name' } },
        weight: { position: { rightOf: 'age' } },
        age: { position: { rightOf: 'name' } },
        name: { position: { below: 'Heading123' } },
      },
      sectionalElements: [
        { type: 'Heading', name: 'Heading123', position: { fixed: 'first' }, level: 1, text: 'Create Dog' },
      ],
      style: {},
    },
    modelInfo: {
      fields: [],
    },
  });
  expect(formDefinition.elementMatrix).toStrictEqual([['Heading123'], ['name', 'age', 'weight'], ['color']]);
});

it('should handle fields without position', () => {
  const formDefinition = generateFormDefinition({
    form: {
      name: 'mySampleForm',
      formActionType: 'create',
      dataType: { dataSourceType: 'DataStore', dataTypeName: 'Dog' },
      fields: {
        color: { position: { below: 'name' } },
        weight: { position: { rightOf: 'age' } },
        age: { position: { rightOf: 'name' } },
        name: { label: 'Name' },
        bark: { label: 'Bark' },
      },
      sectionalElements: [
        { type: 'Heading', name: 'Heading123', position: { fixed: 'first' }, level: 1, text: 'Create Dog' },
      ],
      style: {},
    },
    modelInfo: {
      fields: [],
    },
  });
  expect(formDefinition.elementMatrix).toStrictEqual([['Heading123'], ['name', 'age', 'weight'], ['color'], ['bark']]);
});
