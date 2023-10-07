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
import ts, { factory } from 'typescript';
import { EscapeHatchProps } from './types';

/**
 * This helper method is used to get the overrides
 * that will be applied to a component
 * @internal
 * @param overrides escape hatch props
 * @param elementHierarchy
 * @returns component overrides
 */
export const getOverrideProps = (
  overrides: EscapeHatchProps | null | undefined,
  elementHierarchy: string,
): EscapeHatchProps | null => {
  if (!overrides) {
    return null;
  }

  const componentOverrides = Object.entries(overrides)
    .filter(([key]) => key === elementHierarchy)
    .flatMap(([, value]) => Object.entries(value))
    .filter((m) => m?.[0]);

  return Object.fromEntries(componentOverrides) as unknown as EscapeHatchProps;
};

export const buildGetOverrideProps = () => [
  factory.createVariableStatement(
    [factory.createToken(ts.SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier('getOverrideProps'),
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
                factory.createIdentifier('overrides'),
                undefined,
                factory.createUnionTypeNode([
                  factory.createTypeReferenceNode(factory.createIdentifier('EscapeHatchProps'), undefined),
                  factory.createLiteralTypeNode(factory.createNull()),
                  factory.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword),
                ]),
                undefined,
              ),
              factory.createParameterDeclaration(
                undefined,
                undefined,
                undefined,
                factory.createIdentifier('elementHierarchy'),
                undefined,
                factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
                undefined,
              ),
            ],
            factory.createUnionTypeNode([
              factory.createTypeReferenceNode(factory.createIdentifier('EscapeHatchProps'), undefined),
              factory.createLiteralTypeNode(factory.createNull()),
            ]),
            factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
            factory.createBlock(
              [
                factory.createIfStatement(
                  factory.createPrefixUnaryExpression(
                    ts.SyntaxKind.ExclamationToken,
                    factory.createIdentifier('overrides'),
                  ),
                  factory.createBlock([factory.createReturnStatement(factory.createNull())], true),
                  undefined,
                ),
                factory.createVariableStatement(
                  undefined,
                  factory.createVariableDeclarationList(
                    [
                      factory.createVariableDeclaration(
                        factory.createIdentifier('componentOverrides'),
                        undefined,
                        undefined,
                        factory.createCallExpression(
                          factory.createPropertyAccessExpression(
                            factory.createCallExpression(
                              factory.createPropertyAccessExpression(
                                factory.createCallExpression(
                                  factory.createPropertyAccessExpression(
                                    factory.createCallExpression(
                                      factory.createPropertyAccessExpression(
                                        factory.createIdentifier('Object'),
                                        factory.createIdentifier('entries'),
                                      ),
                                      undefined,
                                      [factory.createIdentifier('overrides')],
                                    ),
                                    factory.createIdentifier('filter'),
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
                                            factory.createBindingElement(
                                              undefined,
                                              undefined,
                                              factory.createIdentifier('key'),
                                              undefined,
                                            ),
                                          ]),
                                          undefined,
                                          undefined,
                                          undefined,
                                        ),
                                      ],
                                      undefined,
                                      factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                      factory.createBinaryExpression(
                                        factory.createIdentifier('key'),
                                        factory.createToken(ts.SyntaxKind.EqualsEqualsEqualsToken),
                                        factory.createIdentifier('elementHierarchy'),
                                      ),
                                    ),
                                  ],
                                ),
                                factory.createIdentifier('flatMap'),
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
                                        factory.createOmittedExpression(),
                                        factory.createBindingElement(
                                          undefined,
                                          undefined,
                                          factory.createIdentifier('value'),
                                          undefined,
                                        ),
                                      ]),
                                      undefined,
                                      undefined,
                                      undefined,
                                    ),
                                  ],
                                  undefined,
                                  factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                  factory.createCallExpression(
                                    factory.createPropertyAccessExpression(
                                      factory.createIdentifier('Object'),
                                      factory.createIdentifier('entries'),
                                    ),
                                    undefined,
                                    [factory.createIdentifier('value')],
                                  ),
                                ),
                              ],
                            ),
                            factory.createIdentifier('filter'),
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
                                  factory.createIdentifier('m'),
                                  undefined,
                                  undefined,
                                  undefined,
                                ),
                              ],
                              undefined,
                              factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                              factory.createElementAccessChain(
                                factory.createIdentifier('m'),
                                factory.createToken(ts.SyntaxKind.QuestionDotToken),
                                factory.createNumericLiteral('0'),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                    ts.NodeFlags.Const,
                  ),
                ),
                factory.createReturnStatement(
                  factory.createAsExpression(
                    factory.createAsExpression(
                      factory.createCallExpression(
                        factory.createPropertyAccessExpression(
                          factory.createIdentifier('Object'),
                          factory.createIdentifier('fromEntries'),
                        ),
                        undefined,
                        [factory.createIdentifier('componentOverrides')],
                      ),
                      factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword),
                    ),
                    factory.createTypeReferenceNode(factory.createIdentifier('EscapeHatchProps'), undefined),
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
