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
import { StudioFieldPosition } from './position';
import { StudioFieldInputConfig } from './input-config';
import { FieldValidationConfiguration } from './form-validation';

/**
 * Field configurations for StudioForm
 */
type StudioFieldConfig = {
  label?: string;
  position?: StudioFieldPosition;
  validations?: FieldValidationConfiguration[];
};

/**
 * If a field is excluded, it should have no other properties.
 */
type ExcludedStudioFieldConfig = {
  excluded: true;
};

export type StudioGenericFieldConfig = {
  /**
   * The configuration for what type of input is used.
   */
  inputType?: StudioFieldInputConfig;
} & StudioFieldConfig;

export type StudioFormFieldConfig = StudioGenericFieldConfig | ExcludedStudioFieldConfig;

export type StudioFormFields = {
  [field: string]: StudioFormFieldConfig;
};
