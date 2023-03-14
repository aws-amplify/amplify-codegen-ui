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

import { mapModelFieldsConfigs, mapElementMatrix, mapStyles, mapElements, mapButtons } from './helpers';
import {
  StudioForm,
  FormDefinition,
  ModelFieldsConfigs,
  StudioFieldPosition,
  GenericDataSchema,
  FormFeatureFlags,
} from '../types';
import { InvalidInputError } from '../errors';

/**
 * Helper that turns the StudioForm model into definition that can be used to render
 * UI Components in the customer project and shapes representing UI Components in Studio.
 * @param form StudioForm, converted from the API shape.
 * @param modelInfo (Optional) holds type information about the DataStore model fields being represented.
 * @returns a definition that translates to rendered JSX elements.
 */
export function generateFormDefinition({
  form,
  dataSchema,
  featureFlags,
}: {
  form: StudioForm;
  dataSchema?: GenericDataSchema;
  featureFlags?: FormFeatureFlags;
}): FormDefinition {
  const formDefinition: FormDefinition = {
    form: { layoutStyle: mapStyles(form.style), labelDecorator: form.labelDecorator || 'none' },
    elements: {},
    buttons: {
      buttonConfigs: {},
      position: '',
      buttonMatrix: [],
    },
    elementMatrix: [],
  };

  let modelFieldsConfigs: ModelFieldsConfigs = {};

  if (form.dataType.dataSourceType !== 'Custom') {
    if (!dataSchema) {
      throw new InvalidInputError(
        `Data schema is missing for form of data source type ${form.dataType.dataSourceType}`,
      );
    }
    modelFieldsConfigs = mapModelFieldsConfigs({
      dataSchema,
      formDefinition,
      dataTypeName: form.dataType.dataTypeName,
      formActionType: form.formActionType,
      featureFlags,
    });
  }

  const elementQueue: { name: string; position?: StudioFieldPosition; excluded?: boolean }[] = Object.entries(
    form.fields,
  )
    .map(([fieldName, fieldConfig]) => ({
      name: fieldName,
      position: typeof fieldConfig === 'object' && 'position' in fieldConfig ? fieldConfig.position : undefined,
      excluded: typeof fieldConfig === 'object' && 'excluded' in fieldConfig ? fieldConfig.excluded : false,
    }))
    .concat(
      Object.entries(form.sectionalElements).map(([elementName, elementConfig]) => ({
        name: elementName,
        position: 'position' in elementConfig ? elementConfig.position : undefined,
        excluded: 'excluded' in elementConfig ? elementConfig.excluded : false,
      })),
    );

  mapElementMatrix({ elementQueue, formDefinition });

  mapElements({ form, formDefinition, modelFieldsConfigs });

  formDefinition.buttons = mapButtons(form.formActionType, form.cta);

  return formDefinition;
}
