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
        id: '123',
        name: 'sampleForm',
        formActionType: 'create',
        dataType: { dataSourceType: 'DataStore', dataTypeName: 'Dog' },
        fields: {},
        sectionalElements: {},
        style: {},
        ctaConfig: {},
      },
      dataSchema: {
        dataSourceType: 'DataStore',
        enums: {},
        nonModels: {},
        models: { Dog: { fields: { name: { dataType: 'String', readOnly: false, required: true, isArray: false } } } },
      },
    });
    expect(formDefinition.elements).toStrictEqual({
      name: {
        componentType: 'TextField',
        props: { label: 'Name', isRequired: true, isReadOnly: false },
        studioFormComponentType: 'TextField',
      },
    });
  });

  it('should map ctaConfig options', () => {
    const formDefinition = generateFormDefinition({
      form: {
        id: '123',
        name: 'sampleForm',
        formActionType: 'create',
        dataType: { dataSourceType: 'Custom', dataTypeName: 'dfsdjflk' },
        fields: {},
        sectionalElements: {},
        style: {},
        ctaConfig: {
          position: 'bottom',
          cancel: {
            visible: false,
            label: 'cancelling',
          },
          clear: {
            visible: false,
            label: 'clearing',
          },
          submit: {
            visible: false,
            label: 'create',
          },
        },
      },
    });
    expect(formDefinition.buttons).toStrictEqual({
      position: 'bottom',
      cancel: {
        visible: false,
        label: 'cancelling',
      },
      clear: {
        visible: false,
        label: 'clearing',
      },
      submit: {
        visible: false,
        label: 'create',
      },
    });
  });

  it('should map empty ctaConfig to defaults', () => {
    const formDefinition = generateFormDefinition({
      form: {
        id: '123',
        name: 'sampleForm',
        formActionType: 'create',
        dataType: { dataSourceType: 'Custom', dataTypeName: 'dfsdjflk' },
        fields: {},
        sectionalElements: {},
        style: {},
        ctaConfig: {},
      },
    });
    expect(formDefinition.buttons).toStrictEqual({
      position: 'bottom',
      cancel: {
        visible: true,
        label: 'Cancel',
      },
      clear: {
        visible: true,
        label: 'Clear',
      },
      submit: {
        visible: true,
        label: 'Submit',
      },
    });
  });

  it('should throw if form has source type DataStore, but no schema is available', () => {
    expect(() =>
      generateFormDefinition({
        form: {
          id: '123',
          name: 'sampleForm',
          formActionType: 'create',
          dataType: { dataSourceType: 'DataStore', dataTypeName: 'Dog' },
          fields: {},
          sectionalElements: {},
          style: {},
          ctaConfig: {},
        },
      }),
    ).toThrow();
  });

  it('should override field configurations from DataStore', () => {
    const formDefinition = generateFormDefinition({
      form: {
        id: '123',
        name: 'mySampleForm',
        formActionType: 'create',
        dataType: { dataSourceType: 'DataStore', dataTypeName: 'Dog' },
        fields: { weight: { inputType: { type: 'SliderField', minValue: 1, maxValue: 100, step: 2 } } },
        sectionalElements: {},
        style: {},
        ctaConfig: {},
      },
      dataSchema: {
        dataSourceType: 'DataStore',
        enums: {},
        nonModels: {},
        models: { Dog: { fields: { weight: { dataType: 'Float', readOnly: false, required: true, isArray: false } } } },
      },
    });
    expect(formDefinition.elements).toStrictEqual({
      weight: {
        componentType: 'SliderField',
        props: { label: 'Weight', min: 1, max: 100, step: 2, isDisabled: false, isRequired: true },
      },
    });
  });

  it('should not add overrides to the matrix', () => {
    const formDefinition = generateFormDefinition({
      form: {
        id: '123',
        name: 'mySampleForm',
        formActionType: 'create',
        dataType: { dataSourceType: 'DataStore', dataTypeName: 'Dog' },
        fields: { weight: { inputType: { type: 'SliderField', minValue: 1, maxValue: 100, step: 2 } } },
        sectionalElements: {},
        style: {},
        ctaConfig: {},
      },
      dataSchema: {
        dataSourceType: 'DataStore',
        enums: {},
        nonModels: {},
        models: { Dog: { fields: { weight: { dataType: 'Float', readOnly: false, required: true, isArray: false } } } },
      },
    });

    expect(formDefinition.elementMatrix).toStrictEqual([['weight']]);
  });

  it('should add fields that do not exist in DataStore', () => {
    const formDefinition = generateFormDefinition({
      form: {
        id: '123',
        name: 'mySampleForm',
        formActionType: 'create',
        dataType: { dataSourceType: 'DataStore', dataTypeName: 'Dog' },
        fields: { weight: { inputType: { type: 'SliderField', minValue: 1, maxValue: 100, step: 2 } } },
        sectionalElements: {},
        style: {},
        ctaConfig: {},
      },
      dataSchema: { dataSourceType: 'DataStore', enums: {}, nonModels: {}, models: { Dog: { fields: {} } } },
    });
    expect(formDefinition.elements).toStrictEqual({
      weight: { componentType: 'SliderField', props: { min: 1, max: 100, step: 2, label: 'Label' } },
    });
  });

  it('should add fields that do not exist in DataStore to the matrix', () => {
    const formDefinition = generateFormDefinition({
      form: {
        id: '123',
        name: 'mySampleForm',
        formActionType: 'create',
        dataType: { dataSourceType: 'DataStore', dataTypeName: 'Dog' },
        fields: { weight: { inputType: { type: 'SliderField', minValue: 1, maxValue: 100, step: 2 } } },
        sectionalElements: {},
        style: {},
        ctaConfig: {},
      },
      dataSchema: { dataSourceType: 'DataStore', enums: {}, nonModels: {}, models: { Dog: { fields: {} } } },
    });
    expect(formDefinition.elementMatrix).toStrictEqual([['weight']]);
  });

  it('should add sectional elements', () => {
    const formDefinition = generateFormDefinition({
      form: {
        id: '123',
        name: 'mySampleForm',
        formActionType: 'create',
        dataType: { dataSourceType: 'Custom', dataTypeName: 'dfjkajfl' },
        fields: {},
        sectionalElements: {
          Heading123: { type: 'Heading', position: { fixed: 'first' }, level: 1, text: 'Create Dog' },
        },
        style: {},
        ctaConfig: {},
      },
    });
    expect(formDefinition.elements.Heading123).toStrictEqual({
      componentType: 'Heading',
      props: { level: 1, children: 'Create Dog' },
    });
  });

  it('should apply layout style', () => {
    const style = {
      verticalGap: { value: '10px' },
      horizontalGap: { tokenReference: 'color.primary.solid' },
      outerPadding: { value: '30px' },
    };
    const formDefinition = generateFormDefinition({
      form: {
        id: '123',
        name: 'mySampleForm',
        formActionType: 'create',
        dataType: { dataSourceType: 'Custom', dataTypeName: 'dfsdjflk' },
        fields: {},
        sectionalElements: {},
        style,
        ctaConfig: {},
      },
    });
    expect(formDefinition.form.layoutStyle).toStrictEqual(style);
  });

  it('should not leave empty rows in the matrix', () => {
    const formDefinition = generateFormDefinition({
      form: {
        id: '123',
        name: 'mySampleForm',
        formActionType: 'create',
        dataType: { dataSourceType: 'DataStore', dataTypeName: 'Dog' },
        fields: {
          weight: { excluded: true },
          name: { excluded: true },
          age: { excluded: true },
        },
        sectionalElements: {
          Heading123: { type: 'Heading', position: { fixed: 'first' }, level: 1, text: 'Create Dog' },
        },

        style: {},
        ctaConfig: {},
      },
      dataSchema: {
        dataSourceType: 'DataStore',
        enums: {},
        nonModels: {},
        models: {
          Dog: {
            fields: {
              name: { dataType: 'String', readOnly: false, required: true, isArray: false },
              weight: { dataType: 'Float', readOnly: false, required: true, isArray: false },
              age: { dataType: 'Int', readOnly: false, required: true, isArray: false },
            },
          },
        },
      },
    });
    expect(formDefinition.elementMatrix).toStrictEqual([['Heading123']]);
  });

  it('should correctly map positions', () => {
    const formDefinition = generateFormDefinition({
      form: {
        id: '123',
        name: 'mySampleForm',
        formActionType: 'create',
        dataType: { dataSourceType: 'DataStore', dataTypeName: 'Dog' },
        fields: {
          weight: { position: { rightOf: 'age' } },
          name: { position: { below: 'Heading123' } },
          age: { position: { rightOf: 'name' } },
        },
        sectionalElements: {
          Heading123: { type: 'Heading', position: { fixed: 'first' }, level: 1, text: 'Create Dog' },
        },

        style: {},
        ctaConfig: {},
      },
      dataSchema: {
        dataSourceType: 'DataStore',
        enums: {},
        nonModels: {},
        models: {
          Dog: {
            fields: {
              name: { dataType: 'String', readOnly: false, required: true, isArray: false },
              weight: { dataType: 'Float', readOnly: false, required: true, isArray: false },
              age: { dataType: 'Int', readOnly: false, required: true, isArray: false },
            },
          },
        },
      },
    });
    expect(formDefinition.elementMatrix).toStrictEqual([['Heading123'], ['name', 'age', 'weight']]);
  });
});

