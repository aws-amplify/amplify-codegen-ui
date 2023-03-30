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
  ModelFieldsConfigs,
  StudioFormFieldConfig,
  StudioFormValueMappings,
  FieldValidationConfiguration,
  ValidationTypes,
  DataFieldDataType,
  StorageAccessLevel,
} from '../../types';
import { InternalError, InvalidInputError } from '../../errors';
import { FORM_DEFINITION_DEFAULTS } from './defaults';
import { deleteUndefined, getFirstDefinedValue, getFirstNumber, getFirstString } from './mapper-utils';
import { ExtendedStudioGenericFieldConfig } from '../../types/form/form-definition';
import { isNonModelDataType } from '../../check-support';

export function mergeValueMappings(
  base?: StudioFormValueMappings,
  override?: StudioFormValueMappings,
): StudioFormValueMappings {
  // if model-based
  if (base?.bindingProperties || override?.bindingProperties) {
    // if overrides present, autogen'd mappings will be passed as base
    // else, as override
    const autoGendValueMappings = base || override;
    if (autoGendValueMappings) {
      const { values } = autoGendValueMappings;
      // only use displayValue from overrides
      // rest should be autogend
      if (base && override?.values[0]?.displayValue) {
        values[0].displayValue = override.values[0].displayValue;
      }

      return {
        values,
        bindingProperties: autoGendValueMappings.bindingProperties,
      };
    }
  }

  // if not model-based
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
  };
}

function getRadioGroupFieldValueMappings(
  config: ExtendedStudioGenericFieldConfig,
  baseConfig?: ExtendedStudioGenericFieldConfig,
): StudioFormValueMappings {
  const valueMappings: StudioFormValueMappings =
    baseConfig?.inputType?.valueMappings?.values.length || config?.inputType?.valueMappings?.values.length
      ? mergeValueMappings(baseConfig?.inputType?.valueMappings, config.inputType?.valueMappings)
      : FORM_DEFINITION_DEFAULTS.field.inputType.valueMappings;

  const dataType = config.dataType ?? baseConfig?.dataType;
  if (dataType === 'Boolean') {
    const trueOverride = valueMappings.values.find(
      ({ value }) => typeof value === 'object' && 'value' in value && value.value === 'true',
    )?.displayValue;
    const falseOverride = valueMappings.values.find(
      ({ value }) => typeof value === 'object' && 'value' in value && value.value === 'false',
    )?.displayValue;

    const {
      field: {
        radioGroupFieldBooleanDisplayValue: { true: trueDefault, false: falseDefault },
      },
    } = FORM_DEFINITION_DEFAULTS;
    return {
      values: [
        { value: { value: 'true' }, displayValue: trueOverride ?? { value: trueDefault } },
        { value: { value: 'false' }, displayValue: falseOverride ?? { value: falseDefault } },
      ],
    };
  }

  return valueMappings;
}

function getRequiredValidationMessage(dataType?: DataFieldDataType): string | undefined {
  if (typeof dataType === 'object' && 'model' in dataType) {
    return `${dataType.model} is required.`;
  }

  return undefined;
}

// pure function that merges in validations in param with defaults
function getMergedValidations(
  componentType: string,
  validations: (FieldValidationConfiguration[] | undefined)[],
  isRequired?: boolean,
  dataType?: DataFieldDataType,
): (FieldValidationConfiguration & { immutable?: true })[] | undefined {
  const mergedValidations: (FieldValidationConfiguration & { immutable?: true })[] = [];
  if (isRequired) {
    const requiredValidation: typeof mergedValidations[0] = { type: ValidationTypes.REQUIRED, immutable: true };
    const requiredValidationMessage = getRequiredValidationMessage(dataType);
    if (requiredValidationMessage) {
      requiredValidation.validationMessage = requiredValidationMessage;
    }
    mergedValidations.push(requiredValidation);
  }

  const ComponentTypeToDefaultValidations: {
    [componentType: string]: (FieldValidationConfiguration & { immutable: true })[];
  } = {
    IPAddressField: [{ type: ValidationTypes.IP_ADDRESS, immutable: true }],
    URLField: [{ type: ValidationTypes.URL, immutable: true }],
    EmailField: [{ type: ValidationTypes.EMAIL, immutable: true }],
    JSONField: [{ type: ValidationTypes.JSON, immutable: true }],
    PhoneNumberField: [{ type: ValidationTypes.PHONE, immutable: true }],
  };

  const defaultValidation = ComponentTypeToDefaultValidations[componentType];

  if (isNonModelDataType(dataType)) {
    mergedValidations.push({ type: ValidationTypes.JSON, immutable: true });
  } else if (defaultValidation) {
    mergedValidations.push(...defaultValidation);
  }

  validations.forEach((validationArray) => {
    if (validationArray) {
      mergedValidations.push(...validationArray);
    }
  });

  return mergedValidations.length ? mergedValidations : undefined;
}

