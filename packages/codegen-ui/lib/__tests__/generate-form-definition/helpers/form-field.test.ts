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

import { mapFormFieldConfig } from '../../../generate-form-definition/helpers';
import { FormDefinition, StudioFormFieldConfig } from '../../../types';

describe('mapFormFieldConfig', () => {
  it('should map properties onto an existing field', () => {
    const element: { type: string; name: string; config: StudioFormFieldConfig } = {
      type: 'field',
      name: 'price',
      config: {
        label: 'Price',
        position: { fixed: 'first' },
        inputType: {
          type: 'SliderField',
          minValue: 0,
          maxValue: 100,
          step: 1,
          readOnly: true,
          required: false,
        },
      },
    };

    const formDefinition: FormDefinition = {
      form: { props: { layoutStyle: {} } },
      elements: {
        price: {
          componentType: 'TextField',
          dataType: 'Int',
          props: { label: 'price', isReadOnly: false, isRequired: true },
        },
      },
      buttons: {},
      elementMatrix: [['price']],
    };

    mapFormFieldConfig(element, formDefinition);

    expect(formDefinition.elements.price).toStrictEqual({
      componentType: 'SliderField',
      dataType: 'Int',
      props: { label: 'Price', isReadOnly: true, isRequired: false, minValue: 0, maxValue: 100, step: 1 },
    });
  });

  it('should map fields that do not yet exist', () => {
    const element: { type: string; name: string; config: StudioFormFieldConfig } = {
      type: 'field',
      name: 'price',
      config: {
        label: 'Price',
        position: { fixed: 'first' },
        inputType: {
          type: 'SliderField',
          minValue: 0,
          maxValue: 100,
          step: 1,
          readOnly: true,
          required: false,
        },
      },
    };

    const formDefinition: FormDefinition = {
      form: { props: { layoutStyle: {} } },
      elements: {},
      buttons: {},
      elementMatrix: [['price']],
    };

    mapFormFieldConfig(element, formDefinition);

    expect(formDefinition.elements.price).toStrictEqual({
      componentType: 'SliderField',
      props: { label: 'Price', isReadOnly: true, isRequired: false, minValue: 0, maxValue: 100, step: 1 },
    });
  });

  it('should throw if input type is not valid for the data type', () => {
    const element: { type: string; name: string; config: StudioFormFieldConfig } = {
      type: 'field',
      name: 'price',
      config: {
        inputType: {
          type: 'RadioGroupField',
          valueMappings: [],
        },
      },
    };

    const formDefinition: FormDefinition = {
      form: { props: { layoutStyle: {} } },
      elements: {
        price: {
          componentType: 'TextField',
          dataType: 'Int',
          props: { label: 'price', isReadOnly: false, isRequired: true },
        },
      },
      buttons: {},
      elementMatrix: [['price']],
    };

    expect(() => mapFormFieldConfig(element, formDefinition)).toThrow();
  });
});
