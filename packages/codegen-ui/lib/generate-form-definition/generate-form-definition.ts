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
  findIndices,
  addDataStoreModelFields,
  removeFromMatrix,
  removeAndReturnItemOnward,
  mapStyles,
  mapElement,
  mapMissingConfigs,
} from './helpers';
import {
  StudioForm,
  SectionalElement,
  StudioFormFieldConfig,
  FormDefinition,
  StudioGenericFieldConfig,
  ModelFieldsConfigs,
  Schema,
} from '../types';

/**
 * Helper that turns the StudioForm model into definition that can be used to render
 * UI Components in the customer project and shapes representing UI Components in Studio.
 * @param form StudioForm, converted from the API shape.
 * @param modelInfo (Optional) holds type information about the DataStore model fields being represented.
 * @returns a definition that translates to rendered JSX elements.
 */
export function generateFormDefinition({
  form,
  dataStore,
}: {
  form: StudioForm;
  dataStore?: { schema: Schema };
}): FormDefinition {
  const formDefinition: FormDefinition = {
    form: { layoutStyle: {} },
    elements: {},
    buttons: {},
    elementMatrix: [],
  };

  const modelFieldsConfigs: ModelFieldsConfigs = {};
  if (dataStore && form.dataType.dataSourceType === 'DataStore') {
    addDataStoreModelFields({
      formDefinition,
      schema: dataStore.schema,
      modelFieldsConfigs,
      modelName: form.dataType.dataTypeName,
    });
  }

  const elementQueue: { type: string; name: string; config: SectionalElement | StudioFormFieldConfig }[] =
    Object.entries(form.fields)
      .map(([fieldName, fieldConfig]) => ({ type: 'field', name: fieldName, config: fieldConfig }))
      .concat(
        Object.entries(form.sectionalElements).map(([elementName, elementConfig]) => ({
          type: 'sectionalElement',
          name: elementName,
          config: elementConfig,
        })),
      );

  const rightOfElementQueue: typeof elementQueue = [];

  // map elements with no position; position below; position fixed to first
  while (elementQueue.length) {
    const element = elementQueue.shift();
    if (!element) {
      break;
    }
    if ('excluded' in element.config && element.config.excluded) {
      const previousIndices = findIndices(element.name, formDefinition.elementMatrix);

      if (previousIndices) {
        removeFromMatrix(previousIndices, formDefinition);
      }
    } else if ('position' in element.config && element.config.position && 'rightOf' in element.config.position) {
      rightOfElementQueue.push(element);
    } else {
      // typecasting since ExcludedStudioFieldConfig is filtered out
      mapElement(
        element as
          | { type: 'field'; name: string; config: StudioGenericFieldConfig }
          | { type: 'sectionalElement'; name: string; config: SectionalElement },
        formDefinition,
        modelFieldsConfigs,
      );
      if (
        'position' in element.config &&
        element.config.position &&
        'below' in element.config.position &&
        element.config.position.below
      ) {
        const relationIndices = findIndices(element.config.position.below, formDefinition.elementMatrix);
        if (!relationIndices) {
          elementQueue.push(element);
        } else {
          const previousIndices = findIndices(element.name, formDefinition.elementMatrix);
          if (previousIndices) {
            removeFromMatrix(previousIndices, formDefinition);
          }
          formDefinition.elementMatrix.splice(relationIndices[0] + 1, 0, [element.name]);
        }
      } else if (
        'position' in element.config &&
        element.config.position &&
        'fixed' in element.config.position &&
        element.config.position.fixed === 'first'
      ) {
        const previousIndices = findIndices(element.name, formDefinition.elementMatrix);
        if (previousIndices) {
          removeFromMatrix(previousIndices, formDefinition);
        }
        formDefinition.elementMatrix.unshift([element.name]);
      } else {
        const previousIndices = findIndices(element.name, formDefinition.elementMatrix);
        if (!previousIndices) {
          formDefinition.elementMatrix.push([element.name]);
        }
      }
    }
  }

  // map elements with rightOf position
  while (rightOfElementQueue.length) {
    const element = rightOfElementQueue.shift();
    if (!element) {
      break;
    }
    if (
      'position' in element.config &&
      element.config.position &&
      'rightOf' in element.config.position &&
      element.config.position.rightOf
    ) {
      const relationIndices = findIndices(element.config.position.rightOf, formDefinition.elementMatrix);
      if (!relationIndices) {
        rightOfElementQueue.push(element);
      } else {
        // typecasting since ExcludedStudioFieldConfig is filtered out
        mapElement(
          element as
            | { type: 'field'; name: string; config: StudioGenericFieldConfig }
            | { type: 'sectionalElement'; name: string; config: SectionalElement },
          formDefinition,
          modelFieldsConfigs,
        );
        const previousIndices = findIndices(element.name, formDefinition.elementMatrix);
        if (previousIndices) {
          const removedItems = removeAndReturnItemOnward(previousIndices, formDefinition);
          formDefinition.elementMatrix[relationIndices[0]].splice(relationIndices[1] + 1, 0, ...removedItems);
        } else {
          formDefinition.elementMatrix[relationIndices[0]].splice(relationIndices[1] + 1, 0, element.name);
        }
      }
    }
  }

  mapMissingConfigs(modelFieldsConfigs, formDefinition);

  formDefinition.form.layoutStyle = mapStyles(form.style);

  formDefinition.elementMatrix = formDefinition.elementMatrix.filter((row) => row.length);

  return formDefinition;
}