function getTextFieldType(componentType: string): string | undefined {
  const ComponentToTypeMap: { [key: string]: string } = {
    NumberField: 'number',
    DateField: 'date',
    TimeField: 'time',
    DateTimeField: 'datetime-local',
    PhoneNumberField: 'tel',
  };
  return ComponentToTypeMap[componentType];
}

/**
 * pure function that maps fieldConfig to definition Element
 */

export function getFormDefinitionInputElement(
  config: ExtendedStudioGenericFieldConfig,
  baseConfig?: ExtendedStudioGenericFieldConfig,
): FormDefinitionInputElement {
  let componentType = config.inputType?.type || baseConfig?.inputType?.type;

  if (!componentType) {
    // Gracefully fall back to a TextField if the inputType is no longer available due to a field rename
    componentType = 'TextField';
  }

  const defaultStringValue = getFirstString([config.inputType?.defaultValue, baseConfig?.inputType?.defaultValue]);
  const isRequiredValue = getFirstDefinedValue([config.inputType?.required, baseConfig?.inputType?.required]);

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
    case 'PhoneNumberField':
      formDefinitionElement = {
        componentType: 'TextField',
        props: {
          label: config.label || baseConfig?.label || FORM_DEFINITION_DEFAULTS.field.inputType.label,
          descriptiveText: config.inputType?.descriptiveText ?? baseConfig?.inputType?.descriptiveText,
          isRequired: isRequiredValue,
          isReadOnly: getFirstDefinedValue([config.inputType?.readOnly, baseConfig?.inputType?.readOnly]),
          placeholder: config.inputType?.placeholder || baseConfig?.inputType?.placeholder,
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
          defaultChecked:
            getFirstDefinedValue([config.inputType?.defaultChecked, baseConfig?.inputType?.defaultChecked]) || false,
          isDisabled: getFirstDefinedValue([config.inputType?.readOnly, baseConfig?.inputType?.readOnly]),
        },
      };

      break;
    /**
     * TODO: Implement PhoneNumberField after UI Library supports
     * a controlled PhoneNumberField component
     * https://github.com/aws-amplify/amplify-ui/issues/2671
     */

    case 'SelectField':
      formDefinitionElement = {
        componentType: 'SelectField',
        props: {
          label: config.label || baseConfig?.label || FORM_DEFINITION_DEFAULTS.field.inputType.label,
          descriptiveText: config.inputType?.descriptiveText ?? baseConfig?.inputType?.descriptiveText,
          placeholder: config.inputType?.placeholder || baseConfig?.inputType?.placeholder || 'Please select an option',
          isDisabled: getFirstDefinedValue([config.inputType?.readOnly, baseConfig?.inputType?.readOnly]),
        },

        defaultValue: defaultStringValue,
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
          isRequired: isRequiredValue,
          isReadOnly: getFirstDefinedValue([config.inputType?.readOnly, baseConfig?.inputType?.readOnly]),
          placeholder: config.inputType?.placeholder || baseConfig?.inputType?.placeholder,
          defaultValue: defaultStringValue,
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
          isRequired: isRequiredValue,
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
          isRequired: isRequiredValue,
        },
      };

      break;

    case 'ToggleButton':
      formDefinitionElement = {
        componentType: 'ToggleButton',
        props: {
          children: config.label || baseConfig?.label || FORM_DEFINITION_DEFAULTS.field.inputType.label,
          isDisabled: getFirstDefinedValue([config.inputType?.readOnly, baseConfig?.inputType?.readOnly]),
          defaultPressed:
            getFirstDefinedValue([config.inputType?.defaultChecked, baseConfig?.inputType?.defaultChecked]) || false,
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
          defaultValue: defaultStringValue,
          descriptiveText: config.inputType?.descriptiveText ?? baseConfig?.inputType?.descriptiveText,
          isRequired: isRequiredValue,
        },
        valueMappings: getRadioGroupFieldValueMappings(config, baseConfig),
      };
      break;

    case 'PasswordField':
      formDefinitionElement = {
        componentType: 'PasswordField',
        props: {
          label: config.label || baseConfig?.label || FORM_DEFINITION_DEFAULTS.field.inputType.label,
          descriptiveText: config.inputType?.descriptiveText ?? baseConfig?.inputType?.descriptiveText,
          isRequired: isRequiredValue,
          isReadOnly: getFirstDefinedValue([config.inputType?.readOnly, baseConfig?.inputType?.readOnly]),
          placeholder: config.inputType?.placeholder || baseConfig?.inputType?.placeholder,
          defaultValue: defaultStringValue,
        },
      };
      break;

    case 'Autocomplete':
      formDefinitionElement = {
        componentType: 'Autocomplete',
        props: {
          label: config.label || baseConfig?.label || FORM_DEFINITION_DEFAULTS.field.inputType.label,
          descriptiveText: config.inputType?.descriptiveText ?? baseConfig?.inputType?.descriptiveText,
          isRequired: isRequiredValue,
          isReadOnly: getFirstDefinedValue([config.inputType?.readOnly, baseConfig?.inputType?.readOnly]),
          placeholder: config.inputType?.placeholder || baseConfig?.inputType?.placeholder,
          defaultValue: defaultStringValue,
        },
        valueMappings: mergeValueMappings(baseConfig?.inputType?.valueMappings, config.inputType?.valueMappings),
      };
      break;

    case 'StorageField':
      formDefinitionElement = {
        componentType: 'StorageField',
        props: {
          label: config.label || baseConfig?.label || FORM_DEFINITION_DEFAULTS.field.inputType.label,
          descriptiveText: config.inputType?.descriptiveText ?? baseConfig?.inputType?.descriptiveText,
          isRequired: isRequiredValue,
          isReadOnly: getFirstDefinedValue([config.inputType?.readOnly, baseConfig?.inputType?.readOnly]),
          defaultValue: defaultStringValue,

          accessLevel: getFirstDefinedValue([
            config.inputType?.fileUploaderConfig?.accessLevel,
            baseConfig?.inputType?.fileUploaderConfig?.accessLevel,
            FORM_DEFINITION_DEFAULTS.field.inputType.fileUploaderConfig.accessLevel,
          ]) as StorageAccessLevel,
          acceptedFileTypes: getFirstDefinedValue([
            config.inputType?.fileUploaderConfig?.acceptedFileTypes,
            baseConfig?.inputType?.fileUploaderConfig?.acceptedFileTypes,
            FORM_DEFINITION_DEFAULTS.field.inputType.fileUploaderConfig.acceptedFileTypes,
          ]) as string[],
          isResumable: getFirstDefinedValue([
            config.inputType?.fileUploaderConfig?.isResumable,
            baseConfig?.inputType?.fileUploaderConfig?.isResumable,
            FORM_DEFINITION_DEFAULTS.field.inputType.fileUploaderConfig.isResumable,
          ]),
          showThumbnails: getFirstDefinedValue([
            config.inputType?.fileUploaderConfig?.showThumbnails,
            baseConfig?.inputType?.fileUploaderConfig?.showThumbnails,
            FORM_DEFINITION_DEFAULTS.field.inputType.fileUploaderConfig.showThumbnails,
          ]),
          maxFileCount: getFirstDefinedValue([
            config.inputType?.fileUploaderConfig?.maxFileCount,
            baseConfig?.inputType?.fileUploaderConfig?.maxFileCount,
          ]),
          maxSize: getFirstDefinedValue([
            config.inputType?.fileUploaderConfig?.maxSize,
            baseConfig?.inputType?.fileUploaderConfig?.maxSize,
          ]),
        },
      };
      break;

    default:
      throw new InvalidInputError(`componentType ${componentType} could not be mapped`);
  }

  const mergedValidations = getMergedValidations(
    componentType,
    [baseConfig?.validations, config?.validations],
    isRequiredValue,
    config?.dataType ?? baseConfig?.dataType,
  );

  formDefinitionElement.validations = mergedValidations;
  formDefinitionElement.dataType = config?.dataType || baseConfig?.dataType;
  formDefinitionElement.isArray = baseConfig ? baseConfig.inputType?.isArray : config.inputType?.isArray;
  formDefinitionElement.relationship = config.relationship ?? baseConfig?.relationship;

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
  if (typeof element.config === 'object' && 'excluded' in element.config) {
    throw new InternalError(`Attempted to map excluded element ${element.name}`);
  }
  formDefinition.elements[element.name] = getFormDefinitionInputElement(
    element.config,
    modelFieldsConfigs[element.name],
  );
}
/* eslint-enable no-param-reassign */
