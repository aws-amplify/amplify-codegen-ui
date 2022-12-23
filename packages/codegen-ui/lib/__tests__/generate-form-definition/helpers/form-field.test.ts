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
import { mergeValueMappings } from '../../../generate-form-definition/helpers/form-field';
import {
  FormDefinition,
  GenericDataRelationshipType,
  GenericValidationType,
  ModelFieldsConfigs,
  StringLengthValidationType,
  StudioFormFieldConfig,
  StudioFormValueMappings,
  StudioGenericFieldConfig,
  ValidationTypes,
} from '../../../types';
import { ExtendedStudioGenericFieldConfig } from '../../../types/form/form-definition';
import { getBasicFormDefinition } from '../../__utils__/basic-form-definition';

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
        },
      },
    };

    const formDefinition: FormDefinition = {
      ...getBasicFormDefinition(),
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
      props: { label: 'Price', isDisabled: true, min: 0, max: 100, step: 1, isRequired: false },
    });
  });

  it('should throw if there is attempt to map excluded field', () => {
    const element: { name: string; config: StudioFormFieldConfig } = {
      name: 'price',
      config: { excluded: true },
    };

    const formDefinition: FormDefinition = {
      ...getBasicFormDefinition(),
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
        value: 'MyDefaultValue',
      },
    };

    expect(getFormDefinitionInputElement(config)).toStrictEqual({
      componentType: 'TextField',
      props: {
        label: 'MyLabel',
        descriptiveText: 'MyDescriptiveText',
        placeholder: 'MyPlaceholder',
      },
      studioFormComponentType: 'TextField',
    });
  });

  it(`should gracefully fall back to TextField if the field type isn't available`, () => {
    const config = {
      label: 'MyLabel',
      inputType: {
        isReadOnly: false,
        placeholder: 'MyPlaceholder',
      },
    };

    expect(getFormDefinitionInputElement(config)).toStrictEqual({
      componentType: 'TextField',
      props: {
        label: 'MyLabel',
        placeholder: 'MyPlaceholder',
      },
      studioFormComponentType: 'TextField',
    });
  });

  it('should get NumberField', () => {
    const config = {
      inputType: {
        type: 'NumberField',
      },
    };

    expect(getFormDefinitionInputElement(config)).toStrictEqual({
      componentType: 'TextField',
      props: {
        label: 'Label',
        type: 'number',
      },
      studioFormComponentType: 'NumberField',
    });
  });

  it('should get DateField', () => {
    const config = {
      inputType: {
        type: 'DateField',
      },
    };

    expect(getFormDefinitionInputElement(config)).toStrictEqual({
      componentType: 'TextField',
      props: {
        label: 'Label',
        type: 'date',
      },
      studioFormComponentType: 'DateField',
    });
  });

  it('should get TimeField', () => {
    const config = {
      inputType: {
        type: 'TimeField',
      },
    };

    expect(getFormDefinitionInputElement(config)).toStrictEqual({
      componentType: 'TextField',
      props: {
        label: 'Label',
        type: 'time',
      },
      studioFormComponentType: 'TimeField',
    });
  });

  it('should get DateTimeField', () => {
    const config = {
      inputType: {
        type: 'DateTimeField',
      },
    };

    expect(getFormDefinitionInputElement(config)).toStrictEqual({
      componentType: 'TextField',
      props: {
        label: 'Label',
        type: 'datetime-local',
      },
      studioFormComponentType: 'DateTimeField',
    });
  });

  it('should get IPAddressField', () => {
    const config = {
      inputType: {
        type: 'IPAddressField',
      },
    };

    expect(getFormDefinitionInputElement(config)).toStrictEqual({
      componentType: 'TextField',
      props: {
        label: 'Label',
      },
      studioFormComponentType: 'IPAddressField',
      validations: [{ type: ValidationTypes.IP_ADDRESS, immutable: true }],
    });
  });

  it('should get URLField', () => {
    const config = {
      inputType: {
        type: 'URLField',
      },
    };

    expect(getFormDefinitionInputElement(config)).toStrictEqual({
      componentType: 'TextField',
      props: {
        label: 'Label',
      },
      studioFormComponentType: 'URLField',
      validations: [{ type: ValidationTypes.URL, immutable: true }],
    });
  });

  it('should get EmailField', () => {
    const config = {
      inputType: {
        type: 'EmailField',
      },
    };

    expect(getFormDefinitionInputElement(config)).toStrictEqual({
      componentType: 'TextField',
      props: {
        label: 'Label',
      },
      studioFormComponentType: 'EmailField',
      validations: [{ type: ValidationTypes.EMAIL, immutable: true }],
    });
  });

  it('should add validation if field is required', () => {
    const config = {
      inputType: {
        type: 'EmailField',
        required: true,
      },
    };

    expect(getFormDefinitionInputElement(config)).toStrictEqual({
      componentType: 'TextField',
      props: {
        label: 'Label',
        isRequired: true,
      },
      studioFormComponentType: 'EmailField',
      validations: [
        { type: ValidationTypes.REQUIRED, immutable: true },
        { type: ValidationTypes.EMAIL, immutable: true },
      ],
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
      componentType: 'TextField',
      props: { label: 'Label', type: 'tel' },
      studioFormComponentType: 'PhoneNumberField',
      validations: [{ type: ValidationTypes.PHONE, immutable: true }],
    });
  });

  it('should get SelectField', () => {
    const config = {
      inputType: {
        type: 'SelectField',
        readOnly: true,
        valueMappings: { values: [{ value: { value: 'value1' }, displayvalue: { value: 'displayValue1' } }] },
        defaultValue: 'value1',
      },
    };

    expect(getFormDefinitionInputElement(config)).toStrictEqual({
      componentType: 'SelectField',
      props: { label: 'Label', isDisabled: true, placeholder: 'Please select an option' },
      valueMappings: {
        values: [{ value: { value: 'value1' }, displayvalue: { value: 'displayValue1' } }],
      },
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
      studioFormComponentType: 'TextAreaField',
    });
  });

  it('should get JSONField', () => {
    const config = {
      inputType: {
        type: 'JSONField',
      },
    };

    expect(getFormDefinitionInputElement(config)).toStrictEqual({
      componentType: 'TextAreaField',
      props: {
        label: 'Label',
      },
      studioFormComponentType: 'JSONField',
      validations: [{ type: ValidationTypes.JSON, immutable: true }],
    });
  });

  it('should merge validations', () => {
    const configValidation: StringLengthValidationType = {
      type: ValidationTypes.LESS_THAN_CHAR_LENGTH,
      numValues: [4],
    };
    const config = {
      inputType: {
        type: 'JSONField',
      },
      validations: [configValidation],
    };

    const baseConfigValidation: GenericValidationType = { type: ValidationTypes.REQUIRED };

    const baseConfig = {
      inputType: {
        type: 'JSONField',
      },
      validations: [baseConfigValidation],
    };

    expect(getFormDefinitionInputElement(config, baseConfig)).toStrictEqual({
      componentType: 'TextAreaField',
      props: {
        label: 'Label',
      },
      studioFormComponentType: 'JSONField',
      validations: [{ type: ValidationTypes.JSON, immutable: true }, baseConfigValidation, configValidation],
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
      },
    };

    expect(getFormDefinitionInputElement(config)).toStrictEqual({
      componentType: 'CheckboxField',
      props: { label: 'Label', name: 'fieldName', value: 'fieldName' },
    });
  });

  it('should get RadioGroupField', () => {
    const config = {
      inputType: {
        type: 'RadioGroupField',
        name: 'MyFieldName',
        valueMappings: { values: [{ value: { value: 'value1' }, displayvalue: { value: 'displayValue1' } }] },
      },
    };

    expect(getFormDefinitionInputElement(config)).toStrictEqual({
      componentType: 'RadioGroupField',
      props: { label: 'Label', name: 'MyFieldName' },
      valueMappings: {
        values: [{ value: { value: 'value1' }, displayvalue: { value: 'displayValue1' } }],
      },
    });
  });

  it('should get Autocomplete', () => {
    const valueMappings: StudioFormValueMappings = {
      values: [{ value: { bindingProperties: { property: 'Owner', field: 'id' } } }],
      bindingProperties: { Owner: { type: 'Data', bindingProperties: { model: 'Owner' } } },
    };

    const dataType = { model: 'Owner' };

    const relationship: GenericDataRelationshipType = { relatedModelName: 'Owner', type: 'HAS_ONE' };

    const config: ExtendedStudioGenericFieldConfig = {
      dataType,
      inputType: {
        name: 'Owner',
        readOnly: false,
        required: true,
        type: 'Autocomplete',
        value: 'Owner',
        isArray: false,
        valueMappings,
      },
      label: 'Owner',
      relationship,
    };

    expect(getFormDefinitionInputElement(config)).toStrictEqual({
      componentType: 'Autocomplete',
      props: {
        label: 'Owner',
        isReadOnly: false,
        isRequired: true,
      },
      valueMappings,
      dataType,
      relationship,
      isArray: false,
      validations: [{ type: ValidationTypes.REQUIRED, immutable: true, validationMessage: 'Owner is required.' }],
    });
  });

  it('should return default valueMappings for RadioGroupField if no values available', () => {
    const config = {
      inputType: {
        type: 'RadioGroupField',
        name: 'MyFieldName',
        valueMappings: { values: [] },
      },
    };

    expect(getFormDefinitionInputElement(config)).toStrictEqual({
      componentType: 'RadioGroupField',
      props: { label: 'Label', name: 'MyFieldName' },
      valueMappings: {
        values: [{ value: { value: 'Option' } }],
      },
    });
  });

  it('should handle valueMappings for RadioGroupField of Boolean type', () => {
    const config: ExtendedStudioGenericFieldConfig = {
      dataType: 'Boolean',
      inputType: {
        type: 'RadioGroupField',
        name: 'MyFieldName',
        valueMappings: {
          values: [
            { displayValue: { value: 'Yup' }, value: { value: 'true' } },
            { displayValue: { value: 'Should not be mapped' }, value: { value: 'should not be mapped' } },
          ],
        },
      },
    };

    expect(getFormDefinitionInputElement(config)).toStrictEqual({
      dataType: 'Boolean',
      componentType: 'RadioGroupField',
      props: { label: 'Label', name: 'MyFieldName' },
      valueMappings: {
        values: [
          { value: { value: 'true' }, displayValue: { value: 'Yup' } },
          { value: { value: 'false' }, displayValue: { value: 'No' } },
        ],
      },
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
});

describe('mergeValueMappings', () => {
  it('should return override values if no base values', () => {
    expect(mergeValueMappings(undefined, { values: [{ value: { value: 'value1' } }] }).values).toStrictEqual([
      { value: { value: 'value1' } },
    ]);
  });

  it('should return base values if no override values', () => {
    expect(mergeValueMappings({ values: [{ value: { value: 'value1' } }] }, undefined).values).toStrictEqual([
      { value: { value: 'value1' } },
    ]);
  });

  it('should only return base values with overrides applied if both base and overrides present', () => {
    const mergedMappings = mergeValueMappings(
      {
        values: [
          { value: { value: 'NEW_YORK' }, displayValue: { value: 'New york' } },
          { value: { value: 'HOUSTON' }, displayValue: { value: 'Houston' } },
          { value: { value: 'LOS_ANGELES' }, displayValue: { value: 'Los angeles' } },
        ],
      },
      {
        values: [
          { value: { value: 'LOS_ANGELES' }, displayValue: { value: 'LA' } },
          { value: { value: 'AUSTIN' }, displayValue: { value: 'Austin' } },
        ],
      },
    );

    expect(mergedMappings.values).toStrictEqual([
      { value: { value: 'NEW_YORK' }, displayValue: { value: 'New york' } },
      { value: { value: 'HOUSTON' }, displayValue: { value: 'Houston' } },
      { value: { value: 'LOS_ANGELES' }, displayValue: { value: 'LA' } },
    ]);

    expect(mergedMappings.values.find((v) => 'value' in v.value && v.value.value === 'AUSTIN')).toBeUndefined();
  });

  it('should transfer bindingProperties', () => {
    expect(
      mergeValueMappings(
        {
          values: [{ value: { value: 'sdjoiflj' }, displayValue: { bindingProperties: { property: 'Dog' } } }],
          bindingProperties: {
            Dog: { type: 'Data', bindingProperties: { model: 'Dog' } },
          },
        },
        {
          values: [{ value: { value: 'sdjoiflj' } }],
          bindingProperties: { Dog: { type: 'Data', bindingProperties: { model: 'Dog' } } },
        },
      ).bindingProperties,
    ).toStrictEqual({
      Dog: { type: 'Data', bindingProperties: { model: 'Dog' } },
    });
  });
});
