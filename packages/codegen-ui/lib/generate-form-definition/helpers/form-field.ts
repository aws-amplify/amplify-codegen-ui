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
import {
  FormDefinition,
  FormDefinitionInputElement,
  StudioGenericFieldConfig,
  ModelFieldsConfigs,
  StudioFormFieldConfig,
  StudioFormValueMappings,
} from '../../types';
import { InternalError, InvalidInputError } from '../../errors';
import { FORM_DEFINITION_DEFAULTS } from './defaults';
import { deleteUndefined, getFirstDefinedValue, getFirstNumber, getFirstString } from './mapper-utils';

export function mergeValueMappings(
  base?: StudioFormValueMappings,
  override?: StudioFormValueMappings,
): StudioFormValueMappings {
  let values: StudioFormValueMappings['values'] = [];

  if (!base && override) {
    values = override.values;
  } else if (base && !override) {
    values = base.values;
  } else if (base && override) {
    const overrideMap = new Map(
      override.values.map(({ displayValue, value }) => [JSON.stringify(value), displayValue]),
    );
    values = base.values.map(({ displayValue, value }) => {
      const stringifiedBaseValue = JSON.stringify(value);
      const overrideDisplayValue = overrideMap.get(stringifiedBaseValue);
      if (overrideDisplayValue) {
        return { displayValue: overrideDisplayValue, value };
      }
      return { displayValue, value };
    });
  }

  return {
    values,
    bindingProperties: { ...base?.bindingProperties, ...override?.bindingProperties },
  };
}

function getTextFieldType(componentType: string): string | undefined {
  const ComponentToTypeMap: { [key: string]: string } = {
    NumberField: 'number',
    DateField: 'date',
    TimeField: 'time',
    DateTimeField: 'datetime-local',
  };
  return ComponentToTypeMap[componentType];
}

/**
 * pure function that maps fieldConfig to definition Element
 */

