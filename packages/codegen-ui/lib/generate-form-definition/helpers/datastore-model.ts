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

import { DataStoreModelField, FormDefinition, ModelFieldsConfigs } from '../../types';
import { FIELD_TYPE_MAP } from './field-type-map';
import { InvalidInputError } from '../../errors';

/**
 * Impure function that adds fields from DataStore to temporary util object, modelFieldsConfigs
 * and to the formDefinition
 */
/* eslint-disable no-param-reassign */
export function addDataStoreModelField(
  formDefinition: FormDefinition,
  modelFieldsConfigs: ModelFieldsConfigs,
  field: DataStoreModelField,
) {
  if (field.isArray) {
    throw new InvalidInputError('Array types are not yet supported');
  }

  const dataType = typeof field.type === 'string' ? field.type : Object.keys(field.type)[0];
  const defaultComponent = FIELD_TYPE_MAP[dataType]?.defaultComponent;

  if (!defaultComponent) {
    throw new InvalidInputError('Field type could not be mapped to a component');
  }

  formDefinition.elementMatrix.push([field.name]);

  // TODO: map Enums to valueMappings
  modelFieldsConfigs[field.name] = {
    label: field.name,
    inputType: {
      type: defaultComponent,
      required: field.isRequired,
      readOnly: field.isReadOnly,
      name: field.name,
      value: 'true',
    },
  };
}
/* eslint-enable no-param-reassign */
