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
import { isEnumFieldType } from '@aws-amplify/datastore';
import {
  Expression,
  factory,
  JsxAttribute,
  PropertyAssignment,
  SyntaxKind,
  NodeFlags,
  CallExpression,
  VariableStatement,
} from 'typescript';
import {
  buildBindingExpression,
  buildConcatExpression,
  isBoundProperty,
  isConcatenatedProperty,
  isFixedPropertyWithValue,
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
    label: getDisplayValue['primaryAuthor']?.(r),
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
    ? factory.createCallChain(
        getElementAccessExpression('getDisplayValue', fieldName),
        factory.createToken(SyntaxKind.QuestionDotToken),
        undefined,
        [factory.createIdentifier(recordString)],
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
    options={authorRecords.map(r) => ({
        id: r.id,
        label: getDisplayValue['primaryAuthor']?.(r) ?? r.id,
    }))}
 */
export function getAutocompleteOptionsProp({
  fieldName,
  fieldConfig,
}: {
  fieldName: string;
  fieldConfig: FieldConfigMetadata;
}): JsxAttribute {
  let options: Expression | undefined;

  const { valueMappings } = fieldConfig;
  const { model, key } = extractModelAndKey(valueMappings);

  if (model && key) {
    options = getModelTypeSuggestions({
      modelName: model,
      fieldName,
      key,
      isModelType: isModelDataType(fieldConfig),
    });
  }

  if (!options) {
    throw new InvalidInputError(`Invalid value mappings on ${fieldName}`);
  }

  return factory.createJsxAttribute(
    factory.createIdentifier('options'),
    factory.createJsxExpression(undefined, options),
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
  const propertyName = isValidVariableName(fieldName)
    ? factory.createIdentifier(fieldName)
    : factory.createStringLiteral(fieldName);
  let additionalStatements: VariableStatement[] = [];
  const { key: primaryKey } = extractModelAndKey(fieldConfig.valueMappings);

  let renderedDisplayValue: Expression = factory.createPropertyAccessChain(
    factory.createIdentifier(recordString),
    factory.createToken(SyntaxKind.QuestionDotToken),
    // if this expression is used, primaryKey should exist
    factory.createIdentifier(primaryKey || ''),
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

  if (isEnumFieldType(fieldConfig.dataType) && fieldConfig.valueMappings && fieldConfig.isArray) {
    const displayValueMapName = `enumDisplayValueMap`;
    additionalStatements = [
      factory.createVariableStatement(
        undefined,
        factory.createVariableDeclarationList(
          [
            factory.createVariableDeclaration(
              factory.createIdentifier(displayValueMapName),
              undefined,
              undefined,
              factory.createObjectLiteralExpression(
                fieldConfig.valueMappings.values.map((v) => {
                  let value = '';
                  let displayValue = '';
                  if (isFixedPropertyWithValue(v.value)) {
                    value = v.value.value.toString();
                  }
                  if (v.displayValue && isFixedPropertyWithValue(v.displayValue)) {
                    displayValue = v.displayValue.value.toString();
                  }
                  if (value === '') {
                    throw Error('Enum cannot have an empty value');
                  }
                  return factory.createPropertyAssignment(
                    factory.createStringLiteral(value),
                    factory.createStringLiteral(displayValue ?? value),
                  );
                }),

                true,
              ),
            ),
          ],
          NodeFlags.Const,
        ),
      ),
    ];
    renderedDisplayValue = factory.createElementAccessExpression(
      factory.createIdentifier(displayValueMapName),
      factory.createIdentifier(recordString),
    );
  }

  return factory.createPropertyAssignment(
    propertyName,
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
      additionalStatements.length
        ? factory.createBlock([...additionalStatements, factory.createReturnStatement(renderedDisplayValue)], false)
        : renderedDisplayValue,
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

  // Import join table model
  if (fieldConfig.relationship?.type === 'HAS_MANY' && fieldConfig.relationship.relatedJoinTableName) {
    modelDependencies.push(fieldConfig.relationship.relatedJoinTableName);
  }

  return modelDependencies;
}
