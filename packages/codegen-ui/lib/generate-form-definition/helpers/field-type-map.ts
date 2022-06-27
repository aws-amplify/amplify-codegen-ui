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

import { FormDefinitionInputElement } from '../../types';

/**
 * Maps data types to UI Components
 */
export const FIELD_TYPE_MAP: {
  [key: string]: {
    defaultComponent: FormDefinitionInputElement['componentType'];
    supportedComponents: Set<FormDefinitionInputElement['componentType']>;
  };
} = {
  ID: {
    defaultComponent: 'TextField',
    supportedComponents: new Set(['TextField']),
  },
  String: {
    defaultComponent: 'TextField',
    supportedComponents: new Set(['TextAreaField', 'TextField', 'PasswordField']),
  },
  Int: {
    defaultComponent: 'TextField',
    supportedComponents: new Set(['SliderField', 'StepperField', 'TextField']),
  },
  Float: {
    defaultComponent: 'TextField',
    supportedComponents: new Set(['SliderField', 'StepperField', 'TextField']),
  },
  AWSDate: {
    defaultComponent: 'TextField',
    supportedComponents: new Set(['TextField']),
  },
  AWSTime: {
    defaultComponent: 'TextField',
    supportedComponents: new Set(['TextField']),
  },
  AWSDateTime: {
    defaultComponent: 'TextField',
    supportedComponents: new Set(['TextField']),
  },
  AWSTimestamp: {
    defaultComponent: 'TextField',
    supportedComponents: new Set(['TextField']),
  },
  AWSEmail: {
    defaultComponent: 'TextField',
    supportedComponents: new Set(['TextField']),
  },
  AWSURL: {
    defaultComponent: 'TextField',
    supportedComponents: new Set(['TextField']),
  },
  AWSIPAddress: {
    defaultComponent: 'TextField',
    supportedComponents: new Set(['TextField']),
  },
  Boolean: {
    defaultComponent: 'SwitchField',
    supportedComponents: new Set(['ToggleButton', 'CheckboxField', 'RadioGroupField', 'SwitchField']),
  },
  AWSJSON: {
    defaultComponent: 'TextAreaField',
    supportedComponents: new Set(['TextField', 'TextAreaField']),
  },
  AWSPhone: {
    defaultComponent: 'PhoneNumberField',
    supportedComponents: new Set(['PhoneNumberField']),
  },
  enum: {
    defaultComponent: 'SelectField',
    supportedComponents: new Set(['RadioGroupField', 'SelectField']),
  },
  nonModel: {
    defaultComponent: 'SelectField',
    supportedComponents: new Set(['SelectField']),
  },
};