export function getFormDefinitionInputElement(
  config: StudioGenericFieldConfig,
  baseConfig?: StudioGenericFieldConfig,
): FormDefinitionInputElement {
  const componentType = config.inputType?.type || baseConfig?.inputType?.type;

  if (!componentType) {
    throw new InvalidInputError('Field config is missing input type');
  }

  let formDefinitionElement: FormDefinitionInputElement;
  switch (componentType) {
    case 'TextField':
    case 'NumberField':
    case 'DateField':
    case 'TimeField':
    case 'DateTimeField':
    case 'IPAddressField':
    case 'URLField':
    case 'EmailField':
      formDefinitionElement = {
        componentType: 'TextField',
        props: {
          label: config.label || baseConfig?.label || FORM_DEFINITION_DEFAULTS.field.inputType.label,
          descriptiveText: config.inputType?.descriptiveText ?? baseConfig?.inputType?.descriptiveText,
          isRequired: getFirstDefinedValue([config.inputType?.required, baseConfig?.inputType?.required]),
          isReadOnly: getFirstDefinedValue([config.inputType?.readOnly, baseConfig?.inputType?.readOnly]),
          placeholder: config.inputType?.placeholder || baseConfig?.inputType?.placeholder,
          defaultValue: getFirstString([config.inputType?.defaultValue, baseConfig?.inputType?.defaultValue]),
          type: getTextFieldType(componentType),
        },
        studioFormComponentType: componentType,
      };
      break;
    case 'SwitchField':
      formDefinitionElement = {
        componentType: 'SwitchField',
        props: {
          label: config.label || baseConfig?.label || FORM_DEFINITION_DEFAULTS.field.inputType.label,
          defaultChecked: getFirstDefinedValue([
            config.inputType?.defaultChecked,
            baseConfig?.inputType?.defaultChecked,
          ]),
          isDisabled: getFirstDefinedValue([config.inputType?.readOnly, baseConfig?.inputType?.readOnly]),
        },
      };

      break;

    case 'PhoneNumberField':
      formDefinitionElement = {
        componentType: 'PhoneNumberField',
        props: {
          label: config.label || baseConfig?.label || FORM_DEFINITION_DEFAULTS.field.inputType.label,
          defaultCountryCode:
            config.inputType?.defaultCountryCode ||
            baseConfig?.inputType?.defaultCountryCode ||
            FORM_DEFINITION_DEFAULTS.field.inputType.defaultCountryCode,
          isRequired: getFirstDefinedValue([config.inputType?.required, baseConfig?.inputType?.required]),
          isReadOnly: getFirstDefinedValue([config.inputType?.readOnly, baseConfig?.inputType?.readOnly]),
          descriptiveText: config.inputType?.descriptiveText ?? baseConfig?.inputType?.descriptiveText,
          placeholder: config.inputType?.placeholder || baseConfig?.inputType?.placeholder,
          defaultValue: getFirstString([config.inputType?.defaultValue, baseConfig?.inputType?.defaultValue]),
        },
      };
      break;

    case 'SelectField':
      formDefinitionElement = {
        componentType: 'SelectField',
        props: {
          label: config.label || baseConfig?.label || FORM_DEFINITION_DEFAULTS.field.inputType.label,
          descriptiveText: config.inputType?.descriptiveText ?? baseConfig?.inputType?.descriptiveText,
          placeholder: config.inputType?.placeholder || baseConfig?.inputType?.placeholder,
          isDisabled: getFirstDefinedValue([config.inputType?.readOnly, baseConfig?.inputType?.readOnly]),
        },

        defaultValue: getFirstString([config.inputType?.defaultValue, baseConfig?.inputType?.defaultValue]),
        valueMappings: mergeValueMappings(baseConfig?.inputType?.valueMappings, config.inputType?.valueMappings),
      };
      break;

    case 'TextAreaField':
    case 'JSONField':
      formDefinitionElement = {
        componentType: 'TextAreaField',
        props: {
          label: config.label || baseConfig?.label || FORM_DEFINITION_DEFAULTS.field.inputType.label,
          descriptiveText: config.inputType?.descriptiveText ?? baseConfig?.inputType?.descriptiveText,
          isRequired: getFirstDefinedValue([config.inputType?.required, baseConfig?.inputType?.required]),
          isReadOnly: getFirstDefinedValue([config.inputType?.readOnly, baseConfig?.inputType?.readOnly]),
          placeholder: config.inputType?.placeholder || baseConfig?.inputType?.placeholder,
          defaultValue: getFirstString([config.inputType?.defaultValue, baseConfig?.inputType?.defaultValue]),
        },
        studioFormComponentType: componentType,
      };
      break;

    case 'SliderField':
      formDefinitionElement = {
        componentType: 'SliderField',
        props: {
          label: config.label || baseConfig?.label || FORM_DEFINITION_DEFAULTS.field.inputType.label,
          min: getFirstDefinedValue([config.inputType?.minValue, baseConfig?.inputType?.minValue]),
          max: getFirstDefinedValue([config.inputType?.maxValue, baseConfig?.inputType?.maxValue]),
          step: getFirstDefinedValue([config.inputType?.step, baseConfig?.inputType?.step]),
          isDisabled: getFirstDefinedValue([config.inputType?.readOnly, baseConfig?.inputType?.readOnly]),
          defaultValue: getFirstNumber([config.inputType?.defaultValue, baseConfig?.inputType?.defaultValue]),
          descriptiveText: config.inputType?.descriptiveText ?? baseConfig?.inputType?.descriptiveText,
          isRequired: getFirstDefinedValue([config.inputType?.required, baseConfig?.inputType?.required]),
        },
      };
      break;

    case 'StepperField':
      formDefinitionElement = {
        componentType: 'StepperField',
        props: {
          label: config.label || baseConfig?.label || FORM_DEFINITION_DEFAULTS.field.inputType.label,
          min: getFirstDefinedValue([config.inputType?.minValue, baseConfig?.inputType?.minValue]),
          max: getFirstDefinedValue([config.inputType?.maxValue, baseConfig?.inputType?.maxValue]),
          step: getFirstDefinedValue([config.inputType?.step, baseConfig?.inputType?.step]),
          isReadOnly: getFirstDefinedValue([config.inputType?.readOnly, baseConfig?.inputType?.readOnly]),
          defaultValue: getFirstNumber([config.inputType?.defaultValue, baseConfig?.inputType?.defaultValue]),
          descriptiveText: config.inputType?.descriptiveText ?? baseConfig?.inputType?.descriptiveText,
          isRequired: getFirstDefinedValue([config.inputType?.required, baseConfig?.inputType?.required]),
        },
      };

      break;

    case 'ToggleButton':
      formDefinitionElement = {
        componentType: 'ToggleButton',
        props: {
          children: config.label || baseConfig?.label || FORM_DEFINITION_DEFAULTS.field.inputType.label,
          isDisabled: getFirstDefinedValue([config.inputType?.readOnly, baseConfig?.inputType?.readOnly]),
          defaultPressed: getFirstDefinedValue([
            config.inputType?.defaultChecked,
            baseConfig?.inputType?.defaultChecked,
          ]),
        },
      };
      break;

    case 'CheckboxField':
      formDefinitionElement = {
        componentType: 'CheckboxField',
        props: {
          label: config.label || baseConfig?.label || FORM_DEFINITION_DEFAULTS.field.inputType.label,
          name: config.inputType?.name || baseConfig?.inputType?.name || FORM_DEFINITION_DEFAULTS.field.inputType.name,
          value:
            config.inputType?.value || baseConfig?.inputType?.value || FORM_DEFINITION_DEFAULTS.field.inputType.value,
          isDisabled: getFirstDefinedValue([config.inputType?.readOnly, baseConfig?.inputType?.readOnly]),
          defaultChecked: getFirstDefinedValue([
            config.inputType?.defaultChecked,
            baseConfig?.inputType?.defaultChecked,
          ]),
        },
      };
      break;

    case 'RadioGroupField':
      formDefinitionElement = {
        componentType: 'RadioGroupField',
        props: {
          label: config.label || baseConfig?.label || FORM_DEFINITION_DEFAULTS.field.inputType.label,
          name: config.inputType?.name || baseConfig?.inputType?.name || FORM_DEFINITION_DEFAULTS.field.inputType.name,
          isReadOnly: getFirstDefinedValue([config.inputType?.readOnly, baseConfig?.inputType?.readOnly]),
          defaultValue: getFirstString([config.inputType?.defaultValue, baseConfig?.inputType?.defaultValue]),
          descriptiveText: config.inputType?.descriptiveText ?? baseConfig?.inputType?.descriptiveText,
          isRequired: getFirstDefinedValue([config.inputType?.required, baseConfig?.inputType?.required]),
        },
        valueMappings:
          baseConfig?.inputType?.valueMappings?.values.length || config?.inputType?.valueMappings?.values.length
            ? mergeValueMappings(baseConfig?.inputType?.valueMappings, config.inputType?.valueMappings)
            : FORM_DEFINITION_DEFAULTS.field.inputType.valueMappings,
      };
      break;

    case 'PasswordField':
      formDefinitionElement = {
        componentType: 'PasswordField',
        props: {
          label: config.label || baseConfig?.label || FORM_DEFINITION_DEFAULTS.field.inputType.label,
          descriptiveText: config.inputType?.descriptiveText ?? baseConfig?.inputType?.descriptiveText,
          isRequired: getFirstDefinedValue([config.inputType?.required, baseConfig?.inputType?.required]),
          isReadOnly: getFirstDefinedValue([config.inputType?.readOnly, baseConfig?.inputType?.readOnly]),
          placeholder: config.inputType?.placeholder || baseConfig?.inputType?.placeholder,
          defaultValue: getFirstString([config.inputType?.defaultValue, baseConfig?.inputType?.defaultValue]),
        },
      };
      break;

    default:
      throw new InvalidInputError(`componentType ${componentType} could not be mapped`);
  }

  deleteUndefined(formDefinitionElement);
  deleteUndefined(formDefinitionElement.props);

  return formDefinitionElement;
}

/**
 * Impure function that adds field configurations to formDefinition
 */
/* eslint-disable no-param-reassign */
export function mapFormFieldConfig(
  element: { name: string; config: StudioFormFieldConfig },
  formDefinition: FormDefinition,
  modelFieldsConfigs: ModelFieldsConfigs,
) {
  if ('excluded' in element.config) {
    throw new InternalError(`Attempted to map excluded element ${element.name}`);
  }
  formDefinition.elements[element.name] = getFormDefinitionInputElement(
    element.config,
    modelFieldsConfigs[element.name],
  );
}
/* eslint-enable no-param-reassign */
