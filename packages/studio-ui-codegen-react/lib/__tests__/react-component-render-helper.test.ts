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
  getFixedComponentPropValueExpression,
  ComponentPropertyValueTypes,
  getComponentPropName,
  isFixedPropertyWithValue,
  isBoundProperty,
  isCollectionItemBoundProperty,
  isConcatenatedProperty,
  isConditionalProperty,
} from '../react-component-render-helper';

describe('react-component-render-helper', () => {
  test('getFixedComponentPropValueExpression', () => {
    const value = 'testValue';
    expect(getFixedComponentPropValueExpression({ value }).text).toEqual(value);
  });

  describe('getComponentPropName', () => {
    test('with name', () => {
      const name = 'ComponentName';
      expect(getComponentPropName(name)).toEqual(`${name}Props`);
    });
    test('without name', () => {
      expect(getComponentPropName()).toEqual(`ComponentWithoutNameProps`);
    });
  });

  describe('property type checkers', () => {
    const propertyTypes: { [propertyType: string]: { checker: Function; property: ComponentPropertyValueTypes } } = {
      ConcatenatedStudioComponentProperty: { checker: isConcatenatedProperty, property: { concat: [] } },
      ConditionalStudioComponentProperty: {
        checker: isConditionalProperty,
        property: {
          condition: {
            property: 'user',
            field: 'age',
            operator: 'gt',
            operand: '18',
            then: {
              value: 'Vote',
            },
            else: {
              value: 'Sorry you cannot vote',
            },
          },
        },
      },
      FixedStudioComponentProperty: { checker: isFixedPropertyWithValue, property: { value: 'testValue' } },
      BoundStudioComponentProperty: {
        checker: isBoundProperty,
        property: { bindingProperties: { property: 'testBinding' } },
      },
      CollectionStudioComponentProperty: {
        checker: isCollectionItemBoundProperty,
        property: { collectionBindingProperties: { property: 'testCollectionBinding' } },
      },
    };

    Object.keys(propertyTypes).forEach((propertyType) => {
      describe(propertyType, () => {
        const {
          [propertyType]: { checker, property },
          ...otherProperties
        } = propertyTypes;
        test(`is ${propertyType}`, () => {
          expect(checker(property)).toBeTruthy();
        });

        Object.entries(otherProperties).forEach(([otherPropertyType, { property }]) => {
          test(`${otherPropertyType} is not ${propertyType}`, () => {
            expect(checker(property)).toBeFalsy();
          });
        });
      });
    });
  });
});
