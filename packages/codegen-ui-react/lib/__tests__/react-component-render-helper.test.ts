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
  RelationalOperator,
  ConditionalStudioComponentProperty,
  StudioComponentProperty,
  ComponentMetadata,
  ConcatenatedStudioComponentProperty,
} from '@aws-amplify/codegen-ui';
import {
  getFixedComponentPropValueExpression,
  getComponentPropName,
  isFixedPropertyWithValue,
  isBoundProperty,
  isCollectionItemBoundProperty,
  isConcatenatedProperty,
  isConditionalProperty,
  buildFixedJsxExpression,
  isDefaultValueOnly,
  getSyntaxKindToken,
  buildChildElement,
  buildConditionalExpression,
  hasChildrenProp,
  buildConcatExpression,
  parseNumberOperand,
} from '../react-component-render-helper';

import { assertASTMatchesSnapshot } from './__utils__';

function buildConditionalWithOperand(operand: string, type?: string) {
  const conditional: ConditionalStudioComponentProperty = {
    condition: {
      property: 'user',
      field: 'age',
      operator: 'gt',
      operand,
      then: {
        value: 'Vote',
      },
      else: {
        value: 'Sorry you cannot vote',
      },
    },
  };

  if (type) {
    conditional.condition.operandType = type;
  }

  return conditional;
}

function buildEmptyComponentMetadata(): ComponentMetadata {
  return {
    hasAuthBindings: false,
    requiredDataModels: [],
    stateReferences: [],
    componentNameToTypeMap: {},
  };
}

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
        property: buildConditionalWithOperand('18'),
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
      expect(() => buildFixedJsxExpression({ value: 'true', type: 'number' })).toThrowErrorMatchingSnapshot();
    });

    test('json parse error', () => {
      expect(() => buildFixedJsxExpression({ value: '⭐', type: 'number' })).toThrowErrorMatchingSnapshot();
    });

    test('unsupported type', () => {
      expect(() =>
        buildFixedJsxExpression({ value: new Date('December 17, 1995 03:24:00'), type: 'unsupported' }),
      ).toThrowError();
      // Not using a snapshot here since the error message changes based on timezone
    });
  });

  describe('isDefaultValueOnly', () => {
    test('defaultValue and not bound property', () => {
      const prop = {
        defaultValue: 'default',
        value: 'something',
      };
      expect(isDefaultValueOnly(prop)).toBeTruthy();
    });

    test('not defaultValue', () => {
      const prop = {
        collectionBindingProperties: {
          property: 'prop',
        },
      };
      expect(isDefaultValueOnly(prop)).toBeFalsy();
    });
  });

  describe('getSyntaxKindToken', () => {
    test('eq', () => {
      expect(getSyntaxKindToken('eq')).toMatchSnapshot();
    });

    test('ne', () => {
      expect(getSyntaxKindToken('ne')).toMatchSnapshot();
    });

    test('le', () => {
      expect(getSyntaxKindToken('le')).toMatchSnapshot();
    });

    test('lt', () => {
      expect(getSyntaxKindToken('lt')).toMatchSnapshot();
    });

    test('ge', () => {
      expect(getSyntaxKindToken('ge')).toMatchSnapshot();
    });

    test('gt', () => {
      expect(getSyntaxKindToken('gt')).toMatchSnapshot();
    });
  });

  describe('buildChildElement', () => {
    test('no prop', () => {
      expect(buildChildElement(buildEmptyComponentMetadata())).toBeUndefined();
    });

    test('fixed property', () => {
      const prop = { value: 'foo' };
      expect(buildChildElement(buildEmptyComponentMetadata(), prop)).toMatchSnapshot();
    });

    test('bound property', () => {
      const prop = { bindingProperties: { property: 'prop' } };
      expect(buildChildElement(buildEmptyComponentMetadata(), prop)).toMatchSnapshot();
    });

    test('collection bound property', () => {
      const prop = { collectionBindingProperties: { property: 'prop' } };
      expect(buildChildElement(buildEmptyComponentMetadata(), prop)).toMatchSnapshot();
    });

    test('concatenated property', () => {
      const prop = { concat: [] };
      expect(buildChildElement(buildEmptyComponentMetadata(), prop)).toMatchSnapshot();
    });

    test('conditonal property', () => {
      const prop = {
        condition: {
          property: 'prop',
          operator: 'eq' as RelationalOperator,
          operand: 0,
          then: { value: 'foo' },
          else: { value: 'bar' },
        },
      };
      expect(buildChildElement(buildEmptyComponentMetadata(), prop)).toMatchSnapshot();
    });
  });

  describe('buildContionalExpression', () => {
    test('operandType exists', () => {
      const numberExpression = buildConditionalExpression(
        buildEmptyComponentMetadata(),
        buildConditionalWithOperand('18', 'number'),
      );
      assertASTMatchesSnapshot(numberExpression);
      const booleanExpression = buildConditionalExpression(
        buildEmptyComponentMetadata(),
        buildConditionalWithOperand('true', 'boolean'),
      );
      assertASTMatchesSnapshot(booleanExpression);
      const stringExpression = buildConditionalExpression(
        buildEmptyComponentMetadata(),
        buildConditionalWithOperand('true', 'string'),
      );
      assertASTMatchesSnapshot(stringExpression);
    });

    test('operandType does not exist', () => {
      const numberExpression = buildConditionalExpression(
        buildEmptyComponentMetadata(),
        buildConditionalWithOperand('18'),
      );
      assertASTMatchesSnapshot(numberExpression);
      const booleanExpression = buildConditionalExpression(
        buildEmptyComponentMetadata(),
        buildConditionalWithOperand('true'),
      );
      assertASTMatchesSnapshot(booleanExpression);
      const stringExpression = buildConditionalExpression(
        buildEmptyComponentMetadata(),
        buildConditionalWithOperand('dlo'),
      );
      assertASTMatchesSnapshot(stringExpression);
    });

    test('operand and operandType mismatch', () => {
      expect(() =>
        buildConditionalExpression(buildEmptyComponentMetadata(), buildConditionalWithOperand('18', 'boolean')),
      ).toThrow('Parsed value 18 and type boolean mismatch');
    });
  });

  describe('hasChildrenProp', () => {
    test('returns true if children property exists', () => {
      expect(
        hasChildrenProp({ width: { value: '10px' }, children: { bindingProperties: { property: 'mySlot' } } }),
      ).toBe(true);
    });

    test('returns false if children property does not exist', () => {
      expect(
        hasChildrenProp({ width: { value: '10px' }, height: { bindingProperties: { property: 'myHeight' } } }),
      ).toBe(false);
    });
  });
  describe('buildConcatExpression', () => {
    test('should build concat with userAttribute', () => {
      const concatProp: ConcatenatedStudioComponentProperty = {
        concat: [{ userAttribute: 'email' }, { value: ', welcome!', type: 'string' }],
      };

      const exp = buildConcatExpression(concatProp);
      assertASTMatchesSnapshot(exp);
    });
  });

  describe('parseNumberOperand', () => {
    test('should parse int if field data type is Int', () => {
      expect(parseNumberOperand('10', { dataType: 'Int', readOnly: false, required: false, isArray: false })).toBe(10);
    });
    test('should parse int if field data type is Int', () => {
      expect(parseNumberOperand('10.01', { dataType: 'Float', readOnly: false, required: false, isArray: false })).toBe(
        10.01,
      );
    });
  });
});
