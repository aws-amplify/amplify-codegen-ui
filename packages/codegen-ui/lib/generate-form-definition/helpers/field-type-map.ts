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

import { FieldTypeMapKeys, FormInputType } from '../../types';

/**
 * Maps data types to UI Components
 */
export const FIELD_TYPE_MAP: {
  [key in FieldTypeMapKeys]: {
    defaultComponent: FormInputType;
    supportedComponents: Set<FormInputType>;
  };
} = {
  ID: {
    defaultComponent: 'TextField',
    supportedComponents: new Set(['TextField']),
  },
  String: {
    defaultComponent: 'TextField',
    supportedComponents: new Set([
      'TextAreaField',
      'TextField',
      'PasswordField',
      'Autocomplete',
      'SelectField',
      'StorageField',
    ]),
  },
  Int: {
    defaultComponent: 'NumberField',
    supportedComponents: new Set(['SliderField', 'StepperField', 'NumberField']),
  },
  Float: {
    defaultComponent: 'NumberField',
    supportedComponents: new Set(['SliderField', 'StepperField', 'NumberField']),
  },
  AWSDate: {
    defaultComponent: 'DateField',
    supportedComponents: new Set(['DateField']),
  },
  AWSTime: {
    defaultComponent: 'TimeField',
    supportedComponents: new Set(['TimeField']),
  },
  AWSDateTime: {
    defaultComponent: 'DateTimeField',
    supportedComponents: new Set(['DateTimeField']),
  },
  AWSTimestamp: {
    defaultComponent: 'NumberField',
    supportedComponents: new Set(['DateTimeField', 'NumberField']),
  },
  AWSEmail: {
    defaultComponent: 'EmailField',
    supportedComponents: new Set(['EmailField']),
  },
  AWSURL: {
    defaultComponent: 'URLField',
    supportedComponents: new Set(['URLField']),
  },
  AWSIPAddress: {
    defaultComponent: 'IPAddressField',
    supportedComponents: new Set(['IPAddressField']),
  },
  Boolean: {
    defaultComponent: 'SwitchField',
    supportedComponents: new Set(['ToggleButton', 'CheckboxField', 'RadioGroupField', 'SwitchField']),
  },
  AWSJSON: {
    defaultComponent: 'JSONField',
    supportedComponents: new Set(['TextField', 'JSONField']),
  },
  AWSPhone: {
    defaultComponent: 'PhoneNumberField',
    supportedComponents: new Set(['PhoneNumberField']),
  },
  Enum: {
    defaultComponent: 'SelectField',
    supportedComponents: new Set(['RadioGroupField', 'SelectField']),
  },
  Relationship: {
    defaultComponent: 'Autocomplete',
    supportedComponents: new Set(['Autocomplete']),
  },
  NonModel: {
    defaultComponent: 'TextAreaField',
    supportedComponents: new Set(['TextAreaField']),
  },
};
