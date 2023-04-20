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
import { FieldConfigMetadata } from '@aws-amplify/codegen-ui';

export const shouldWrapInArrayField = (config: FieldConfigMetadata): boolean =>
  (config.isArray || !!config.relationship) && config.componentType !== 'StorageField';

export const isModelDataType = (
  config: FieldConfigMetadata,
): config is FieldConfigMetadata & { dataType: { model: string } } =>
  !!(config.dataType && typeof config.dataType === 'object' && 'model' in config.dataType && config.dataType.model);

export const isEnumDataType = (
  config: FieldConfigMetadata,
): config is FieldConfigMetadata & { dataType: { enum: string } } =>
  !!(config.dataType && typeof config.dataType === 'object' && 'enum' in config.dataType && config.dataType.enum);

export const shouldImplementDisplayValueFunction = (config: FieldConfigMetadata): boolean => {
  return !!config.relationship || (isEnumDataType(config) && shouldWrapInArrayField(config));
};

export const shouldImplementIDValueFunction = (config: FieldConfigMetadata): boolean => {
  return !!(isModelDataType(config) && config.valueMappings);
};
