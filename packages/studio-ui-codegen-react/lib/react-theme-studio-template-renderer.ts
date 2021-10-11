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

  fileName = 'theme.txs';

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
   * import { useEffect } from "react";
   * import {
   *   AmplifyProvider,
   *   DeepPartial,
   *   Theme,
   *   extendTheming,
   * } from "@aws-amplify/ui-react";
   */
  private buildImports() {
    this.importCollection.addImport('react', 'useEffect');
    this.importCollection.addImport('@aws-amplify/ui-react', 'extendTheming');
    this.importCollection.addImport('@aws-amplify/ui-react', 'Theme');
    this.importCollection.addImport('@aws-amplify/ui-react', 'DeepPartial');
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
            factory.createQualifiedName(factory.createIdentifier('React'), factory.createIdentifier('ReactComponent')),
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
   * const theme = {{ theme object }}
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
            jsonToLiteral(this.component as json),
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
   *   const theming = extendTheming(theme);
   *   useEffect(() => {
   *     Object.entries(theming.CSSVariables).forEach(([key, value]) => {
   *       document.documentElement.style.setProperty(key, value);
   *     });
   *   });
   *   return (
   *     <AmplifyProvider theming={theming}>
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
                  this.buildExtendThemingStatement(),
                  this.buildApplyStylesHook(),
                  factory.createReturnStatement(
                    factory.createParenthesizedExpression(
                      factory.createJsxElement(
                        factory.createJsxOpeningElement(
                          factory.createIdentifier('AmplifyProvider'),
                          undefined,
                          factory.createJsxAttributes([
                            factory.createJsxAttribute(
                              factory.createIdentifier('theming'),
                              factory.createJsxExpression(undefined, factory.createIdentifier('theming')),
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

  /*
   * const theming = extendTheming(theme);
   */
  private buildExtendThemingStatement() {
    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier('theming'),
            undefined,
            undefined,
            factory.createCallExpression(factory.createIdentifier('extendTheming'), undefined, [
              factory.createIdentifier('theme'),
            ]),
          ),
        ],
        NodeFlags.Const,
      ),
    );
  }

  /*
   * useEffect(() => {
   *   Object.entries(theming.CSSVariables).forEach(([key, value]) => {
   *     document.documentElement.style.setProperty(key, value);
   *   });
   * });
   */
  private buildApplyStylesHook() {
    return factory.createExpressionStatement(
      factory.createCallExpression(factory.createIdentifier('useEffect'), undefined, [
        factory.createArrowFunction(
          undefined,
          undefined,
          [],
          undefined,
          factory.createToken(SyntaxKind.EqualsGreaterThanToken),
          factory.createBlock(
            [
              factory.createExpressionStatement(
                factory.createCallExpression(
                  factory.createPropertyAccessExpression(
                    factory.createCallExpression(
                      factory.createPropertyAccessExpression(
                        factory.createIdentifier('Object'),
                        factory.createIdentifier('entries'),
                      ),
                      undefined,
                      [
                        factory.createPropertyAccessExpression(
                          factory.createIdentifier('theming'),
                          factory.createIdentifier('CSSVariables'),
                        ),
                      ],
                    ),
                    factory.createIdentifier('forEach'),
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
                      factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                      factory.createBlock(
                        [
                          factory.createExpressionStatement(
                            factory.createCallExpression(
                              factory.createPropertyAccessExpression(
                                factory.createPropertyAccessExpression(
                                  factory.createPropertyAccessExpression(
                                    factory.createIdentifier('document'),
                                    factory.createIdentifier('documentElement'),
                                  ),
                                  factory.createIdentifier('style'),
                                ),
                                factory.createIdentifier('setProperty'),
                              ),
                              undefined,
                              [factory.createIdentifier('key'), factory.createIdentifier('value')],
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
            true,
          ),
        ),
      ]),
    );
  }
}
