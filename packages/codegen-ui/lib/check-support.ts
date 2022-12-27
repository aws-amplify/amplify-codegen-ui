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
import { DataFieldDataType, GenericDataField, GenericDataModel, FormFeatureFlags } from './types';

export const isNonModelDataType = (dataType?: DataFieldDataType): boolean => {
  return typeof dataType === 'object' && 'nonModel' in dataType;
};

// TODO: change so that default is supported once GA release
const isRelationshipSupported = (featureFlags: FormFeatureFlags | undefined) => featureFlags?.isRelationshipSupported;

// TODO: change so that default is supported once GA release
const isNonModelSupported = (featureFlags: FormFeatureFlags | undefined) => featureFlags?.isNonModelSupported;

/**
 * Checks whether a field is supported as a form input
 */

export const checkIsSupportedAsFormField = (field: GenericDataField, featureFlags?: FormFeatureFlags): boolean => {
  const unsupportedFieldMap: { [key: string]: (f: GenericDataField) => boolean } = {
    nonModel: (f) => !isNonModelSupported(featureFlags) && typeof f.dataType === 'object' && 'nonModel' in f.dataType,
    relationship: (f) => !isRelationshipSupported(featureFlags) && !!f.relationship,
  };

  const unsupportedArray = Object.values(unsupportedFieldMap);
  return !unsupportedArray.some((callback) => callback(field));
};
/**
 * Checks whether a form should be autogen'd from the given model
 */
export const checkIsSupportedAsForm = (model: GenericDataModel, featureFlags?: FormFeatureFlags): boolean => {
  const fieldsArray = Object.values(model.fields);

  // no empty forms
  if (fieldsArray.length === 0) {
    return false;
  }

  let unsupportedFieldsCount = 0;

  const hasRequiredUnsupportedField = fieldsArray.some((field) => {
    const isUnsupported = !checkIsSupportedAsFormField(field, featureFlags);
    if (isUnsupported) {
      unsupportedFieldsCount += 1;

      // no unsupported, required fields
      if (field.required) {
        return true;
      }
    }

    return false;
  });

  if (hasRequiredUnsupportedField) {
    return false;
  }

  // if all fields are unsupported
  if (unsupportedFieldsCount === fieldsArray.length) {
    return false;
  }

  return true;
};
