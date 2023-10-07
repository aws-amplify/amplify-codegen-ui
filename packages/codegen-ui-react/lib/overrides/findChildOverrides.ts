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
 * This method is used to parse through all of the overrides and
 * only pass the relevant child overrides for a given component.
 * @internal
 * @param overrides escape hatch props
 * @param elementHierarchy
 * @returns overrides only for specified element
 */
export const findChildOverrides = (
  overrides: EscapeHatchProps | null | undefined,
  elementHierarchy: string,
): EscapeHatchProps | null => {
  if (!overrides) {
    return null;
  }

  const filteredOverrides = Object.entries(overrides).filter((m) => m[0].startsWith(elementHierarchy));

  return Object.assign(
    {},
    ...Array.from(filteredOverrides, ([k, v]) => ({
      [k.replace(elementHierarchy, '')]: v,
    })),
  ) as EscapeHatchProps;
};

export const buildFindChildOverrides = () => [
  factory.createVariableStatement(
    [factory.createToken(ts.SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier('findChildOverrides'),
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
                        factory.createIdentifier('filteredOverrides'),
                        undefined,
                        undefined,
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
                                  factory.createIdentifier('m'),
                                  undefined,
                                  undefined,
                                  undefined,
                                ),
                              ],
                              undefined,
                              factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                              factory.createCallExpression(
                                factory.createPropertyAccessExpression(
                                  factory.createElementAccessExpression(
                                    factory.createIdentifier('m'),
                                    factory.createNumericLiteral('0'),
                                  ),
                                  factory.createIdentifier('startsWith'),
                                ),
                                undefined,
                                [factory.createIdentifier('elementHierarchy')],
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
                    factory.createCallExpression(
                      factory.createPropertyAccessExpression(
                        factory.createIdentifier('Object'),
                        factory.createIdentifier('assign'),
                      ),
                      undefined,
                      [
                        factory.createObjectLiteralExpression([], false),
                        factory.createSpreadElement(
                          factory.createCallExpression(
                            factory.createPropertyAccessExpression(
                              factory.createIdentifier('Array'),
                              factory.createIdentifier('from'),
                            ),
                            undefined,
                            [
                              factory.createIdentifier('filteredOverrides'),
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
                                        factory.createIdentifier('k'),
                                        undefined,
                                      ),
                                      factory.createBindingElement(
                                        undefined,
                                        undefined,
                                        factory.createIdentifier('v'),
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
                                factory.createParenthesizedExpression(
                                  factory.createObjectLiteralExpression(
                                    [
                                      factory.createPropertyAssignment(
                                        factory.createComputedPropertyName(
                                          factory.createCallExpression(
                                            factory.createPropertyAccessExpression(
                                              factory.createIdentifier('k'),
                                              factory.createIdentifier('replace'),
                                            ),
                                            undefined,
                                            [
                                              factory.createIdentifier('elementHierarchy'),
                                              factory.createStringLiteral(''),
                                            ],
                                          ),
                                        ),
                                        factory.createIdentifier('v'),
                                      ),
                                    ],
                                    true,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
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
