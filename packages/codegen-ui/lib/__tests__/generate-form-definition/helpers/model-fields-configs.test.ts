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
import { getBasicFormDefinition } from '../../__utils__/basic-form-definition';

describe('mapModelFieldsConfigs', () => {
  it('should map to elementMatrix and add to modelFieldsConfigs', () => {
    const formDefinition: FormDefinition = getBasicFormDefinition();

    const dataSchema: GenericDataSchema = {
      dataSourceType: 'DataStore',
      enums: {},
      nonModels: {},
      models: {
        Dog: {
          fields: {
            name: { dataType: 'String', readOnly: false, required: false, isArray: true },
          },
        },
      },
    };

    const modelFieldsConfigs = mapModelFieldsConfigs({ dataTypeName: 'Dog', formDefinition, dataSchema });

    expect(formDefinition.elementMatrix).toStrictEqual([['name']]);
    expect(modelFieldsConfigs.name).toStrictEqual({
      label: 'Name',
      dataType: 'String',
      inputType: { type: 'TextField', isArray: true, required: false, readOnly: false, name: 'name', value: 'name' },
    });
  });

  it('should properly map different field names casings to sentence case', () => {
    const formDefinition: FormDefinition = getBasicFormDefinition();

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
    const formDefinition: FormDefinition = getBasicFormDefinition();

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

  it('should generate config from id field but not add it to matrix', () => {
    const formDefinition: FormDefinition = getBasicFormDefinition();

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
        dataType: 'ID',
        inputType: {
          name: 'id',
          readOnly: false,
          required: true,
          type: 'TextField',
          value: 'id',
          isArray: false,
        },
        label: 'Id',
      },
    });
  });

  it('should add read-only fields to configs but not to matrix', () => {
    const formDefinition: FormDefinition = getBasicFormDefinition();

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
        dataType: 'String',
        inputType: {
          name: 'name',
          readOnly: true,
          required: false,
          type: 'TextField',
          value: 'name',
          isArray: false,
        },
        label: 'Name',
      },
    });
  });

  it('should add relationship fields to configs but not to matrix', () => {
    const formDefinition: FormDefinition = getBasicFormDefinition();

    const dataSchema: GenericDataSchema = {
      dataSourceType: 'DataStore',
      enums: {},
      nonModels: {},
      models: {
        Dog: {
          fields: {
            ownerId: {
              dataType: 'ID',
              readOnly: false,
              required: false,
              isArray: false,
              relationship: { type: 'HAS_ONE', relatedModelName: 'Owner' },
            },
          },
        },
      },
    };

    const modelFieldsConfigs = mapModelFieldsConfigs({ dataTypeName: 'Dog', formDefinition, dataSchema });

    expect(formDefinition.elementMatrix).toStrictEqual([]);
    expect(modelFieldsConfigs).toStrictEqual({
      ownerId: {
        dataType: 'ID',
        inputType: {
          name: 'ownerId',
          readOnly: false,
          required: false,
          type: 'SelectField',
          value: 'ownerId',
          isArray: false,
        },
        label: 'Owner id',
      },
    });
  });

  it('should not add nonModel field to matrix', () => {
    const formDefinition: FormDefinition = getBasicFormDefinition();

    const dataSchema: GenericDataSchema = {
      dataSourceType: 'DataStore',
      enums: {},
      nonModels: { Interaction: { fields: {} } },
      models: {
        Dog: {
          fields: {
            ownerId: {
              dataType: { nonModel: 'Interaction' },
              readOnly: false,
              required: false,
              isArray: false,
            },
          },
        },
      },
    };

    mapModelFieldsConfigs({ dataTypeName: 'Dog', formDefinition, dataSchema });

    expect(formDefinition.elementMatrix).toStrictEqual([]);
  });

  it('should add value mappings from enums', () => {
    const formDefinition: FormDefinition = getBasicFormDefinition();

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
        dataType: {
          enum: 'City',
        },
        inputType: {
          name: 'city',
          readOnly: false,
          required: false,
          type: 'SelectField',
          value: 'city',
          valueMappings: {
            values: [
              { value: { value: 'NEW_YORK' }, displayValue: { value: 'New york' } },
              { value: { value: 'HOUSTON' }, displayValue: { value: 'Houston' } },
              { value: { value: 'LOS_ANGELES' }, displayValue: { value: 'Los angeles' } },
              { value: { value: nonEnglishAlphabetTest }, displayValue: { value: nonEnglishAlphabetTest } },
            ],
          },
          isArray: false,
        },
        label: 'City',
      },
    });
  });

  it('should throw if type is enum but no matching enum provided', () => {
    const formDefinition: FormDefinition = getBasicFormDefinition();

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
