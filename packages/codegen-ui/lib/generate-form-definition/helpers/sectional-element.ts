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
import { FormDefinition, SectionalElement, FormDefinitionElementProps } from '../../types';
import { InvalidInputError } from '../../errors';

/**
 * Impure function that adds sectional elements to the form definition
 */
/* eslint-disable no-param-reassign */
export function mapSectionalElement(
  element: { type: string; name: string; config: SectionalElement },
  formDefinition: FormDefinition,
) {
  if (formDefinition.elements[element.name]) {
    throw new InvalidInputError(`There is are form elements with the same name: ${element.name}`);
  }

  const props: FormDefinitionElementProps = {};

  if ('level' in element.config) {
    props.level = element.config.level;
  }

  if ('text' in element.config) {
    props.text = element.config.text;
  }

  formDefinition.elements[element.name] = { componentType: element.config.type, props };
}
/* eslint-enable no-param-reassign */
