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

import { addDataStoreModelFields } from '../../../generate-form-definition/helpers';
import { FormDefinition, ModelFieldsConfigs } from '../../../types';

describe('addDataStoreModelField', () => {
  it('should map to elementMatrix and add to modelFieldsConfigs', () => {
    const formDefinition: FormDefinition = {
      form: { layoutStyle: {} },
      elements: {},
      buttons: {},
      elementMatrix: [],
    };

    const field1 = { name: 'name', type: 'String' as const, isReadOnly: false, isRequired: false, isArray: false };

    const schema = {
      models: {
        Dog: {
          name: 'Dog',
          pluralName: 'Dogs',
          fields: {
            [field1.name]: field1,
          },
        },
      },
      enums: {},
      version: 'version',
    };

    const modelFieldsConfigs: ModelFieldsConfigs = {};

    addDataStoreModelFields({ formDefinition, modelFieldsConfigs, schema, modelName: 'Dog' });

    expect(formDefinition.elementMatrix).toStrictEqual([['name']]);
    expect(modelFieldsConfigs.name).toStrictEqual({
      label: 'name',
      inputType: { type: 'TextField', required: false, readOnly: false, name: 'name', value: 'true' },
    });
  });

  it('should throw if field is an array', () => {
    const formDefinition: FormDefinition = {
      form: { layoutStyle: {} },
      elements: {},
      buttons: {},
      elementMatrix: [],
    };

    const field1 = { name: 'name', type: 'String' as const, isReadOnly: false, isRequired: false, isArray: true };

    const schema = {
      models: {
        Dog: {
          name: 'Dog',
          pluralName: 'Dogs',
          fields: {
            [field1.name]: field1,
          },
        },
      },
      enums: {},
      version: 'version',
    };

    const modelFieldsConfigs: ModelFieldsConfigs = {};

    expect(() => addDataStoreModelFields({ formDefinition, modelFieldsConfigs, schema, modelName: 'Dog' })).toThrow();
  });

  it('should throw if there is no default component', () => {
    const formDefinition: FormDefinition = {
      form: { layoutStyle: {} },
      elements: {},
      buttons: {},
      elementMatrix: [],
    };

    const field1 = {
      name: 'name',
      type: 'ErrantType' as any,
      isReadOnly: false,
      isRequired: false,
      isArray: false,
    };

    const schema = {
      models: {
        Dog: {
          name: 'Dog',
          pluralName: 'Dogs',
          fields: {
            [field1.name]: field1,
          },
        },
      },
      enums: {},
      version: 'version',
    };

    const modelFieldsConfigs: ModelFieldsConfigs = {};

    expect(() => addDataStoreModelFields({ formDefinition, modelFieldsConfigs, schema, modelName: 'Dog' })).toThrow();
  });
});
