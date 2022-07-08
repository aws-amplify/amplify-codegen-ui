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

import { addDataStoreModelField } from '../../../generate-form-definition/helpers';
import { FormDefinition, ModelFieldsConfigs } from '../../../types';

describe('addDataStoreModelField', () => {
  it('should map to elementMatrix and add to modelFieldsConfigs', () => {
    const formDefinition: FormDefinition = {
      form: { layoutStyle: {} },
      elements: {},
      buttons: {},
      elementMatrix: [],
    };

    const dataStoreModelField = { name: 'name', type: 'String', isReadOnly: false, isRequired: false, isArray: false };

    const modelFieldsConfigs: ModelFieldsConfigs = {};

    addDataStoreModelField(formDefinition, modelFieldsConfigs, dataStoreModelField);

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

    const dataStoreModelField = { name: 'name', type: 'String', isReadOnly: false, isRequired: false, isArray: true };

    expect(() => addDataStoreModelField(formDefinition, {}, dataStoreModelField)).toThrow();
  });

  it('should throw if there is no default component', () => {
    const formDefinition: FormDefinition = {
      form: { layoutStyle: {} },
      elements: {},
      buttons: {},
      elementMatrix: [],
    };

    const dataStoreModelField = {
      name: 'name',
      type: 'ErrantType',
      isReadOnly: false,
      isRequired: false,
      isArray: false,
    };

    expect(() => addDataStoreModelField(formDefinition, {}, dataStoreModelField)).toThrow();
  });

  it('should skip generation of id field from data store model', () => {
    const formDefinition: FormDefinition = {
      form: { layoutStyle: {} },
      elements: {},
      buttons: {},
      elementMatrix: [],
    };

    const dataStoreModelField = { name: 'id', type: 'ID', isReadOnly: true, isRequired: true, isArray: false };

    const modelFieldsConfigs: ModelFieldsConfigs = {};

    addDataStoreModelField(formDefinition, modelFieldsConfigs, dataStoreModelField);

    expect(formDefinition.elementMatrix).toStrictEqual([]);
    expect(modelFieldsConfigs).toStrictEqual({
      id: {
        inputType: {
          name: 'id',
          readOnly: true,
          required: true,
          type: 'TextField',
          value: 'true',
        },
        label: 'id',
      },
    });
  });

  it('should skip generation of read only fields from data store model', () => {
    const formDefinition: FormDefinition = {
      form: { layoutStyle: {} },
      elements: {},
      buttons: {},
      elementMatrix: [],
    };

    const dataStoreModelField = { name: 'name', type: 'Boolean', isReadOnly: true, isRequired: false, isArray: false };

    const modelFieldsConfigs: ModelFieldsConfigs = {};

    addDataStoreModelField(formDefinition, modelFieldsConfigs, dataStoreModelField);

    expect(formDefinition.elementMatrix).toStrictEqual([]);
    expect(modelFieldsConfigs).toStrictEqual({
      name: {
        inputType: {
          name: 'name',
          readOnly: true,
          required: false,
          type: 'SwitchField',
          value: 'true',
        },
        label: 'name',
      },
    });
  });
});
