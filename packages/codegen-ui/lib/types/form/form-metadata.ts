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
import { DataFieldDataType, GenericDataRelationshipType } from '../data';
import { FieldValidationConfiguration } from './form-validation';
import { StudioFormValueMappings } from './input-config';
import { FormStyleConfig, LabelDecorator, StudioFormStyle } from './style';

/**
 * Form Action type definition
 */
export type StudioFormActionType = 'create' | 'update';

export type StudioDataSourceType = 'DataStore' | 'Custom';

/**
 * Data type definition for StudioForm
 */
export type StudioFormDataType = {
  dataSourceType: StudioDataSourceType;

  dataTypeName: string;
};

export type FieldConfigMetadata = {
  // ex. name field has a string validation type where the rule is char length > 5
  validationRules: FieldValidationConfiguration[];
  // needed for mapping conversions e.g. for Int
  dataType?: DataFieldDataType;
  relationship?: GenericDataRelationshipType;
  // for JSON type with invalid variable field name ie. { "1first-Name": "John" } => "firstName"
  sanitizedFieldName?: string;
  isArray?: boolean;
  componentType: string;
  studioFormComponentType?: string;
  // used for dynamic mapping of displayValue
  valueMappings?: StudioFormValueMappings;
};

export type FormMetadata = {
  id?: string;
  formActionType: StudioFormActionType;
  dataType: StudioFormDataType;
  name: string;
  fieldConfigs: Record<string, FieldConfigMetadata>;
  layoutConfigs: Record<keyof Omit<StudioFormStyle, 'labelDecorator'>, FormStyleConfig>;
  labelDecorator?: LabelDecorator;
};
