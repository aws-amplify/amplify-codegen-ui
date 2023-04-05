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
import { DataFieldDataType } from '@aws-amplify/codegen-ui';
import { factory, NodeFlags, Expression, SyntaxKind, Identifier } from 'typescript';
import { STORAGE_FILE_KEY } from '../../utils/constants';

/*
Builds the event target variable. Example:
let { value } = e.target;
*/

const expressionMap = {
  // e
  e: factory.createIdentifier('e'),
  // value
  value: factory.createIdentifier('value'),
  // e.target.checked
  eTargetChecked: factory.createPropertyAccessExpression(
    factory.createPropertyAccessExpression(factory.createIdentifier('e'), factory.createIdentifier('target')),
    factory.createIdentifier('checked'),
  ),
  // e.target
  eTarget: factory.createPropertyAccessExpression(factory.createIdentifier('e'), factory.createIdentifier('target')),
  // {value}
  destructuredValue: factory.createObjectBindingPattern([
    factory.createBindingElement(undefined, undefined, factory.createIdentifier('value'), undefined),
  ]),
  // e.target.value
  eTargetValue: factory.createPropertyAccessExpression(
    factory.createPropertyAccessExpression(factory.createIdentifier('e'), factory.createIdentifier('target')),
    factory.createIdentifier('value'),
  ),
};

// array:     files.map(({ key }) => key)
// non-array: files?.[0]?.key;
export function extractKeyByMapping(array: string, key: string, isArray?: boolean) {
  if (isArray) {
    return factory.createCallExpression(
      factory.createPropertyAccessExpression(factory.createIdentifier(array), factory.createIdentifier('map')),
      undefined,
      [
        factory.createArrowFunction(
          undefined,
          undefined,
          [
            factory.createParameterDeclaration(
              undefined,
              undefined,
              undefined,
              factory.createObjectBindingPattern([
                factory.createBindingElement(undefined, undefined, factory.createIdentifier(key), undefined),
              ]),
              undefined,
              undefined,
              undefined,
            ),
          ],
          undefined,
          factory.createToken(SyntaxKind.EqualsGreaterThanToken),
          factory.createIdentifier(key),
        ),
      ],
    );
  }
  return factory.createPropertyAccessChain(
    factory.createElementAccessChain(
      factory.createIdentifier(array),
      factory.createToken(SyntaxKind.QuestionDotToken),
      factory.createNumericLiteral('0'),
    ),
    factory.createToken(SyntaxKind.QuestionDotToken),
    factory.createIdentifier(STORAGE_FILE_KEY),
  );
}

// default variable statement
const setVariableStatement = (lhs: Identifier, assignment: Expression) =>
  factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [factory.createVariableDeclaration(lhs, undefined, undefined, assignment)],
      NodeFlags.Let,
    ),
  );

