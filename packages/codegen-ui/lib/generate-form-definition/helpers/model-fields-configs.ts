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
import { checkIsSupportedAsFormField } from '../../check-support';

import { InvalidInputError } from '../../errors';
import {
  FieldTypeMapKeys,
  FormDefinition,
  GenericDataField,
  GenericDataSchema,
  ModelFieldsConfigs,
  StudioFieldInputConfig,
  StudioFormValueMappings,
} from '../../types';
import { ExtendedStudioGenericFieldConfig } from '../../types/form/form-definition';
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

function getValueMappings({
  field,
  enums,
}: {
  field: GenericDataField;
  enums: GenericDataSchema['enums'];
}): StudioFormValueMappings | undefined {
  // if enum
  if (typeof field.dataType === 'object' && 'enum' in field.dataType) {
    const fieldEnums = enums[field.dataType.enum];
    if (!fieldEnums) {
      throw new InvalidInputError(`Values could not be found for enum ${field.dataType.enum}`);
    }

    return {
      values: fieldEnums.values.map((value) => ({
        displayValue: { value: sentenceCase(value) ? sentenceCase(value) : value },
        value: { value },
      })),
    };
  }

  // if relationship
  if (field.relationship) {
    console.log(field);
    // if model & HAS_ONE
    if (field.relationship.type === 'HAS_ONE') {
      const modelName = field.relationship.relatedModelName;
      return {
        // TODO: map field dynamically as part of cpk task
        values: [{ value: { bindingProperties: { property: modelName, field: 'id' } } }],
        bindingProperties: { [modelName]: { type: 'Data', bindingProperties: { model: modelName } } },
      };
    }
    if (field.relationship.type === 'BELONGS_TO') {
      const modelName = field.relationship.relatedModelName;
      return {
        values: [{ value: { bindingProperties: { property: modelName, field: 'id' } } }],
        bindingProperties: { [modelName]: { type: 'Data', bindingProperties: { model: modelName } } },
      };
    }
  }

  return undefined;
}

export function getFieldConfigFromModelField({
  fieldName,
  field,
  dataSchema,
}: {
  fieldName: string;
  field: GenericDataField;
  dataSchema: GenericDataSchema;
}): ExtendedStudioGenericFieldConfig {
  const fieldTypeMapKey = getFieldTypeMapKey(field);

  const { defaultComponent } = FIELD_TYPE_MAP[fieldTypeMapKey];

  const config: ExtendedStudioGenericFieldConfig & { inputType: StudioFieldInputConfig } = {
    label: sentenceCase(fieldName),
    dataType: field.dataType,
    inputType: {
      type: defaultComponent,
      required: field.required,
      readOnly: field.readOnly,
      name: fieldName,
      value: fieldName,
      isArray: field.isArray,
    },
  };

  if (field.relationship) {
    config.relationship = field.relationship;
  }

  const valueMappings = getValueMappings({ field, enums: dataSchema.enums });
  if (valueMappings) {
    config.inputType.valueMappings = valueMappings;
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
    const isAutoExcludedField =
      field.readOnly ||
      (fieldName === 'id' && field.dataType === 'ID' && field.required) ||
      (field.relationship && !(typeof field.dataType === 'object' && 'model' in field.dataType)) ||
      !checkIsSupportedAsFormField(field);

    if (!isAutoExcludedField) {
      formDefinition.elementMatrix.push([fieldName]);
    }

    modelFieldsConfigs[fieldName] = getFieldConfigFromModelField({ fieldName, field, dataSchema });
  });

  return modelFieldsConfigs;
}
