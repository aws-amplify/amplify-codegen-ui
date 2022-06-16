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

import { mapSectionalElement } from '../../../generate-form-definition/helpers';
import { FormDefinition, SectionalElement } from '../../../types';

describe('mapSectionalElement', () => {
  it('should throw if there is already an element with the same name', () => {
    const formDefinition: FormDefinition = {
      form: { props: { layoutStyle: {} } },
      elements: { Heading123: { componentType: 'Heading', props: {} } },
      buttons: {},
      elementMatrix: [],
    };

    const element: { type: string; name: string; config: SectionalElement } = {
      type: 'sectionalElement',
      name: 'Heading123',
      config: { type: 'Heading', level: 1, text: 'My Heading', position: { fixed: 'first' }, name: 'Heading123' },
    };

    expect(() => mapSectionalElement(element, formDefinition)).toThrow();
  });

  it('should map configurations', () => {
    const formDefinition: FormDefinition = {
      form: { props: { layoutStyle: {} } },
      elements: {},
      buttons: {},
      elementMatrix: [],
    };

    const element: { type: string; name: string; config: SectionalElement } = {
      type: 'sectionalElement',
      name: 'Heading123',
      config: { type: 'Heading', level: 1, text: 'My Heading', position: { fixed: 'first' }, name: 'Heading123' },
    };

    mapSectionalElement(element, formDefinition);

    expect(formDefinition.elements.Heading123).toStrictEqual({
      componentType: 'Heading',
      props: { level: 1, text: 'My Heading' },
    });
  });
});
