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
  GenericDataModel,
  GenericDataSchema,
  ModelFieldsConfigs,
  StudioFieldInputConfig,
  StudioForm,
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
  fieldName,
  field,
  enums,
  allModels,
}: {
  fieldName: string;
  field: GenericDataField;
  enums: GenericDataSchema['enums'];
  allModels: { [modelName: string]: GenericDataModel };
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
    const modelName = field.relationship.relatedModelName;
    // if model, store all keys; else, store field as key
    const keys =
      typeof field.dataType === 'object' && 'model' in field.dataType ? allModels[modelName].primaryKeys : [fieldName];
    const values: StudioFormValueMappings['values'] = keys.map((key) => ({
      value: { bindingProperties: { property: modelName, field: key } },
    }));
    return {
      values,
      bindingProperties: { [modelName]: { type: 'Data', bindingProperties: { model: modelName } } },
    };
  }

  return undefined;
}

export function getFieldConfigFromModelField({
  fieldName,
  field,
  dataSchema,
  setReadOnly,
}: {
  fieldName: string;
  field: GenericDataField;
  dataSchema: GenericDataSchema;
  setReadOnly?: boolean;
}): ExtendedStudioGenericFieldConfig {
  const fieldTypeMapKey = getFieldTypeMapKey(field);

  const { defaultComponent } = FIELD_TYPE_MAP[fieldTypeMapKey];

  // When the relationship is many to many, set data type to the actual related model instead of the join table
  // if (field.relationship && field.relationship.type === 'HAS_MANY' && field.relationship.relatedJoinTableName) {
  //   const dataType = field.dataType as { model: string };
  //   dataType.model = field.relationship.relatedModelName;
  // }
  let { dataType } = field;
  if (
    field.relationship &&
    typeof field.dataType === 'object' &&
    'model' in field.dataType &&
    dataSchema.models[field.dataType.model]?.isJoinTable
  ) {
    dataType = { model: field.relationship.relatedModelName };
  }

  let { readOnly } = field;
  if (setReadOnly) {
    readOnly = true;
  }

  const config: ExtendedStudioGenericFieldConfig & { inputType: StudioFieldInputConfig } = {
    label: sentenceCase(fieldName),
    dataType,
    inputType: {
      type: defaultComponent,
      required: field.required,
      readOnly,
      name: fieldName,
      value: fieldName,
      isArray: field.isArray,
    },
  };

  if (field.relationship) {
    config.relationship = field.relationship;
  }

  const valueMappings = getValueMappings({ fieldName, field, enums: dataSchema.enums, allModels: dataSchema.models });
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
  formActionType,
}: {
  dataTypeName: string;
  dataSchema: GenericDataSchema;
  formDefinition: FormDefinition;
  formActionType?: StudioForm['formActionType'];
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
      (field.relationship && !(typeof field.dataType === 'object' && 'model' in field.dataType));

    if (!isAutoExcludedField) {
      formDefinition.elementMatrix.push([fieldName]);
    }

    const isPrimaryKey = model.primaryKeys.includes(fieldName);

    modelFieldsConfigs[fieldName] = getFieldConfigFromModelField({
      fieldName,
      field,
      dataSchema,
      setReadOnly: isPrimaryKey && formActionType === 'update',
    });
  });

  return modelFieldsConfigs;
}
