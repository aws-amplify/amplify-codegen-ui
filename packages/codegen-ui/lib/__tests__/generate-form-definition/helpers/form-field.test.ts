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

import { mapFormFieldConfig, getFormDefinitionInputElement } from '../../../generate-form-definition/helpers';
import { FormDefinition, ModelFieldsConfigs, StudioFormFieldConfig, StudioGenericFieldConfig } from '../../../types';

describe('mapFormFieldConfig', () => {
  it('should map fields', () => {
    const element: { name: string; config: StudioGenericFieldConfig } = {
      name: 'price',
      config: {
        label: 'Price',
        position: { fixed: 'first' },
        inputType: {
          type: 'SliderField',
          minValue: 0,
          maxValue: 100,
          step: 1,
          readOnly: true,
          required: true,
        },
      },
    };

    const formDefinition: FormDefinition = {
      form: { layoutStyle: {} },
      elements: {},
      buttons: {},
      elementMatrix: [['price']],
    };

    const modelFieldsConfigs: ModelFieldsConfigs = {
      price: {
        label: 'price',
        inputType: {
          type: 'TextField',
          readOnly: false,
          required: false,
        },
      },
    };

    mapFormFieldConfig(element, formDefinition, modelFieldsConfigs);

    expect(formDefinition.elements.price).toStrictEqual({
      componentType: 'SliderField',
      props: { label: 'Price', isDisabled: true, min: 0, max: 100, step: 1, isRequired: true },
    });
  });

  it('should throw if there is attempt to map excluded field', () => {
    const element: { name: string; config: StudioFormFieldConfig } = {
      name: 'price',
      config: { excluded: true },
    };

    const formDefinition: FormDefinition = {
      form: { layoutStyle: {} },
      elements: {},
      buttons: {},
      elementMatrix: [['price']],
    };

    const modelFieldsConfigs: ModelFieldsConfigs = {
      price: {
        label: 'price',
        inputType: {
          type: 'TextField',
          readOnly: false,
          required: false,
        },
      },
    };

    expect(() => mapFormFieldConfig(element, formDefinition, modelFieldsConfigs)).toThrow();
  });
});

