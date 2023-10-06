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
import { Variant, VariantValues } from './types';

/**
 * Given a list of style variants, select a given one based on input props
 * @internal
 * @param variants list of style variants to select from
 * @param props variant values to select from the list, may include additional props, to tidy up usage upstream
 */
export function getOverridesFromVariants<T>(
  variants: Variant[],
  props: { [key: string]: T },
): { [key: string]: Variant } {
  // Get unique keys from the provided variants
  const variantValueKeys = [...new Set(variants.flatMap((variant) => Object.keys(variant.variantValues)))];

  /*
    Get variant value object from provided props,
    dropping keys that aren't in variantValueKeys, or whose vals are falsey
  */
  const variantValuesFromProps: VariantValues = Object.keys(props)
    .filter((i) => variantValueKeys.includes(i) && props[i])
    .reduce((acc, key) => {
      return {
        ...acc,
        [key]: props[key],
      };
    }, {});

  const matchedVariants = variants.filter(({ variantValues }) => {
    return (
      Object.keys(variantValues).length === Object.keys(variantValuesFromProps).length &&
      Object.entries(variantValues).every(([key, value]) => variantValuesFromProps[key] === value)
    );
  });

  return matchedVariants.reduce((overrides, variant) => {
    return { ...overrides, ...variant.overrides };
  }, {});
}

