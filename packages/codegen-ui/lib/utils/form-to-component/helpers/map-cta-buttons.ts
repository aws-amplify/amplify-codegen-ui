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
import { StudioComponentChild, FormDefinition } from '../../../types';
import { FormDefinitionButtonElement } from '../../../types/form/form-definition-element';

function getButtonChild(
  key: string,
  buttonConfigs: { [key: string]: FormDefinitionButtonElement },
): StudioComponentChild | undefined {
  const buttonElement = buttonConfigs[key];
  if (buttonElement) {
    return {
      name: buttonElement.name,
      componentType: buttonElement.componentType,
      properties: Object.fromEntries(
        Object.entries(buttonElement.props).map(([propKey, value]) => {
          return [propKey, { value }];
        }),
      ),
    };
  }
  return undefined;
}

export const ctaButtonMapper = (formDefinition: FormDefinition): StudioComponentChild => {
  const CTAComponent: StudioComponentChild = {
    name: 'CTAFlex',
    componentType: 'Flex',
    properties: {
      justifyContent: {
        value: 'space-between',
      },
    },
    children: [],
  };

  formDefinition.buttons.buttonMatrix[0].forEach((buttonKey) => {
    const buttonChild = getButtonChild(buttonKey, formDefinition.buttons.buttonConfigs);

    if (buttonChild) {
      CTAComponent.children?.push(buttonChild);
    }
  });

  const rightAlignCTA: StudioComponentChild = {
    componentType: 'Flex',
    name: 'RightAlignCTASubFlex',
    properties: {},
    children: [],
  };

  formDefinition.buttons.buttonMatrix[1].forEach((buttonKey) => {
    const buttonChild = getButtonChild(buttonKey, formDefinition.buttons.buttonConfigs);

    if (buttonChild) {
      rightAlignCTA.children?.push(buttonChild);
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
    case 'top_and_bottom':
      updatedFormChildren.splice(0, 0, buttons);
      updatedFormChildren.splice(formChildren.length, 0, buttons);
      break;
    default:
      updatedFormChildren.splice(formChildren.length, 0, buttons);
      break;
  }

  return updatedFormChildren;
};
