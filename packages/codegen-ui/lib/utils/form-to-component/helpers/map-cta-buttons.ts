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
import { StudioComponentChild, FormDefinition, ButtonConfig } from '../../../types';
import { FormDefinitionButtonElement } from '../../../types/form/form-definition-element';

const mapButtonPosition = (buttonElement: FormDefinitionButtonElement): StudioComponentChild => {
  return {
    componentType: buttonElement.componentType,
    name: buttonElement.name,
    properties: {
      children: {
        value: buttonElement.props.children,
      },
      type: {
        value: buttonElement.props.type ? buttonElement.props.type : 'button',
      },
      ...(buttonElement.props.variation && { variation: { value: buttonElement.props.variation } }),
    },
  };
};

const mapButtonNameToConfig = (name: string, config: ButtonConfig) => {
  if (name === 'clear') {
    return config.buttonConfigs.clear;
  }
  if (name === 'cancel') {
    return config.buttonConfigs.cancel;
  }
  return config.buttonConfigs.submit;
};

export const ctaButtonMapper = (formDefinition: FormDefinition): StudioComponentChild => {
  const CTAComponent: StudioComponentChild = {
    name: 'CTAFlex',
    componentType: 'Flex',
    properties: {
      justifyContent: {
        value: 'space-between',
      },
      marginTop: {
        value: '1rem',
      },
    },
    children: [],
  };

  formDefinition.buttons.buttonMatrix[0].forEach((button) => {
    if (Object.keys(formDefinition.buttons.buttonConfigs).includes(button)) {
      const config = mapButtonNameToConfig(button, formDefinition.buttons);
      if (config) {
        const buttonDefinition = mapButtonPosition(config);
        CTAComponent.children?.push(buttonDefinition);
      }
    }
  });

  const rightAlignCTA: StudioComponentChild = {
    componentType: 'Flex',
    name: 'SubmitAndResetFlex',
    properties: {},
    children: [],
  };

  formDefinition.buttons.buttonMatrix[1].forEach((button) => {
    if (Object.keys(formDefinition.buttons.buttonConfigs).includes(button)) {
      const config = mapButtonNameToConfig(button, formDefinition.buttons);
      if (config) {
        const buttonDefinition = mapButtonPosition(config);
        rightAlignCTA.children?.push(buttonDefinition);
      }
    }
  });

  CTAComponent.children?.push(rightAlignCTA);

  return CTAComponent;
};

export const addCTAPosition = (
  formChildren: StudioComponentChild[],
  position: string,
  buttons: StudioComponentChild,
) => {
  const updatedFormChildren = formChildren || [];

  switch (position) {
    case 'top':
      updatedFormChildren.splice(0, 0, buttons);
      break;
    case 'bottom':
      updatedFormChildren.splice(formChildren.length, 0, buttons);
      break;
    case 'topAndBottom':
      updatedFormChildren.splice(0, 0, buttons);
      updatedFormChildren.splice(formChildren.length, 0, buttons);
      break;
    default:
      updatedFormChildren.splice(formChildren.length, 0, buttons);
      break;
  }

  return updatedFormChildren;
};
