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
import { factory, NodeFlags, SyntaxKind, VariableStatement } from 'typescript';

/**
 * does not support array types within objects as it's currently not supported
 *
 * ref: https://stackoverflow.com/questions/45942118/lodash-return-array-of-values-if-the-path-is-valid
 *
 * @param input object input
 * @param path dot notation path for the provided input
 * @param accumlator array
 * @returns returns value at the end of object
 */
export const fetchByPath = <T extends Record<string, any>>(input: T, path: string, accumlator: any[] = []) => {
  const currentPath = path.split('.');
  const head = currentPath.shift();
  if (input && head && input[head] !== undefined) {
    if (!currentPath.length) {
      accumlator.push(input[head]);
    } else {
      fetchByPath(input[head], currentPath.join('.'), accumlator);
    }
  }
  return accumlator[0];
};

/**
 * get the generated output of the fetchByPath function in TS AST
 *
 * @returns VariableStatement
 */
export const getFetchByPathNodeFunction = (): VariableStatement => {
  return factory.createVariableStatement(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier('fetchByPath'),
          undefined,
          undefined,
          factory.createArrowFunction(
            undefined,
            [
              factory.createTypeParameterDeclaration(
                factory.createIdentifier('T'),
                factory.createTypeReferenceNode(factory.createIdentifier('Record'), [
                  factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
                  factory.createKeywordTypeNode(SyntaxKind.AnyKeyword),
                ]),
                undefined,
              ),
            ],
            [
              factory.createParameterDeclaration(
                undefined,
                undefined,
                undefined,
                factory.createIdentifier('input'),
                undefined,
                factory.createTypeReferenceNode(factory.createIdentifier('T'), undefined),
                undefined,
              ),
              factory.createParameterDeclaration(
                undefined,
                undefined,
                undefined,
                factory.createIdentifier('path'),
                undefined,
                undefined,
                factory.createStringLiteral(''),
              ),
              factory.createParameterDeclaration(
                undefined,
                undefined,
                undefined,
                factory.createIdentifier('accumlator'),
                undefined,
                factory.createArrayTypeNode(factory.createKeywordTypeNode(SyntaxKind.AnyKeyword)),
                factory.createArrayLiteralExpression([], false),
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
                        factory.createIdentifier('currentPath'),
                        undefined,
                        undefined,
                        factory.createCallExpression(
                          factory.createPropertyAccessExpression(
                            factory.createIdentifier('path'),
                            factory.createIdentifier('split'),
                          ),
                          undefined,
                          [factory.createStringLiteral('.')],
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
                        factory.createIdentifier('head'),
                        undefined,
                        undefined,
                        factory.createCallExpression(
                          factory.createPropertyAccessExpression(
                            factory.createIdentifier('currentPath'),
                            factory.createIdentifier('shift'),
                          ),
                          undefined,
                          [],
                        ),
                      ),
                    ],
                    NodeFlags.Const,
                  ),
                ),
                factory.createIfStatement(
                  factory.createBinaryExpression(
                    factory.createBinaryExpression(
                      factory.createIdentifier('input'),
                      factory.createToken(SyntaxKind.AmpersandAmpersandToken),
                      factory.createIdentifier('head'),
                    ),
                    factory.createToken(SyntaxKind.AmpersandAmpersandToken),
                    factory.createBinaryExpression(
                      factory.createElementAccessExpression(
                        factory.createIdentifier('input'),
                        factory.createIdentifier('head'),
                      ),
                      factory.createToken(SyntaxKind.ExclamationEqualsEqualsToken),
                      factory.createIdentifier('undefined'),
                    ),
                  ),
                  factory.createBlock(
                    [
                      factory.createIfStatement(
                        factory.createPrefixUnaryExpression(
                          SyntaxKind.ExclamationToken,
                          factory.createPropertyAccessExpression(
                            factory.createIdentifier('currentPath'),
                            factory.createIdentifier('length'),
                          ),
                        ),
                        factory.createBlock(
                          [
                            factory.createExpressionStatement(
                              factory.createCallExpression(
                                factory.createPropertyAccessExpression(
                                  factory.createIdentifier('accumlator'),
                                  factory.createIdentifier('push'),
                                ),
                                undefined,
                                [
                                  factory.createElementAccessExpression(
                                    factory.createIdentifier('input'),
                                    factory.createIdentifier('head'),
                                  ),
                                ],
                              ),
                            ),
                          ],
                          true,
                        ),
                        factory.createBlock(
                          [
                            factory.createExpressionStatement(
                              factory.createCallExpression(factory.createIdentifier('fetchByPath'), undefined, [
                                factory.createElementAccessExpression(
                                  factory.createIdentifier('input'),
                                  factory.createIdentifier('head'),
                                ),
                                factory.createCallExpression(
                                  factory.createPropertyAccessExpression(
                                    factory.createIdentifier('currentPath'),
                                    factory.createIdentifier('join'),
                                  ),
                                  undefined,
                                  [factory.createStringLiteral('.')],
                                ),
                                factory.createIdentifier('accumlator'),
                              ]),
                            ),
                          ],
                          true,
                        ),
                      ),
                    ],
                    true,
                  ),
                  undefined,
                ),
                factory.createReturnStatement(
                  factory.createElementAccessExpression(
                    factory.createIdentifier('accumlator'),
                    factory.createNumericLiteral('0'),
                  ),
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
};
