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

/**
 * Maps data types to UI Components
 */
export const FIELD_TYPE_MAP: { [type: string]: { defaultComponent: string; supportedComponents?: Set<string> } } = {
  ID: {
    defaultComponent: 'TextField',
  },
  String: {
    defaultComponent: 'TextField',
    supportedComponents: new Set(['TextAreaField']),
  },
  Int: {
    defaultComponent: 'TextField',
    supportedComponents: new Set(['SliderField', 'StepperField']),
  },
  Float: {
    defaultComponent: 'TextField',
    supportedComponents: new Set(['SliderField', 'StepperField']),
  },
  AWSDate: {
    defaultComponent: 'TextField',
  },
  AWSTime: {
    defaultComponent: 'TextField',
  },
  AWSDateTime: {
    defaultComponent: 'TextField',
  },
  AWSTimestamp: {
    defaultComponent: 'TextField',
  },
  AWSEmail: {
    defaultComponent: 'TextField',
  },
  AWSURL: {
    defaultComponent: 'TextField',
  },
  AWSIPAddress: {
    defaultComponent: 'TextField',
  },
  Boolean: {
    defaultComponent: 'SwitchField',
    supportedComponents: new Set(['ToggleButton', 'CheckboxField', 'RadioGroupField']),
  },
  AWSJSON: {
    defaultComponent: 'TextAreaField',
    supportedComponents: new Set(['TextField']),
  },
  AWSPhone: {
    defaultComponent: 'PhoneNumberField',
  },
  enum: {
    defaultComponent: 'SelectField',
    supportedComponents: new Set(['RadioGroupField']),
  },
  nonModel: {
    defaultComponent: 'SelectField',
  },
};
