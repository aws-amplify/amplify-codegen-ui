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
import type { Schema as DataStoreSchema, ModelField } from '@aws-amplify/datastore';
import { InvalidInputError } from './errors';
import { GenericDataField, GenericDataRelationshipType, GenericDataSchema } from './types';

function getGenericDataField(field: ModelField): GenericDataField {
  return {
    dataType: field.type,
    required: !!field.isRequired,
    readOnly: !!field.isReadOnly,
    isArray: field.isArray,
  };
}

function addRelationship(
  fields: {
    [modelName: string]: { [fieldName: string]: GenericDataField['relationship'] };
  },
  modelName: string,
  fieldName: string,
  relationship: GenericDataField['relationship'],
) {
  // handle prototype-pollution vulnerability
  if (modelName === '__proto__') {
    throw new InvalidInputError('Invalid model name "__proto__"');
  }
  if (!fields[modelName]) {
    // eslint-disable-next-line no-param-reassign
    fields[modelName] = {};
  }

  // eslint-disable-next-line no-param-reassign
  fields[modelName][fieldName] = relationship;
}

export function getGenericFromDataStore(dataStoreSchema: DataStoreSchema): GenericDataSchema {
  const genericSchema: GenericDataSchema = {
    dataSourceType: 'DataStore',
    models: {},
    enums: {},
    nonModels: {},
  };

  const fieldsWithImplicitRelationships: {
    [modelName: string]: { [fieldName: string]: GenericDataField['relationship'] };
  } = {};

  Object.values(dataStoreSchema.models).forEach((model) => {
    const genericFields: { [fieldName: string]: GenericDataField } = {};

    Object.values(model.fields).forEach((field) => {
      const genericField = getGenericDataField(field);

      // handle relationships
      if (typeof field.type === 'object' && 'model' in field.type) {
        if (field.association) {
          const relationshipType = field.association.connectionType;

          let relatedModelName = field.type.model;

          let modelRelationship: GenericDataRelationshipType | undefined;

          if (relationshipType === 'HAS_MANY' && 'associatedWith' in field.association) {
            const associatedModel = dataStoreSchema.models[field.type.model];
            const associatedFieldName = field.association.associatedWith;
            const associatedField = associatedModel.fields[associatedFieldName];
            // if the associated model is a join table, update relatedModelName to the actual related model
            if (
              typeof associatedField.type === 'object' &&
              'model' in associatedField.type &&
              associatedField.type.model === model.name
            ) {
              const relatedJoinField = Object.values(associatedModel.fields).find(
                (joinField) =>
                  joinField.name !== associatedFieldName &&
                  typeof joinField.type === 'object' &&
                  'model' in joinField.type,
              );
              if (relatedJoinField && typeof relatedJoinField.type === 'object' && 'model' in relatedJoinField.type) {
                relatedModelName = relatedJoinField.type.model;
              }
              // if the associated model is not a join table, note implicit relationship for associated field
            } else {
              addRelationship(fieldsWithImplicitRelationships, associatedModel.name, associatedFieldName, {
                type: 'HAS_ONE',
                relatedModelName: model.name,
              });
            }
            modelRelationship = { type: relationshipType, relatedModelName, relatedModelField: associatedFieldName };
          }

          // note implicit relationship for associated field within same model
          if (relationshipType === 'HAS_ONE' && 'targetName' in field.association && field.association.targetName) {
            addRelationship(fieldsWithImplicitRelationships, model.name, field.association.targetName, {
              type: relationshipType,
              relatedModelName,
            });
            modelRelationship = { type: relationshipType, relatedModelName };
          }

          if (relationshipType === 'BELONGS_TO') {
            modelRelationship = { type: relationshipType, relatedModelName };
          }

          genericField.relationship = modelRelationship;
        }
      }

      genericFields[field.name] = genericField;
    });

    genericSchema.models[model.name] = { fields: genericFields };
  });

  Object.entries(fieldsWithImplicitRelationships).forEach(([modelName, fields]) => {
    Object.entries(fields).forEach(([fieldName, relationship]) => {
      const field = genericSchema.models[modelName]?.fields[fieldName];
      if (field) {
        field.relationship = relationship;
      }
    });
  });

  genericSchema.enums = dataStoreSchema.enums;

  if (dataStoreSchema.nonModels) {
    Object.values(dataStoreSchema.nonModels).forEach((nonModel) => {
      const genericFields: { [fieldName: string]: GenericDataField } = {};
      Object.values(nonModel.fields).forEach((field) => {
        const genericField = getGenericDataField(field);
        genericFields[field.name] = genericField;
      });
      genericSchema.nonModels[nonModel.name] = { fields: genericFields };
    });
  }

  return genericSchema;
}
