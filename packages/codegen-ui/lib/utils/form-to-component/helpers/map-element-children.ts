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
  FormDefinitionElement,
  FormDefinitionRadioGroupFieldElement,
  FormDefinitionSelectFieldElement,
  StudioComponentChild,
} from '../../../types';

type MapElementChildrenReturnValue = { children: StudioComponentChild[] };

function mapOptions(
  elementName: string,
  element: FormDefinitionSelectFieldElement | FormDefinitionRadioGroupFieldElement,
): { children: StudioComponentChild[] } {
  const options = element.valueMappings.values.map(({ displayValue, value }, index) => {
    const optionType = element.componentType === 'RadioGroupField' ? 'Radio' : 'option';

    const option: StudioComponentChild = {
      name: `${elementName}${optionType}${index}`,
      componentType: optionType,
      properties: {
        children: displayValue ?? value,
        value,
      },
    };

    if (element.componentType === 'SelectField' && 'value' in value && value.value === element.defaultValue) {
      option.properties.selected = { value: true };
    }

    return option;
  });

  return { children: options };
}

export function mapElementChildren(elementName: string, element: FormDefinitionElement): MapElementChildrenReturnValue {
  switch (element.componentType) {
    case 'SelectField':
    case 'RadioGroupField':
      return mapOptions(elementName, element);

    default:
      return { children: [] };
  }
}
