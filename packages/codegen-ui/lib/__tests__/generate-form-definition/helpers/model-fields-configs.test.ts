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

import { ModelIntrospectionSchema } from '@aws-amplify/appsync-modelgen-plugin';
import {
  mapModelFieldsConfigs,
  getFieldTypeMapKey,
  getFieldConfigFromModelField,
} from '../../../generate-form-definition/helpers';
import { getGenericFromDataStore } from '../../../generic-from-datastore';
import { FormDefinition, GenericDataField, GenericDataSchema } from '../../../types';
import { getBasicFormDefinition } from '../../__utils__/basic-form-definition';
import schemaWith2HasOne from '../../__utils__/introspection-schemas/schema-with-2-has-one.json';

describe('mapModelFieldsConfigs', () => {
  it('should map to elementMatrix and add to modelFieldsConfigs', () => {
    const formDefinition: FormDefinition = getBasicFormDefinition();

    const dataSchema: GenericDataSchema = {
      dataSourceType: 'DataStore',
      enums: {},
      nonModels: {},
      models: {
        Dog: {
          primaryKeys: ['id'],
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
          primaryKeys: ['id'],
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
          primaryKeys: ['id'],
          fields: {
            name: { dataType: 'String', readOnly: false, required: false, isArray: false },
          },
        },
      },
    };

    expect(() => mapModelFieldsConfigs({ dataTypeName: 'Cat', formDefinition, dataSchema })).toThrow();
  });

  it('should properly map all hasOne relationships if multiple are provided', () => {
    const genericDataSchema = getGenericFromDataStore(schemaWith2HasOne as unknown as ModelIntrospectionSchema);

    const modelFields = mapModelFieldsConfigs({
      dataTypeName: 'Foo',
      formDefinition: {
        form: {
          layoutStyle: { horizontalGap: { value: '12' }, verticalGap: { value: '12' }, outerPadding: { value: '5' } },
          labelDecorator: 'none',
        },
        elements: {},
        buttons: {
          buttonConfigs: {},
          position: '',
          buttonMatrix: [],
        },
        elementMatrix: [],
      },
      dataSchema: genericDataSchema,
      formActionType: 'create',
      featureFlags: { isRelationshipSupported: true },
    });

    const userValueMappings = {
      bindingProperties: {
        User: {
          bindingProperties: {
            model: 'User',
          },
          type: 'Data',
        },
      },
      values: [
        {
          displayValue: {
            concat: [
              {
                bindingProperties: {
                  field: 'name',
                  property: 'User',
                },
              },
              {
                value: ' - ',
              },
              {
                bindingProperties: {
                  field: 'id',
                  property: 'User',
                },
              },
            ],
            isDefault: true,
          },
          value: {
            bindingProperties: {
              field: 'id',
              property: 'User',
            },
          },
        },
      ],
    };

    expect(modelFields.fooUser1Id.inputType?.valueMappings).toEqual(userValueMappings);
    expect(modelFields.fooUser2Id.inputType?.valueMappings).toEqual(userValueMappings);
  });

  it('should generate config from id field but not add it to matrix', () => {
    const formDefinition: FormDefinition = getBasicFormDefinition();

    const dataSchema: GenericDataSchema = {
      dataSourceType: 'DataStore',
      enums: {},
      nonModels: {},
      models: {
        Dog: {
          primaryKeys: ['id'],
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
          primaryKeys: ['id'],
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

  it('should add model-type relationship fields to matrix if relationship enabled', () => {
    const formDefinition: FormDefinition = getBasicFormDefinition();

    const dataSchema: GenericDataSchema = {
      dataSourceType: 'DataStore',
      enums: {},
      nonModels: {
        metaData: {
          fields: {},
        },
      },
      models: {
        Owner: {
          primaryKeys: ['id', 'lastName'],
          fields: {
            id: {
              dataType: 'ID',
              readOnly: false,
              required: true,
              isArray: false,
            },
            lastName: {
              dataType: 'String',
              readOnly: false,
              required: true,
              isArray: false,
            },
            barcode: {
              dataType: 'ID',
              readOnly: false,
              required: true,
              isArray: false,
            },
            description: {
              dataType: 'AWSJSON',
              readOnly: false,
              required: true,
              isArray: false,
            },
            time: {
              dataType: 'AWSTime',
              readOnly: false,
              required: true,
              isArray: false,
            },
            date: {
              dataType: 'AWSDate',
              readOnly: false,
              required: true,
              isArray: false,
            },
            dateTime: {
              dataType: 'AWSDateTime',
              readOnly: false,
              required: true,
              isArray: false,
            },
            metadata: {
              dataType: { nonModel: 'Metadata' },
              readOnly: false,
              required: true,
              isArray: false,
            },
            Dog: {
              dataType: { model: 'Dog' },
              readOnly: false,
              required: true,
              isArray: false,
              relationship: { type: 'BELONGS_TO', relatedModelName: 'Dog' },
            },
            dogName: {
              dataType: 'String',
              readOnly: false,
              required: true,
              isArray: false,
              relationship: { type: 'BELONGS_TO', relatedModelName: 'Dog' },
            },
            firstName: {
              dataType: 'String',
              readOnly: false,
              required: true,
              isArray: false,
            },
          },
        },
        Dog: {
          primaryKeys: ['id'],
          fields: {
            Owner: {
              dataType: { model: 'Owner' },
              readOnly: false,
              required: false,
              isArray: false,
              relationship: { type: 'HAS_ONE', relatedModelName: 'Owner' },
            },
          },
        },
      },
    };

    const modelFieldsConfigs = mapModelFieldsConfigs({
      dataTypeName: 'Dog',
      formDefinition,
      dataSchema,
      featureFlags: { isRelationshipSupported: true },
    });

    expect(formDefinition.elementMatrix).toStrictEqual([['Owner']]);

    expect(modelFieldsConfigs).toStrictEqual({
      Owner: {
        label: 'Owner',
        dataType: { model: 'Owner' },
        inputType: {
          type: 'Autocomplete',
          placeholder: 'Search Owner',
          required: false,
          readOnly: false,
          name: 'Owner',
          value: 'Owner',
          isArray: false,
          valueMappings: {
            values: [
              {
                value: { bindingProperties: { property: 'Owner', field: 'id' } },
                displayValue: {
                  isDefault: true,
                  concat: [
                    { bindingProperties: { property: 'Owner', field: 'firstName' } },
                    { value: ' - ' },
                    { bindingProperties: { property: 'Owner', field: 'id' } },
                    { value: '-' },
                    { bindingProperties: { property: 'Owner', field: 'lastName' } },
                  ],
                },
              },
              { value: { bindingProperties: { property: 'Owner', field: 'lastName' } } },
            ],
            bindingProperties: { Owner: { type: 'Data', bindingProperties: { model: 'Owner' } } },
          },
        },
        relationship: { type: 'HAS_ONE', relatedModelName: 'Owner' },
      },
    });
  });

  it('should not add model-type relationship fields matrix if relationship not enabled', () => {
    const formDefinition: FormDefinition = getBasicFormDefinition();

    const dataSchema: GenericDataSchema = {
      dataSourceType: 'DataStore',
      enums: {},
      nonModels: {},
      models: {
        Owner: {
          primaryKeys: ['id'],
          fields: {},
        },
        Dog: {
          primaryKeys: ['id'],
          fields: {
            Owner: {
              dataType: { model: 'Owner' },
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
      Owner: {
        label: 'Owner',
        dataType: { model: 'Owner' },
        inputType: {
          type: 'Autocomplete',
          placeholder: 'Search Owner',
          required: false,
          readOnly: false,
          name: 'Owner',
          value: 'Owner',
          isArray: false,
          valueMappings: {
            values: [
              {
                value: { bindingProperties: { property: 'Owner', field: 'id' } },
                displayValue: { isDefault: true, bindingProperties: { property: 'Owner', field: 'id' } },
              },
            ],
            bindingProperties: { Owner: { type: 'Data', bindingProperties: { model: 'Owner' } } },
          },
        },
        relationship: { type: 'HAS_ONE', relatedModelName: 'Owner' },
      },
    });
  });

  it('should add not-model type relationship fields to configs but not to matrix', () => {
    const formDefinition: FormDefinition = getBasicFormDefinition();

    const dataSchema: GenericDataSchema = {
      dataSourceType: 'DataStore',
      enums: {},
      nonModels: {},
      models: {
        CompositeDog: {
          fields: {
            name: {
              dataType: 'ID',
              required: true,
              readOnly: false,
              isArray: false,
            },
            description: {
              dataType: 'String',
              required: true,
              readOnly: false,
              isArray: false,
            },
            CompositeBowl: {
              dataType: {
                model: 'CompositeBowl',
              },
              required: false,
              readOnly: false,
              isArray: false,
              relationship: {
                type: 'HAS_ONE',
                relatedModelName: 'CompositeBowl',
                associatedFields: ['compositeDogCompositeBowlShape', 'compositeDogCompositeBowlSize'],
              },
            },
            compositeDogCompositeBowlShape: {
              dataType: 'ID',
              required: false,
              readOnly: false,
              isArray: false,
              relationship: {
                type: 'HAS_ONE',
                relatedModelName: 'CompositeBowl',
              },
            },
            compositeDogCompositeBowlSize: {
              dataType: 'String',
              required: false,
              readOnly: false,
              isArray: false,
              relationship: {
                type: 'HAS_ONE',
                relatedModelName: 'CompositeBowl',
              },
            },
          },
          primaryKeys: ['name', 'description'],
        },
        CompositeBowl: {
          fields: {
            shape: {
              dataType: 'ID',
              required: true,
              readOnly: false,
              isArray: false,
            },
            size: {
              dataType: 'String',
              required: true,
              readOnly: false,
              isArray: false,
            },
          },
          primaryKeys: ['shape', 'size'],
        },
      },
    };

    const modelFieldsConfigs = mapModelFieldsConfigs({
      dataTypeName: 'CompositeDog',
      formDefinition,
      dataSchema,
      featureFlags: { isRelationshipSupported: true },
    });

    expect(formDefinition.elementMatrix).toStrictEqual([['name'], ['description'], ['CompositeBowl']]);

    expect(modelFieldsConfigs.compositeDogCompositeBowlShape.inputType?.valueMappings).toStrictEqual({
      values: [
        {
          displayValue: {
            bindingProperties: {
              field: 'shape',
              property: 'CompositeBowl',
            },
            isDefault: true,
          },
          value: {
            bindingProperties: {
              property: 'CompositeBowl',
              field: 'shape',
            },
          },
        },
      ],
      bindingProperties: {
        CompositeBowl: {
          type: 'Data',
          bindingProperties: {
            model: 'CompositeBowl',
          },
        },
      },
    });

    expect(modelFieldsConfigs.compositeDogCompositeBowlSize.inputType?.valueMappings).toStrictEqual({
      values: [
        {
          displayValue: {
            bindingProperties: {
              field: 'size',
              property: 'CompositeBowl',
            },
            isDefault: true,
          },
          value: {
            bindingProperties: {
              property: 'CompositeBowl',
              field: 'size',
            },
          },
        },
      ],
      bindingProperties: {
        CompositeBowl: {
          type: 'Data',
          bindingProperties: {
            model: 'CompositeBowl',
          },
        },
      },
    });
  });

  it('should add not-model type relationship fields to configs and matrix if HAS_ONE & hasMany index', () => {
    const formDefinition: FormDefinition = getBasicFormDefinition();

    const dataSchema: GenericDataSchema = {
      dataSourceType: 'DataStore',
      enums: {},
      nonModels: {},
      models: {
        CompositeDog: {
          primaryKeys: ['name', 'description'],
          fields: {
            name: {
              dataType: 'ID',
              required: true,
              readOnly: false,
              isArray: false,
            },
            description: {
              dataType: 'String',
              required: true,
              readOnly: false,
              isArray: false,
            },
            CompositeToys: {
              dataType: {
                model: 'CompositeToy',
              },
              required: false,
              readOnly: false,
              isArray: true,
              relationship: {
                canUnlinkAssociatedModel: true,
                type: 'HAS_MANY',
                relatedModelName: 'CompositeToy',
                relatedModelFields: ['compositeDogCompositeToysName', 'compositeDogCompositeToysDescription'],
              },
            },
          },
        },
        CompositeToy: {
          fields: {
            kind: {
              dataType: 'ID',
              required: true,
              readOnly: false,
              isArray: false,
            },
            color: {
              dataType: 'String',
              required: true,
              readOnly: false,
              isArray: false,
            },
            compositeDogCompositeToysName: {
              dataType: 'ID',
              required: false,
              readOnly: false,
              isArray: false,
              relationship: {
                type: 'HAS_ONE',
                relatedModelName: 'CompositeDog',
                isHasManyIndex: true,
              },
            },
            compositeDogCompositeToysDescription: {
              dataType: 'String',
              required: false,
              readOnly: false,
              isArray: false,
              relationship: {
                type: 'HAS_ONE',
                relatedModelName: 'CompositeDog',
                isHasManyIndex: true,
              },
            },
          },
          primaryKeys: ['kind', 'color'],
        },
      },
    };

    const modelFieldsConfigs = mapModelFieldsConfigs({
      dataTypeName: 'CompositeToy',
      formDefinition,
      dataSchema,
      featureFlags: { isRelationshipSupported: true },
    });

    expect(formDefinition.elementMatrix).toStrictEqual([
      ['kind'],
      ['color'],
      ['compositeDogCompositeToysName'],
      ['compositeDogCompositeToysDescription'],
    ]);
    expect(modelFieldsConfigs.compositeDogCompositeToysName).toStrictEqual({
      label: 'Composite dog composite toys name',
      dataType: 'ID',
      inputType: {
        placeholder: 'Search CompositeDog',
        type: 'Autocomplete',
        required: false,
        readOnly: false,
        name: 'compositeDogCompositeToysName',
        value: 'compositeDogCompositeToysName',
        isArray: false,
        valueMappings: {
          values: [
            {
              displayValue: {
                bindingProperties: {
                  field: 'name',
                  property: 'CompositeDog',
                },
                isDefault: true,
              },
              value: {
                bindingProperties: {
                  property: 'CompositeDog',
                  field: 'name',
                },
              },
            },
          ],
          bindingProperties: {
            CompositeDog: {
              type: 'Data',
              bindingProperties: {
                model: 'CompositeDog',
              },
            },
          },
        },
      },
      relationship: { type: 'HAS_ONE', relatedModelName: 'CompositeDog', isHasManyIndex: true },
    });
    expect(modelFieldsConfigs.compositeDogCompositeToysDescription).toStrictEqual({
      label: 'Composite dog composite toys description',
      dataType: 'String',
      inputType: {
        type: 'Autocomplete',
        placeholder: 'Search CompositeDog',
        required: false,
        readOnly: false,
        name: 'compositeDogCompositeToysDescription',
        value: 'compositeDogCompositeToysDescription',
        isArray: false,
        valueMappings: {
          values: [
            {
              displayValue: {
                bindingProperties: {
                  field: 'description',
                  property: 'CompositeDog',
                },
                isDefault: true,
              },
              value: {
                bindingProperties: {
                  property: 'CompositeDog',
                  field: 'description',
                },
              },
            },
          ],
          bindingProperties: {
            CompositeDog: {
              type: 'Data',
              bindingProperties: {
                model: 'CompositeDog',
              },
            },
          },
        },
      },
      relationship: { type: 'HAS_ONE', relatedModelName: 'CompositeDog', isHasManyIndex: true },
    });
  });

  it('should add nonModel field to matrix if nonModel enabled', () => {
    const formDefinition: FormDefinition = getBasicFormDefinition();

    const dataSchema: GenericDataSchema = {
      dataSourceType: 'DataStore',
      enums: {},
      nonModels: { Interaction: { fields: {} } },
      models: {
        Dog: {
          primaryKeys: ['id'],
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

    const modelFieldsConfigs = mapModelFieldsConfigs({
      dataTypeName: 'Dog',
      formDefinition,
      dataSchema,
      featureFlags: { isNonModelSupported: true },
    });

    expect(modelFieldsConfigs).toStrictEqual({
      ownerId: {
        dataType: {
          nonModel: 'Interaction',
        },
        inputType: {
          isArray: false,
          name: 'ownerId',
          readOnly: false,
          required: false,
          type: 'TextAreaField',
          value: 'ownerId',
        },
        label: 'Owner id',
      },
    });
    expect(formDefinition.elementMatrix).toStrictEqual([['ownerId']]);
  });

  it('should not add nonModel field to matrix if nonModel not supported', () => {
    const formDefinition: FormDefinition = getBasicFormDefinition();

    const dataSchema: GenericDataSchema = {
      dataSourceType: 'DataStore',
      enums: {},
      nonModels: { Interaction: { fields: {} } },
      models: {
        Dog: {
          primaryKeys: ['id'],
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

    const modelFieldsConfigs = mapModelFieldsConfigs({ dataTypeName: 'Dog', formDefinition, dataSchema });

    expect(modelFieldsConfigs).toStrictEqual({
      ownerId: {
        dataType: {
          nonModel: 'Interaction',
        },
        inputType: {
          isArray: false,
          name: 'ownerId',
          readOnly: false,
          required: false,
          type: 'TextAreaField',
          value: 'ownerId',
        },
        label: 'Owner id',
      },
    });
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
          primaryKeys: ['id'],
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
              { value: { value: 'NEW_YORK' }, displayValue: { value: 'New york', isDefault: true } },
              { value: { value: 'HOUSTON' }, displayValue: { value: 'Houston', isDefault: true } },
              { value: { value: 'LOS_ANGELES' }, displayValue: { value: 'Los angeles', isDefault: true } },
              {
                value: { value: nonEnglishAlphabetTest },
                displayValue: { value: nonEnglishAlphabetTest, isDefault: true },
              },
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
          primaryKeys: ['id'],
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

describe('getFieldConfigFromModelField', () => {
  it('should map the componentType of AWSTimestamp fields based on feature flag', () => {
    const fieldName = 'birthTime';
    const field: GenericDataField = { dataType: 'AWSTimestamp', readOnly: false, required: false, isArray: false };
    const dataSchema: GenericDataSchema = {
      dataSourceType: 'DataStore',
      enums: {},
      nonModels: {},
      models: {
        Dog: {
          primaryKeys: ['id'],
          fields: {
            [fieldName]: field,
          },
        },
      },
    };

    const fieldConfigWithoutFeatureFlags = getFieldConfigFromModelField({
      dataTypeName: 'Dog',
      fieldName,
      field,
      dataSchema,
      featureFlags: undefined,
    });

    expect(fieldConfigWithoutFeatureFlags.inputType?.type).toBe('DateTimeField');

    const fieldConfigWithRelationshipEnabled = getFieldConfigFromModelField({
      dataTypeName: 'Dog',
      fieldName,
      field,
      dataSchema,
      featureFlags: { isRelationshipSupported: true },
    });

    expect(fieldConfigWithRelationshipEnabled.inputType?.type).toBe('NumberField');
  });
});
