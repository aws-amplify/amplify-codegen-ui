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
import { factory, NodeFlags, Expression, SyntaxKind, Identifier, VariableStatement } from 'typescript';
import { buildAccessChain, setErrorState } from './form-state';

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

// default variable statement
const setVariableStatement = (lhs: Identifier, assignment: Expression) =>
  factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [factory.createVariableDeclaration(lhs, undefined, undefined, assignment)],
      NodeFlags.Let,
    ),
  );

const numberVariableStatement = (fieldName: string, variable: VariableStatement) => {
  return [
    variable,
    factory.createIfStatement(
      factory.createCallExpression(factory.createIdentifier('NaN'), undefined, [factory.createIdentifier('value')]),
      factory.createBlock(
        [
          setErrorState(
            factory.createIdentifier(fieldName),
            factory.createStringLiteral('Value must be a valid number'),
          ),
          factory.createReturnStatement(undefined),
        ],
        true,
      ),
      undefined,
    ),
  ];
};

/**
 * const date = new Date(e.target.value);
 *
 * if(!(date instanceof Date && !isNaN(date))) {
 *
 * setErrors((errors) => ({ ...errors, [key]: 'The value must be a valid date' }));
 *
 * return
 *
 * }
 *
 * let value = Number(value);
 *
 * @param fieldName name of field used to set error if date is invalid
 * @returns return expression block {example above}
 */
const timestampVariableStatement = (fieldName: string) => {
  return [
    factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier('date'),
            undefined,
            undefined,
            factory.createNewExpression(factory.createIdentifier('Date'), undefined, [
              buildAccessChain(['e', 'target', 'value'], false),
            ]),
          ),
        ],
        NodeFlags.Const,
      ),
    ),
    factory.createIfStatement(
      factory.createPrefixUnaryExpression(
        SyntaxKind.ExclamationToken,
        factory.createParenthesizedExpression(
          factory.createBinaryExpression(
            factory.createBinaryExpression(
              factory.createIdentifier('date'),
              factory.createToken(SyntaxKind.InstanceOfKeyword),
              factory.createIdentifier('Date'),
            ),
            factory.createToken(SyntaxKind.AmpersandAmpersandToken),
            factory.createPrefixUnaryExpression(
              SyntaxKind.ExclamationToken,
              factory.createCallExpression(factory.createIdentifier('isNaN'), undefined, [
                factory.createIdentifier('date'),
              ]),
            ),
          ),
        ),
      ),
      factory.createBlock(
        [
          setErrorState(
            factory.createIdentifier(fieldName),
            factory.createStringLiteral('The value must be a valid date'),
          ),
          factory.createReturnStatement(undefined),
        ],
        false,
      ),
    ),
    factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            expressionMap.value,
            undefined,
            undefined,
            factory.createCallExpression(factory.createIdentifier('Number'), undefined, [
              factory.createIdentifier('date'),
            ]),
          ),
        ],
        NodeFlags.Let,
      ),
    ),
  ];
};

export const buildTargetVariable = (fieldType: string, fieldName: string, dataType?: DataFieldDataType) => {
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
  };

  let expression: Expression = fieldTypeToExpressionMap[fieldType]?.expression ?? expressionMap.eTarget;
  let defaultIdentifier: Identifier =
    fieldTypeToExpressionMap[fieldType]?.identifier ?? expressionMap.destructuredValue;
  switch (dataType) {
    case 'AWSTimestamp':
      // validate date first then cast to number
      return timestampVariableStatement(fieldName);
    case 'Float':
      if (fieldType === 'TextField') {
        // value = Number(e.target.value);
        defaultIdentifier = expressionMap.value;
        expression = factory.createCallExpression(factory.createIdentifier('Number'), undefined, [
          expressionMap.eTargetValue,
        ]);
      }
      return numberVariableStatement(fieldName, setVariableStatement(defaultIdentifier, expression));
      break;
    case 'Int':
      if (fieldType === 'TextField') {
        // value = parseInt(e.target.value);
        defaultIdentifier = expressionMap.value;
        expression = factory.createCallExpression(factory.createIdentifier('parseInt'), undefined, [
          expressionMap.eTargetValue,
        ]);
      }
      return numberVariableStatement(fieldName, setVariableStatement(defaultIdentifier, expression));
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
    default:
      return [setVariableStatement(defaultIdentifier, expression)];
  }
};
