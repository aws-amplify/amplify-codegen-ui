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
import { FieldConfigMetadata, isValidVariableName } from '@aws-amplify/codegen-ui';
import { StudioFormInputFieldProperty } from '@aws-amplify/codegen-ui/lib/types/form/input-config';
import { Expression, factory, JsxAttribute, PropertyAssignment, SyntaxKind, NodeFlags } from 'typescript';
import {
  buildBindingExpression,
  buildConcatExpression,
  isBoundProperty,
  isConcatenatedProperty,
} from '../../react-component-render-helper';
import { getRecordsName } from './form-state';
import { isModelDataType } from './render-checkers';

export const getDisplayValueObjectName = 'getDisplayValue';

/**
    example:
    suggestions={Array.from(authorRecords).map(([key, record]) => ({
        id: key,
        label: getDisplayValue['primaryAuthor']?.(record) ?? key,
    }))}
 */
export function getAutocompleteSuggestionsPropFromModel({
  modelName,
  fieldName,
}: {
  modelName: string;
  fieldName: string;
}): JsxAttribute {
  return factory.createJsxAttribute(
    factory.createIdentifier('suggestions'),
    factory.createJsxExpression(
      undefined,
      factory.createCallExpression(
        factory.createPropertyAccessExpression(
          factory.createCallExpression(
            factory.createPropertyAccessExpression(factory.createIdentifier('Array'), factory.createIdentifier('from')),
            undefined,
            [factory.createIdentifier(getRecordsName(modelName))],
          ),
          factory.createIdentifier('map'),
        ),
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
                factory.createArrayBindingPattern([
                  factory.createBindingElement(undefined, undefined, factory.createIdentifier('key'), undefined),
                  factory.createBindingElement(undefined, undefined, factory.createIdentifier('record'), undefined),
                ]),
                undefined,
                undefined,
                undefined,
              ),
            ],
            undefined,
            factory.createToken(SyntaxKind.EqualsGreaterThanToken),
            factory.createParenthesizedExpression(
              factory.createObjectLiteralExpression(
                [
                  factory.createPropertyAssignment(factory.createIdentifier('id'), factory.createIdentifier('key')),
                  factory.createPropertyAssignment(
                    factory.createIdentifier('label'),
                    factory.createBinaryExpression(
                      factory.createCallChain(
                        factory.createElementAccessExpression(
                          factory.createIdentifier('getDisplayValue'),
                          factory.createStringLiteral(fieldName),
                        ),
                        factory.createToken(SyntaxKind.QuestionDotToken),
                        undefined,
                        [factory.createIdentifier('record')],
                      ),
                      factory.createToken(SyntaxKind.QuestionQuestionToken),
                      factory.createIdentifier('key'),
                    ),
                  ),
                ],
                true,
              ),
            ),
          ),
        ],
      ),
    ),
  );
}

// impure helper
/* eslint-disable no-param-reassign */
function replaceProperty(prop: StudioFormInputFieldProperty, toReplace: string, replaceWith: string): void {
  if (isBoundProperty(prop) && prop.bindingProperties.property === toReplace) {
    prop.bindingProperties.property = replaceWith;
  }
  if (isConcatenatedProperty(prop)) {
    prop.concat.forEach((subProp) => replaceProperty(subProp as StudioFormInputFieldProperty, toReplace, replaceWith));
  }
}
/* eslint-enable no-param-reassign */

export function getDisplayValueObject(displayValueFunctions: PropertyAssignment[]) {
  return factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier('getDisplayValue'),
          undefined,
          undefined,
          factory.createObjectLiteralExpression(displayValueFunctions, true),
        ),
      ],
      NodeFlags.Const,
    ),
  );
}

// example - primaryAuthor: (record) => record?.name,
export function buildDisplayValueFunction(fieldName: string, fieldConfig: FieldConfigMetadata): PropertyAssignment {
  const recordString = 'record';
  let renderedDisplayValue: Expression = factory.createPropertyAccessChain(
    factory.createIdentifier(recordString),
    factory.createToken(SyntaxKind.QuestionDotToken),
    factory.createIdentifier('id'),
  );

  if (isModelDataType(fieldConfig) && fieldConfig.valueMappings) {
    const valueConfig = fieldConfig.valueMappings.values[0];
    if (valueConfig) {
      const displayValueProperty = valueConfig.displayValue || valueConfig.value;
      const modelName = fieldConfig.dataType.model;
      replaceProperty(displayValueProperty, modelName, recordString);
      if (isConcatenatedProperty(displayValueProperty)) {
        renderedDisplayValue = buildConcatExpression(displayValueProperty);
      } else if (isBoundProperty(displayValueProperty)) {
        renderedDisplayValue = buildBindingExpression(displayValueProperty);
      }
    }
  }

  return factory.createPropertyAssignment(
    isValidVariableName(fieldName) ? factory.createIdentifier(fieldName) : factory.createStringLiteral(fieldName),
    factory.createArrowFunction(
      undefined,
      undefined,
      [
        factory.createParameterDeclaration(
          undefined,
          undefined,
          undefined,
          factory.createIdentifier(recordString),
          undefined,
          undefined,
          undefined,
        ),
      ],
      undefined,
      factory.createToken(SyntaxKind.EqualsGreaterThanToken),
      renderedDisplayValue,
    ),
  );
}

export function getModelsToImport(fieldConfig: FieldConfigMetadata): string[] {
  const modelDependencies: string[] = [];
  if (fieldConfig.valueMappings && fieldConfig.valueMappings.bindingProperties) {
    Object.values(fieldConfig.valueMappings.bindingProperties).forEach((prop) => {
      if (prop.type === 'Data' && prop.bindingProperties.model) {
        modelDependencies.push(prop.bindingProperties.model);
      }
    });
  }

  return modelDependencies;
}
