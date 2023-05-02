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

import { InternalError, InvalidInputError } from '../../errors';
import {
  FieldTypeMapKeys,
  FormDefinition,
  FormFeatureFlags,
  GenericDataField,
  GenericDataModel,
  GenericDataRelationshipType,
  GenericDataSchema,
  HasManyRelationshipType,
  ModelFieldsConfigs,
  StudioFieldInputConfig,
  StudioForm,
  StudioFormValueMappings,
} from '../../types';
import { ExtendedStudioGenericFieldConfig } from '../../types/form/form-definition';
import { StudioFormInputFieldProperty } from '../../types/form/input-config';
import { FIELD_TYPE_MAP } from './field-type-map';

const isModelDataType = (field: GenericDataField): field is GenericDataField & { dataType: { model: string } } =>
  typeof field.dataType === 'object' && 'model' in field.dataType;

const isHasManyRelationship = (relationship: GenericDataRelationshipType): relationship is HasManyRelationshipType =>
  ('isHasManyIndex' in relationship && relationship.isHasManyIndex) ?? false;

function extractCorrespondingKey({
  thisModel,
  relatedModel,
  relationshipFieldName,
}: {
  thisModel: GenericDataModel;
  relatedModel: GenericDataModel;
  relationshipFieldName: string;
}): string {
  const { relationship: thisModelRelationship } = thisModel.fields[relationshipFieldName] ?? {};

  if (thisModelRelationship) {
    if (isHasManyRelationship(thisModelRelationship)) {
      const correspondingFieldTuple = Object.values(relatedModel.fields).find(
        ({ relationship }) =>
          relationship?.type === 'HAS_MANY' && relationship?.relatedModelFields.includes(relationshipFieldName),
      );

      if (correspondingFieldTuple) {
        const correspondingField = correspondingFieldTuple.relationship;

        if (correspondingField?.type === 'HAS_MANY') {
          const indexOfKey = correspondingField.relatedModelFields.indexOf(relationshipFieldName);

          if (indexOfKey !== -1) {
            const relatedPrimaryKey = relatedModel.primaryKeys[indexOfKey];

            if (relatedPrimaryKey) {
              // secondary index on child of 1:m
              return relatedPrimaryKey;
            }
          }
        }
      }
    } else {
      const modelRelationshipFieldTuple = Object.values(thisModel.fields)
        .filter(isModelDataType)
        .find(({ relationship: matchingFieldRelationship }) => {
          return (
            matchingFieldRelationship?.type === thisModelRelationship.type &&
            matchingFieldRelationship?.relatedModelName === thisModelRelationship.relatedModelName &&
            matchingFieldRelationship?.associatedFields?.includes(relationshipFieldName)
          );
        });

      if (modelRelationshipFieldTuple) {
        const modelRelationshipField = modelRelationshipFieldTuple.relationship;

        if (
          modelRelationshipField &&
          'associatedFields' in modelRelationshipField &&
          modelRelationshipField.associatedFields
        ) {
          const indexOfKey = modelRelationshipField.associatedFields.indexOf(relationshipFieldName);
          if (indexOfKey !== -1) {
            const relatedPrimaryKey = relatedModel.primaryKeys[indexOfKey];
            if (relatedPrimaryKey) {
              // index on parent of 1:1
              return relatedPrimaryKey;
            }
          }
        }
      }
    }
  }

  throw new InternalError(`Cannot find corresponding key for scalar relationship field ${relationshipFieldName}`);
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
  keyToMap,
}: {
  model: GenericDataModel;
  modelName: string;
  keyToMap?: string;
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
      !isModelDataType(fieldObject),
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

  if (keyToMap) {
    concatArray.push({
      bindingProperties: { property: modelName, field: keyToMap },
    });
  } else {
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
  }

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
    const isModelType = isModelDataType(field);
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

    values[0].displayValue = getModelDisplayValue({
      model: relatedModel,
      modelName,
      keyToMap: isModelType ? undefined : keys[0],
    });

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
  featureFlags,
}: {
  dataTypeName: string;
  fieldName: string;
  field: GenericDataField;
  dataSchema: GenericDataSchema;
  setReadOnly?: boolean;
  featureFlags: FormFeatureFlags | undefined;
}): ExtendedStudioGenericFieldConfig {
  const fieldTypeMapKey = getFieldTypeMapKey(field);

  let { defaultComponent } = FIELD_TYPE_MAP[fieldTypeMapKey];

  // we are rolling out the switch to NumberField with relationship support
  if (!featureFlags?.isRelationshipSupported && fieldTypeMapKey === 'AWSTimestamp') {
    defaultComponent = 'DateTimeField';
  }

  // When the relationship is many to many, set data type to the actual related model instead of the join table
  // if (field.relationship && field.relationship.type === 'HAS_MANY' && field.relationship.relatedJoinTableName) {
  //   const dataType = field.dataType as { model: string };
  //   dataType.model = field.relationship.relatedModelName;
  // }
  let { dataType } = field;
  if (field.relationship && isModelDataType(field) && dataSchema.models[field.dataType.model]?.isJoinTable) {
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
        !isModelDataType(field) &&
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
      featureFlags,
    });
  });

  return modelFieldsConfigs;
}
