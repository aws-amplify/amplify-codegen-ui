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

import { StudioFormStyle } from './style';
import { StudioFormFields, StudioFormFieldConfig, StudioGenericFieldConfig } from './fields';
import { SectionalElement } from './sectional-element';
import { FormDefinition, ModelFieldsConfigs, FieldTypeMapKeys } from './form-definition';
import { StudioFieldInputConfig, StudioFormValueMappings } from './input-config';
import { StudioFieldPosition } from './position';
import { StudioFormCTA } from './form-cta';
import { FormMetadata, FieldConfigMetadata } from './form-metadata';

/**
 * Data type definition for StudioForm
 */
type StudioFormDataType = {
  dataSourceType: 'DataStore' | 'Custom';

  dataTypeName: string;
};
/**
 * Form Action type definition
 */
type StudioFormActionType = 'create' | 'update';

/**
 * This is the base type for all StudioForms
 */
export type StudioForm = {
  id?: string;

  name: string;

  formActionType: StudioFormActionType;

  dataType: StudioFormDataType;

  fields: StudioFormFields;

  sectionalElements: { [elementName: string]: SectionalElement };

  style: StudioFormStyle;

  cta: StudioFormCTA;
};

export type FormInputType =
  | 'TextField'
  | 'TextAreaField'
  | 'PasswordField'
  | 'SliderField'
  | 'StepperField'
  | 'StepperField'
  | 'SwitchField'
  | 'ToggleButton'
  | 'CheckboxField'
  | 'RadioGroupField'
  | 'PhoneNumberField'
  | 'SelectField'
  | 'NumberField'
  | 'DateField'
  | 'TimeField'
  | 'DateTimeField'
  | 'IPAddressField'
  | 'URLField'
  | 'EmailField'
  | 'JSONField';

export * from './form-definition-element';
export * from './style';
export * from './form-validation';
export * from './form-cta';

export type {
  SectionalElement,
  StudioFormFieldConfig,
  StudioFormActionType,
  FormDefinition,
  FormMetadata,
  FieldConfigMetadata,
  StudioFieldInputConfig,
  StudioGenericFieldConfig,
  StudioFormFields,
  ModelFieldsConfigs,
  StudioFieldPosition,
  FieldTypeMapKeys,
  StudioFormValueMappings,
};
