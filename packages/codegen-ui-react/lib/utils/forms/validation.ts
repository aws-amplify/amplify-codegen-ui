/* eslint-disable */
import ts, { factory } from 'typescript';

type ValidationResponse = { hasError: boolean; errorMessage?: string };

export const validateField = (
  value: any,
  validations: { type: string; strValues?: string[]; numValues?: number[]; validationMessage?: string }[],
): ValidationResponse => {
  for (const validation of validations) {
    if (validation.numValues?.length) {
      switch (validation.type) {
        case 'LessThanChar':
          return {
            hasError: !(value.length < validation.numValues[0]),
            errorMessage: validation.validationMessage || `The value must be shorter than ${validation.numValues[0]}`,
          };
        case 'GreaterThanChar':
          return {
            hasError: !(value.length > validation.numValues[0]),
            errorMessage: validation.validationMessage || `The value must be longer than ${validation.numValues[0]}`,
          };
        case 'LessThanNum':
          return {
            hasError: !(value < validation.numValues[0]),
            errorMessage: validation.validationMessage || `The value must be less than ${validation.numValues[0]}`,
          };
        case 'GreaterThanNum':
          return {
            hasError: !(value > validation.numValues[0]),
            errorMessage: validation.validationMessage || `The value must be greater than ${validation.numValues[0]}`,
          };
        case 'EqualTo':
          return {
            hasError: !validation.numValues.some((el) => el === value),
            errorMessage:
              validation.validationMessage || `The value must be equal to ${validation.numValues.join(' or ')}`,
          };
        default:
      }
    } else if (validation.strValues?.length) {
      switch (validation.type) {
        case 'StartWith':
          return {
            hasError: !validation.strValues.some((el: any) => value.startsWith(el)),
            errorMessage:
              validation.validationMessage || `The value must start with ${validation.strValues.join(', ')}`,
          };
        case 'EndWith':
          return {
            hasError: !validation.strValues.some((el: any) => value.endsWith(el)),
            errorMessage: validation.validationMessage || `The value must end with ${validation.strValues.join(', ')}`,
          };
        case 'Contains':
          return {
            hasError: !validation.strValues.some((el: any) => value.includes(el)),
            errorMessage: validation.validationMessage || `The value must contain ${validation.strValues.join(', ')}`,
          };
        case 'NotContains':
          return {
            hasError: !validation.strValues.every((el: any) => !value.includes(el)),
            errorMessage:
              validation.validationMessage || `The value must not contain ${validation.strValues.join(', ')}`,
          };
        case 'BeAfter':
          const afterTimeValue = parseInt(validation.strValues[0]);
          const afterTimeValidator = Number.isNaN(afterTimeValue) ? validation.strValues[0] : afterTimeValue;
          return {
            hasError: !(new Date(value) > new Date(afterTimeValidator)),
            errorMessage: validation.validationMessage || `The value must be after ${validation.strValues[0]}`,
          };
        case 'BeBefore':
          const beforeTimeValue = parseInt(validation.strValues[0]);
          const beforeTimevalue = Number.isNaN(beforeTimeValue) ? validation.strValues[0] : beforeTimeValue;
          return {
            hasError: !(new Date(value) < new Date(beforeTimevalue)),
            errorMessage: validation.validationMessage || `The value must be before ${validation.strValues[0]}`,
          };
      }
    }
    switch (validation.type) {
      case 'Required':
        return {
          hasError: value === undefined || value === '',
          errorMessage: validation.validationMessage || 'The value is required',
        };
      case 'Email':
        const EMAIL_ADDRESS_REGEX =
          /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
        return {
          hasError: !EMAIL_ADDRESS_REGEX.test(value),
          errorMessage: validation.validationMessage || 'The value must be a valid email address',
        };
      case 'JSON':
        let isInvalidJSON = false;
        try {
          JSON.parse(value);
        } catch (e) {
          isInvalidJSON = true;
        }
        return {
          hasError: isInvalidJSON,
          errorMessage: validation.validationMessage || 'The value must be in a correct JSON format',
        };
      case 'IpAddress':
        const IPV_4 = /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/;
        const IPV_6 =
          /^(?:(?:[a-fA-F\d]{1,4}:){7}(?:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){5}(?::(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,2}|:)|(?:[a-fA-F\d]{1,4}:){4}(?:(?::[a-fA-F\d]{1,4}){0,1}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,3}|:)|(?:[a-fA-F\d]{1,4}:){3}(?:(?::[a-fA-F\d]{1,4}){0,2}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,4}|:)|(?:[a-fA-F\d]{1,4}:){2}(?:(?::[a-fA-F\d]{1,4}){0,3}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,5}|:)|(?:[a-fA-F\d]{1,4}:){1}(?:(?::[a-fA-F\d]{1,4}){0,4}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,6}|:)|(?::(?:(?::[a-fA-F\d]{1,4}){0,5}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,7}|:)))(?:%[0-9a-zA-Z]{1,})?$/;
        return {
          hasError: !(IPV_4.test(value) || IPV_6.test(value)),
          errorMessage: validation.validationMessage || 'The value must be an IPv4 or IPv6 address',
        };
      case 'URL':
        let isInvalidUrl = false;
        try {
          new URL(value);
        } catch (e) {
          isInvalidUrl = true;
        }
        return {
          hasError: isInvalidUrl,
          errorMessage:
            validation.validationMessage ||
            'The value must be a valid URL that begins with a schema (i.e. http:// or mailto:)',
        };
      default:
    }
  }
  return { hasError: false };
};

