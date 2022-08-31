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
import { FormDefinition, StudioForm } from '../../types';
import { mapFormMetadata } from '../../utils/form-component-metadata';
import { getBasicFormDefinition } from '../__utils__/basic-form-definition';

describe('mapFormMetaData', () => {
  it('should not map metadata for sectional elements', () => {
    const formDefinition: FormDefinition = {
      ...getBasicFormDefinition(),
      elements: {
        myHeading: { componentType: 'Heading', props: { level: 2, children: 'Create a Post' } },
        name: { componentType: 'TextField', props: { label: 'Label' }, studioFormComponentType: 'TextField' },
        myText: { componentType: 'Text', props: { children: 'Did you put your name above?' } },
        myDivider: { componentType: 'Divider', props: { orientation: 'horizontal' } },
      },
      elementMatrix: [['myHeading'], ['name'], ['myText'], ['myDivider']],
    };

    const form: StudioForm = {
      name: 'CustomWithSectionalElements',
      formActionType: 'create',
      dataType: {
        dataSourceType: 'Custom',
        dataTypeName: 'Post',
      },
      fields: {
        name: {
          inputType: {
            type: 'TextField',
          },
        },
      },
      sectionalElements: {
        myHeading: {
          position: {
            fixed: 'first',
          },
          type: 'Heading',
          level: 2,
          text: 'Create a Post',
        },
        myText: {
          position: {
            below: 'name',
          },
          type: 'Text',
          text: 'Did you put your name above?',
        },
        myDivider: {
          position: {
            below: 'myText',
          },
          type: 'Divider',
        },
      },
      style: {},
      cta: {},
    };

    const { fieldConfigs } = mapFormMetadata(form, formDefinition);

    expect('name' in fieldConfigs).toBe(true);
    expect('myDivider' in fieldConfigs || 'myText' in fieldConfigs || 'myHeading' in fieldConfigs).toBe(false);
  });
});