describe('getFormDefinitionInputElement', () => {
  it('should get TextField', () => {
    const config = {
      label: 'MyLabel',
      inputType: {
        type: 'TextField',
        descriptiveText: 'MyDescriptiveText',
        isRequired: true,
        isReadOnly: false,
        placeholder: 'MyPlaceholder',
        defaultValue: 'MyDefaultValue',
      },
    };

    expect(getFormDefinitionInputElement(config)).toStrictEqual({
      componentType: 'TextField',
      props: {
        label: 'MyLabel',
        descriptiveText: 'MyDescriptiveText',
        placeholder: 'MyPlaceholder',
        defaultValue: 'MyDefaultValue',
      },
    });
  });

  it('should get SwitchField', () => {
    const config = {
      inputType: {
        type: 'SwitchField',
        defaultChecked: true,
      },
    };

    expect(getFormDefinitionInputElement(config)).toStrictEqual({
      componentType: 'SwitchField',
      props: { label: 'Label', defaultChecked: true },
    });
  });

  it('should get PhoneNumberField', () => {
    const config = {
      inputType: {
        type: 'PhoneNumberField',
        defaultCountryCode: '+11',
      },
    };

    expect(getFormDefinitionInputElement(config)).toStrictEqual({
      componentType: 'PhoneNumberField',
      props: { label: 'Label', defaultCountryCode: '+11' },
    });
  });

  it('should get SelectField', () => {
    const config = {
      inputType: {
        type: 'SelectField',
        readOnly: true,
        valueMappings: [
          { displayValue: 'value1Display', value: 'value1' },
          { displayValue: 'value2Display', value: 'value2' },
        ],
        defaultValue: 'value1',
      },
    };

    expect(getFormDefinitionInputElement(config)).toStrictEqual({
      componentType: 'SelectField',
      props: { label: 'Label', isDisabled: true },
      options: [
        { value: 'value1', children: 'value1Display' },
        { value: 'value2', children: 'value2Display' },
      ],
      defaultValue: 'value1',
    });
  });

  it('should get TextAreaField', () => {
    const config = {
      inputType: {
        type: 'TextAreaField',
      },
    };

    const baseConfig = {
      label: 'MyLabel',
      inputType: {
        type: 'TextField',
        descriptiveText: 'MyDescriptiveText',
        isRequired: true,
        isReadOnly: false,
        placeholder: 'MyPlaceholder',
        defaultValue: 'MyDefaultValue',
      },
    };

    expect(getFormDefinitionInputElement(config, baseConfig)).toStrictEqual({
      componentType: 'TextAreaField',
      props: {
        label: 'MyLabel',
        descriptiveText: 'MyDescriptiveText',
        placeholder: 'MyPlaceholder',
        defaultValue: 'MyDefaultValue',
      },
    });
  });

  it('should get PasswordField', () => {
    const config = {
      inputType: {
        type: 'PasswordField',
      },
    };

    const baseConfig = {
      label: 'MyLabel',
      inputType: {
        type: 'TextField',
        descriptiveText: 'MyDescriptiveText',
        isRequired: true,
        isReadOnly: false,
        placeholder: 'MyPlaceholder',
        defaultValue: 'MyDefaultValue',
      },
    };

    expect(getFormDefinitionInputElement(config, baseConfig)).toStrictEqual({
      componentType: 'PasswordField',
      props: {
        label: 'MyLabel',
        descriptiveText: 'MyDescriptiveText',
        placeholder: 'MyPlaceholder',
        defaultValue: 'MyDefaultValue',
      },
    });
  });

  it('should get SliderField', () => {
    const config = {
      inputType: {
        type: 'SliderField',
        defaultValue: 2,
      },
    };

    expect(getFormDefinitionInputElement(config)).toStrictEqual({
      componentType: 'SliderField',
      props: { label: 'Label', defaultValue: 2 },
    });
  });

  it('should get StepperField', () => {
    const config = {
      inputType: {
        type: 'StepperField',
        minValue: 0,
        maxValue: 100,
      },
    };

    expect(getFormDefinitionInputElement(config)).toStrictEqual({
      componentType: 'StepperField',
      props: { label: 'Label', min: 0, max: 100 },
    });
  });

  it('should get ToggleButton', () => {
    const config = {
      label: 'MyLabel',
      inputType: {
        type: 'ToggleButton',
        defaultChecked: false,
      },
    };

    expect(getFormDefinitionInputElement(config)).toStrictEqual({
      componentType: 'ToggleButton',
      props: { children: 'MyLabel', defaultPressed: false },
    });
  });

  it('should get CheckboxField', () => {
    const config = {
      inputType: {
        type: 'CheckboxField',
        defaultChecked: true,
      },
    };

    expect(getFormDefinitionInputElement(config)).toStrictEqual({
      componentType: 'CheckboxField',
      props: { label: 'Label', name: 'fieldName', value: 'true', defaultChecked: true },
    });
  });

  it('should get RadioGroupField', () => {
    const config = {
      inputType: {
        type: 'RadioGroupField',
        name: 'MyFieldName',
        valueMappings: [
          { displayValue: 'value1Display', value: 'value1' },
          { displayValue: 'value2Display', value: 'value2' },
        ],
      },
    };

    expect(getFormDefinitionInputElement(config)).toStrictEqual({
      componentType: 'RadioGroupField',
      props: { label: 'Label', name: 'MyFieldName' },
      radios: [
        { value: 'value1', children: 'value1Display' },
        { value: 'value2', children: 'value2Display' },
      ],
    });
  });

  it('should throw if the inputType type is not valid', () => {
    const config = {
      inputType: {
        type: 'NotValid',
      },
    };

    expect(() => getFormDefinitionInputElement(config)).toThrow();
  });

  it('should throw if the inputType is missing type', () => {
    const config = { label: 'MyLabel' };

    expect(() => getFormDefinitionInputElement(config)).toThrow();
  });
});
