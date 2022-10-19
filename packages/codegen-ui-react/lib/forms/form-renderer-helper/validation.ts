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
  Expression,
  factory,
  NodeFlags,
  SyntaxKind,
  ObjectLiteralElementLike,
  ObjectLiteralExpression,
} from 'typescript';
import { FieldValidationConfiguration, FieldConfigMetadata, isValidVariableName } from '@aws-amplify/codegen-ui';

export const createValidationExpression = (validationRules: FieldValidationConfiguration[] = []): Expression => {
  const validateExpressions = validationRules.map<ObjectLiteralExpression>((rule) => {
    const elements: ObjectLiteralElementLike[] = [
      factory.createPropertyAssignment(factory.createIdentifier('type'), factory.createStringLiteral(rule.type)),
    ];
    if ('strValues' in rule) {
      elements.push(
        factory.createPropertyAssignment(
          factory.createIdentifier('strValues'),
          factory.createArrayLiteralExpression(
            rule.strValues.map((value) => factory.createStringLiteral(value)),
            false,
          ),
        ),
      );
    }
    if ('numValues' in rule) {
      elements.push(
        factory.createPropertyAssignment(
          factory.createIdentifier('numValues'),
          factory.createArrayLiteralExpression(
            rule.numValues.map((value) => factory.createNumericLiteral(value)),
            false,
          ),
        ),
      );
    }
    if (rule.validationMessage) {
      elements.push(
        factory.createPropertyAssignment(
          factory.createIdentifier('validationMessage'),
          factory.createStringLiteral(rule.validationMessage),
        ),
      );
    }
    return factory.createObjectLiteralExpression(elements, false);
  });

  return factory.createArrayLiteralExpression(validateExpressions, true);
};

/**
 * builds validation variable
 * for nested values it will mention the full path as that corresponds to the fields
 * this will also link to error messages
 *
 * const validations = { post_url: [{ type: "URL" }], 'user.status': [] };
 *
 * @param fieldConfigs
 * @returns
 */
export function buildValidations(fieldConfigs: Record<string, FieldConfigMetadata>) {
  const validationsForField = Object.entries(fieldConfigs).map(([fieldName, { validationRules }]) => {
    const propKey =
      fieldName.split('.').length > 1 || !isValidVariableName(fieldName)
        ? factory.createStringLiteral(fieldName)
        : factory.createIdentifier(fieldName);
    return factory.createPropertyAssignment(propKey, createValidationExpression(validationRules));
  });

  return factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier('validations'),
          undefined,
          undefined,
          factory.createObjectLiteralExpression(validationsForField, true),
        ),
      ],
      NodeFlags.Const,
    ),
  );
}

/**
    if (errors.name?.hasError) {
      runValidationTasks("name", value);
    }
   */
export function getOnChangeValidationBlock(fieldName: string) {
  return factory.createIfStatement(
    factory.createPropertyAccessChain(
      isValidVariableName(fieldName)
        ? factory.createPropertyAccessExpression(
            factory.createIdentifier('errors'),
            factory.createIdentifier(fieldName),
          )
        : factory.createElementAccessExpression(
            factory.createIdentifier('errors'),
            factory.createStringLiteral(fieldName),
          ),
      factory.createToken(SyntaxKind.QuestionDotToken),
      factory.createIdentifier('hasError'),
    ),
    factory.createBlock(
      [
        factory.createExpressionStatement(
          factory.createCallExpression(factory.createIdentifier('runValidationTasks'), undefined, [
            factory.createStringLiteral(fieldName),
            factory.createIdentifier('value'),
          ]),
        ),
      ],
      true,
    ),
    undefined,
  );
}

/**
    const runValidationTasks = async (fieldName, value) => {
      let validationResponse = validateField(value, validations[fieldName]);
      if (onValidate?.[fieldName]) {
        validationResponse = await onValidate[fieldName](value, validationResponse);
      }
      setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
      return validationResponse;
    };
   */

export const runValidationTasksFunction = factory.createVariableStatement(
  undefined,
  factory.createVariableDeclarationList(
    [
      factory.createVariableDeclaration(
        factory.createIdentifier('runValidationTasks'),
        undefined,
        undefined,
        factory.createArrowFunction(
          [factory.createModifier(SyntaxKind.AsyncKeyword)],
          undefined,
          [
            factory.createParameterDeclaration(
              undefined,
              undefined,
              undefined,
              factory.createIdentifier('fieldName'),
              undefined,
              undefined,
              undefined,
            ),
            factory.createParameterDeclaration(
              undefined,
              undefined,
              undefined,
              factory.createIdentifier('value'),
              undefined,
              undefined,
              undefined,
            ),
          ],
          undefined,
          factory.createToken(SyntaxKind.EqualsGreaterThanToken),
          factory.createBlock(
            [
              factory.createVariableStatement(
                undefined,
                factory.createVariableDeclarationList(
                  [
                    factory.createVariableDeclaration(
                      factory.createIdentifier('validationResponse'),
                      undefined,
                      undefined,
                      factory.createCallExpression(factory.createIdentifier('validateField'), undefined, [
                        factory.createIdentifier('value'),
                        factory.createElementAccessExpression(
                          factory.createIdentifier('validations'),
                          factory.createIdentifier('fieldName'),
                        ),
                      ]),
                    ),
                  ],
                  NodeFlags.Let,
                ),
              ),
              factory.createVariableStatement(
                undefined,
                factory.createVariableDeclarationList(
                  [
                    factory.createVariableDeclaration(
                      factory.createIdentifier('customValidator'),
                      undefined,
                      undefined,
                      factory.createCallExpression(factory.createIdentifier('fetchByPath'), undefined, [
                        factory.createIdentifier('onValidate'),
                        factory.createIdentifier('fieldName'),
                      ]),
                    ),
                  ],
                  NodeFlags.Const,
                ),
              ),
              factory.createIfStatement(
                factory.createIdentifier('customValidator'),
                factory.createBlock(
                  [
                    factory.createExpressionStatement(
                      factory.createBinaryExpression(
                        factory.createIdentifier('validationResponse'),
                        factory.createToken(SyntaxKind.EqualsToken),
                        factory.createAwaitExpression(
                          factory.createCallExpression(factory.createIdentifier('customValidator'), undefined, [
                            factory.createIdentifier('value'),
                            factory.createIdentifier('validationResponse'),
                          ]),
                        ),
                      ),
                    ),
                  ],
                  true,
                ),
                undefined,
              ),
              factory.createExpressionStatement(
                factory.createCallExpression(factory.createIdentifier('setErrors'), undefined, [
                  factory.createArrowFunction(
                    undefined,
                    undefined,
                    [
                      factory.createParameterDeclaration(
                        undefined,
                        undefined,
                        undefined,
                        factory.createIdentifier('errors'),
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
                          factory.createSpreadAssignment(factory.createIdentifier('errors')),
                          factory.createPropertyAssignment(
                            factory.createComputedPropertyName(factory.createIdentifier('fieldName')),
                            factory.createIdentifier('validationResponse'),
                          ),
                        ],
                        false,
                      ),
                    ),
                  ),
                ]),
              ),
              factory.createReturnStatement(factory.createIdentifier('validationResponse')),
            ],
            true,
          ),
        ),
      ),
    ],
    NodeFlags.Const,
  ),
);