export const buildTargetVariable = (
  fieldType: string,
  fieldName: string,
  dataType?: DataFieldDataType,
  isArray?: boolean,
) => {
  const fieldTypeToExpressionMap: {
    [fieldType: string]: { expression: Expression; identifier: Identifier };
  } = {
    SliderField: {
      expression: expressionMap.e,
      identifier: expressionMap.value,
    },
    StepperField: {
      expression: expressionMap.e,
      identifier: expressionMap.value,
    },
    SwitchField: {
      expression: expressionMap.eTargetChecked,
      identifier: expressionMap.value,
    },
    CheckboxField: {
      expression: expressionMap.eTargetChecked,
      identifier: expressionMap.value,
    },
    ToggleButton: {
      expression: factory.createPrefixUnaryExpression(SyntaxKind.ExclamationToken, factory.createIdentifier(fieldName)),
      identifier: expressionMap.value,
    },
    StorageField: {
      expression: extractKeyByMapping('files', STORAGE_FILE_KEY, isArray),
      identifier: expressionMap.value,
    },
  };

  let expression: Expression = fieldTypeToExpressionMap[fieldType]?.expression ?? expressionMap.eTarget;
  let defaultIdentifier: Identifier =
    fieldTypeToExpressionMap[fieldType]?.identifier ?? expressionMap.destructuredValue;
  switch (dataType) {
    case 'AWSTimestamp':
      if (fieldType === 'NumberField') {
        // value = isNaN(parseInt(e.target.value)) ? e.target.value : parseInt(e.target.value);
        defaultIdentifier = expressionMap.value;
        expression = factory.createConditionalExpression(
          factory.createCallExpression(factory.createIdentifier('isNaN'), undefined, [
            factory.createCallExpression(factory.createIdentifier('parseInt'), undefined, [expressionMap.eTargetValue]),
          ]),
          factory.createToken(SyntaxKind.QuestionToken),
          expressionMap.eTargetValue,
          factory.createToken(SyntaxKind.ColonToken),
          factory.createCallExpression(factory.createIdentifier('parseInt'), undefined, [expressionMap.eTargetValue]),
        );
      } else if (fieldType === 'DateTimeField') {
        // value = e.target.value === '' ? '' : Number(new Date(e.target.value))
        defaultIdentifier = expressionMap.value;
        expression = factory.createConditionalExpression(
          factory.createBinaryExpression(
            expressionMap.eTargetValue,
            factory.createToken(SyntaxKind.EqualsEqualsEqualsToken),
            factory.createStringLiteral(''),
          ),
          factory.createToken(SyntaxKind.QuestionToken),
          factory.createStringLiteral(''),
          factory.createToken(SyntaxKind.ColonToken),
          factory.createCallExpression(factory.createIdentifier('Number'), undefined, [
            factory.createNewExpression(factory.createIdentifier('Date'), undefined, [expressionMap.eTargetValue]),
          ]),
        );
      }
      return [setVariableStatement(defaultIdentifier, expression)];
    case 'Float':
      if (fieldType === 'NumberField') {
        // value = isNaN(parseFloat(e.target.value)) ? e.target.value : parseFloat(e.target.value);
        defaultIdentifier = expressionMap.value;
        expression = factory.createConditionalExpression(
          factory.createCallExpression(factory.createIdentifier('isNaN'), undefined, [
            factory.createCallExpression(factory.createIdentifier('parseFloat'), undefined, [
              expressionMap.eTargetValue,
            ]),
          ]),
          factory.createToken(SyntaxKind.QuestionToken),
          expressionMap.eTargetValue,
          factory.createToken(SyntaxKind.ColonToken),
          factory.createCallExpression(factory.createIdentifier('parseFloat'), undefined, [expressionMap.eTargetValue]),
        );
      }
      return [setVariableStatement(defaultIdentifier, expression)];
    case 'Int':
      if (fieldType === 'NumberField') {
        // value = isNaN(parseInt(e.target.value)) ? e.target.value : parseInt(e.target.value);
        defaultIdentifier = expressionMap.value;
        expression = factory.createConditionalExpression(
          factory.createCallExpression(factory.createIdentifier('isNaN'), undefined, [
            factory.createCallExpression(factory.createIdentifier('parseInt'), undefined, [expressionMap.eTargetValue]),
          ]),
          factory.createToken(SyntaxKind.QuestionToken),
          expressionMap.eTargetValue,
          factory.createToken(SyntaxKind.ColonToken),
          factory.createCallExpression(factory.createIdentifier('parseInt'), undefined, [expressionMap.eTargetValue]),
        );
      }
      return [setVariableStatement(defaultIdentifier, expression)];
    case 'Boolean':
      if (fieldType === 'RadioGroupField') {
        // value = e.target.value === 'true'
        defaultIdentifier = expressionMap.value;
        expression = factory.createBinaryExpression(
          expressionMap.eTargetValue,
          factory.createToken(SyntaxKind.EqualsEqualsEqualsToken),
          factory.createStringLiteral('true'),
        );
      }
      return [setVariableStatement(defaultIdentifier, expression)];
    case 'AWSDateTime':
      // value = e.target.value === '' ? '' : new Date(value).toISOString()
      defaultIdentifier = expressionMap.value;
      expression = factory.createConditionalExpression(
        factory.createBinaryExpression(
          expressionMap.eTargetValue,
          factory.createToken(SyntaxKind.EqualsEqualsEqualsToken),
          factory.createStringLiteral(''),
        ),
        factory.createToken(SyntaxKind.QuestionToken),
        factory.createStringLiteral(''),
        factory.createToken(SyntaxKind.ColonToken),
        factory.createCallExpression(
          factory.createPropertyAccessExpression(
            factory.createNewExpression(factory.createIdentifier('Date'), undefined, [expressionMap.eTargetValue]),
            factory.createIdentifier('toISOString'),
          ),
          undefined,
          [],
        ),
      );

      return [setVariableStatement(defaultIdentifier, expression)];

    default:
      return [setVariableStatement(defaultIdentifier, expression)];
  }
};