export const buildGetOverridesFromVariants = () => [
  factory.createFunctionDeclaration(
    undefined,
    [factory.createToken(ts.SyntaxKind.ExportKeyword)],
    undefined,
    factory.createIdentifier('getOverridesFromVariants'),
    [factory.createTypeParameterDeclaration(factory.createIdentifier('T'), undefined, undefined)],
    [
      factory.createParameterDeclaration(
        undefined,
        undefined,
        undefined,
        factory.createIdentifier('variants'),
        undefined,
        factory.createArrayTypeNode(factory.createTypeReferenceNode(factory.createIdentifier('Variant'), undefined)),
        undefined,
      ),
      factory.createParameterDeclaration(
        undefined,
        undefined,
        undefined,
        factory.createIdentifier('props'),
        undefined,
        factory.createTypeLiteralNode([
          factory.createIndexSignature(
            undefined,
            undefined,
            [
              factory.createParameterDeclaration(
                undefined,
                undefined,
                undefined,
                factory.createIdentifier('key'),
                undefined,
                factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
                undefined,
              ),
            ],
            factory.createTypeReferenceNode(factory.createIdentifier('T'), undefined),
          ),
        ]),
        undefined,
      ),
    ],
    factory.createTypeLiteralNode([
      factory.createIndexSignature(
        undefined,
        undefined,
        [
          factory.createParameterDeclaration(
            undefined,
            undefined,
            undefined,
            factory.createIdentifier('key'),
            undefined,
            factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
            undefined,
          ),
        ],
        factory.createTypeReferenceNode(factory.createIdentifier('Variant'), undefined),
      ),
    ]),
    factory.createBlock(
      [
        factory.createVariableStatement(
          undefined,
          factory.createVariableDeclarationList(
            [
              factory.createVariableDeclaration(
                factory.createIdentifier('variantValueKeys'),
                undefined,
                undefined,
                factory.createArrayLiteralExpression(
                  [
                    factory.createSpreadElement(
                      factory.createNewExpression(factory.createIdentifier('Set'), undefined, [
                        factory.createCallExpression(
                          factory.createPropertyAccessExpression(
                            factory.createIdentifier('variants'),
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
                                  factory.createIdentifier('variant'),
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
                                  factory.createIdentifier('keys'),
                                ),
                                undefined,
                                [
                                  factory.createPropertyAccessExpression(
                                    factory.createIdentifier('variant'),
                                    factory.createIdentifier('variantValues'),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ]),
                    ),
                  ],
                  false,
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
                factory.createIdentifier('variantValuesFromProps'),
                undefined,
                factory.createTypeReferenceNode(factory.createIdentifier('VariantValues'), undefined),
                factory.createCallExpression(
                  factory.createPropertyAccessExpression(
                    factory.createCallExpression(
                      factory.createPropertyAccessExpression(
                        factory.createCallExpression(
                          factory.createPropertyAccessExpression(
                            factory.createIdentifier('Object'),
                            factory.createIdentifier('keys'),
                          ),
                          undefined,
                          [factory.createIdentifier('props')],
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
                              factory.createIdentifier('i'),
                              undefined,
                              undefined,
                              undefined,
                            ),
                          ],
                          undefined,
                          factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                          factory.createBinaryExpression(
                            factory.createCallExpression(
                              factory.createPropertyAccessExpression(
                                factory.createIdentifier('variantValueKeys'),
                                factory.createIdentifier('includes'),
                              ),
                              undefined,
                              [factory.createIdentifier('i')],
                            ),
                            factory.createToken(ts.SyntaxKind.AmpersandAmpersandToken),
                            factory.createElementAccessExpression(
                              factory.createIdentifier('props'),
                              factory.createIdentifier('i'),
                            ),
                          ),
                        ),
                      ],
                    ),
                    factory.createIdentifier('reduce'),
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
                          factory.createIdentifier('acc'),
                          undefined,
                          undefined,
                          undefined,
                        ),
                        factory.createParameterDeclaration(
                          undefined,
                          undefined,
                          undefined,
                          factory.createIdentifier('key'),
                          undefined,
                          undefined,
                          undefined,
                        ),
                      ],
                      undefined,
                      factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                      factory.createBlock(
                        [
                          factory.createReturnStatement(
                            factory.createObjectLiteralExpression(
                              [
                                factory.createSpreadAssignment(factory.createIdentifier('acc')),
                                factory.createPropertyAssignment(
                                  factory.createComputedPropertyName(factory.createIdentifier('key')),
                                  factory.createElementAccessExpression(
                                    factory.createIdentifier('props'),
                                    factory.createIdentifier('key'),
                                  ),
                                ),
                              ],
                              true,
                            ),
                          ),
                        ],
                        true,
                      ),
                    ),
                    factory.createObjectLiteralExpression([], false),
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
                factory.createIdentifier('matchedVariants'),
                undefined,
                undefined,
                factory.createCallExpression(
                  factory.createPropertyAccessExpression(
                    factory.createIdentifier('variants'),
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
                          factory.createObjectBindingPattern([
                            factory.createBindingElement(
                              undefined,
                              undefined,
                              factory.createIdentifier('variantValues'),
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
                      factory.createBlock(
                        [
                          factory.createReturnStatement(
                            factory.createParenthesizedExpression(
                              factory.createBinaryExpression(
                                factory.createBinaryExpression(
                                  factory.createPropertyAccessExpression(
                                    factory.createCallExpression(
                                      factory.createPropertyAccessExpression(
                                        factory.createIdentifier('Object'),
                                        factory.createIdentifier('keys'),
                                      ),
                                      undefined,
                                      [factory.createIdentifier('variantValues')],
                                    ),
                                    factory.createIdentifier('length'),
                                  ),
                                  factory.createToken(ts.SyntaxKind.EqualsEqualsEqualsToken),
                                  factory.createPropertyAccessExpression(
                                    factory.createCallExpression(
                                      factory.createPropertyAccessExpression(
                                        factory.createIdentifier('Object'),
                                        factory.createIdentifier('keys'),
                                      ),
                                      undefined,
                                      [factory.createIdentifier('variantValuesFromProps')],
                                    ),
                                    factory.createIdentifier('length'),
                                  ),
                                ),
                                factory.createToken(ts.SyntaxKind.AmpersandAmpersandToken),
                                factory.createCallExpression(
                                  factory.createPropertyAccessExpression(
                                    factory.createCallExpression(
                                      factory.createPropertyAccessExpression(
                                        factory.createIdentifier('Object'),
                                        factory.createIdentifier('entries'),
                                      ),
                                      undefined,
                                      [factory.createIdentifier('variantValues')],
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
                                          factory.createArrayBindingPattern([
                                            factory.createBindingElement(
                                              undefined,
                                              undefined,
                                              factory.createIdentifier('key'),
                                              undefined,
                                            ),
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
                                      factory.createBinaryExpression(
                                        factory.createElementAccessExpression(
                                          factory.createIdentifier('variantValuesFromProps'),
                                          factory.createIdentifier('key'),
                                        ),
                                        factory.createToken(ts.SyntaxKind.EqualsEqualsEqualsToken),
                                        factory.createIdentifier('value'),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ],
                        true,
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
          factory.createCallExpression(
            factory.createPropertyAccessExpression(
              factory.createIdentifier('matchedVariants'),
              factory.createIdentifier('reduce'),
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
                    factory.createIdentifier('overrides'),
                    undefined,
                    undefined,
                    undefined,
                  ),
                  factory.createParameterDeclaration(
                    undefined,
                    undefined,
                    undefined,
                    factory.createIdentifier('variant'),
                    undefined,
                    undefined,
                    undefined,
                  ),
                ],
                undefined,
                factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                factory.createBlock(
                  [
                    factory.createReturnStatement(
                      factory.createObjectLiteralExpression(
                        [
                          factory.createSpreadAssignment(factory.createIdentifier('overrides')),
                          factory.createSpreadAssignment(
                            factory.createPropertyAccessExpression(
                              factory.createIdentifier('variant'),
                              factory.createIdentifier('overrides'),
                            ),
                          ),
                        ],
                        false,
                      ),
                    ),
                  ],
                  true,
                ),
              ),
              factory.createObjectLiteralExpression([], false),
            ],
          ),
        ),
      ],
      true,
    ),
  ),
];
