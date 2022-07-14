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
import { FormDefinition, ModelFieldsConfigs, StudioForm } from '../../types';
import { InternalError } from '../../errors';
/**
 * Impure function that maps element to the form definition
 */
export function mapElements({
  formDefinition,
  modelFieldsConfigs,
  form,
}: {
  form: StudioForm;
  formDefinition: FormDefinition;
  modelFieldsConfigs: ModelFieldsConfigs;
}) {
  formDefinition.elementMatrix.forEach((row) => {
    row.forEach((elementName) => {
      if (form.fields[elementName]) {
        mapFormFieldConfig({ name: elementName, config: form.fields[elementName] }, formDefinition, modelFieldsConfigs);
      } else if (modelFieldsConfigs[elementName]) {
        mapFormFieldConfig({ name: elementName, config: modelFieldsConfigs[elementName] }, formDefinition, {});
      } else if (form.sectionalElements[elementName]) {
        mapSectionalElement({ name: elementName, config: form.sectionalElements[elementName] }, formDefinition);
      } else {
        throw new InternalError(`${elementName} could not be found`);
      }
    });
  });
}
