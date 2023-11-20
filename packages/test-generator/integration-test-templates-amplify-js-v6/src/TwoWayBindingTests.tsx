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
import '@aws-amplify/ui-react/styles.css';
import { ThemeProvider } from '@aws-amplify/ui-react';
import { TwoWayBindings } from './ui-components'; // eslint-disable-line import/extensions

export default function TwoWayBindingTests() {
  return (
    <ThemeProvider>
      <TwoWayBindings
        overrides={{
          CheckboxFieldSection: { id: 'checkbox-field-section' },
          PasswordFieldSection: { id: 'password-field-section' },
          PhoneNumberFieldSection: { id: 'phone-number-field-section' },
          RadioGroupFieldSection: { id: 'radio-group-field-section' },
          RadioGroupFieldValue: { id: 'radio-group-field-value' },
          SearchFieldSection: { id: 'search-field-section' },
          SelectFieldSection: { id: 'select-field-section' },
          SliderFieldSection: { id: 'slider-field-section' },
          StepperFieldSection: { id: 'stepper-field-section' },
          SwitchFieldSection: { id: 'switch-field-section' },
          TextFieldSection: { id: 'text-field-section' },
          TextAreaFieldSection: { id: 'text-area-field-section' },
        }}
      />
    </ThemeProvider>
  );
}
