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
import {
  StudioComponentDataPropertyBinding,
  StudioComponentStoragePropertyBinding,
  StudioComponentSimplePropertyBinding,
} from '../types';
import {
  isStudioComponentWithBinding,
  isDataPropertyBinding,
  isStoragePropertyBinding,
  isSimplePropertyBinding,
  isStudioComponentWithCollectionProperties,
  isStudioComponentWithVariants,
} from '../renderer-helper';

describe('render-helper', () => {
  const bindingProperties: {
    data: StudioComponentDataPropertyBinding;
    storage: StudioComponentStoragePropertyBinding;
    boolean: StudioComponentSimplePropertyBinding;
    string: StudioComponentSimplePropertyBinding;
    number: StudioComponentSimplePropertyBinding;
    date: StudioComponentSimplePropertyBinding;
  } = {
    data: {
      type: 'Data',
      bindingProperties: {
        model: 'User',
      },
    },
    storage: {
      type: 'Storage',
      bindingProperties: {
        bucket: 'test-bucket',
      },
    },
    boolean: {
      type: 'Boolean',
    },
    string: {
      type: 'String',
    },
    number: {
      type: 'Number',
    },
    date: {
      type: 'Date',
    },
  };

  describe('isStudioComponentWithBinding', () => {
    test('object has bindingProperties', () => {
      expect(
        isStudioComponentWithBinding({
          componentType: 'View',
          name: 'MyBindingView',
          properties: {},
          bindingProperties: {},
        }),
      ).toBeTruthy();
      expect(
        isStudioComponentWithBinding({
          componentType: 'View',
          name: 'MyNonBindingView',
          properties: {},
        }),
      ).toBeFalsy();
    });
  });

  describe('isStudioComponentWithCollectionProperties', () => {
    test('object without collectionProperties is falsy', () => {
      expect(
        isStudioComponentWithCollectionProperties({
          componentType: '',
          name: '',
          properties: {},
        }),
      ).toBeFalsy();
    });
    test('object with undefined collectionProperties is falsy', () => {
      expect(
        isStudioComponentWithCollectionProperties({
          componentType: '',
          name: '',
          properties: {},
          collectionProperties: undefined,
        }),
      ).toBeFalsy();
    });
    test('object with collectionProperties is truthy', () => {
      expect(
        isStudioComponentWithCollectionProperties({
          componentType: '',
          name: '',
          properties: {},
          collectionProperties: {},
        }),
      ).toBeTruthy();
    });
  });

  describe('isStudioComponentWithVariants', () => {
    test('object without variants is falsy', () => {
      expect(
        isStudioComponentWithVariants({
          componentType: '',
          name: '',
          properties: {},
        }),
      ).toBeFalsy();
    });
    test('object with undefined variants is falsy', () => {
      expect(
        isStudioComponentWithVariants({
          componentType: '',
          name: '',
          properties: {},
          variants: undefined,
        }),
      ).toBeFalsy();
    });
    test('object with empty list of variants is falsy', () => {
      expect(
        isStudioComponentWithVariants({
          componentType: '',
          name: '',
          properties: {},
          variants: [],
        }),
      ).toBeFalsy();
    });
    test('object with variants is truthy', () => {
      expect(
        isStudioComponentWithVariants({
          componentType: '',
          name: '',
          properties: {},
          variants: [
            {
              variantValues: {},
              overrides: {},
            },
          ],
        }),
      ).toBeTruthy();
    });
  });

  describe('isDataPropertyBinding', () => {
    test('property has type Data', () => {
      expect(isDataPropertyBinding(bindingProperties.data)).toBeTruthy();
      const { data, ...otherTypes } = bindingProperties;
      Object.values(otherTypes).forEach((otherType) => expect(isDataPropertyBinding(otherType)).toBeFalsy());
    });
  });

  describe('isStoragePropertyBinding', () => {
    test('property has type Storage', () => {
      expect(isStoragePropertyBinding(bindingProperties.storage)).toBeTruthy();
      const { storage, ...otherTypes } = bindingProperties;
      Object.values(otherTypes).forEach((otherType) => expect(isStoragePropertyBinding(otherType)).toBeFalsy());
    });
  });

  describe('isSimplePropertyBinding', () => {
    test('property has type Boolean, String, Number, or Date', () => {
      expect(isSimplePropertyBinding(bindingProperties.boolean)).toBeTruthy();
      expect(isSimplePropertyBinding(bindingProperties.string)).toBeTruthy();
      expect(isSimplePropertyBinding(bindingProperties.number)).toBeTruthy();
      expect(isSimplePropertyBinding(bindingProperties.date)).toBeTruthy();
      const { boolean, string, number, date, ...otherTypes } = bindingProperties;
      Object.values(otherTypes).forEach((otherType) => expect(isSimplePropertyBinding(otherType)).toBeFalsy());
    });
  });
});
