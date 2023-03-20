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
  StudioComponentSimplePropertyBinding,
  StudioComponentEventPropertyBinding,
  StudioComponentAuthProperty,
} from '../types';
import {
  isStudioComponentWithBinding,
  isDataPropertyBinding,
  isSimplePropertyBinding,
  isStudioComponentWithCollectionProperties,
  isStudioComponentWithVariants,
  isEventPropertyBinding,
  isAuthProperty,
  resolveBetweenPredicateToMultiplePredicates,
  OPERAND_DELIMITER,
} from '../renderer-helper';

describe('render-helper', () => {
  const bindingProperties: {
    data: StudioComponentDataPropertyBinding;
    boolean: StudioComponentSimplePropertyBinding;
    string: StudioComponentSimplePropertyBinding;
    number: StudioComponentSimplePropertyBinding;
    date: StudioComponentSimplePropertyBinding;
    event: StudioComponentEventPropertyBinding;
    auth: StudioComponentAuthProperty;
  } = {
    data: {
      type: 'Data',
      bindingProperties: {
        model: 'User',
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
    event: {
      type: 'Event',
    },
    auth: {
      userAttribute: 'email',
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

  describe('isEventPropertyBinding', () => {
    test('property has type Event', () => {
      expect(isEventPropertyBinding(bindingProperties.event)).toBeTruthy();
      const { event, ...otherTypes } = bindingProperties;
      Object.values(otherTypes).forEach((otherType) => expect(isEventPropertyBinding(otherType)).toBeFalsy());
    });
  });

  describe('isAuthProperty', () => {
    test('property has type userAttribute', () => {
      expect(isAuthProperty(bindingProperties.auth)).toBeTruthy();
      const { auth, ...otherTypes } = bindingProperties;
      Object.values(otherTypes).forEach((otherType) => expect(isAuthProperty(otherType)).toBeFalsy());
    });
  });

  describe('resolveBetweenPredicateToMultiplePredicates', () => {
    it('should throw if not 2 operands', () => {
      expect(() =>
        resolveBetweenPredicateToMultiplePredicates({
          field: 'age',
          operator: 'between',
          operand: '1',
        }),
      ).toThrow();
      expect(() =>
        resolveBetweenPredicateToMultiplePredicates({
          field: 'age',
          operator: 'between',
        }),
      ).toThrow();
      expect(() =>
        resolveBetweenPredicateToMultiplePredicates({
          field: 'age',
          operator: 'between',
          operand: [1, 2, 3].join(OPERAND_DELIMITER),
        }),
      ).toThrow();
    });

    it('should resolve predicate', () => {
      const betweenPredicateOperands = ['1', '2'];
      const betweenPredicate = {
        field: 'age',
        operator: 'between',
        operand: betweenPredicateOperands.join(OPERAND_DELIMITER),
      };
      expect(resolveBetweenPredicateToMultiplePredicates(betweenPredicate)).toStrictEqual({
        and: [
          { field: betweenPredicate.field, operator: 'ge', operand: betweenPredicateOperands[0] },
          { field: betweenPredicate.field, operator: 'le', operand: betweenPredicateOperands[1] },
        ],
      });
    });
  });
});