export const generateValidationFunction = () => {
  return [
    factory.createTypeAliasDeclaration(
      undefined,
      undefined,
      factory.createIdentifier('ValidationResponse'),
      undefined,
      factory.createTypeLiteralNode([
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('hasError'),
          undefined,
          factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword),
        ),
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('errorMessage'),
          factory.createToken(ts.SyntaxKind.QuestionToken),
          factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
        ),
      ]),
    ),
    factory.createVariableStatement(
      [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier('validateField'),
            undefined,
            undefined,
            factory.createArrowFunction(
              undefined,
              undefined,
              [
                factory.createParameterDeclaration(
                  undefined,
                  undefined,
                  undefined,
                  factory.createIdentifier('value'),
                  undefined,
                  factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
                  undefined,
                ),
                factory.createParameterDeclaration(
                  undefined,
                  undefined,
                  undefined,
                  factory.createIdentifier('validations'),
                  undefined,
                  factory.createArrayTypeNode(
                    factory.createTypeLiteralNode([
                      factory.createPropertySignature(
                        undefined,
                        factory.createIdentifier('type'),
                        undefined,
                        factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
                      ),
                      factory.createPropertySignature(
                        undefined,
                        factory.createIdentifier('strValues'),
                        factory.createToken(ts.SyntaxKind.QuestionToken),
                        factory.createArrayTypeNode(factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)),
                      ),
                      factory.createPropertySignature(
                        undefined,
                        factory.createIdentifier('numValues'),
                        factory.createToken(ts.SyntaxKind.QuestionToken),
                        factory.createArrayTypeNode(factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)),
                      ),
                      factory.createPropertySignature(
                        undefined,
                        factory.createIdentifier('validationMessage'),
                        factory.createToken(ts.SyntaxKind.QuestionToken),
                        factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
                      ),
                    ]),
                  ),
                  undefined,
                ),
              ],
              factory.createTypeReferenceNode(factory.createIdentifier('ValidationResponse'), undefined),
              factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
              factory.createBlock(
                [
                  factory.createForOfStatement(
                    undefined,
                    factory.createVariableDeclarationList(
                      [
                        factory.createVariableDeclaration(
                          factory.createIdentifier('validation'),
                          undefined,
                          undefined,
                          undefined,
                        ),
                      ],
                      ts.NodeFlags.Const,
                    ),
                    factory.createIdentifier('validations'),
                    factory.createBlock(
                      [
                        factory.createIfStatement(
                          factory.createPropertyAccessChain(
                            factory.createPropertyAccessExpression(
                              factory.createIdentifier('validation'),
                              factory.createIdentifier('numValues'),
                            ),
                            factory.createToken(ts.SyntaxKind.QuestionDotToken),
                            factory.createIdentifier('length'),
                          ),
                          factory.createBlock(
                            [
                              factory.createSwitchStatement(
                                factory.createPropertyAccessExpression(
                                  factory.createIdentifier('validation'),
                                  factory.createIdentifier('type'),
                                ),
                                factory.createCaseBlock([
                                  factory.createCaseClause(factory.createStringLiteral('LessThanChar'), [
                                    factory.createReturnStatement(
                                      factory.createObjectLiteralExpression(
                                        [
                                          factory.createPropertyAssignment(
                                            factory.createIdentifier('hasError'),
                                            factory.createPrefixUnaryExpression(
                                              ts.SyntaxKind.ExclamationToken,
                                              factory.createParenthesizedExpression(
                                                factory.createBinaryExpression(
                                                  factory.createPropertyAccessExpression(
                                                    factory.createIdentifier('value'),
                                                    factory.createIdentifier('length'),
                                                  ),
                                                  factory.createToken(ts.SyntaxKind.LessThanToken),
                                                  factory.createElementAccessExpression(
                                                    factory.createPropertyAccessExpression(
                                                      factory.createIdentifier('validation'),
                                                      factory.createIdentifier('numValues'),
                                                    ),
                                                    factory.createNumericLiteral('0'),
                                                  ),
                                                ),
                                              ),
                                            ),
                                          ),
                                          factory.createPropertyAssignment(
                                            factory.createIdentifier('errorMessage'),
                                            factory.createBinaryExpression(
                                              factory.createPropertyAccessExpression(
                                                factory.createIdentifier('validation'),
                                                factory.createIdentifier('validationMessage'),
                                              ),
                                              factory.createToken(ts.SyntaxKind.BarBarToken),
                                              factory.createTemplateExpression(
                                                factory.createTemplateHead(
                                                  'The value must be shorter than ',
                                                  'The value must be shorter than ',
                                                ),
                                                [
                                                  factory.createTemplateSpan(
                                                    factory.createElementAccessExpression(
                                                      factory.createPropertyAccessExpression(
                                                        factory.createIdentifier('validation'),
                                                        factory.createIdentifier('numValues'),
                                                      ),
                                                      factory.createNumericLiteral('0'),
                                                    ),
                                                    factory.createTemplateTail('', ''),
                                                  ),
                                                ],
                                              ),
                                            ),
                                          ),
                                        ],
                                        true,
                                      ),
                                    ),
                                  ]),
                                  factory.createCaseClause(factory.createStringLiteral('GreaterThanChar'), [
                                    factory.createReturnStatement(
                                      factory.createObjectLiteralExpression(
                                        [
                                          factory.createPropertyAssignment(
                                            factory.createIdentifier('hasError'),
                                            factory.createPrefixUnaryExpression(
                                              ts.SyntaxKind.ExclamationToken,
                                              factory.createParenthesizedExpression(
                                                factory.createBinaryExpression(
                                                  factory.createPropertyAccessExpression(
                                                    factory.createIdentifier('value'),
                                                    factory.createIdentifier('length'),
                                                  ),
                                                  factory.createToken(ts.SyntaxKind.GreaterThanToken),
                                                  factory.createElementAccessExpression(
                                                    factory.createPropertyAccessExpression(
                                                      factory.createIdentifier('validation'),
                                                      factory.createIdentifier('numValues'),
                                                    ),
                                                    factory.createNumericLiteral('0'),
                                                  ),
                                                ),
                                              ),
                                            ),
                                          ),
                                          factory.createPropertyAssignment(
                                            factory.createIdentifier('errorMessage'),
                                            factory.createBinaryExpression(
                                              factory.createPropertyAccessExpression(
                                                factory.createIdentifier('validation'),
                                                factory.createIdentifier('validationMessage'),
                                              ),
                                              factory.createToken(ts.SyntaxKind.BarBarToken),
                                              factory.createTemplateExpression(
                                                factory.createTemplateHead(
                                                  'The value must be longer than ',
                                                  'The value must be longer than ',
                                                ),
                                                [
                                                  factory.createTemplateSpan(
                                                    factory.createElementAccessExpression(
                                                      factory.createPropertyAccessExpression(
                                                        factory.createIdentifier('validation'),
                                                        factory.createIdentifier('numValues'),
                                                      ),
                                                      factory.createNumericLiteral('0'),
                                                    ),
                                                    factory.createTemplateTail('', ''),
                                                  ),
                                                ],
                                              ),
                                            ),
                                          ),
                                        ],
                                        true,
                                      ),
                                    ),
                                  ]),
                                  factory.createCaseClause(factory.createStringLiteral('LessThanNum'), [
                                    factory.createReturnStatement(
                                      factory.createObjectLiteralExpression(
                                        [
                                          factory.createPropertyAssignment(
                                            factory.createIdentifier('hasError'),
                                            factory.createPrefixUnaryExpression(
                                              ts.SyntaxKind.ExclamationToken,
                                              factory.createParenthesizedExpression(
                                                factory.createBinaryExpression(
                                                  factory.createIdentifier('value'),
                                                  factory.createToken(ts.SyntaxKind.LessThanToken),
                                                  factory.createElementAccessExpression(
                                                    factory.createPropertyAccessExpression(
                                                      factory.createIdentifier('validation'),
                                                      factory.createIdentifier('numValues'),
                                                    ),
                                                    factory.createNumericLiteral('0'),
                                                  ),
                                                ),
                                              ),
                                            ),
                                          ),
                                          factory.createPropertyAssignment(
                                            factory.createIdentifier('errorMessage'),
                                            factory.createBinaryExpression(
                                              factory.createPropertyAccessExpression(
                                                factory.createIdentifier('validation'),
                                                factory.createIdentifier('validationMessage'),
                                              ),
                                              factory.createToken(ts.SyntaxKind.BarBarToken),
                                              factory.createTemplateExpression(
                                                factory.createTemplateHead(
                                                  'The value must be less than ',
                                                  'The value must be less than ',
                                                ),
                                                [
                                                  factory.createTemplateSpan(
                                                    factory.createElementAccessExpression(
                                                      factory.createPropertyAccessExpression(
                                                        factory.createIdentifier('validation'),
                                                        factory.createIdentifier('numValues'),
                                                      ),
                                                      factory.createNumericLiteral('0'),
                                                    ),
                                                    factory.createTemplateTail('', ''),
                                                  ),
                                                ],
                                              ),
                                            ),
                                          ),
                                        ],
                                        true,
                                      ),
                                    ),
                                  ]),
                                  factory.createCaseClause(factory.createStringLiteral('GreaterThanNum'), [
                                    factory.createReturnStatement(
                                      factory.createObjectLiteralExpression(
                                        [
                                          factory.createPropertyAssignment(
                                            factory.createIdentifier('hasError'),
                                            factory.createPrefixUnaryExpression(
                                              ts.SyntaxKind.ExclamationToken,
                                              factory.createParenthesizedExpression(
                                                factory.createBinaryExpression(
                                                  factory.createIdentifier('value'),
                                                  factory.createToken(ts.SyntaxKind.GreaterThanToken),
                                                  factory.createElementAccessExpression(
                                                    factory.createPropertyAccessExpression(
                                                      factory.createIdentifier('validation'),
                                                      factory.createIdentifier('numValues'),
                                                    ),
                                                    factory.createNumericLiteral('0'),
                                                  ),
                                                ),
                                              ),
                                            ),
                                          ),
                                          factory.createPropertyAssignment(
                                            factory.createIdentifier('errorMessage'),
                                            factory.createBinaryExpression(
                                              factory.createPropertyAccessExpression(
                                                factory.createIdentifier('validation'),
                                                factory.createIdentifier('validationMessage'),
                                              ),
                                              factory.createToken(ts.SyntaxKind.BarBarToken),
                                              factory.createTemplateExpression(
                                                factory.createTemplateHead(
                                                  'The value must be greater than ',
                                                  'The value must be greater than ',
                                                ),
                                                [
                                                  factory.createTemplateSpan(
                                                    factory.createElementAccessExpression(
                                                      factory.createPropertyAccessExpression(
                                                        factory.createIdentifier('validation'),
                                                        factory.createIdentifier('numValues'),
                                                      ),
                                                      factory.createNumericLiteral('0'),
                                                    ),
                                                    factory.createTemplateTail('', ''),
                                                  ),
                                                ],
                                              ),
                                            ),
                                          ),
                                        ],
                                        true,
                                      ),
                                    ),
                                  ]),
                                  factory.createCaseClause(factory.createStringLiteral('EqualTo'), [
                                    factory.createReturnStatement(
                                      factory.createObjectLiteralExpression(
                                        [
                                          factory.createPropertyAssignment(
                                            factory.createIdentifier('hasError'),
                                            factory.createPrefixUnaryExpression(
                                              ts.SyntaxKind.ExclamationToken,
                                              factory.createCallExpression(
                                                factory.createPropertyAccessExpression(
                                                  factory.createPropertyAccessExpression(
                                                    factory.createIdentifier('validation'),
                                                    factory.createIdentifier('numValues'),
                                                  ),
                                                  factory.createIdentifier('some'),
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
                                                        factory.createIdentifier('el'),
                                                        undefined,
                                                        undefined,
                                                        undefined,
                                                      ),
                                                    ],
                                                    undefined,
                                                    factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                                    factory.createBinaryExpression(
                                                      factory.createIdentifier('el'),
                                                      factory.createToken(ts.SyntaxKind.EqualsEqualsEqualsToken),
                                                      factory.createIdentifier('value'),
                                                    ),
                                                  ),
                                                ],
                                              ),
                                            ),
                                          ),
                                          factory.createPropertyAssignment(
                                            factory.createIdentifier('errorMessage'),
                                            factory.createBinaryExpression(
                                              factory.createPropertyAccessExpression(
                                                factory.createIdentifier('validation'),
                                                factory.createIdentifier('validationMessage'),
                                              ),
                                              factory.createToken(ts.SyntaxKind.BarBarToken),
                                              factory.createTemplateExpression(
                                                factory.createTemplateHead(
                                                  'The value must be equal to ',
                                                  'The value must be equal to ',
                                                ),
                                                [
                                                  factory.createTemplateSpan(
                                                    factory.createCallExpression(
                                                      factory.createPropertyAccessExpression(
                                                        factory.createPropertyAccessExpression(
                                                          factory.createIdentifier('validation'),
                                                          factory.createIdentifier('numValues'),
                                                        ),
                                                        factory.createIdentifier('join'),
                                                      ),
                                                      undefined,
                                                      [factory.createStringLiteral(' or ')],
                                                    ),
                                                    factory.createTemplateTail('', ''),
                                                  ),
                                                ],
                                              ),
                                            ),
                                          ),
                                        ],
                                        true,
                                      ),
                                    ),
                                  ]),
                                  factory.createDefaultClause([]),
                                ]),
                              ),
                            ],
                            true,
                          ),
                          factory.createIfStatement(
                            factory.createPropertyAccessChain(
                              factory.createPropertyAccessExpression(
                                factory.createIdentifier('validation'),
                                factory.createIdentifier('strValues'),
                              ),
                              factory.createToken(ts.SyntaxKind.QuestionDotToken),
                              factory.createIdentifier('length'),
                            ),
                            factory.createBlock(
                              [
                                factory.createSwitchStatement(
                                  factory.createPropertyAccessExpression(
                                    factory.createIdentifier('validation'),
                                    factory.createIdentifier('type'),
                                  ),
                                  factory.createCaseBlock([
                                    factory.createCaseClause(factory.createStringLiteral('StartWith'), [
                                      factory.createReturnStatement(
                                        factory.createObjectLiteralExpression(
                                          [
                                            factory.createPropertyAssignment(
                                              factory.createIdentifier('hasError'),
                                              factory.createPrefixUnaryExpression(
                                                ts.SyntaxKind.ExclamationToken,
                                                factory.createCallExpression(
                                                  factory.createPropertyAccessExpression(
                                                    factory.createPropertyAccessExpression(
                                                      factory.createIdentifier('validation'),
                                                      factory.createIdentifier('strValues'),
                                                    ),
                                                    factory.createIdentifier('some'),
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
                                                          factory.createIdentifier('el'),
                                                          undefined,
                                                          factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
                                                          undefined,
                                                        ),
                                                      ],
                                                      undefined,
                                                      factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                                      factory.createCallExpression(
                                                        factory.createPropertyAccessExpression(
                                                          factory.createIdentifier('value'),
                                                          factory.createIdentifier('startsWith'),
                                                        ),
                                                        undefined,
                                                        [factory.createIdentifier('el')],
                                                      ),
                                                    ),
                                                  ],
                                                ),
                                              ),
                                            ),
                                            factory.createPropertyAssignment(
                                              factory.createIdentifier('errorMessage'),
                                              factory.createBinaryExpression(
                                                factory.createPropertyAccessExpression(
                                                  factory.createIdentifier('validation'),
                                                  factory.createIdentifier('validationMessage'),
                                                ),
                                                factory.createToken(ts.SyntaxKind.BarBarToken),
                                                factory.createTemplateExpression(
                                                  factory.createTemplateHead(
                                                    'The value must start with ',
                                                    'The value must start with ',
                                                  ),
                                                  [
                                                    factory.createTemplateSpan(
                                                      factory.createCallExpression(
                                                        factory.createPropertyAccessExpression(
                                                          factory.createPropertyAccessExpression(
                                                            factory.createIdentifier('validation'),
                                                            factory.createIdentifier('strValues'),
                                                          ),
                                                          factory.createIdentifier('join'),
                                                        ),
                                                        undefined,
                                                        [factory.createStringLiteral(', ')],
                                                      ),
                                                      factory.createTemplateTail('', ''),
                                                    ),
                                                  ],
                                                ),
                                              ),
                                            ),
                                          ],
                                          true,
                                        ),
                                      ),
                                    ]),
                                    factory.createCaseClause(factory.createStringLiteral('EndWith'), [
                                      factory.createReturnStatement(
                                        factory.createObjectLiteralExpression(
                                          [
                                            factory.createPropertyAssignment(
                                              factory.createIdentifier('hasError'),
                                              factory.createPrefixUnaryExpression(
                                                ts.SyntaxKind.ExclamationToken,
                                                factory.createCallExpression(
                                                  factory.createPropertyAccessExpression(
                                                    factory.createPropertyAccessExpression(
                                                      factory.createIdentifier('validation'),
                                                      factory.createIdentifier('strValues'),
                                                    ),
                                                    factory.createIdentifier('some'),
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
                                                          factory.createIdentifier('el'),
                                                          undefined,
                                                          factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
                                                          undefined,
                                                        ),
                                                      ],
                                                      undefined,
                                                      factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                                      factory.createCallExpression(
                                                        factory.createPropertyAccessExpression(
                                                          factory.createIdentifier('value'),
                                                          factory.createIdentifier('endsWith'),
                                                        ),
                                                        undefined,
                                                        [factory.createIdentifier('el')],
                                                      ),
                                                    ),
                                                  ],
                                                ),
                                              ),
                                            ),
                                            factory.createPropertyAssignment(
                                              factory.createIdentifier('errorMessage'),
                                              factory.createBinaryExpression(
                                                factory.createPropertyAccessExpression(
                                                  factory.createIdentifier('validation'),
                                                  factory.createIdentifier('validationMessage'),
                                                ),
                                                factory.createToken(ts.SyntaxKind.BarBarToken),
                                                factory.createTemplateExpression(
                                                  factory.createTemplateHead(
                                                    'The value must end with ',
                                                    'The value must end with ',
                                                  ),
                                                  [
                                                    factory.createTemplateSpan(
                                                      factory.createCallExpression(
                                                        factory.createPropertyAccessExpression(
                                                          factory.createPropertyAccessExpression(
                                                            factory.createIdentifier('validation'),
                                                            factory.createIdentifier('strValues'),
                                                          ),
                                                          factory.createIdentifier('join'),
                                                        ),
                                                        undefined,
                                                        [factory.createStringLiteral(', ')],
                                                      ),
                                                      factory.createTemplateTail('', ''),
                                                    ),
                                                  ],
                                                ),
                                              ),
                                            ),
                                          ],
                                          true,
                                        ),
                                      ),
                                    ]),
                                    factory.createCaseClause(factory.createStringLiteral('Contains'), [
                                      factory.createReturnStatement(
                                        factory.createObjectLiteralExpression(
                                          [
                                            factory.createPropertyAssignment(
                                              factory.createIdentifier('hasError'),
                                              factory.createPrefixUnaryExpression(
                                                ts.SyntaxKind.ExclamationToken,
                                                factory.createCallExpression(
                                                  factory.createPropertyAccessExpression(
                                                    factory.createPropertyAccessExpression(
                                                      factory.createIdentifier('validation'),
                                                      factory.createIdentifier('strValues'),
                                                    ),
                                                    factory.createIdentifier('some'),
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
                                                          factory.createIdentifier('el'),
                                                          undefined,
                                                          factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
                                                          undefined,
                                                        ),
                                                      ],
                                                      undefined,
                                                      factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                                      factory.createCallExpression(
                                                        factory.createPropertyAccessExpression(
                                                          factory.createIdentifier('value'),
                                                          factory.createIdentifier('includes'),
                                                        ),
                                                        undefined,
                                                        [factory.createIdentifier('el')],
                                                      ),
                                                    ),
                                                  ],
                                                ),
                                              ),
                                            ),
                                            factory.createPropertyAssignment(
                                              factory.createIdentifier('errorMessage'),
                                              factory.createBinaryExpression(
                                                factory.createPropertyAccessExpression(
                                                  factory.createIdentifier('validation'),
                                                  factory.createIdentifier('validationMessage'),
                                                ),
                                                factory.createToken(ts.SyntaxKind.BarBarToken),
                                                factory.createTemplateExpression(
                                                  factory.createTemplateHead(
                                                    'The value must contain ',
                                                    'The value must contain ',
                                                  ),
                                                  [
                                                    factory.createTemplateSpan(
                                                      factory.createCallExpression(
                                                        factory.createPropertyAccessExpression(
                                                          factory.createPropertyAccessExpression(
                                                            factory.createIdentifier('validation'),
                                                            factory.createIdentifier('strValues'),
                                                          ),
                                                          factory.createIdentifier('join'),
                                                        ),
                                                        undefined,
                                                        [factory.createStringLiteral(', ')],
                                                      ),
                                                      factory.createTemplateTail('', ''),
                                                    ),
                                                  ],
                                                ),
                                              ),
                                            ),
                                          ],
                                          true,
                                        ),
                                      ),
                                    ]),
                                    factory.createCaseClause(factory.createStringLiteral('NotContains'), [
                                      factory.createReturnStatement(
                                        factory.createObjectLiteralExpression(
                                          [
                                            factory.createPropertyAssignment(
                                              factory.createIdentifier('hasError'),
                                              factory.createPrefixUnaryExpression(
                                                ts.SyntaxKind.ExclamationToken,
                                                factory.createCallExpression(
                                                  factory.createPropertyAccessExpression(
                                                    factory.createPropertyAccessExpression(
                                                      factory.createIdentifier('validation'),
                                                      factory.createIdentifier('strValues'),
                                                    ),
                                                    factory.createIdentifier('every'),
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
                                                          factory.createIdentifier('el'),
                                                          undefined,
                                                          factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
                                                          undefined,
                                                        ),
                                                      ],
                                                      undefined,
                                                      factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                                      factory.createPrefixUnaryExpression(
                                                        ts.SyntaxKind.ExclamationToken,
                                                        factory.createCallExpression(
                                                          factory.createPropertyAccessExpression(
                                                            factory.createIdentifier('value'),
                                                            factory.createIdentifier('includes'),
                                                          ),
                                                          undefined,
                                                          [factory.createIdentifier('el')],
                                                        ),
                                                      ),
                                                    ),
                                                  ],
                                                ),
                                              ),
                                            ),
                                            factory.createPropertyAssignment(
                                              factory.createIdentifier('errorMessage'),
                                              factory.createBinaryExpression(
                                                factory.createPropertyAccessExpression(
                                                  factory.createIdentifier('validation'),
                                                  factory.createIdentifier('validationMessage'),
                                                ),
                                                factory.createToken(ts.SyntaxKind.BarBarToken),
                                                factory.createTemplateExpression(
                                                  factory.createTemplateHead(
                                                    'The value must not contain ',
                                                    'The value must not contain ',
                                                  ),
                                                  [
                                                    factory.createTemplateSpan(
                                                      factory.createCallExpression(
                                                        factory.createPropertyAccessExpression(
                                                          factory.createPropertyAccessExpression(
                                                            factory.createIdentifier('validation'),
                                                            factory.createIdentifier('strValues'),
                                                          ),
                                                          factory.createIdentifier('join'),
                                                        ),
                                                        undefined,
                                                        [factory.createStringLiteral(', ')],
                                                      ),
                                                      factory.createTemplateTail('', ''),
                                                    ),
                                                  ],
                                                ),
                                              ),
                                            ),
                                          ],
                                          true,
                                        ),
                                      ),
                                    ]),
                                    factory.createCaseClause(factory.createStringLiteral('BeAfter'), [
                                      factory.createVariableStatement(
                                        undefined,
                                        factory.createVariableDeclarationList(
                                          [
                                            factory.createVariableDeclaration(
                                              factory.createIdentifier('afterTimeValue'),
                                              undefined,
                                              undefined,
                                              factory.createCallExpression(
                                                factory.createIdentifier('parseInt'),
                                                undefined,
                                                [
                                                  factory.createElementAccessExpression(
                                                    factory.createPropertyAccessExpression(
                                                      factory.createIdentifier('validation'),
                                                      factory.createIdentifier('strValues'),
                                                    ),
                                                    factory.createNumericLiteral('0'),
                                                  ),
                                                ],
                                              ),
                                            ),
                                          ],
                                          ts.NodeFlags.Const,
                                        ),
                                      ),
                                      factory.createVariableStatement(
                                        undefined,
                                        factory.createVariableDeclarationList(
                                          [
                                            factory.createVariableDeclaration(
                                              factory.createIdentifier('afterTimeValidator'),
                                              undefined,
                                              undefined,
                                              factory.createConditionalExpression(
                                                factory.createCallExpression(
                                                  factory.createPropertyAccessExpression(
                                                    factory.createIdentifier('Number'),
                                                    factory.createIdentifier('isNaN'),
                                                  ),
                                                  undefined,
                                                  [factory.createIdentifier('afterTimeValue')],
                                                ),
                                                factory.createToken(ts.SyntaxKind.QuestionToken),
                                                factory.createElementAccessExpression(
                                                  factory.createPropertyAccessExpression(
                                                    factory.createIdentifier('validation'),
                                                    factory.createIdentifier('strValues'),
                                                  ),
                                                  factory.createNumericLiteral('0'),
                                                ),
                                                factory.createToken(ts.SyntaxKind.ColonToken),
                                                factory.createIdentifier('afterTimeValue'),
                                              ),
                                            ),
                                          ],
                                          ts.NodeFlags.Const,
                                        ),
                                      ),
                                      factory.createReturnStatement(
                                        factory.createObjectLiteralExpression(
                                          [
                                            factory.createPropertyAssignment(
                                              factory.createIdentifier('hasError'),
                                              factory.createPrefixUnaryExpression(
                                                ts.SyntaxKind.ExclamationToken,
                                                factory.createParenthesizedExpression(
                                                  factory.createBinaryExpression(
                                                    factory.createNewExpression(
                                                      factory.createIdentifier('Date'),
                                                      undefined,
                                                      [factory.createIdentifier('value')],
                                                    ),
                                                    factory.createToken(ts.SyntaxKind.GreaterThanToken),
                                                    factory.createNewExpression(
                                                      factory.createIdentifier('Date'),
                                                      undefined,
                                                      [factory.createIdentifier('afterTimeValidator')],
                                                    ),
                                                  ),
                                                ),
                                              ),
                                            ),
                                            factory.createPropertyAssignment(
                                              factory.createIdentifier('errorMessage'),
                                              factory.createBinaryExpression(
                                                factory.createPropertyAccessExpression(
                                                  factory.createIdentifier('validation'),
                                                  factory.createIdentifier('validationMessage'),
                                                ),
                                                factory.createToken(ts.SyntaxKind.BarBarToken),
                                                factory.createTemplateExpression(
                                                  factory.createTemplateHead(
                                                    'The value must be after ',
                                                    'The value must be after ',
                                                  ),
                                                  [
                                                    factory.createTemplateSpan(
                                                      factory.createElementAccessExpression(
                                                        factory.createPropertyAccessExpression(
                                                          factory.createIdentifier('validation'),
                                                          factory.createIdentifier('strValues'),
                                                        ),
                                                        factory.createNumericLiteral('0'),
                                                      ),
                                                      factory.createTemplateTail('', ''),
                                                    ),
                                                  ],
                                                ),
                                              ),
                                            ),
                                          ],
                                          true,
                                        ),
                                      ),
                                    ]),
                                    factory.createCaseClause(factory.createStringLiteral('BeBefore'), [
                                      factory.createVariableStatement(
                                        undefined,
                                        factory.createVariableDeclarationList(
                                          [
                                            factory.createVariableDeclaration(
                                              factory.createIdentifier('beforeTimeValue'),
                                              undefined,
                                              undefined,
                                              factory.createCallExpression(
                                                factory.createIdentifier('parseInt'),
                                                undefined,
                                                [
                                                  factory.createElementAccessExpression(
                                                    factory.createPropertyAccessExpression(
                                                      factory.createIdentifier('validation'),
                                                      factory.createIdentifier('strValues'),
                                                    ),
                                                    factory.createNumericLiteral('0'),
                                                  ),
                                                ],
                                              ),
                                            ),
                                          ],
                                          ts.NodeFlags.Const,
                                        ),
                                      ),
                                      factory.createVariableStatement(
                                        undefined,
                                        factory.createVariableDeclarationList(
                                          [
                                            factory.createVariableDeclaration(
                                              factory.createIdentifier('beforeTimevalue'),
                                              undefined,
                                              undefined,
                                              factory.createConditionalExpression(
                                                factory.createCallExpression(
                                                  factory.createPropertyAccessExpression(
                                                    factory.createIdentifier('Number'),
                                                    factory.createIdentifier('isNaN'),
                                                  ),
                                                  undefined,
                                                  [factory.createIdentifier('beforeTimeValue')],
                                                ),
                                                factory.createToken(ts.SyntaxKind.QuestionToken),
                                                factory.createElementAccessExpression(
                                                  factory.createPropertyAccessExpression(
                                                    factory.createIdentifier('validation'),
                                                    factory.createIdentifier('strValues'),
                                                  ),
                                                  factory.createNumericLiteral('0'),
                                                ),
                                                factory.createToken(ts.SyntaxKind.ColonToken),
                                                factory.createIdentifier('beforeTimeValue'),
                                              ),
                                            ),
                                          ],
                                          ts.NodeFlags.Const,
                                        ),
                                      ),
                                      factory.createReturnStatement(
                                        factory.createObjectLiteralExpression(
                                          [
                                            factory.createPropertyAssignment(
                                              factory.createIdentifier('hasError'),
                                              factory.createPrefixUnaryExpression(
                                                ts.SyntaxKind.ExclamationToken,
                                                factory.createParenthesizedExpression(
                                                  factory.createBinaryExpression(
                                                    factory.createNewExpression(
                                                      factory.createIdentifier('Date'),
                                                      undefined,
                                                      [factory.createIdentifier('value')],
                                                    ),
                                                    factory.createToken(ts.SyntaxKind.LessThanToken),
                                                    factory.createNewExpression(
                                                      factory.createIdentifier('Date'),
                                                      undefined,
                                                      [factory.createIdentifier('beforeTimevalue')],
                                                    ),
                                                  ),
                                                ),
                                              ),
                                            ),
                                            factory.createPropertyAssignment(
                                              factory.createIdentifier('errorMessage'),
                                              factory.createBinaryExpression(
                                                factory.createPropertyAccessExpression(
                                                  factory.createIdentifier('validation'),
                                                  factory.createIdentifier('validationMessage'),
                                                ),
                                                factory.createToken(ts.SyntaxKind.BarBarToken),
                                                factory.createTemplateExpression(
                                                  factory.createTemplateHead(
                                                    'The value must be before ',
                                                    'The value must be before ',
                                                  ),
                                                  [
                                                    factory.createTemplateSpan(
                                                      factory.createElementAccessExpression(
                                                        factory.createPropertyAccessExpression(
                                                          factory.createIdentifier('validation'),
                                                          factory.createIdentifier('strValues'),
                                                        ),
                                                        factory.createNumericLiteral('0'),
                                                      ),
                                                      factory.createTemplateTail('', ''),
                                                    ),
                                                  ],
                                                ),
                                              ),
                                            ),
                                          ],
                                          true,
                                        ),
                                      ),
                                    ]),
                                  ]),
                                ),
                              ],
                              true,
                            ),
                            undefined,
                          ),
                        ),
                        factory.createSwitchStatement(
                          factory.createPropertyAccessExpression(
                            factory.createIdentifier('validation'),
                            factory.createIdentifier('type'),
                          ),
                          factory.createCaseBlock([
                            factory.createCaseClause(factory.createStringLiteral('Required'), [
                              factory.createReturnStatement(
                                factory.createObjectLiteralExpression(
                                  [
                                    factory.createPropertyAssignment(
                                      factory.createIdentifier('hasError'),
                                      factory.createBinaryExpression(
                                        factory.createBinaryExpression(
                                          factory.createIdentifier('value'),
                                          factory.createToken(ts.SyntaxKind.EqualsEqualsEqualsToken),
                                          factory.createIdentifier('undefined'),
                                        ),
                                        factory.createToken(ts.SyntaxKind.BarBarToken),
                                        factory.createBinaryExpression(
                                          factory.createIdentifier('value'),
                                          factory.createToken(ts.SyntaxKind.EqualsEqualsEqualsToken),
                                          factory.createStringLiteral(''),
                                        ),
                                      ),
                                    ),
                                    factory.createPropertyAssignment(
                                      factory.createIdentifier('errorMessage'),
                                      factory.createBinaryExpression(
                                        factory.createPropertyAccessExpression(
                                          factory.createIdentifier('validation'),
                                          factory.createIdentifier('validationMessage'),
                                        ),
                                        factory.createToken(ts.SyntaxKind.BarBarToken),
                                        factory.createStringLiteral('The value is required'),
                                      ),
                                    ),
                                  ],
                                  true,
                                ),
                              ),
                            ]),
                            factory.createCaseClause(factory.createStringLiteral('Email'), [
                              factory.createVariableStatement(
                                undefined,
                                factory.createVariableDeclarationList(
                                  [
                                    factory.createVariableDeclaration(
                                      factory.createIdentifier('EMAIL_ADDRESS_REGEX'),
                                      undefined,
                                      undefined,
                                      factory.createRegularExpressionLiteral(
                                        "/^[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~](.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*.?[a-zA-Z0-9])*.[a-zA-Z](-?[a-zA-Z0-9])+$/",
                                      ),
                                    ),
                                  ],
                                  ts.NodeFlags.Const,
                                ),
                              ),
                              factory.createReturnStatement(
                                factory.createObjectLiteralExpression(
                                  [
                                    factory.createPropertyAssignment(
                                      factory.createIdentifier('hasError'),
                                      factory.createPrefixUnaryExpression(
                                        ts.SyntaxKind.ExclamationToken,
                                        factory.createCallExpression(
                                          factory.createPropertyAccessExpression(
                                            factory.createIdentifier('EMAIL_ADDRESS_REGEX'),
                                            factory.createIdentifier('test'),
                                          ),
                                          undefined,
                                          [factory.createIdentifier('value')],
                                        ),
                                      ),
                                    ),
                                    factory.createPropertyAssignment(
                                      factory.createIdentifier('errorMessage'),
                                      factory.createBinaryExpression(
                                        factory.createPropertyAccessExpression(
                                          factory.createIdentifier('validation'),
                                          factory.createIdentifier('validationMessage'),
                                        ),
                                        factory.createToken(ts.SyntaxKind.BarBarToken),
                                        factory.createStringLiteral('The value must be a valid email address'),
                                      ),
                                    ),
                                  ],
                                  true,
                                ),
                              ),
                            ]),
                            factory.createCaseClause(factory.createStringLiteral('JSON'), [
                              factory.createVariableStatement(
                                undefined,
                                factory.createVariableDeclarationList(
                                  [
                                    factory.createVariableDeclaration(
                                      factory.createIdentifier('isInvalidJSON'),
                                      undefined,
                                      undefined,
                                      factory.createFalse(),
                                    ),
                                  ],
                                  ts.NodeFlags.Let,
                                ),
                              ),
                              factory.createTryStatement(
                                factory.createBlock(
                                  [
                                    factory.createExpressionStatement(
                                      factory.createCallExpression(
                                        factory.createPropertyAccessExpression(
                                          factory.createIdentifier('JSON'),
                                          factory.createIdentifier('parse'),
                                        ),
                                        undefined,
                                        [factory.createIdentifier('value')],
                                      ),
                                    ),
                                  ],
                                  true,
                                ),
                                factory.createCatchClause(
                                  factory.createVariableDeclaration(
                                    factory.createIdentifier('e'),
                                    undefined,
                                    undefined,
                                    undefined,
                                  ),
                                  factory.createBlock(
                                    [
                                      factory.createExpressionStatement(
                                        factory.createBinaryExpression(
                                          factory.createIdentifier('isInvalidJSON'),
                                          factory.createToken(ts.SyntaxKind.EqualsToken),
                                          factory.createTrue(),
                                        ),
                                      ),
                                    ],
                                    true,
                                  ),
                                ),
                                undefined,
                              ),
                              factory.createReturnStatement(
                                factory.createObjectLiteralExpression(
                                  [
                                    factory.createPropertyAssignment(
                                      factory.createIdentifier('hasError'),
                                      factory.createIdentifier('isInvalidJSON'),
                                    ),
                                    factory.createPropertyAssignment(
                                      factory.createIdentifier('errorMessage'),
                                      factory.createBinaryExpression(
                                        factory.createPropertyAccessExpression(
                                          factory.createIdentifier('validation'),
                                          factory.createIdentifier('validationMessage'),
                                        ),
                                        factory.createToken(ts.SyntaxKind.BarBarToken),
                                        factory.createStringLiteral('The value must be in a correct JSON format'),
                                      ),
                                    ),
                                  ],
                                  true,
                                ),
                              ),
                            ]),
                            factory.createCaseClause(factory.createStringLiteral('IpAddress'), [
                              factory.createVariableStatement(
                                undefined,
                                factory.createVariableDeclarationList(
                                  [
                                    factory.createVariableDeclaration(
                                      factory.createIdentifier('IPV_4'),
                                      undefined,
                                      undefined,
                                      factory.createRegularExpressionLiteral(
                                        '/^(?:25[0-5]|2[0-4]d|1dd|[1-9]d|d)(?:.(?:25[0-5]|2[0-4]d|1dd|[1-9]d|d)){3}$/',
                                      ),
                                    ),
                                  ],
                                  ts.NodeFlags.Const,
                                ),
                              ),
                              factory.createVariableStatement(
                                undefined,
                                factory.createVariableDeclarationList(
                                  [
                                    factory.createVariableDeclaration(
                                      factory.createIdentifier('IPV_6'),
                                      undefined,
                                      undefined,
                                      factory.createRegularExpressionLiteral(
                                        '/^(?:(?:[a-fA-Fd]{1,4}:){7}(?:[a-fA-Fd]{1,4}|:)|(?:[a-fA-Fd]{1,4}:){6}(?:(?:25[0-5]|2[0-4]d|1dd|[1-9]d|d)(?:\\.(?:25[0-5]|2[0-4]d|1dd|[1-9]d|d)){3}|:[a-fA-Fd]{1,4}|:)|(?:[a-fA-Fd]{1,4}:){5}(?::(?:25[0-5]|2[0-4]d|1dd|[1-9]d|d)(?:\\.(?:25[0-5]|2[0-4]d|1dd|[1-9]d|d)){3}|(?::[a-fA-Fd]{1,4}){1,2}|:)|(?:[a-fA-Fd]{1,4}:){4}(?:(?::[a-fA-Fd]{1,4}){0,1}:(?:25[0-5]|2[0-4]d|1dd|[1-9]d|d)(?:\\.(?:25[0-5]|2[0-4]d|1dd|[1-9]d|d)){3}|(?::[a-fA-Fd]{1,4}){1,3}|:)|(?:[a-fA-Fd]{1,4}:){3}(?:(?::[a-fA-Fd]{1,4}){0,2}:(?:25[0-5]|2[0-4]d|1dd|[1-9]d|d)(?:\\.(?:25[0-5]|2[0-4]d|1dd|[1-9]d|d)){3}|(?::[a-fA-Fd]{1,4}){1,4}|:)|(?:[a-fA-Fd]{1,4}:){2}(?:(?::[a-fA-Fd]{1,4}){0,3}:(?:25[0-5]|2[0-4]d|1dd|[1-9]d|d)(?:\\.(?:25[0-5]|2[0-4]d|1dd|[1-9]d|d)){3}|(?::[a-fA-Fd]{1,4}){1,5}|:)|(?:[a-fA-Fd]{1,4}:){1}(?:(?::[a-fA-Fd]{1,4}){0,4}:(?:25[0-5]|2[0-4]d|1dd|[1-9]d|d)(?:\\.(?:25[0-5]|2[0-4]d|1dd|[1-9]d|d)){3}|(?::[a-fA-Fd]{1,4}){1,6}|:)|(?::(?:(?::[a-fA-Fd]{1,4}){0,5}:(?:25[0-5]|2[0-4]d|1dd|[1-9]d|d)(?:\\.(?:25[0-5]|2[0-4]d|1dd|[1-9]d|d)){3}|(?::[a-fA-Fd]{1,4}){1,7}|:)))(?:%[0-9a-zA-Z]{1,})?$/',
                                      ),
                                    ),
                                  ],
                                  ts.NodeFlags.Const,
                                ),
                              ),
                              factory.createReturnStatement(
                                factory.createObjectLiteralExpression(
                                  [
                                    factory.createPropertyAssignment(
                                      factory.createIdentifier('hasError'),
                                      factory.createPrefixUnaryExpression(
                                        ts.SyntaxKind.ExclamationToken,
                                        factory.createParenthesizedExpression(
                                          factory.createBinaryExpression(
                                            factory.createCallExpression(
                                              factory.createPropertyAccessExpression(
                                                factory.createIdentifier('IPV_4'),
                                                factory.createIdentifier('test'),
                                              ),
                                              undefined,
                                              [factory.createIdentifier('value')],
                                            ),
                                            factory.createToken(ts.SyntaxKind.BarBarToken),
                                            factory.createCallExpression(
                                              factory.createPropertyAccessExpression(
                                                factory.createIdentifier('IPV_6'),
                                                factory.createIdentifier('test'),
                                              ),
                                              undefined,
                                              [factory.createIdentifier('value')],
                                            ),
                                          ),
                                        ),
                                      ),
                                    ),
                                    factory.createPropertyAssignment(
                                      factory.createIdentifier('errorMessage'),
                                      factory.createBinaryExpression(
                                        factory.createPropertyAccessExpression(
                                          factory.createIdentifier('validation'),
                                          factory.createIdentifier('validationMessage'),
                                        ),
                                        factory.createToken(ts.SyntaxKind.BarBarToken),
                                        factory.createStringLiteral('The value must be an IPv4 or IPv6 address'),
                                      ),
                                    ),
                                  ],
                                  true,
                                ),
                              ),
                            ]),
                            factory.createCaseClause(factory.createStringLiteral('URL'), [
                              factory.createVariableStatement(
                                undefined,
                                factory.createVariableDeclarationList(
                                  [
                                    factory.createVariableDeclaration(
                                      factory.createIdentifier('isInvalidUrl'),
                                      undefined,
                                      undefined,
                                      factory.createFalse(),
                                    ),
                                  ],
                                  ts.NodeFlags.Let,
                                ),
                              ),
                              factory.createTryStatement(
                                factory.createBlock(
                                  [
                                    factory.createExpressionStatement(
                                      factory.createNewExpression(factory.createIdentifier('URL'), undefined, [
                                        factory.createIdentifier('value'),
                                      ]),
                                    ),
                                  ],
                                  true,
                                ),
                                factory.createCatchClause(
                                  factory.createVariableDeclaration(
                                    factory.createIdentifier('e'),
                                    undefined,
                                    undefined,
                                    undefined,
                                  ),
                                  factory.createBlock(
                                    [
                                      factory.createExpressionStatement(
                                        factory.createBinaryExpression(
                                          factory.createIdentifier('isInvalidUrl'),
                                          factory.createToken(ts.SyntaxKind.EqualsToken),
                                          factory.createTrue(),
                                        ),
                                      ),
                                    ],
                                    true,
                                  ),
                                ),
                                undefined,
                              ),
                              factory.createReturnStatement(
                                factory.createObjectLiteralExpression(
                                  [
                                    factory.createPropertyAssignment(
                                      factory.createIdentifier('hasError'),
                                      factory.createIdentifier('isInvalidUrl'),
                                    ),
                                    factory.createPropertyAssignment(
                                      factory.createIdentifier('errorMessage'),
                                      factory.createBinaryExpression(
                                        factory.createPropertyAccessExpression(
                                          factory.createIdentifier('validation'),
                                          factory.createIdentifier('validationMessage'),
                                        ),
                                        factory.createToken(ts.SyntaxKind.BarBarToken),
                                        factory.createStringLiteral(
                                          'The value must be a valid URL that begins with a schema (i.e. http:// or mailto:)',
                                        ),
                                      ),
                                    ),
                                  ],
                                  true,
                                ),
                              ),
                            ]),
                            factory.createDefaultClause([]),
                          ]),
                        ),
                      ],
                      true,
                    ),
                  ),
                  factory.createReturnStatement(
                    factory.createObjectLiteralExpression(
                      [factory.createPropertyAssignment(factory.createIdentifier('hasError'), factory.createFalse())],
                      false,
                    ),
                  ),
                ],
                true,
              ),
            ),
          ),
        ],
        ts.NodeFlags.Const,
      ),
    ),
  ];
};
