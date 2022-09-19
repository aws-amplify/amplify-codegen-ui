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
import { factory, NodeFlags, VariableStatement, Expression, BindingName, SyntaxKind } from 'typescript';

/*
Builds the event target variable. Example:
let { value } =  e.target;
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

export const buildTargetVariable = (
  fieldType: string,
  fieldName: string,
  dataType?: DataFieldDataType,
): VariableStatement => {
  const fieldTypeToExpressionMap: {
    [fieldType: string]: { expression: Expression; identifier: string | BindingName };
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
  let defaultIdentifier: string | BindingName =
    fieldTypeToExpressionMap[fieldType]?.identifier ?? expressionMap.destructuredValue;
  switch (dataType) {
    case 'AWSTimestamp':
      // value = Number(new Date(e.target.value));
      defaultIdentifier = expressionMap.value;
      expression = factory.createCallExpression(factory.createIdentifier('Number'), undefined, [
        factory.createNewExpression(factory.createIdentifier('Date'), undefined, [expressionMap.eTargetValue]),
      ]);
      break;
    case 'Float':
      if (fieldType === 'TextField') {
        // value = Number(e.target.value);
        defaultIdentifier = expressionMap.value;
        expression = factory.createCallExpression(factory.createIdentifier('Number'), undefined, [
          expressionMap.eTargetValue,
        ]);
      }
      break;
    case 'Int':
      if (fieldType === 'TextField') {
        // value = parseInt(e.target.value);
        defaultIdentifier = expressionMap.value;
        expression = factory.createCallExpression(factory.createIdentifier('parseInt'), undefined, [
          expressionMap.eTargetValue,
        ]);
      }
      break;
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
      break;
    default:
  }
  return factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [factory.createVariableDeclaration(defaultIdentifier, undefined, undefined, expression)],
      NodeFlags.Let,
    ),
  );
};
