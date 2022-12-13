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
import { FieldConfigMetadata, HasManyRelationshipType } from '@aws-amplify/codegen-ui';
import { PropertyAssignment } from 'typescript';
import {
  buildDisplayValueFunction,
  getDisplayValueObject,
  getModelsToImport,
  buildIDValueFunction,
  getIDValueObject,
} from './model-values';
import {
  shouldImplementDisplayValueFunction,
  shouldWrapInArrayField,
  shouldImplementIDValueFunction,
} from './render-checkers';
import { buildValidationForField, buildValidations } from './validation';

/**
 * This helper returns an evolving collection of artifacts produced by iterating through
 * the fieldConfigs object. Its purpose is to prevent iterating through this object
 * multiple times to shave off compute time.
 */
export function mapFromFieldConfigs(fieldConfigs: Record<string, FieldConfigMetadata>) {
  const validationsForField: PropertyAssignment[] = [];
  const dataTypesMap: { [dataType: string]: string[] } = {};
  const displayValueFunctions: PropertyAssignment[] = [];
  const idValueFunctions: PropertyAssignment[] = [];
  const modelsToImport: string[] = [];
  let usesArrayField = false;

  Object.entries(fieldConfigs).forEach(([fieldName, fieldConfig]) => {
    // dataTypesMap
    let dataTypeKey: string | undefined;
    if (fieldConfig.dataType) {
      if (typeof fieldConfig.dataType === 'string') {
        dataTypeKey = fieldConfig.dataType;
      }
    }

    if (dataTypeKey) {
      if (dataTypesMap[dataTypeKey]) {
        dataTypesMap[dataTypeKey].push(fieldName);
      } else {
        dataTypesMap[dataTypeKey] = [fieldName];
      }
    }

    // usesArrayField
    if (shouldWrapInArrayField(fieldConfig)) {
      usesArrayField = true;
    }

    // displayValue
    if (shouldImplementDisplayValueFunction(fieldConfig)) {
      displayValueFunctions.push(buildDisplayValueFunction(fieldName, fieldConfig));
    }

    // idValue
    if (shouldImplementIDValueFunction(fieldConfig)) {
      idValueFunctions.push(buildIDValueFunction(fieldName, fieldConfig));
    }

    // modelsToImport
    modelsToImport.push(...getModelsToImport(fieldConfig));

    // validation
    validationsForField.push(buildValidationForField(fieldName, fieldConfig.validationRules));
  });

  return {
    validationsObject: buildValidations(validationsForField),
    dataTypesMap,
    displayValueObject: displayValueFunctions.length ? getDisplayValueObject(displayValueFunctions) : undefined,
    idValueObject: idValueFunctions.length ? getIDValueObject(idValueFunctions) : undefined,
    modelsToImport,
    usesArrayField,
  };
}

export const isManyToManyRelationship = (
  fieldConfigMetaData: FieldConfigMetadata,
): fieldConfigMetaData is FieldConfigMetadata & {
  relationship: HasManyRelationshipType & { relatedJoinTableName: string };
} => !!(fieldConfigMetaData.relationship?.type === 'HAS_MANY' && fieldConfigMetaData.relationship.relatedJoinTableName);
