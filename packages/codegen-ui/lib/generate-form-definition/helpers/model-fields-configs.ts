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

import { FormDefinition, ModelFieldsConfigs, GenericDataSchema } from '../../types';
import { FIELD_TYPE_MAP } from './field-type-map';
import { InvalidInputError } from '../../errors';

/**
 * Impure function that adds fields from DataStore to temporary util object, modelFieldsConfigs
 * and to the formDefinition
 */
/* eslint-disable no-param-reassign */
export function mapModelFieldsConfigs({
  dataTypeName,
  formDefinition,
  modelFieldsConfigs,
  dataSchema,
}: {
  dataTypeName: string;
  dataSchema: GenericDataSchema;
  formDefinition: FormDefinition;
  modelFieldsConfigs: ModelFieldsConfigs;
}) {
  const model = dataSchema.models[dataTypeName];

  if (!model) {
    throw new InvalidInputError(`Model ${dataTypeName} not found`);
  }

  Object.entries(model.fields).forEach(([fieldName, field]) => {
    if (field.isArray) {
      throw new InvalidInputError('Array types are not yet supported');
    }

    const dataType = typeof field.dataType === 'string' ? field.dataType : Object.keys(field.dataType)[0];
    const defaultComponent = FIELD_TYPE_MAP[dataType]?.defaultComponent;

    if (!defaultComponent) {
      throw new InvalidInputError('Field type could not be mapped to a component');
    }

    const isAutoExcludedField = field.readOnly || (fieldName === 'id' && field.dataType === 'ID' && field.required);

    if (!isAutoExcludedField) {
      formDefinition.elementMatrix.push([fieldName]);
    }

    // TODO: map Enums to valueMappings
    modelFieldsConfigs[fieldName] = {
      label: fieldName,
      inputType: {
        type: defaultComponent,
        required: field.required,
        readOnly: field.readOnly,
        name: fieldName,
        value: 'true',
      },
    };
  });
}
/* eslint-enable no-param-reassign */
