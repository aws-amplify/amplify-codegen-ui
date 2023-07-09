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
import { StudioComponent, StudioForm } from '../../types';
import { componentRequiresDataApi, formRequiresDataApi } from '../../utils';
import { loadSchemaFromJSONFile } from '../__utils__/load-schema';

describe('data-binding-utils', () => {
  describe('formRequiresDataApi', () => {
    it('should return true if from has dataSourceType of DataStore', () => {
      const form = loadSchemaFromJSONFile<StudioForm>('forms/post-datastore-create');
      const result = formRequiresDataApi(form);

      expect(result).toBe(true);
    });

    it('should return false if from has dataSourceType other than DataStore', () => {
      const form = loadSchemaFromJSONFile<StudioForm>('forms/post-custom-create');
      const result = formRequiresDataApi(form);

      expect(result).toBe(false);
    });
  });

  describe('componentRequiresDataApi', () => {
    it('should return true if collection has collectionProperties set', () => {
      const collection = loadSchemaFromJSONFile<StudioComponent>('collectionWithBinding');
      const result = componentRequiresDataApi(collection);
      expect(result).toBe(true);
    });

    it('should return false if collection has no collectionProperties set', () => {
      const collection = loadSchemaFromJSONFile<StudioComponent>('collectionWithoutBinding');
      const result = componentRequiresDataApi(collection);
      expect(result).toBe(false);
    });

    it('should return true if component contains data action', () => {
      const component = loadSchemaFromJSONFile<StudioComponent>(
        'bindings/data/componentWithDataStoreCreateActionBinding',
      );
      const result = componentRequiresDataApi(component);
      expect(result).toBe(true);
    });

    it('should return false if component does not contain data action', () => {
      // a data binding is acceptable as this is just a helper for type definitions
      const component = loadSchemaFromJSONFile<StudioComponent>('componentWithDataBinding');
      const result = componentRequiresDataApi(component);
      expect(result).toBe(false);
    });
  });
});
