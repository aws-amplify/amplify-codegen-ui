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
import { FormDefinition } from '../../../types';
import { mapFormDefinitionToComponent } from '../../../utils/form-to-component';
import { getBasicFormDefinition } from '../../__utils__/basic-form-definition';

describe('mapFormDefinitionToComponent', () => {
  it('should map options for RadioGroupField', () => {
    const formDefinition: FormDefinition = {
      ...getBasicFormDefinition(),
      elements: {
        city: {
          componentType: 'RadioGroupField',
          props: { label: 'City', name: 'city' },
          valueMappings: {
            bindingProperties: {},
            values: [
              { value: { value: 'NEW_YORK' }, displayValue: { value: 'New York' } },
              { value: { value: 'SAN_FRANCISCO' } },
            ],
          },
        },
      },
      elementMatrix: [['city']],
    };

    const radioGroupField = mapFormDefinitionToComponent('CreateDog', formDefinition).children?.[0];

    expect(radioGroupField?.children).toStrictEqual([
      {
        name: 'cityRadio0',
        componentType: 'Radio',
        properties: { children: { value: 'New York' }, value: { value: 'NEW_YORK' } },
      },
      {
        name: 'cityRadio1',
        componentType: 'Radio',
        properties: { children: { value: 'SAN_FRANCISCO' }, value: { value: 'SAN_FRANCISCO' } },
      },
    ]);
  });

  it('should map options for SelectField', () => {
    const formDefinition: FormDefinition = {
      ...getBasicFormDefinition(),
      elements: {
        city: {
          componentType: 'SelectField',
          props: { label: 'City' },
          defaultValue: 'NEW_YORK',
          valueMappings: {
            bindingProperties: {},
            values: [
              { value: { value: 'NEW_YORK' }, displayValue: { value: 'New York' } },
              { value: { value: 'SAN_FRANCISCO' } },
            ],
          },
        },
      },
      elementMatrix: [['city']],
    };

    const selectField = mapFormDefinitionToComponent('CreateDog', formDefinition).children?.[0];

    expect(selectField?.children).toStrictEqual([
      {
        name: 'cityoption0',
        componentType: 'option',
        properties: { children: { value: 'New York' }, value: { value: 'NEW_YORK' }, selected: { value: true } },
      },
      {
        name: 'cityoption1',
        componentType: 'option',
        properties: { children: { value: 'SAN_FRANCISCO' }, value: { value: 'SAN_FRANCISCO' } },
      },
    ]);
  });
});
