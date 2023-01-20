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
  FormFeatureFlags,
  GenericDataField,
  GenericDataModel,
  GenericDataSchema,
  ModelFieldsConfigs,
  StudioFieldInputConfig,
  StudioForm,
  StudioFormValueMappings,
} from '../../types';
import { ExtendedStudioGenericFieldConfig } from '../../types/form/form-definition';
import { StudioFormInputFieldProperty } from '../../types/form/input-config';
import { FIELD_TYPE_MAP } from './field-type-map';

function extractCorrespondingKey({
  thisModel,
  relatedModel,
  relationshipFieldName,
}: {
  thisModel: GenericDataModel;
  relatedModel: GenericDataModel;
  relationshipFieldName: string;
}): string {
  const relationshipField = thisModel.fields[relationshipFieldName];
  if (
    relationshipField.relationship &&
    'isHasManyIndex' in relationshipField.relationship &&
    relationshipField.relationship.isHasManyIndex
  ) {
    const correspondingFieldTuple = Object.entries(relatedModel.fields).find(
      ([, field]) =>
        field.relationship?.type === 'HAS_MANY' &&
        field.relationship?.relatedModelFields.includes(relationshipFieldName),
    );
    if (correspondingFieldTuple) {
      const correspondingField = correspondingFieldTuple[1].relationship;
      if (correspondingField?.type === 'HAS_MANY') {
        const indexOfKey = correspondingField.relatedModelFields.indexOf(relationshipFieldName);
        if (indexOfKey !== -1) {
          return relatedModel.primaryKeys[indexOfKey];
        }
      }
    }
  }

  // TODO: support other types
  return relationshipFieldName;
}

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

function getModelDisplayValue({
  model,
  modelName,
}: {
  model: GenericDataModel;
  modelName: string;
}): StudioFormInputFieldProperty & { isDefault: true } {
  const concatArray: StudioFormInputFieldProperty[] = [];
  const { primaryKeys } = model;

  const scalarNonReadableFields = new Set(['ID', 'AWSJSON', 'AWSTime', 'AWSDate', 'AWSDateTime']);

  const firstReadableNonKeyField = Object.entries(model.fields).find(
    ([fieldName, fieldObject]) =>
      !primaryKeys.includes(fieldName) &&
      !fieldObject.relationship &&
      !(typeof fieldObject.dataType === 'string' && scalarNonReadableFields.has(fieldObject.dataType)) &&
      !(typeof fieldObject.dataType === 'object' && 'nonModel' in fieldObject.dataType) &&
      !(typeof fieldObject.dataType === 'object' && 'model' in fieldObject.dataType),
  )?.[0];

  if (firstReadableNonKeyField) {
    concatArray.push(
      {
        bindingProperties: { property: modelName, field: firstReadableNonKeyField },
      },
      {
        value: ' - ',
      },
    );
  }

  primaryKeys.forEach((key, index) => {
    concatArray.push({
      bindingProperties: { property: modelName, field: key },
    });
    if (index !== primaryKeys.length - 1) {
      concatArray.push({
        value: '-',
      });
    }
  });

  return concatArray.length === 1 ? { ...concatArray[0], isDefault: true } : { concat: concatArray, isDefault: true };
}

function getValueMappings({
  dataTypeName,
  fieldName,
  field,
  enums,
  allModels,
}: {
  dataTypeName: string;
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
        displayValue: { value: sentenceCase(value) ? sentenceCase(value) : value, isDefault: true },
        value: { value },
      })),
    };
  }

  // if relationship
  if (field.relationship) {
    const modelName = field.relationship.relatedModelName;
    const relatedModel = allModels[modelName];
    const isModelType = typeof field.dataType === 'object' && 'model' in field.dataType;
    // if model, store all keys; else, store corresponding primary key
    const keys = isModelType
      ? relatedModel.primaryKeys
      : [
          extractCorrespondingKey({
            thisModel: allModels[dataTypeName],
            relatedModel,
            relationshipFieldName: fieldName,
          }),
        ];
    const values: StudioFormValueMappings['values'] = keys.map((key) => ({
      value: { bindingProperties: { property: modelName, field: key } },
    }));
    if (isModelType) {
      // attach displayValue for all options to the first value
      values[0].displayValue = getModelDisplayValue({ model: relatedModel, modelName });
    }
    return {
      values,
      bindingProperties: { [modelName]: { type: 'Data', bindingProperties: { model: modelName } } },
    };
  }

  return undefined;
}

export function getFieldConfigFromModelField({
  dataTypeName,
  fieldName,
  field,
  dataSchema,
  setReadOnly,
}: {
  dataTypeName: string;
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
    config.inputType.placeholder = `Search ${field.relationship.relatedModelName}`;
  }

  const valueMappings = getValueMappings({
    dataTypeName,
    fieldName,
    field,
    enums: dataSchema.enums,
    allModels: dataSchema.models,
  });
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
  featureFlags,
}: {
  dataTypeName: string;
  dataSchema: GenericDataSchema;
  formDefinition: FormDefinition;
  formActionType?: StudioForm['formActionType'];
  featureFlags?: FormFeatureFlags;
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
      !checkIsSupportedAsFormField(field, featureFlags) ||
      (field.relationship &&
        !(typeof field.dataType === 'object' && 'model' in field.dataType) &&
        // if index overlaps with that of BELONGS_TO, the model field will establish bidirectionality automatically
        !(
          'isHasManyIndex' in field.relationship &&
          field.relationship.isHasManyIndex &&
          field.relationship.type === 'HAS_ONE'
        ));

    if (!isAutoExcludedField) {
      formDefinition.elementMatrix.push([fieldName]);
    }

    const isPrimaryKey = model.primaryKeys.includes(fieldName);

    modelFieldsConfigs[fieldName] = getFieldConfigFromModelField({
      dataTypeName,
      fieldName,
      field,
      dataSchema,
      setReadOnly: isPrimaryKey && formActionType === 'update',
    });
  });

  return modelFieldsConfigs;
}
