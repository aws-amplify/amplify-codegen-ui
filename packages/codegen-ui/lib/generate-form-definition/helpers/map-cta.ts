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
  StudioFormCTA,
  ButtonConfig,
  StudioFormCTAButton,
  FormDefinitionButtonElement,
  StudioFormActionType,
} from '../../types';

function getButtonElement(
  key: 'cancel' | 'clear' | 'submit',
  formActionType: StudioFormActionType,
  override?: StudioFormCTAButton,
): FormDefinitionButtonElement | undefined {
  const resetLabel = formActionType === 'create' ? 'Clear' : 'Reset';

  const buttonMap = {
    cancel: {
      name: 'CancelButton',
      type: 'button',
      label: 'Cancel',
    },
    clear: {
      name: `${resetLabel}Button`,
      type: 'reset',
      label: resetLabel,
    },
    submit: {
      name: 'SubmitButton',
      type: 'submit',
      variation: 'primary',
      label: 'Submit',
    },
  };

  const element: FormDefinitionButtonElement = {
    name: buttonMap[key].name,
    componentType: 'Button',
    props: {
      children: buttonMap[key].label,
      type: buttonMap[key].type,
    },
  };

  if (typeof override === 'object' && 'children' in override && override.children) {
    element.props.children = override.children;
  }

  if (key === 'submit') {
    element.props.variation = buttonMap[key].variation;
  }

  return element;
}

// TODO: temporary logic. it should take reordering into consideration
function mapMatrix(buttons?: StudioFormCTA): string[][] {
  const matrix: ('clear' | 'cancel' | 'submit')[][] = [['clear'], ['cancel', 'submit']];
  if (!buttons) {
    return matrix;
  }

  return matrix.map((subArray) => {
    return subArray.filter((element) => {
      if (
        typeof buttons[element] === 'object' &&
        'excluded' in (buttons[element] as StudioFormCTAButton) &&
        (buttons[element] as { excluded: boolean }).excluded
      ) {
        return false;
      }
      // remove cancel by default if there is no defined value for it
      if (element === 'cancel' && !buttons?.cancel) {
        return false;
      }
      return true;
    });
  });
}

export function mapButtons(formActionType: StudioFormActionType, buttons?: StudioFormCTA): ButtonConfig {
  const buttonMapping: ButtonConfig = {
    position: buttons?.position ?? 'bottom',
    buttonMatrix: mapMatrix(buttons),
    buttonConfigs: {},
  };

  const keys: (keyof ButtonConfig['buttonConfigs'])[] = ['submit', 'cancel', 'clear'];

  keys.forEach((key) => {
    buttonMapping.buttonConfigs[key] = getButtonElement(key, formActionType, buttons?.[key]);
  });

  return buttonMapping;
}
