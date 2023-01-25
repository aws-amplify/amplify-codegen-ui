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

import { factory, NodeFlags, SyntaxKind } from 'typescript';

/**
 * accepts timestamp number and returns date object
 * since datastore allows second and millisecond epochs we need to format accordingly
 *
 * @param ts number
 * @returns date object
 */
export const convertTimeStampToDate = (ts: number): Date => {
  if (Math.abs(Date.now() - ts) < Math.abs(Date.now() - ts * 1000)) {
    return new Date(ts);
  }
  return new Date(ts * 1000);
};

/**
 * takes a date object and converts it to the local format used for an html input element with datetime-local
 *
 * @param date date object
 * @returns string formatted in datetime-local
 */
export const convertToLocal = (date: Date) => {
  const df = new Intl.DateTimeFormat('default', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    calendar: 'iso8601',
    numberingSystem: 'latn',
    hourCycle: 'h23',
  });
  const parts = df.formatToParts(date).reduce<Record<string, string>>((acc, part) => {
    acc[part.type] = part.value;
    return acc;
  }, {});
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
};

/**
 * ast representation fo the convert timestamp to date
 */
export const convertTimeStampToDateAST = factory.createVariableStatement(
  undefined,
  factory.createVariableDeclarationList(
    [
      factory.createVariableDeclaration(
        factory.createIdentifier('convertTimeStampToDate'),
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
              factory.createIdentifier('ts'),
              undefined,
              factory.createKeywordTypeNode(SyntaxKind.NumberKeyword),
              undefined,
            ),
          ],
          factory.createTypeReferenceNode(factory.createIdentifier('Date'), undefined),
          factory.createToken(SyntaxKind.EqualsGreaterThanToken),
          factory.createBlock(
            [
              factory.createIfStatement(
                factory.createBinaryExpression(
                  factory.createCallExpression(
                    factory.createPropertyAccessExpression(
                      factory.createIdentifier('Math'),
                      factory.createIdentifier('abs'),
                    ),
                    undefined,
                    [
                      factory.createBinaryExpression(
                        factory.createCallExpression(
                          factory.createPropertyAccessExpression(
                            factory.createIdentifier('Date'),
                            factory.createIdentifier('now'),
                          ),
                          undefined,
                          [],
                        ),
                        factory.createToken(SyntaxKind.MinusToken),
                        factory.createIdentifier('ts'),
                      ),
                    ],
                  ),
                  factory.createToken(SyntaxKind.LessThanToken),
                  factory.createCallExpression(
                    factory.createPropertyAccessExpression(
                      factory.createIdentifier('Math'),
                      factory.createIdentifier('abs'),
                    ),
                    undefined,
                    [
                      factory.createBinaryExpression(
                        factory.createCallExpression(
                          factory.createPropertyAccessExpression(
                            factory.createIdentifier('Date'),
                            factory.createIdentifier('now'),
                          ),
                          undefined,
                          [],
                        ),
                        factory.createToken(SyntaxKind.MinusToken),
                        factory.createBinaryExpression(
                          factory.createIdentifier('ts'),
                          factory.createToken(SyntaxKind.AsteriskToken),
                          factory.createNumericLiteral('1000'),
                        ),
                      ),
                    ],
                  ),
                ),
                factory.createBlock(
                  [
                    factory.createReturnStatement(
                      factory.createNewExpression(factory.createIdentifier('Date'), undefined, [
                        factory.createIdentifier('ts'),
                      ]),
                    ),
                  ],
                  true,
                ),
                undefined,
              ),
              factory.createReturnStatement(
                factory.createNewExpression(factory.createIdentifier('Date'), undefined, [
                  factory.createBinaryExpression(
                    factory.createIdentifier('ts'),
                    factory.createToken(SyntaxKind.AsteriskToken),
                    factory.createNumericLiteral('1000'),
                  ),
                ]),
              ),
            ],
            true,
          ),
        ),
      ),
    ],
    NodeFlags.Const,
  ),
);

/**
 * convertToLocal function represented in ts ast
 */

