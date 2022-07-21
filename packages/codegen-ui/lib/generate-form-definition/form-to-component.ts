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
import type { SchemaModel, ModelFields } from '@aws-amplify/datastore';
import {
  StudioComponent,
  StudioForm,
  StudioComponentChild,
  StudioComponentProperty,
  DataStoreCreateItemAction,
  DataStoreUpdateItemAction,
  FixedStudioComponentProperty,
} from '../types';

/**
 * TODO: remove once form builder depends more on generic data schema
 */
const isGraphQLScalarType = (obj: any): boolean => {
  return obj && typeof obj !== 'object';
};

// map the datastore schema fields into form fields
export const mapFieldsToForm = (fields: ModelFields) => {
  const formFields: StudioComponentChild[] = [];
  Object.entries(fields).forEach(([fieldName, fieldValue]) => {
    // TODO: expand studio component child to also support other non text fields
    if (isGraphQLScalarType(fieldValue.type) && !fieldValue.isArray) {
      formFields.push({
        name: `${fieldName}Field`,
        componentType: 'TextField',
        properties: {
          name: {
            value: fieldName,
          },
          label: {
            value: fieldName,
          },
          placeholder: {
            value: `${fieldValue.type}`,
          },
          ...(fieldValue.isRequired && {
            required: {
              value: 'true',
              type: 'boolean',
            },
          }),
        },
      });
    }
  });

  return formFields;
};

export const mapParentGrid = (name: string, children: StudioComponentChild[] = []): StudioComponentChild => {
  return {
    name: `${name}Grid`,
    componentType: 'Grid',
    properties: {
      columnGap: {
        value: '1rem',
      },
      rowGap: {
        value: '1rem',
      },
    },
    children,
  };
};

export const ctaButtonConfig = (): StudioComponentChild => {
  return {
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
    children: [
      {
        componentType: 'Button',
        name: 'CancelButton',
        properties: {
          label: {
            value: 'Cancel',
          },
          type: {
            value: 'button',
          },
        },
      },
      {
        componentType: 'Flex',
        name: 'SubmitAndResetFlex',
        properties: {},
        children: [
          {
            componentType: 'Button',
            name: 'ClearButton',
            properties: {
              label: {
                value: 'Clear',
              },
              type: {
                value: 'reset',
              },
            },
          },
          {
            componentType: 'Button',
            name: 'onSubmitDataStore',
            properties: {
              label: {
                value: 'Submit',
              },
              type: {
                value: 'submit',
              },
              variation: {
                value: 'primary',
              },
            },
          },
        ],
      },
    ],
  };
};

export const mapOnSubmitEvent = (
  form: StudioForm,
  childrenFormFields: StudioComponentChild[],
): DataStoreCreateItemAction | DataStoreUpdateItemAction => {
  if (form.formActionType === 'create') {
    return {
      action: 'Amplify.DataStoreCreateItemAction',
      parameters: {
        model: form.dataType.dataTypeName,
        fields: childrenFormFields.reduce(
          (prev: { [propertyName: string]: StudioComponentProperty }, { name, properties }) => {
            return {
              ...prev,
              [(properties.name as any).value]: {
                componentName: name,
                property: 'value',
              },
            };
          },
          {},
        ),
      },
    } as DataStoreCreateItemAction;
  }
  /**
   * TODO: Read DataStore Spec to find CustomPrimaryKey if not ID
   */
  const { value: primaryKey } = childrenFormFields.find(
    ({ properties }) => (properties.name as FixedStudioComponentProperty).value === 'id',
  )?.properties.name as FixedStudioComponentProperty;
  return {
    action: 'Amplify.DataStoreUpdateItemAction',
    parameters: {
      model: form.dataType.dataTypeName,
      id: {
        value: primaryKey || 'id',
      },
    },
  } as DataStoreUpdateItemAction;
};
/**
 * TODO to be removed when form builder depends on generic data schema
 */
export const mapFormToComponent = (form: StudioForm, dataSchema: SchemaModel): StudioComponent => {
  // here we can merge the datastore schema with the form
  // right now it's only creating fields from the existing datastore schema
  // TODO: manage merging fields from form and datastore
  const childrenFormFields = mapFieldsToForm(dataSchema.fields);

  const component: StudioComponent = {
    name: form.name,
    properties: {},
    bindingProperties: {
      onCancel: { type: 'Event' },
    },
    events: {
      onSubmit: mapOnSubmitEvent(form, childrenFormFields),
    },
    // codegen will default to rendering the component with this name
    componentType: 'form',
    children: [mapParentGrid(form.name, childrenFormFields), ctaButtonConfig()],
  };

  return component;
};
