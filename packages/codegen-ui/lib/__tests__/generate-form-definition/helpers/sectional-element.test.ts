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

import { mapSectionalElement, getFormDefinitionSectionalElement } from '../../../generate-form-definition/helpers';
import { FormDefinition, GenericSectionalElementConfig, SectionalElementConfig } from '../../../types';
import { getBasicFormDefinition } from '../../__utils__/basic-form-definition';

describe('mapSectionalElement', () => {
  it('should throw if there is already an element with the same name', () => {
    const formDefinition: FormDefinition = {
      ...getBasicFormDefinition(),
      elements: { Heading123: { componentType: 'Heading', props: {} } },
    };

    const element: { name: string; config: GenericSectionalElementConfig } = {
      name: 'Heading123',
      config: { type: 'Heading', level: 1, text: 'My Heading', position: { fixed: 'first' } },
    };

    expect(() => mapSectionalElement(element, formDefinition)).toThrow();
  });

  it('should map configurations', () => {
    const formDefinition: FormDefinition = getBasicFormDefinition();

    const element: { name: string; config: GenericSectionalElementConfig } = {
      name: 'Heading123',
      config: { type: 'Heading', level: 1, text: 'My Heading', position: { fixed: 'first' } },
    };

    mapSectionalElement(element, formDefinition);

    expect(formDefinition.elements.Heading123).toStrictEqual({
      componentType: 'Heading',
      props: { level: 1, children: 'My Heading' },
    });
  });

  it('should throw if attempting to map excluded sectional element', () => {
    const formDefinition: FormDefinition = getBasicFormDefinition();

    const element: { name: string; config: SectionalElementConfig } = {
      name: 'Heading123',
      config: { excluded: true },
    };

    expect(() => mapSectionalElement(element, formDefinition)).toThrow();
  });
});

describe('getFormDefinitionSectionalElement', () => {
  it('should map Text', () => {
    const config: GenericSectionalElementConfig = {
      type: 'Text',
      text: 'MyText',
      position: { fixed: 'first' },
    };

    expect(getFormDefinitionSectionalElement(config)).toStrictEqual({
      componentType: 'Text',
      props: { children: 'MyText' },
    });
  });

  it('should map Divider', () => {
    const config: GenericSectionalElementConfig = {
      type: 'Divider',
      position: { fixed: 'first' },
      orientation: 'horizontal',
    };

    expect(getFormDefinitionSectionalElement(config)).toStrictEqual({
      componentType: 'Divider',
      props: { orientation: 'horizontal' },
    });
  });

  it('should map Heading', () => {
    const config: GenericSectionalElementConfig = {
      type: 'Heading',
      position: { fixed: 'first' },
    };

    expect(getFormDefinitionSectionalElement(config)).toStrictEqual({
      componentType: 'Heading',
      props: { children: 'text' },
    });
  });

  it('should throw if componentType is unmappable', () => {
    const config: GenericSectionalElementConfig = {
      type: 'Invalid',
      position: { fixed: 'first' },
    };

    expect(() => getFormDefinitionSectionalElement(config)).toThrow();
  });
});
