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
import { isNonModelDataType, FieldConfigMetadata } from '@aws-amplify/codegen-ui';
import {
  PropertyAccessExpression,
  Identifier,
  factory,
  SyntaxKind,
  Expression,
  ObjectLiteralExpression,
} from 'typescript';
/**
 * JSON.parse(s)
 */
export const parseValue = (expression: Expression) =>
  factory.createCallExpression(
    factory.createPropertyAccessExpression(factory.createIdentifier('JSON'), factory.createIdentifier('parse')),
    undefined,
    [expression],
  );

/**
 * modelFields.nonModelFieldArray.map(s => JSON.parse(item))
 */
export const parseArrayValues = (accessName: PropertyAccessExpression | Identifier) => {
  return factory.createCallExpression(
    factory.createPropertyAccessExpression(accessName, factory.createIdentifier('map')),
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
            factory.createIdentifier('s'),
            undefined,
            undefined,
          ),
        ],
        undefined,
        factory.createToken(SyntaxKind.EqualsGreaterThanToken),
        parseValue(factory.createIdentifier('s')),
      ),
    ],
  );
};

/**
 * arrayFields = nonModelFieldArray: modelFields.nonModelFieldArray.map(s => JSON.parse(item))
 * singleFields =
 *  nonModelField: modelFields.nonModelField ? JSON.parse(modelFields.nonModelField) : modelFields.nonModelField
 */
export const generateParsePropertyAssignments = (arrayFields: string[], nonArrayFields: string[]) => {
  const parseArrayFields = arrayFields.map((field) =>
    factory.createPropertyAssignment(
      factory.createIdentifier(field),
      parseArrayValues(
        factory.createPropertyAccessExpression(
          factory.createIdentifier('modelFields'),
          factory.createIdentifier(field),
        ),
      ),
    ),
  );
  const parseFields = nonArrayFields.map((field) =>
    factory.createPropertyAssignment(
      factory.createIdentifier(field),
      factory.createConditionalExpression(
        factory.createPropertyAccessExpression(
          factory.createIdentifier('modelFields'),
          factory.createIdentifier(field),
        ),
        factory.createToken(SyntaxKind.QuestionToken),
        parseValue(
          factory.createPropertyAccessExpression(
            factory.createIdentifier('modelFields'),
            factory.createIdentifier(field),
          ),
        ),
        factory.createToken(SyntaxKind.ColonToken),
        factory.createPropertyAccessExpression(
          factory.createIdentifier('modelFields'),
          factory.createIdentifier(field),
        ),
      ),
    ),
  );
  return [...parseArrayFields, ...parseFields];
};

//
export const generateUpdateModelObject = (
  fieldConfigs: Record<string, FieldConfigMetadata>,
  modelFieldsObjectName: string,
) => {
  const nonModelFields: string[] = [];
  const nonModelArrayFields: string[] = [];

  Object.entries(fieldConfigs).forEach(([name, { dataType, sanitizedFieldName, isArray }]) => {
    if (isNonModelDataType(dataType)) {
      const renderedFieldName = sanitizedFieldName || name;
      if (!isArray) {
        nonModelFields.push(renderedFieldName);
      } else {
        nonModelArrayFields.push(renderedFieldName);
      }
    }
  });
  const parsePropertyAssignments = generateParsePropertyAssignments(nonModelArrayFields, nonModelFields);
  let updateModelObject: ObjectLiteralExpression | Identifier = factory.createIdentifier(modelFieldsObjectName);
  if (parsePropertyAssignments.length) {
    updateModelObject = factory.createObjectLiteralExpression(
      [factory.createSpreadAssignment(factory.createIdentifier(modelFieldsObjectName)), ...parsePropertyAssignments],
      true,
    );
  }
  return updateModelObject;
};
