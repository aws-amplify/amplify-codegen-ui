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
import { StudioTheme } from '@amzn/amplify-ui-codegen-schema';
import { EOL } from 'os';
import { factory, SyntaxKind, NodeFlags, EmitHint, FunctionDeclaration } from 'typescript';
import { StudioTemplateRenderer } from '@amzn/studio-ui-codegen';

import { ReactRenderConfig, ScriptKind, scriptKindToFileExtension } from './react-render-config';
import { ImportCollection } from './import-collection';
import { ReactOutputManager } from './react-output-manager';
import {
  transpile,
  buildPrinter,
  defaultRenderConfig,
  getDeclarationFilename,
  json,
  jsonToLiteral,
} from './react-studio-template-renderer-helper';

export class ReactThemeStudioTemplateRenderer extends StudioTemplateRenderer<
  string,
  StudioTheme,
  ReactOutputManager,
  {
    componentText: string;
    renderComponentToFilesystem: (outputPath: string) => Promise<void>;
  }
> {
  protected importCollection = new ImportCollection();

  fileName = 'theme.tsx';

  constructor(theme: StudioTheme, protected renderConfig: ReactRenderConfig) {
    super(theme, new ReactOutputManager(), renderConfig);
    const { script } = this.renderConfig;
    if (script !== ScriptKind.TSX) {
      this.fileName = `theme.${scriptKindToFileExtension(renderConfig.script || ScriptKind.TSX)}`;
    }

    this.renderConfig = {
      ...defaultRenderConfig,
      ...this.renderConfig,
    };
  }

  renderComponent() {
    const { printer, file } = buildPrinter(this.fileName, this.renderConfig);

    const renderedImports = this.buildImports().map((importStatement) =>
      printer.printNode(EmitHint.Unspecified, importStatement, file),
    );
    const renderedFunction = printer.printNode(EmitHint.Unspecified, this.buildFunction(), file);
    const componentText = ['/* eslint-disable */', ...renderedImports, renderedFunction].join(EOL);
    const { componentText: transpiledComponentText, declaration } = transpile(componentText, this.renderConfig);

    return {
      componentText: transpiledComponentText,
      renderComponentToFilesystem: async (outputPath: string) => {
        await this.renderComponentToFilesystem(transpiledComponentText)(this.fileName)(outputPath);
        if (declaration) {
          await this.renderComponentToFilesystem(declaration)(getDeclarationFilename(this.fileName))(outputPath);
        }
      },
    };
  }

  /*
   * import React from "react";
   * import {
   *   AmplifyProvider,
   *   createTheme,
   * } from "@aws-amplify/ui-react";
   */
  private buildImports() {
    this.importCollection.addImport('@aws-amplify/ui-react', 'createTheme');
    this.importCollection.addImport('@aws-amplify/ui-react', 'AmplifyProvider');

    return this.importCollection.buildImportStatements();
  }

  private buildFunction(): FunctionDeclaration {
    return factory.createFunctionDeclaration(
      undefined,
      [factory.createModifier(SyntaxKind.ExportKeyword), factory.createModifier(SyntaxKind.DefaultKeyword)],
      undefined,
      factory.createIdentifier('withTheme'),
      [factory.createTypeParameterDeclaration(factory.createIdentifier('T'), undefined, undefined)],
      [
        factory.createParameterDeclaration(
          undefined,
          undefined,
          undefined,
          factory.createIdentifier('WrappedComponent'),
          undefined,
          factory.createTypeReferenceNode(
            factory.createQualifiedName(factory.createIdentifier('React'), factory.createIdentifier('ComponentType')),
            [factory.createTypeReferenceNode(factory.createIdentifier('T'), undefined)],
          ),
          undefined,
        ),
      ],
      undefined,
      factory.createBlock(
        [
          this.buildThemeVariable(),
          this.buildSetComponentNameStatement(),
          this.buildComponentWithThemeFunction(),
          factory.createExpressionStatement(
            factory.createBinaryExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier('ComponentWithTheme'),
                factory.createIdentifier('displayName'),
              ),
              factory.createToken(SyntaxKind.EqualsToken),
              factory.createIdentifier('displayName'),
            ),
          ),
          factory.createReturnStatement(factory.createIdentifier('ComponentWithTheme')),
        ],
        true,
      ),
    );
  }

  /*
   * const theme = createTheme({{ theme object }})
   */
  private buildThemeVariable() {
    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier('theme'),
            undefined,
            undefined,
            factory.createCallExpression(factory.createIdentifier('createTheme'), undefined, [
              jsonToLiteral(this.component as json),
            ]),
          ),
        ],
        NodeFlags.Const,
      ),
    );
  }

  /*
   * const displayName = WrappedComponent.displayName || WrappedComponent.name || "Component";
   */
  private buildSetComponentNameStatement() {
    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier('displayName'),
            undefined,
            undefined,
            factory.createBinaryExpression(
              factory.createBinaryExpression(
                factory.createPropertyAccessExpression(
                  factory.createIdentifier('WrappedComponent'),
                  factory.createIdentifier('displayName'),
                ),
                factory.createToken(SyntaxKind.BarBarToken),
                factory.createPropertyAccessExpression(
                  factory.createIdentifier('WrappedComponent'),
                  factory.createIdentifier('name'),
                ),
              ),
              factory.createToken(SyntaxKind.BarBarToken),
              factory.createStringLiteral('Component'),
            ),
          ),
        ],
        NodeFlags.Const,
      ),
    );
  }

  /*
   * const ComponentWithTheme = (props: T) => {
   *   return (
   *     <AmplifyProvider theme={theme}>
   *       <WrappedComponent {...props} />
   *     </AmplifyProvider>
   *   );
   * };
   */
  private buildComponentWithThemeFunction() {
    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier('ComponentWithTheme'),
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
                  factory.createIdentifier('props'),
                  undefined,
                  factory.createTypeReferenceNode(factory.createIdentifier('T'), undefined),
                  undefined,
                ),
              ],
              undefined,
              factory.createToken(SyntaxKind.EqualsGreaterThanToken),
              factory.createBlock(
                [
                  factory.createReturnStatement(
                    factory.createParenthesizedExpression(
                      factory.createJsxElement(
                        factory.createJsxOpeningElement(
                          factory.createIdentifier('AmplifyProvider'),
                          undefined,
                          factory.createJsxAttributes([
                            factory.createJsxAttribute(
                              factory.createIdentifier('theme'),
                              factory.createJsxExpression(undefined, factory.createIdentifier('theme')),
                            ),
                            factory.createJsxAttribute(
                              factory.createIdentifier('components'),
                              factory.createJsxExpression(undefined, factory.createObjectLiteralExpression([], false)),
                            ),
                          ]),
                        ),
                        [
                          factory.createJsxSelfClosingElement(
                            factory.createIdentifier('WrappedComponent'),
                            undefined,
                            factory.createJsxAttributes([
                              factory.createJsxSpreadAttribute(factory.createIdentifier('props')),
                            ]),
                          ),
                        ],
                        factory.createJsxClosingElement(factory.createIdentifier('AmplifyProvider')),
                      ),
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
  }
}
