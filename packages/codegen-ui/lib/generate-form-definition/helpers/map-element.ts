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

import { mapFormFieldConfig } from './form-field';
import { mapSectionalElement } from './sectional-element';
import { FormDefinition, SectionalElement, StudioGenericFieldConfig, ModelFieldsConfigs } from '../../types';
/**
 * Impure function that maps element to the form definition
 */
export function mapElement(
  element:
    | { type: 'field'; name: string; config: StudioGenericFieldConfig }
    | { type: 'sectionalElement'; name: string; config: SectionalElement },
  formDefinition: FormDefinition,
  modelFieldsConfigs: ModelFieldsConfigs,
) {
  if (element.type === 'field') {
    mapFormFieldConfig(element, formDefinition, modelFieldsConfigs);
  } else if (element.type === 'sectionalElement') {
    mapSectionalElement(element, formDefinition);
  }
}
