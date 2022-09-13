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
Builds the event target variable which is called value
default case
const { value } =  e.target;
*/
export const buildTargetVariable = (name: string, dataType?: DataFieldDataType): VariableStatement => {
  let expression: Expression = factory.createPropertyAccessExpression(
    factory.createIdentifier('e'),
    factory.createIdentifier('target'),
  );
  let defaultIdentifier: string | BindingName = factory.createIdentifier('value');
  switch (dataType) {
    // const value = Number(new Date(e.target.value));
    case 'AWSTimestamp':
      expression = factory.createCallExpression(factory.createIdentifier('Number'), undefined, [
        factory.createNewExpression(factory.createIdentifier('Date'), undefined, [
          factory.createPropertyAccessExpression(expression, factory.createIdentifier('value')),
        ]),
      ]);
      break;
    case 'Float':
      // const value = Number(e.target.value);
      expression = factory.createCallExpression(factory.createIdentifier('Number'), undefined, [
        factory.createPropertyAccessExpression(expression, factory.createIdentifier('value')),
      ]);
      break;
    case 'Int':
      // const value = parseInt(e.target.value);
      expression = factory.createCallExpression(factory.createIdentifier('parseInt'), undefined, [
        factory.createPropertyAccessExpression(expression, factory.createIdentifier('value')),
      ]);
      break;
    case 'Boolean':
      if (name === 'RadioGroupField') {
        // const value = e.target.value === 'true'
        // this works around only two set Radio for boolean
        expression = factory.createBinaryExpression(
          factory.createPropertyAccessExpression(expression, factory.createIdentifier('value')),
          factory.createToken(SyntaxKind.EqualsEqualsEqualsToken),
          factory.createStringLiteral('true'),
        );
      } else {
        // SwitchField & CheckboxField
        // const value = e.target.checked;
        expression = factory.createPropertyAccessExpression(expression, factory.createIdentifier('checked'));
      }
      break;
    default:
      defaultIdentifier = factory.createObjectBindingPattern([
        factory.createBindingElement(undefined, undefined, factory.createIdentifier('value'), undefined),
      ]);
      break;
  }
  return factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [factory.createVariableDeclaration(defaultIdentifier, undefined, undefined, expression)],
      NodeFlags.Let,
    ),
  );
};