export const convertToLocalAST = factory.createVariableStatement(
  undefined,
  factory.createVariableDeclarationList(
    [
      factory.createVariableDeclaration(
        factory.createIdentifier('convertToLocal'),
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
              factory.createIdentifier('date'),
              undefined,
              factory.createTypeReferenceNode(factory.createIdentifier('Date'), undefined),
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
                      factory.createIdentifier('df'),
                      undefined,
                      undefined,
                      factory.createNewExpression(
                        factory.createPropertyAccessExpression(
                          factory.createIdentifier('Intl'),
                          factory.createIdentifier('DateTimeFormat'),
                        ),
                        undefined,
                        [
                          factory.createStringLiteral('default'),
                          factory.createObjectLiteralExpression(
                            [
                              factory.createPropertyAssignment(
                                factory.createIdentifier('year'),
                                factory.createStringLiteral('numeric'),
                              ),
                              factory.createPropertyAssignment(
                                factory.createIdentifier('month'),
                                factory.createStringLiteral('2-digit'),
                              ),
                              factory.createPropertyAssignment(
                                factory.createIdentifier('day'),
                                factory.createStringLiteral('2-digit'),
                              ),
                              factory.createPropertyAssignment(
                                factory.createIdentifier('hour'),
                                factory.createStringLiteral('2-digit'),
                              ),
                              factory.createPropertyAssignment(
                                factory.createIdentifier('minute'),
                                factory.createStringLiteral('2-digit'),
                              ),
                              factory.createPropertyAssignment(
                                factory.createIdentifier('calendar'),
                                factory.createStringLiteral('iso8601'),
                              ),
                              factory.createPropertyAssignment(
                                factory.createIdentifier('numberingSystem'),
                                factory.createStringLiteral('latn'),
                              ),
                              factory.createPropertyAssignment(
                                factory.createIdentifier('hourCycle'),
                                factory.createStringLiteral('h23'),
                              ),
                            ],
                            true,
                          ),
                        ],
                      ),
                    ),
                  ],
                  NodeFlags.Const,
                ),
              ),
              factory.createVariableStatement(
                undefined,
                factory.createVariableDeclarationList(
                  [
                    factory.createVariableDeclaration(
                      factory.createIdentifier('parts'),
                      undefined,
                      undefined,
                      factory.createCallExpression(
                        factory.createPropertyAccessExpression(
                          factory.createCallExpression(
                            factory.createPropertyAccessExpression(
                              factory.createIdentifier('df'),
                              factory.createIdentifier('formatToParts'),
                            ),
                            undefined,
                            [factory.createIdentifier('date')],
                          ),
                          factory.createIdentifier('reduce'),
                        ),
                        [
                          factory.createTypeReferenceNode(factory.createIdentifier('Record'), [
                            factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
                            factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
                          ]),
                        ],
                        [
                          factory.createArrowFunction(
                            undefined,
                            undefined,
                            [
                              factory.createParameterDeclaration(
                                undefined,
                                undefined,
                                undefined,
                                factory.createIdentifier('acc'),
                                undefined,
                                undefined,
                                undefined,
                              ),
                              factory.createParameterDeclaration(
                                undefined,
                                undefined,
                                undefined,
                                factory.createIdentifier('part'),
                                undefined,
                                undefined,
                                undefined,
                              ),
                            ],
                            undefined,
                            factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                            factory.createBlock(
                              [
                                factory.createExpressionStatement(
                                  factory.createBinaryExpression(
                                    factory.createElementAccessExpression(
                                      factory.createIdentifier('acc'),
                                      factory.createPropertyAccessExpression(
                                        factory.createIdentifier('part'),
                                        factory.createIdentifier('type'),
                                      ),
                                    ),
                                    factory.createToken(SyntaxKind.EqualsToken),
                                    factory.createPropertyAccessExpression(
                                      factory.createIdentifier('part'),
                                      factory.createIdentifier('value'),
                                    ),
                                  ),
                                ),
                                factory.createReturnStatement(factory.createIdentifier('acc')),
                              ],
                              true,
                            ),
                          ),
                          factory.createObjectLiteralExpression([], false),
                        ],
                      ),
                    ),
                  ],
                  NodeFlags.Const,
                ),
              ),
              factory.createReturnStatement(
                factory.createTemplateExpression(factory.createTemplateHead('', ''), [
                  factory.createTemplateSpan(
                    factory.createPropertyAccessExpression(
                      factory.createIdentifier('parts'),
                      factory.createIdentifier('year'),
                    ),
                    factory.createTemplateMiddle('-', '-'),
                  ),
                  factory.createTemplateSpan(
                    factory.createPropertyAccessExpression(
                      factory.createIdentifier('parts'),
                      factory.createIdentifier('month'),
                    ),
                    factory.createTemplateMiddle('-', '-'),
                  ),
                  factory.createTemplateSpan(
                    factory.createPropertyAccessExpression(
                      factory.createIdentifier('parts'),
                      factory.createIdentifier('day'),
                    ),
                    factory.createTemplateMiddle('T', 'T'),
                  ),
                  factory.createTemplateSpan(
                    factory.createPropertyAccessExpression(
                      factory.createIdentifier('parts'),
                      factory.createIdentifier('hour'),
                    ),
                    factory.createTemplateMiddle(':', ':'),
                  ),
                  factory.createTemplateSpan(
                    factory.createPropertyAccessExpression(
                      factory.createIdentifier('parts'),
                      factory.createIdentifier('minute'),
                    ),
                    factory.createTemplateTail('', ''),
                  ),
                ]),
              ),
            ],
            true,
          ),
        ),
      ),
    ],
    NodeFlags.Const,
  ),
);
