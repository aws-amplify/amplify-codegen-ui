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

import { sentenceCase } from 'change-case';

import { InvalidInputError } from '../../errors';
import {
  FieldTypeMapKeys,
  FormDefinition,
  GenericDataField,
  GenericDataSchema,
  ModelFieldsConfigs,
  StudioFieldInputConfig,
  StudioGenericFieldConfig,
} from '../../types';
import { FIELD_TYPE_MAP } from './field-type-map';

export function getFieldTypeMapKey(field: GenericDataField): FieldTypeMapKeys {
  if (typeof field.dataType === 'object' && 'enum' in field.dataType) {
    return 'Enum';
  }

  if ((typeof field.dataType === 'object' && 'model' in field.dataType) || field.relationship?.relatedModelName) {
    return 'Relationship';
  }

  if (typeof field.dataType === 'object' && 'nonModel' in field.dataType) {
    return 'NonModel';
  }
  return field.dataType;
}

export function getFieldConfigFromModelField({
  fieldName,
  field,
  dataSchema,
}: {
  fieldName: string;
  field: GenericDataField;
  dataSchema: GenericDataSchema;
}): StudioGenericFieldConfig {
  const fieldTypeMapKey = getFieldTypeMapKey(field);

  const { defaultComponent } = FIELD_TYPE_MAP[fieldTypeMapKey];

  const config: StudioGenericFieldConfig & { inputType: StudioFieldInputConfig } = {
    label: sentenceCase(fieldName),
    dataType: field.dataType,
    inputType: {
      type: defaultComponent,
      required: field.required,
      readOnly: field.readOnly,
      name: fieldName,
      value: 'true',
    },
  };

  if (typeof field.dataType === 'object' && 'enum' in field.dataType) {
    const fieldEnums = dataSchema.enums[field.dataType.enum];
    if (!fieldEnums) {
      throw new InvalidInputError(`Values could not be found for enum ${field.dataType.enum}`);
    }

    config.inputType.valueMappings = {
      values: fieldEnums.values.map((value) => ({
        displayValue: { value: sentenceCase(value) ? sentenceCase(value) : value },
        value: { value },
      })),
    };
  }

  return config;
}

/**
 * Impure function that adds fields from DataStore to temporary util object, modelFieldsConfigs
 * and to the formDefinition
 */
export function mapModelFieldsConfigs({
  dataTypeName,
  formDefinition,
  dataSchema,
}: {
  dataTypeName: string;
  dataSchema: GenericDataSchema;
  formDefinition: FormDefinition;
}) {
  const modelFieldsConfigs: ModelFieldsConfigs = {};
  const model = dataSchema.models[dataTypeName];

  if (!model) {
    throw new InvalidInputError(`Model ${dataTypeName} not found`);
  }

  Object.entries(model.fields).forEach(([fieldName, field]) => {
    if (field.isArray) {
      throw new InvalidInputError('Array types are not yet supported');
    }

    const isAutoExcludedField = field.readOnly || (fieldName === 'id' && field.dataType === 'ID' && field.required);

    if (!isAutoExcludedField) {
      formDefinition.elementMatrix.push([fieldName]);
    }

    modelFieldsConfigs[fieldName] = getFieldConfigFromModelField({ fieldName, field, dataSchema });
  });

  return modelFieldsConfigs;
}
