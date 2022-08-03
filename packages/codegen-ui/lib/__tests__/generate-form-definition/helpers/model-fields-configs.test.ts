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

import { mapModelFieldsConfigs, getFieldTypeMapKey } from '../../../generate-form-definition/helpers';
import { FormDefinition, GenericDataSchema } from '../../../types';

describe('mapModelFieldsConfigs', () => {
  it('should map to elementMatrix and add to modelFieldsConfigs', () => {
    const formDefinition: FormDefinition = {
      form: { layoutStyle: {} },
      elements: {},
      buttons: {},
      elementMatrix: [],
    };

    const dataSchema: GenericDataSchema = {
      dataSourceType: 'DataStore',
      enums: {},
      nonModels: {},
      models: {
        Dog: {
          fields: {
            name: { dataType: 'String', readOnly: false, required: false, isArray: false },
          },
        },
      },
    };

    const modelFieldsConfigs = mapModelFieldsConfigs({ dataTypeName: 'Dog', formDefinition, dataSchema });

    expect(formDefinition.elementMatrix).toStrictEqual([['name']]);
    expect(modelFieldsConfigs.name).toStrictEqual({
      label: 'Name',
      inputType: { type: 'TextField', required: false, readOnly: false, name: 'name', value: 'true' },
    });
  });

  it('should properly map different field names casings to sentence case', () => {
    const formDefinition: FormDefinition = {
      form: { layoutStyle: {} },
      elements: {},
      buttons: {},
      elementMatrix: [],
    };

    const dataSchema: GenericDataSchema = {
      dataSourceType: 'DataStore',
      enums: {},
      nonModels: {},
      models: {
        Dog: {
          fields: {
            name: { dataType: 'String', readOnly: false, required: false, isArray: false },
            camelCaseField: { dataType: 'String', readOnly: false, required: false, isArray: false },
            'param-case-field': { dataType: 'String', readOnly: false, required: false, isArray: false },
            snake_case_field: { dataType: 'String', readOnly: false, required: false, isArray: false },
          },
        },
      },
    };

    const modelFieldsConfigs = mapModelFieldsConfigs({ dataTypeName: 'Dog', formDefinition, dataSchema });

    expect(Object.values(modelFieldsConfigs).map((m) => m.label)).toStrictEqual([
      'Name',
      'Camel case field',
      'Param case field',
      'Snake case field',
    ]);
  });

  it('should throw if specified model is not found', () => {
    const formDefinition: FormDefinition = {
      form: { layoutStyle: {} },
      elements: {},
      buttons: {},
      elementMatrix: [],
    };

    const dataSchema: GenericDataSchema = {
      dataSourceType: 'DataStore',
      enums: {},
      nonModels: {},
      models: {
        Dog: {
          fields: {
            name: { dataType: 'String', readOnly: false, required: false, isArray: false },
          },
        },
      },
    };

    expect(() => mapModelFieldsConfigs({ dataTypeName: 'Cat', formDefinition, dataSchema })).toThrow();
  });

  it('should throw if field is an array', () => {
    const formDefinition: FormDefinition = {
      form: { layoutStyle: {} },
      elements: {},
      buttons: {},
      elementMatrix: [],
    };

    const dataSchema: GenericDataSchema = {
      dataSourceType: 'DataStore',
      enums: {},
      nonModels: {},
      models: {
        Dog: {
          fields: {
            names: { dataType: 'String', readOnly: false, required: false, isArray: true },
          },
        },
      },
    };

    expect(() => mapModelFieldsConfigs({ dataTypeName: 'Dog', formDefinition, dataSchema })).toThrow();
  });

  it('should generate config from id field but not add it to matrix', () => {
    const formDefinition: FormDefinition = {
      form: { layoutStyle: {} },
      elements: {},
      buttons: {},
      elementMatrix: [],
    };

    const dataSchema: GenericDataSchema = {
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
    };

    const modelFieldsConfigs = mapModelFieldsConfigs({ dataTypeName: 'Dog', formDefinition, dataSchema });

    expect(formDefinition.elementMatrix).toStrictEqual([]);
    expect(modelFieldsConfigs).toStrictEqual({
      id: {
        inputType: {
          name: 'id',
          readOnly: false,
          required: true,
          type: 'TextField',
          value: 'true',
        },
        label: 'Id',
      },
    });
  });

  it('should add read-only fields to configs but not to matrix', () => {
    const formDefinition: FormDefinition = {
      form: { layoutStyle: {} },
      elements: {},
      buttons: {},
      elementMatrix: [],
    };

    const dataSchema: GenericDataSchema = {
      dataSourceType: 'DataStore',
      enums: {},
      nonModels: {},
      models: {
        Dog: {
          fields: {
            name: { dataType: 'String', readOnly: true, required: false, isArray: false },
          },
        },
      },
    };

    const modelFieldsConfigs = mapModelFieldsConfigs({ dataTypeName: 'Dog', formDefinition, dataSchema });

    expect(formDefinition.elementMatrix).toStrictEqual([]);
    expect(modelFieldsConfigs).toStrictEqual({
      name: {
        inputType: {
          name: 'name',
          readOnly: true,
          required: false,
          type: 'TextField',
          value: 'true',
        },
        label: 'Name',
      },
    });
  });

  it('should add value mappings from enums', () => {
    const formDefinition: FormDefinition = {
      form: { layoutStyle: {} },
      elements: {},
      buttons: {},
      elementMatrix: [],
    };

    const nonEnglishAlphabetTest = 'ㅎ🌱يَّة';

    const dataSchema: GenericDataSchema = {
      dataSourceType: 'DataStore',
      enums: { City: { values: ['NEW_YORK', 'HOUSTON', 'LOS_ANGELES', nonEnglishAlphabetTest] } },
      nonModels: {},
      models: {
        Dog: {
          fields: {
            city: { dataType: { enum: 'City' }, readOnly: false, required: false, isArray: false },
          },
        },
      },
    };

    const modelFieldsConfigs = mapModelFieldsConfigs({ dataTypeName: 'Dog', formDefinition, dataSchema });

    expect(modelFieldsConfigs).toStrictEqual({
      city: {
        inputType: {
          name: 'city',
          readOnly: false,
          required: false,
          type: 'SelectField',
          value: 'true',
          valueMappings: {
            values: [
              { value: { value: 'NEW_YORK' }, displayValue: { value: 'New york' } },
              { value: { value: 'HOUSTON' }, displayValue: { value: 'Houston' } },
              { value: { value: 'LOS_ANGELES' }, displayValue: { value: 'Los angeles' } },
              { value: { value: nonEnglishAlphabetTest }, displayValue: { value: nonEnglishAlphabetTest } },
            ],
          },
        },
        label: 'City',
      },
    });
  });

  it('should throw if type is enum but no matching enum provided', () => {
    const formDefinition: FormDefinition = {
      form: { layoutStyle: {} },
      elements: {},
      buttons: {},
      elementMatrix: [],
    };

    const dataSchema: GenericDataSchema = {
      dataSourceType: 'DataStore',
      enums: {},
      nonModels: {},
      models: {
        Dog: {
          fields: {
            city: { dataType: { enum: 'City' }, readOnly: false, required: false, isArray: false },
          },
        },
      },
    };

    expect(() => mapModelFieldsConfigs({ dataTypeName: 'Dog', formDefinition, dataSchema })).toThrow();
  });
});

describe('getFieldTypeMapKey', () => {
  it('should return `Relationship` if field is of type model or has a related model', () => {
    expect(
      getFieldTypeMapKey({
        dataType: { model: 'Dog' },
        readOnly: false,
        required: false,
        isArray: false,
      }),
    ).toBe('Relationship');

    expect(
      getFieldTypeMapKey({
        dataType: 'ID',
        readOnly: false,
        required: false,
        isArray: false,
        relationship: { relatedModelName: 'Dog', type: 'HAS_ONE' },
      }),
    ).toBe('Relationship');
  });

  it('should return `NonModel` if dataType is nonModel', () => {
    expect(
      getFieldTypeMapKey({
        dataType: { nonModel: 'Misc' },
        readOnly: false,
        required: false,
        isArray: false,
      }),
    ).toBe('NonModel');
  });
});
