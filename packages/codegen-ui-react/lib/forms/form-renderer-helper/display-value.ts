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
  FieldConfigMetadata,
  InvalidInputError,
  isValidVariableName,
  StudioFormValueMappings,
} from '@aws-amplify/codegen-ui';
import { StudioFormInputFieldProperty } from '@aws-amplify/codegen-ui/lib/types/form/input-config';
import {
  Expression,
  factory,
  JsxAttribute,
  PropertyAssignment,
  SyntaxKind,
  NodeFlags,
  CallExpression,
} from 'typescript';
import {
  buildBindingExpression,
  buildConcatExpression,
  isBoundProperty,
  isConcatenatedProperty,
} from '../../react-component-render-helper';
import { getRecordsName } from './form-state';
import { getElementAccessExpression } from './invalid-variable-helpers';
import { isModelDataType } from './render-checkers';

export const getDisplayValueObjectName = 'getDisplayValue';

/**
  authorRecords.map((r) => ({
    id: r.id,
    label: r.id,
  }))
 */

/**
  examples:
  for model -
  authorRecords.map((r) => ({
    id: r.id,
    label: getDisplayValue['primaryAuthor']?.(r) ?? r.id,
  }))

  for scalar - 
  authorRecords.map((r) => ({
    id: r.id,
    label: r.id,
  }))
 */
function getModelTypeSuggestions({
  modelName,
  fieldName,
  key,
  isModelType,
}: {
  modelName: string;
  fieldName: string;
  key: string;
  isModelType: boolean;
}): CallExpression {
  const recordString = 'r';

  const labelExpression = isModelType
    ? factory.createBinaryExpression(
        factory.createCallChain(
          getElementAccessExpression('getDisplayValue', fieldName),
          factory.createToken(SyntaxKind.QuestionDotToken),
          undefined,
          [factory.createIdentifier('r')],
        ),
        factory.createToken(SyntaxKind.QuestionQuestionToken),
        getElementAccessExpression(recordString, key),
      )
    : getElementAccessExpression(recordString, key);

  return factory.createCallExpression(
    factory.createPropertyAccessExpression(
      factory.createIdentifier(getRecordsName(modelName)),
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
            factory.createIdentifier(recordString),
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
              factory.createPropertyAssignment(
                factory.createIdentifier('id'),
                getElementAccessExpression(recordString, key),
              ),
              factory.createPropertyAssignment(factory.createIdentifier('label'), labelExpression),
            ],
            true,
          ),
        ),
      ),
    ],
  );
}

export function extractModelAndKey(valueMappings?: StudioFormValueMappings): { model?: string; key?: string } {
  let model: undefined | string;
  let key: undefined | string;
  const bindingProperty = valueMappings?.bindingProperties && Object.values(valueMappings.bindingProperties)[0];
  if (bindingProperty && bindingProperty.type === 'Data') {
    model = bindingProperty.bindingProperties.model;
    const { value } = valueMappings.values[0];
    if (isBoundProperty(value) && value.bindingProperties.field) {
      key = value.bindingProperties.field;
    }
  }

  return { model, key };
}

/**
    example:
    suggestions={authorRecords.map(r) => ({
        id: r.id,
        label: getDisplayValue['primaryAuthor']?.(r) ?? r.id,
    }))}
 */
export function getAutocompleteSuggestionsProp({
  fieldName,
  fieldConfig,
}: {
  fieldName: string;
  fieldConfig: FieldConfigMetadata;
}): JsxAttribute {
  let suggestions: Expression | undefined;

  const { valueMappings } = fieldConfig;
  const { model, key } = extractModelAndKey(valueMappings);

  if (model && key) {
    suggestions = getModelTypeSuggestions({
      modelName: model,
      fieldName,
      key,
      isModelType: isModelDataType(fieldConfig),
    });
  }

  if (!suggestions) {
    throw new InvalidInputError(`Invalid value mappings on ${fieldName}`);
  }

  return factory.createJsxAttribute(
    factory.createIdentifier('suggestions'),
    factory.createJsxExpression(undefined, suggestions),
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
          factory.createIdentifier(getDisplayValueObjectName),
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
