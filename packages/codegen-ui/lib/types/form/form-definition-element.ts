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

type FormDefinitionInputElementCommon = {
  dataType?: DataFieldDataType;
  validations?: (FieldValidationConfiguration & { immutable?: true })[];
  isArray?: boolean;
  relationship?: GenericDataRelationshipType;
};

export type FormDefinitionTextFieldElement = {
  componentType: 'TextField';
  props: {
    label: string;
    descriptiveText?: string;
    isRequired?: boolean;
    isReadOnly?: boolean;
    placeholder?: string;
    type?: string;
  };
  studioFormComponentType:
    | 'TextField'
    | 'NumberField'
    | 'DateField'
    | 'TimeField'
    | 'DateTimeField'
    | 'IPAddressField'
    | 'URLField'
    | 'EmailField'
    | 'PhoneNumberField';
};

export type FormDefinitionAutocompleteElement = {
  componentType: 'Autocomplete';
  props: {
    label: string;
    descriptiveText?: string;
    isRequired?: boolean;
    isReadOnly?: boolean;
    placeholder?: string;
    defaultValue?: string;
  };
  valueMappings: StudioFormValueMappings;
};

export type FormDefinitionSwitchFieldElement = {
  componentType: 'SwitchField';
  props: { label: string; defaultChecked?: boolean; isDisabled?: boolean };
};

export type FormDefinitionPhoneNumberFieldElement = {
  componentType: 'PhoneNumberField';
  props: {
    label: string;
    defaultCountryCode: string;
    isRequired?: boolean;
    isReadOnly?: boolean;
    descriptiveText?: string;
    placeholder?: string;
    defaultValue?: string;
  };
};

export type FormDefinitionSelectFieldElement = {
  componentType: 'SelectField';
  props: { label: string; descriptiveText?: string; placeholder?: string; isDisabled?: boolean };
  // needs to be mapped as children of 'option' JSX elements
  valueMappings: StudioFormValueMappings;
  // 'selected' attr needs to be mapped onto the 'option' itself, not the SelectField
  defaultValue?: string;
};

export type FormDefinitionTextAreaFieldElement = {
  componentType: 'TextAreaField';
  props: {
    label: string;
    descriptiveText?: string;
    isRequired?: boolean;
    isReadOnly?: boolean;
    placeholder?: string;
    defaultValue?: string;
  };
  studioFormComponentType: 'JSONField' | 'TextAreaField';
};

export type FormDefinitionSliderFieldElement = {
  componentType: 'SliderField';
  props: {
    label: string;
    min?: number;
    max?: number;
    step?: number;
    defaultValue?: number;
    isDisabled?: boolean;
    descriptiveText?: string;
    isRequired?: boolean;
  };
};

export type FormDefinitionStepperFieldElement = {
  componentType: 'StepperField';
  props: {
    label: string;
    min?: number;
    max?: number;
    step?: number;
    isReadOnly?: boolean;
    defaultValue?: number;
    descriptiveText?: string;
    isRequired?: boolean;
  };
};

export type FormDefinitionStorageFieldElement = {
  componentType: 'StorageField';
  props: {
    label: string;
    descriptiveText?: string;
    isRequired?: boolean;
    isReadOnly?: boolean;
    defaultValue?: string;
    accessLevel: StorageAccessLevel;
    acceptedFileTypes: string[];
    showThumbnails?: boolean;
    isResumable?: boolean;
    maxFileCount?: number;
    maxSize?: number;
  };
};

export type FormDefinitionToggleButtonElement = {
  componentType: 'ToggleButton';
  props: {
    // label, essentially
    children?: string;
    isDisabled?: boolean;
    defaultPressed?: boolean;
  };
};

export type FormDefinitionCheckboxFieldElement = {
  componentType: 'CheckboxField';
  props: { label: string; value: string; name: string; isDisabled?: boolean };
};

export type FormDefinitionRadioGroupFieldElement = {
  componentType: 'RadioGroupField';
  props: {
    label: string;
    name: string;
    isReadOnly?: boolean;
    defaultValue?: string;
    descriptiveText?: string;
    isRequired?: boolean;
  };
  // needs to be mapped as children of 'Radio' JSX elements
  valueMappings: StudioFormValueMappings;
};

export type FormDefinitionPasswordFieldElement = {
  componentType: 'PasswordField';
  props: {
    label: string;
    descriptiveText?: string;
    isRequired?: boolean;
    isReadOnly?: boolean;
    placeholder?: string;
    defaultValue?: string;
  };
};

export type FormDefinitionButtonElement = {
  name: string;
  componentType: 'Button';
  props: {
    variation?: string;
    children: string;
    type?: string;
  };
};

export type FormDefinitionInputElement = (
  | FormDefinitionTextFieldElement
  | FormDefinitionSwitchFieldElement
  | FormDefinitionPhoneNumberFieldElement
  | FormDefinitionSelectFieldElement
  | FormDefinitionTextAreaFieldElement
  | FormDefinitionSliderFieldElement
  | FormDefinitionStepperFieldElement
  | FormDefinitionToggleButtonElement
  | FormDefinitionCheckboxFieldElement
  | FormDefinitionRadioGroupFieldElement
  | FormDefinitionPasswordFieldElement
  | FormDefinitionAutocompleteElement
  | FormDefinitionStorageFieldElement
) &
  FormDefinitionInputElementCommon;

export type FormDefinitionHeadingElement = {
  componentType: 'Heading';
  props: { level?: number; children?: string };
};

export type FormDefinitionTextElement = {
  componentType: 'Text';
  props: { children?: string };
};

export type FormDefinitionDividerElement = {
  componentType: 'Divider';
  props: { orientation?: 'horizontal' | 'vertical' };
};

export type FormDefinitionSectionalElement =
  | FormDefinitionHeadingElement
  | FormDefinitionTextElement
  | FormDefinitionDividerElement;

export type FormDefinitionElement =
  | FormDefinitionInputElement
  | FormDefinitionSectionalElement
  | FormDefinitionButtonElement;

export type StorageAccessLevel = 'public' | 'protected' | 'private';
