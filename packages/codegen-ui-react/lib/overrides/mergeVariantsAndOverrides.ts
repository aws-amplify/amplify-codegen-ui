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
 * This helper method is used to merge
 * variants with overrides
 * @internal
 * @param variants
 * @param overrides
 * @returns merged variants with overrides
 */
export const mergeVariantsAndOverrides = (
  variants: EscapeHatchProps,
  overrides: EscapeHatchProps,
): EscapeHatchProps => {
  if (!variants && !overrides) {
    return null;
  }
  if (!overrides) {
    return variants;
  }
  if (!variants) {
    return overrides;
  }
  const overrideKeys = new Set(Object.keys(overrides));
  const sharedKeys = Object.keys(variants).filter((variantKey) => overrideKeys.has(variantKey));
  const merged = Object.fromEntries(
    sharedKeys.map((sharedKey) => [sharedKey, { ...variants[sharedKey], ...overrides[sharedKey] }]),
  );
  return {
    ...variants,
    ...overrides,
    ...merged,
  };
};

export const buildMergeVariantsAndOverrides = () => [
  factory.createVariableStatement(
    [factory.createToken(ts.SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier('mergeVariantsAndOverrides'),
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
                factory.createIdentifier('variants'),
                undefined,
                factory.createTypeReferenceNode(factory.createIdentifier('EscapeHatchProps'), undefined),
                undefined,
              ),
              factory.createParameterDeclaration(
                undefined,
                undefined,
                undefined,
                factory.createIdentifier('overrides'),
                undefined,
                factory.createTypeReferenceNode(factory.createIdentifier('EscapeHatchProps'), undefined),
                undefined,
              ),
            ],
            factory.createTypeReferenceNode(factory.createIdentifier('EscapeHatchProps'), undefined),
            factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
            factory.createBlock(
              [
                factory.createIfStatement(
                  factory.createBinaryExpression(
                    factory.createPrefixUnaryExpression(
                      ts.SyntaxKind.ExclamationToken,
                      factory.createIdentifier('variants'),
                    ),
                    factory.createToken(ts.SyntaxKind.AmpersandAmpersandToken),
                    factory.createPrefixUnaryExpression(
                      ts.SyntaxKind.ExclamationToken,
                      factory.createIdentifier('overrides'),
                    ),
                  ),
                  factory.createBlock([factory.createReturnStatement(factory.createNull())], true),
                  undefined,
                ),
                factory.createIfStatement(
                  factory.createPrefixUnaryExpression(
                    ts.SyntaxKind.ExclamationToken,
                    factory.createIdentifier('overrides'),
                  ),
                  factory.createBlock([factory.createReturnStatement(factory.createIdentifier('variants'))], true),
                  undefined,
                ),
                factory.createIfStatement(
                  factory.createPrefixUnaryExpression(
                    ts.SyntaxKind.ExclamationToken,
                    factory.createIdentifier('variants'),
                  ),
                  factory.createBlock([factory.createReturnStatement(factory.createIdentifier('overrides'))], true),
                  undefined,
                ),
                factory.createVariableStatement(
                  undefined,
                  factory.createVariableDeclarationList(
                    [
                      factory.createVariableDeclaration(
                        factory.createIdentifier('overrideKeys'),
                        undefined,
                        undefined,
                        factory.createNewExpression(factory.createIdentifier('Set'), undefined, [
                          factory.createCallExpression(
                            factory.createPropertyAccessExpression(
                              factory.createIdentifier('Object'),
                              factory.createIdentifier('keys'),
                            ),
                            undefined,
                            [factory.createIdentifier('overrides')],
                          ),
                        ]),
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
                        factory.createIdentifier('sharedKeys'),
                        undefined,
                        undefined,
                        factory.createCallExpression(
                          factory.createPropertyAccessExpression(
                            factory.createCallExpression(
                              factory.createPropertyAccessExpression(
                                factory.createIdentifier('Object'),
                                factory.createIdentifier('keys'),
                              ),
                              undefined,
                              [factory.createIdentifier('variants')],
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
                                  factory.createIdentifier('variantKey'),
                                  undefined,
                                  undefined,
                                  undefined,
                                ),
                              ],
                              undefined,
                              factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                              factory.createCallExpression(
                                factory.createPropertyAccessExpression(
                                  factory.createIdentifier('overrideKeys'),
                                  factory.createIdentifier('has'),
                                ),
                                undefined,
                                [factory.createIdentifier('variantKey')],
                              ),
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
                        factory.createIdentifier('merged'),
                        undefined,
                        undefined,
                        factory.createCallExpression(
                          factory.createPropertyAccessExpression(
                            factory.createIdentifier('Object'),
                            factory.createIdentifier('fromEntries'),
                          ),
                          undefined,
                          [
                            factory.createCallExpression(
                              factory.createPropertyAccessExpression(
                                factory.createIdentifier('sharedKeys'),
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
                                      factory.createIdentifier('sharedKey'),
                                      undefined,
                                      undefined,
                                      undefined,
                                    ),
                                  ],
                                  undefined,
                                  factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                  factory.createArrayLiteralExpression(
                                    [
                                      factory.createIdentifier('sharedKey'),
                                      factory.createObjectLiteralExpression(
                                        [
                                          factory.createSpreadAssignment(
                                            factory.createElementAccessExpression(
                                              factory.createIdentifier('variants'),
                                              factory.createIdentifier('sharedKey'),
                                            ),
                                          ),
                                          factory.createSpreadAssignment(
                                            factory.createElementAccessExpression(
                                              factory.createIdentifier('overrides'),
                                              factory.createIdentifier('sharedKey'),
                                            ),
                                          ),
                                        ],
                                        false,
                                      ),
                                    ],
                                    false,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                    ts.NodeFlags.Const,
                  ),
                ),
                factory.createReturnStatement(
                  factory.createObjectLiteralExpression(
                    [
                      factory.createSpreadAssignment(factory.createIdentifier('variants')),
                      factory.createSpreadAssignment(factory.createIdentifier('overrides')),
                      factory.createSpreadAssignment(factory.createIdentifier('merged')),
                    ],
                    true,
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
