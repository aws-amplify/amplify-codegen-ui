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
import { factory, NodeFlags, ObjectLiteralElementLike } from 'typescript';
import { FieldConfigMetadata } from '@aws-amplify/codegen-ui';

/**
 * builds modelFields object which is used to validate, onSubmit, onSuccess/onError
 * the nameOverrides will swap in a different expression instead of the name of the state when building the object
 *
 * ex.  [name, content, updatedAt]
 *
 * const modelFields = {
 *   name,
 *   content,
 *   updatedAt
 * };
 * @param fieldConfigs
 * @returns
 */
export const buildModelFieldObject = (
  shouldBeConst: boolean,
  fieldConfigs: Record<string, FieldConfigMetadata> = {},
  nameOverrides: Record<string, ObjectLiteralElementLike> = {},
) => {
  const fieldSet = new Set<string>();
  const fields = Object.keys(fieldConfigs).reduce<ObjectLiteralElementLike[]>((acc, value) => {
    const fieldName = value.split('.')[0];
    const { sanitizedFieldName } = fieldConfigs[value];
    const renderedFieldName = sanitizedFieldName || fieldName;
    if (!fieldSet.has(renderedFieldName)) {
      let assignment = nameOverrides[fieldName]
        ? nameOverrides[fieldName]
        : factory.createShorthandPropertyAssignment(factory.createIdentifier(fieldName), undefined);
      if (sanitizedFieldName) {
        assignment = factory.createPropertyAssignment(
          factory.createStringLiteral(fieldName),
          factory.createIdentifier(sanitizedFieldName),
        );
      }

      acc.push(assignment);
      fieldSet.add(renderedFieldName);
    }
    return acc;
  }, []);

  return factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier('modelFields'),
          undefined,
          undefined,
          factory.createObjectLiteralExpression(fields, true),
        ),
      ],
      shouldBeConst ? NodeFlags.Const : NodeFlags.Let,
    ),
  );
};
