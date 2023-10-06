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

import { SyntaxKind, factory } from 'typescript';

export type EscapeHatchProps = {
  [elementHierarchy: string]: Record<string, unknown>;
} | null;

export type VariantValues = { [key: string]: string };
export type Variant = {
  variantValues: VariantValues;
  overrides: EscapeHatchProps;
};

export const buildEscapeHatchAndVariantTypes = () => [
  factory.createTypeAliasDeclaration(
    undefined,
    [factory.createToken(SyntaxKind.ExportKeyword)],
    factory.createIdentifier('EscapeHatchProps'),
    undefined,
    factory.createUnionTypeNode([
      factory.createTypeLiteralNode([
        factory.createIndexSignature(
          undefined,
          undefined,
          [
            factory.createParameterDeclaration(
              undefined,
              undefined,
              undefined,
              factory.createIdentifier('elementHierarchy'),
              undefined,
              factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
              undefined,
            ),
          ],
          factory.createTypeReferenceNode(factory.createIdentifier('Record'), [
            factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
            factory.createKeywordTypeNode(SyntaxKind.UnknownKeyword),
          ]),
        ),
      ]),
      factory.createLiteralTypeNode(factory.createNull()),
    ]),
  ),
  factory.createTypeAliasDeclaration(
    undefined,
    [factory.createToken(SyntaxKind.ExportKeyword)],
    factory.createIdentifier('VariantValues'),
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
            factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
            undefined,
          ),
        ],
        factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
      ),
    ]),
  ),
  factory.createTypeAliasDeclaration(
    undefined,
    [factory.createToken(SyntaxKind.ExportKeyword)],
    factory.createIdentifier('Variant'),
    undefined,
    factory.createTypeLiteralNode([
      factory.createPropertySignature(
        undefined,
        factory.createIdentifier('variantValues'),
        undefined,
        factory.createTypeReferenceNode(factory.createIdentifier('VariantValues'), undefined),
      ),
      factory.createPropertySignature(
        undefined,
        factory.createIdentifier('overrides'),
        undefined,
        factory.createTypeReferenceNode(factory.createIdentifier('EscapeHatchProps'), undefined),
      ),
    ]),
  ),
];
