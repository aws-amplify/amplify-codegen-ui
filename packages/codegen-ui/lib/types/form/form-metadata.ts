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
import { DataFieldDataType } from '../data';
import { FieldValidationConfiguration } from './form-validation';
import { FormStyleConfig, StudioFormStyle } from './style';

/**
 * Form Action type definition
 */
export type StudioFormActionType = 'create' | 'update';

export type FieldConfigMetadata = {
  // ex. name field has a string validation type where the rule is char length > 5
  validationRules: FieldValidationConfiguration[];
  // component field is of type AWSTimestamp will need to map this to date then get time from date
  dataType?: DataFieldDataType;

  isArray?: boolean;
  componentType: string;
};

export type FormMetadata = {
  id?: string;
  formActionType: StudioFormActionType;
  name: string;
  fieldConfigs: Record<string, FieldConfigMetadata>;
  layoutConfigs: Record<keyof StudioFormStyle, FormStyleConfig>;
};