it('should requeue if related element is not yet found', () => {
  const formDefinition = generateFormDefinition({
    form: {
      id: '123',
      name: 'mySampleForm',
      formActionType: 'create',
      dataType: { dataSourceType: 'Custom', dataTypeName: 'dfjslkfj' },
      fields: {
        color: { position: { below: 'name' }, inputType: { type: 'TextField' } },
        weight: { position: { rightOf: 'age' }, inputType: { type: 'TextField' } },
        age: { position: { rightOf: 'name' }, inputType: { type: 'TextField' } },
        name: { position: { below: 'Heading123' }, inputType: { type: 'TextField' } },
      },
      sectionalElements: {
        Heading123: { type: 'Heading', position: { fixed: 'first' }, level: 1, text: 'Create Dog' },
      },

      style: {},
      ctaConfig: {},
    },
  });
  expect(formDefinition.elementMatrix).toStrictEqual([['Heading123'], ['name', 'age', 'weight'], ['color']]);
});

it('should handle fields without position', () => {
  const formDefinition = generateFormDefinition({
    form: {
      id: '123',
      name: 'mySampleForm',
      formActionType: 'create',
      dataType: { dataSourceType: 'Custom', dataTypeName: 'fjsldkfj' },
      fields: {
        color: { position: { below: 'name' }, inputType: { type: 'TextField' } },
        weight: { position: { rightOf: 'age' }, inputType: { type: 'TextField' } },
        age: { position: { rightOf: 'name' }, inputType: { type: 'TextField' } },
        name: { label: 'Name', inputType: { type: 'TextField' } },
        bark: { label: 'Bark', inputType: { type: 'TextField' } },
      },
      sectionalElements: {
        Heading123: { type: 'Heading', position: { fixed: 'first' }, level: 1, text: 'Create Dog' },
      },

      style: {},
      ctaConfig: {},
    },
  });
  expect(formDefinition.elementMatrix).toStrictEqual([['Heading123'], ['name', 'age', 'weight'], ['color'], ['bark']]);
});

