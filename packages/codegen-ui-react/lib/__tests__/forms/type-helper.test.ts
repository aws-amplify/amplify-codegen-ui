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

import { FieldConfigMetadata } from '@aws-amplify/codegen-ui';
import { generateFieldTypes } from '../../forms/form-renderer-helper/type-helper';
import { genericPrinter } from '../__utils__';

describe('should generate nested object types', () => {
  it('should generate type for nested object', () => {
    const fieldConfigs: Record<string, FieldConfigMetadata> = {
      'bio.favoriteAnimal.animalMeta.family.genus': {
        dataType: 'String',
        validationRules: [],
        componentType: 'TextField',
      },
      'bio.favoriteAnimal.animalMeta.earliestRecord': {
        dataType: 'AWSTimestamp',
        validationRules: [],
        componentType: 'TextField',
      },
      firstName: {
        dataType: 'String',
        validationRules: [],
        componentType: 'TextField',
      },
      isExplorer: {
        dataType: 'Boolean',
        validationRules: [],
        componentType: 'CheckboxField',
      },
    };
    const types = generateFieldTypes('myCreateForm', 'input', fieldConfigs);
    const response = genericPrinter(types);
    expect(response).toMatchSnapshot();
  });

  it('should generate type for non nested object', () => {
    const fieldConfigs: Record<string, FieldConfigMetadata> = {
      firstName: {
        dataType: 'String',
        validationRules: [],
        componentType: 'TextField',
      },
      isExplorer: {
        dataType: 'Boolean',
        validationRules: [],
        componentType: 'RadioGroupField',
      },
      tags: {
        validationRules: [],
        componentType: 'TextField',
        isArray: true,
      },
    };
    const types = generateFieldTypes('myCreateForm', 'input', fieldConfigs);
    const response = genericPrinter(types);
    expect(response).toMatchSnapshot();
  });
});

describe('should generate types accordingly for array fields', () => {
  it('should generate array for input type', () => {
    const fieldConfigs: Record<string, FieldConfigMetadata> = {
      firstName: {
        dataType: 'String',
        validationRules: [],
        componentType: 'TextField',
      },
      isExplorer: {
        dataType: 'Boolean',
        validationRules: [],
        componentType: 'RadioGroupField',
      },
      tags: {
        validationRules: [],
        componentType: 'TextField',
        isArray: true,
      },
    };
    const types = generateFieldTypes('myCreateForm', 'input', fieldConfigs);
    const response = genericPrinter(types);
    expect(response).toContain('tags?: string[];');
    expect(response).toMatchSnapshot();
  });
  it('should remove array type for the validation type', () => {
    const fieldConfigs: Record<string, FieldConfigMetadata> = {
      firstName: {
        dataType: 'String',
        validationRules: [],
        componentType: 'TextField',
      },
      isExplorer: {
        dataType: 'Boolean',
        validationRules: [],
        componentType: 'RadioGroupField',
      },
      tags: {
        validationRules: [],
        componentType: 'TextField',
        isArray: true,
      },
    };
    const types = generateFieldTypes('myCreateForm', 'validation', fieldConfigs);
    const response = genericPrinter(types);
    expect(response).toContain('tags?: ValidationFunction<string>;');
    expect(response).toMatchSnapshot();
  });
});
