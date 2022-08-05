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
import { mapElements } from '../../../generate-form-definition/helpers';
import { FormDefinition, SectionalElement, ModelFieldsConfigs, StudioForm } from '../../../types';

describe('mapElements', () => {
  it('should map sectional elements & input elements with and without overrides', () => {
    const sectionalConfig: SectionalElement = {
      type: 'Text',
      text: 'MyText',
      position: { fixed: 'first' },
    };

    const formDefinition: FormDefinition = {
      form: { layoutStyle: {} },
      elements: {},
      buttons: {},
      elementMatrix: [['myText', 'name'], ['price']],
    };

    const modelFieldsConfigs: ModelFieldsConfigs = {
      price: {
        label: 'price',
        inputType: {
          type: 'TextField',
          readOnly: false,
          required: false,
        },
      },
      weight: {
        label: 'weight',
        inputType: { type: 'TextField' },
      },
    };

    const form: StudioForm = {
      id: '123',
      name: 'sampleForm',
      formActionType: 'create',
      dataType: { dataSourceType: 'DataStore', dataTypeName: 'Dog' },
      fields: { name: { inputType: { type: 'TextField' } } },
      sectionalElements: { myText: sectionalConfig },
      style: {},
      ctaConfig: {},
    };

    mapElements({ formDefinition, modelFieldsConfigs, form });
    expect(formDefinition.elements).toStrictEqual({
      myText: { componentType: 'Text', props: { children: 'MyText' } },
      name: { componentType: 'TextField', props: { label: 'Label' }, studioFormComponentType: 'TextField' },
      price: {
        componentType: 'TextField',
        props: { label: 'price', isRequired: false, isReadOnly: false },
        studioFormComponentType: 'TextField',
      },
    });

    expect('weight' in formDefinition.elements).toBe(false);
  });

  it('should throw if config for element not found', () => {
    const formDefinition: FormDefinition = {
      form: { layoutStyle: {} },
      elements: {},
      buttons: {},
      elementMatrix: [['myText']],
    };

    const modelFieldsConfigs: ModelFieldsConfigs = {};

    const form: StudioForm = {
      id: '123',
      name: 'sampleForm',
      formActionType: 'create',
      dataType: { dataSourceType: 'DataStore', dataTypeName: 'Dog' },
      fields: {},
      sectionalElements: {},
      style: {},
      ctaConfig: {},
    };

    expect(() => mapElements({ formDefinition, modelFieldsConfigs, form })).toThrow();
  });
});
