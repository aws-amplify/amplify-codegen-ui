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
import { generateOnValidationType } from '../../forms/type-helper';
import { genericPrinter } from '../__utils__';

describe('should generate nested object', () => {
  it('should generate type for nested object', () => {
    const fieldConfigs: Record<string, FieldConfigMetadata> = {
      'bio.favoriteAnimal.animalMeta.family.genus': {
        dataType: 'String',
        validationRules: [],
      },
      'bio.favoriteAnimal.animalMeta.earliestRecord': {
        dataType: 'AWSTimestamp',
        validationRules: [],
      },
      firstName: {
        dataType: 'String',
        validationRules: [],
      },
      isExplorer: {
        dataType: 'Boolean',
        validationRules: [],
      },
    };
    const types = generateOnValidationType('myCreateForm', fieldConfigs);
    const response = genericPrinter(types);
    expect(response).toMatchSnapshot();
  });

  it('should generate type for non nested object', () => {
    const fieldConfigs: Record<string, FieldConfigMetadata> = {
      firstName: {
        dataType: 'String',
        validationRules: [],
      },
      isExplorer: {
        dataType: 'Boolean',
        validationRules: [],
      },
    };
    const types = generateOnValidationType('myCreateForm', fieldConfigs);
    const response = genericPrinter(types);
    expect(response).toMatchSnapshot();
  });
});
