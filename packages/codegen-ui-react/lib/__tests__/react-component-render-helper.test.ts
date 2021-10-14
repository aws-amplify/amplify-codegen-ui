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
import { StudioComponentProperty } from '@aws-amplify/codegen-ui';
import {
  getFixedComponentPropValueExpression,
  getComponentPropName,
  isFixedPropertyWithValue,
  isBoundProperty,
  isCollectionItemBoundProperty,
  isConcatenatedProperty,
  isConditionalProperty,
  buildFixedJsxExpression,
} from '../react-component-render-helper';

import { assertASTMatchesSnapshot } from './__utils__/snapshot-helpers';

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
    const propertyTypes: { [propertyType: string]: { checker: Function; property: StudioComponentProperty } } = {
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

        Object.entries(otherProperties).forEach(([otherPropertyType, { property: otherProperty }]) => {
          test(`${otherPropertyType} is not ${propertyType}`, () => {
            expect(checker(otherProperty)).toBeFalsy();
          });
        });
      });
    });
  });

  describe('buildFixedJsxExpression', () => {
    test('string', () => {
      assertASTMatchesSnapshot(buildFixedJsxExpression({ value: 'some text' }));
    });

    test('number', () => {
      assertASTMatchesSnapshot(buildFixedJsxExpression({ value: 400 }));
    });

    test('string wrapped number', () => {
      assertASTMatchesSnapshot(buildFixedJsxExpression({ value: '400' }));
    });

    test('parsed number', () => {
      assertASTMatchesSnapshot(buildFixedJsxExpression({ value: '400', type: 'Number' }));
      assertASTMatchesSnapshot(buildFixedJsxExpression({ value: '400', type: 'number' }));
    });

    test('boolean', () => {
      assertASTMatchesSnapshot(buildFixedJsxExpression({ value: true }));
    });

    test('string wrapped boolean', () => {
      assertASTMatchesSnapshot(buildFixedJsxExpression({ value: 'true' }));
    });

    test('parsed boolean', () => {
      assertASTMatchesSnapshot(buildFixedJsxExpression({ value: 'true', type: 'Boolean' }));
    });

    test('string wrapped array', () => {
      assertASTMatchesSnapshot(buildFixedJsxExpression({ value: '[1,2,3]' }));
    });

    test('parsed array', () => {
      assertASTMatchesSnapshot(buildFixedJsxExpression({ value: '[1,2,3]', type: 'Object' }));
    });

    test('string wrapped object', () => {
      assertASTMatchesSnapshot(buildFixedJsxExpression({ value: '{"transponder": "rocinante"}' }));
    });

    test('parsed object', () => {
      assertASTMatchesSnapshot(buildFixedJsxExpression({ value: '{"transponder": "rocinante"}', type: 'Object' }));
    });

    test('string wrapped null', () => {
      assertASTMatchesSnapshot(buildFixedJsxExpression({ value: 'null' }));
    });

    test('parsed null', () => {
      assertASTMatchesSnapshot(buildFixedJsxExpression({ value: 'null', type: 'Object' }));
    });

    test('type mismatch error', () => {
      expect(() => buildFixedJsxExpression({ value: 'true', type: 'number' })).toThrow(
        'Parsed value type "boolean" and specified type "number" mismatch',
      );
    });

    test('json parse error', () => {
      expect(() => buildFixedJsxExpression({ value: '⭐', type: 'number' })).toThrow('Failed to parse value "⭐"');
    });
  });
});
