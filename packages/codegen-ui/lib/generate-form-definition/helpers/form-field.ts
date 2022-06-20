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
import { FormDefinition, StudioFormFieldConfig } from '../../types';
import { FIELD_TYPE_MAP } from './field-type-map';
import { InvalidInputError } from '../../errors';

/**
 * Impure function that adds field configurations to formDefinition
 */
/* eslint-disable no-param-reassign */
export function mapFormFieldConfig(
  element: { type: string; name: string; config: StudioFormFieldConfig },
  formDefinition: FormDefinition,
) {
  const { config } = element;

  if ('label' in config && config.label) {
    formDefinition.elements[element.name] = {
      ...formDefinition.elements[element.name],
      props: {
        ...formDefinition.elements[element.name]?.props,
        label: config.label,
      },
    };
  }

  if ('inputType' in config && config.inputType) {
    const dataType = formDefinition.elements[element.name]?.dataType;

    if (dataType) {
      if (!FIELD_TYPE_MAP[dataType]?.supportedComponents.has(config.inputType.type)) {
        throw new InvalidInputError(
          `The input type ${config.inputType.type} is not supported for data type ${dataType}`,
        );
      }
    }

    const newProps = { ...formDefinition.elements[element.name]?.props };

    if ('required' in config.inputType) {
      newProps.isRequired = config.inputType.required;
    }

    if ('readOnly' in config.inputType) {
      newProps.isReadOnly = config.inputType.readOnly;
    }

    if ('placeholder' in config.inputType) {
      newProps.placeholder = config.inputType.placeholder;
    }

    if ('minValue' in config.inputType) {
      newProps.minValue = config.inputType.minValue;
    }

    if ('maxValue' in config.inputType) {
      newProps.maxValue = config.inputType.maxValue;
    }

    if ('step' in config.inputType) {
      newProps.step = config.inputType.step;
    }

    formDefinition.elements[element.name] = {
      ...formDefinition.elements[element.name],
      componentType: config.inputType.type,
      props: newProps,
    };
  }
}
/* eslint-enable no-param-reassign */
