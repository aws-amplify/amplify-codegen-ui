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
import { FORM_DEFINITION_DEFAULTS } from './defaults';
import { StudioFormCTA, ButtonConfig, StudioFormCTAButton, FormDefinitionButtonElement } from '../../types';

function getButtonElement(
  key: 'cancel' | 'clear' | 'submit',
  override?: StudioFormCTAButton,
): FormDefinitionButtonElement | undefined {
  if (override && 'excluded' in override) {
    return undefined;
  }

  const ButtonMap = {
    cancel: {
      name: 'CancelButton',
      type: 'button',
    },
    clear: {
      name: 'ClearButton',
      type: 'reset',
    },
    submit: {
      name: 'SubmitButton',
      type: 'submit',
      variation: 'primary',
    },
  };

  const { cta: defaults } = FORM_DEFINITION_DEFAULTS;

  const element: FormDefinitionButtonElement = {
    name: ButtonMap[key].name,
    componentType: 'Button',
    props: {
      children: override?.children ?? defaults[key].label,
      type: ButtonMap[key].type,
    },
  };

  if (key === 'submit') {
    element.props.variation = ButtonMap[key].variation;
  }

  return element;
}

export function mapButtons(buttons?: StudioFormCTA): ButtonConfig {
  const defaults = FORM_DEFINITION_DEFAULTS.cta;

  const buttonMapping: ButtonConfig = {
    position: buttons?.position ?? defaults.position,
    buttonMatrix: defaults.buttonMatrix,
    buttonConfigs: {},
  };

  const keys: (keyof ButtonConfig['buttonConfigs'])[] = ['submit', 'cancel', 'clear'];

  keys.forEach((key) => {
    buttonMapping.buttonConfigs[key] = getButtonElement(key, buttons?.[key]);
  });

  return buttonMapping;
}
