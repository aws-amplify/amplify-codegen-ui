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

import { LabelDecorator, StudioFormStyle } from './style';
import { StudioFormFields, StudioFormFieldConfig, StudioGenericFieldConfig } from './fields';
import { GenericSectionalElementConfig, SectionalElementConfig, SectionalElementFields } from './sectional-element';
import { FormDefinition, ModelFieldsConfigs, FieldTypeMapKeys, ButtonConfig } from './form-definition';
import { StudioFieldInputConfig, StudioFormValueMappings, StudioFormInputFieldProperty } from './input-config';
import { StudioFieldPosition } from './position';
import { StudioFormCTA } from './form-cta';
import {
  FormMetadata,
  FieldConfigMetadata,
  StudioFormActionType,
  StudioFormDataType,
  StudioDataSourceType,
} from './form-metadata';

/**
 * This is the base type for all StudioForms
 */
export type StudioForm = {
  id?: string;

  name: string;

  formActionType: StudioFormActionType;

  dataType: StudioFormDataType;

  fields: StudioFormFields;

  sectionalElements: SectionalElementFields;

  style: StudioFormStyle;

  cta: StudioFormCTA;

  labelDecorator?: LabelDecorator;
};

export type FormInputType =
  | 'TextField'
  | 'TextAreaField'
  | 'PasswordField'
  | 'SliderField'
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
  | 'JSONField'
  | 'Autocomplete'
  | 'StorageField';

export * from './form-definition-element';
export * from './style';
export * from './form-validation';
export * from './form-cta';

export type {
  GenericSectionalElementConfig,
  SectionalElementConfig,
  SectionalElementFields,
  StudioFormFieldConfig,
  StudioFormActionType,
  StudioDataSourceType,
  FormDefinition,
  FormMetadata,
  FieldConfigMetadata,
  StudioFieldInputConfig,
  StudioFormInputFieldProperty,
  StudioGenericFieldConfig,
  StudioFormFields,
  ModelFieldsConfigs,
  StudioFieldPosition,
  FieldTypeMapKeys,
  StudioFormValueMappings,
  ButtonConfig,
};