it('should fill out styles using defaults', () => {
  const definitionForFormWithoutStyle = generateFormDefinition({
    form: {
      id: '123',
      name: 'mySampleForm',
      formActionType: 'create',
      dataType: { dataSourceType: 'Custom', dataTypeName: 'dfkjad' },
      fields: {},
      sectionalElements: {},

      style: {},
      ctaConfig: {},
    },
  });

  expect(definitionForFormWithoutStyle.form.layoutStyle).toStrictEqual({
    horizontalGap: { value: '15px' },
    verticalGap: { value: '15px' },
    outerPadding: { value: '20px' },
  });
});

it('should skip read-only fields without overrides', () => {
  const formDefinition = generateFormDefinition({
    form: {
      id: '123',
      name: 'sampleForm',
      formActionType: 'create',
      dataType: { dataSourceType: 'DataStore', dataTypeName: 'Dog' },
      fields: {},
      sectionalElements: {},
      style: {},
      ctaConfig: {},
    },
    dataSchema: {
      dataSourceType: 'DataStore',
      enums: {},
      nonModels: {},
      models: {
        Dog: {
          fields: {
            name: { dataType: 'String', readOnly: true, required: true, isArray: false },
          },
        },
      },
    },
  });
  expect(formDefinition.elements).toStrictEqual({});
  expect(formDefinition.elementMatrix).toStrictEqual([]);
});

it('should add read-only fields if it has overrides', () => {
  const formDefinition = generateFormDefinition({
    form: {
      id: '123',
      name: 'sampleForm',
      formActionType: 'create',
      dataType: { dataSourceType: 'DataStore', dataTypeName: 'Dog' },
      fields: { name: { inputType: { type: 'TextField' } } },
      sectionalElements: {},
      style: {},
      ctaConfig: {},
    },
    dataSchema: {
      dataSourceType: 'DataStore',
      enums: {},
      nonModels: {},
      models: {
        Dog: {
          fields: {
            name: { dataType: 'String', readOnly: true, required: true, isArray: false },
          },
        },
      },
    },
  });
  expect(formDefinition.elements).toStrictEqual({
    name: {
      componentType: 'TextField',
      props: { label: 'Name', isRequired: true, isReadOnly: true },
      studioFormComponentType: 'TextField',
    },
  });
  expect(formDefinition.elementMatrix).toStrictEqual([['name']]);
});

it('should skip adding id field if it has no overrides', () => {
  const formDefinition = generateFormDefinition({
    form: {
      id: '123',
      name: 'sampleForm',
      formActionType: 'create',
      dataType: { dataSourceType: 'DataStore', dataTypeName: 'Dog' },
      fields: {},
      sectionalElements: {},
      style: {},
      ctaConfig: {},
    },
    dataSchema: {
      dataSourceType: 'DataStore',
      enums: {},
      nonModels: {},
      models: {
        Dog: {
          fields: {
            id: { dataType: 'ID', readOnly: false, required: true, isArray: false },
          },
        },
      },
    },
  });
  expect(formDefinition.elements).toStrictEqual({});
  expect(formDefinition.elementMatrix).toStrictEqual([]);
});
