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
  GenericSectionalElementConfig,
  SectionalElementConfig,
  FormDefinitionSectionalElement,
} from '../../types';
import { InternalError, InvalidInputError } from '../../errors';
import { deleteUndefined } from './mapper-utils';
import { FORM_DEFINITION_DEFAULTS } from './defaults';

export function getFormDefinitionSectionalElement(
  config: GenericSectionalElementConfig,
): FormDefinitionSectionalElement {
  const componentType = config.type;

  let formDefinitionElement: FormDefinitionSectionalElement;

  switch (componentType) {
    case 'Text':
      formDefinitionElement = {
        componentType: 'Text',
        props: {
          children: config.text || FORM_DEFINITION_DEFAULTS.sectionalElement.text,
        },
      };
      break;

    case 'Divider':
      formDefinitionElement = {
        componentType: 'Divider',
        props: {
          orientation: config.orientation === 'vertical' ? 'vertical' : 'horizontal',
        },
      };
      break;

    case 'Heading':
      formDefinitionElement = {
        componentType: 'Heading',
        props: {
          level: config.level,
          children: config.text || FORM_DEFINITION_DEFAULTS.sectionalElement.text,
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
 * Impure function that adds sectional elements to the form definition
 */
/* eslint-disable no-param-reassign */
export function mapSectionalElement(
  element: { name: string; config: SectionalElementConfig },
  formDefinition: FormDefinition,
) {
  if (formDefinition.elements[element.name]) {
    throw new InvalidInputError(`There is are form elements with the same name: ${element.name}`);
  }
  if ('excluded' in element.config) {
    throw new InternalError(`Attempted to map excluded sectional element ${element.name}`);
  }
  formDefinition.elements[element.name] = getFormDefinitionSectionalElement(element.config);
}
/* eslint-enable no-param-reassign */
