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
import {
  FrontendManagerTemplateRenderer,
  FrontendManagerRendererConstants,
  isFrontendManagerComponentWithBinding,
  isSimplePropertyBinding,
  isDataPropertyBinding,
  isAuthPropertyBinding,
  isFrontendManagerComponentWithCollectionProperties,
  isFrontendManagerComponentWithVariants,
  isFrontendManagerComponentWithActions,
  FrontendManagerComponent,
  FrontendManagerComponentPredicate,
  FrontendManagerComponentAuthPropertyBinding,
  FrontendManagerComponentSort,
  FrontendManagerComponentVariant,
  FrontendManagerComponentAction,
  FrontendManagerComponentSimplePropertyBinding,
  handleCodegenErrors,
} from '@aws-amplify/codegen-ui';

import { EOL } from 'os';
import ts, {
  EmitHint,
  factory,
  FunctionDeclaration,
  JsxElement,
  JsxFragment,
  PropertySignature,
  SyntaxKind,
  TypeAliasDeclaration,
  TypeNode,
  VariableStatement,
  Statement,
  BindingElement,
  Modifier,
  ObjectLiteralExpression,
  CallExpression,
  Identifier,
  ComputedPropertyName,
  ArrowFunction,
  LiteralExpression,
  BooleanLiteral,
  addSyntheticLeadingComment,
  JsxSelfClosingElement,
} from 'typescript';
import { ImportCollection } from './import-collection';
import { ReactOutputManager } from './react-output-manager';
import { ReactRenderConfig, ScriptKind, scriptKindToFileExtension } from './react-render-config';
import SampleCodeRenderer from './amplify-ui-renderers/sampleCodeRenderer';
import { getComponentPropName } from './react-component-render-helper';
import {
  transpile,
  buildPrinter,
  defaultRenderConfig,
  getDeclarationFilename,
  json,
  jsonToLiteral,
  bindingPropertyUsesHook,
} from './react-frontend-manager-template-renderer-helper';
import Primitive, { isPrimitive, PrimitiveTypeParameter, isBuiltInIcon } from './primitive';
import { RequiredKeys } from './utils/type-utils';

export abstract class ReactFrontendManagerTemplateRenderer extends FrontendManagerTemplateRenderer<
  string,
  FrontendManagerComponent,
  ReactOutputManager,
  {
    componentText: string;
    renderComponentToFilesystem: (outputPath: string) => Promise<void>;
  }
> {
  protected importCollection = new ImportCollection();

  protected renderConfig: RequiredKeys<ReactRenderConfig, keyof typeof defaultRenderConfig>;

  fileName = `${this.component.name}.tsx`;

  constructor(component: FrontendManagerComponent, renderConfig: ReactRenderConfig) {
    super(component, new ReactOutputManager(), renderConfig);
    this.renderConfig = {
      ...defaultRenderConfig,
      ...renderConfig,
    };
    this.fileName = `${this.component.name}.${scriptKindToFileExtension(this.renderConfig.script)}`;
    // TODO: throw warnings on invalid config combinations. i.e. CommonJS + JSX
  }

  @handleCodegenErrors
  renderSampleCodeSnippet() {
    const jsx = this.renderSampleCodeSnippetJsx(this.component);
    const imports = this.importCollection.buildSampleSnippetImports(
      this.component.name ?? FrontendManagerRendererConstants.unknownName,
    );

    const { printer, file } = buildPrinter(this.fileName, this.renderConfig);
    let importsText = '';
    for (const importStatement of imports) {
      const result = printer.printNode(EmitHint.Unspecified, importStatement, file);
      importsText += result + EOL;
    }

    const compText = printer.printNode(EmitHint.Unspecified, jsx, file);

    return { compText, importsText };
  }

  @handleCodegenErrors
  renderComponentOnly() {
    const jsx = this.renderJsx(this.component);

    const { printer, file } = buildPrinter(this.fileName, this.renderConfig);

    const imports = this.importCollection.buildImportStatements();

    let importsText = '';

    for (const importStatement of imports) {
      const result = printer.printNode(EmitHint.Unspecified, importStatement, file);
      importsText += result + EOL;
    }

    const wrappedFunction = this.renderFunctionWrapper(
      this.component.name ?? FrontendManagerRendererConstants.unknownName,
      jsx,
      false,
    );

    const result = printer.printNode(EmitHint.Unspecified, wrappedFunction, file);

    // do not produce declaration becuase it is not used
    const { componentText: compText } = transpile(result, { ...this.renderConfig, renderTypeDeclarations: false });

    return { compText, importsText };
  }

  renderComponentInternal() {
    // This is a react component so we only need a single tsx

    const { printer, file } = buildPrinter(this.fileName, this.renderConfig);

    const jsx = this.renderJsx(this.component);

    const wrappedFunction = this.renderFunctionWrapper(
      this.component.name ?? FrontendManagerRendererConstants.unknownName,
      jsx,
      true,
    );
    const propsDeclaration = this.renderBindingPropsType(this.component);

    const imports = this.importCollection.buildImportStatements();

    let componentText = `/* eslint-disable */${EOL}`;

    for (const importStatement of imports) {
      const result = printer.printNode(EmitHint.Unspecified, importStatement, file);
      componentText += result + EOL;
    }

    componentText += EOL;

    const propsPrinted = printer.printNode(EmitHint.Unspecified, propsDeclaration, file);
    componentText += propsPrinted;

    componentText += EOL;

    const result = printer.printNode(EmitHint.Unspecified, wrappedFunction, file);
    componentText += result;

    const { componentText: transpiledComponentText, declaration } = transpile(componentText, this.renderConfig);

    return {
      componentText: transpiledComponentText,
      declaration,
      renderComponentToFilesystem: async (outputPath: string) => {
        await this.renderComponentToFilesystem(transpiledComponentText)(this.fileName)(outputPath);
        if (declaration) {
          await this.renderComponentToFilesystem(declaration)(getDeclarationFilename(this.fileName))(outputPath);
        }
      },
    };
  }

  renderFunctionWrapper(
    componentName: string,
    jsx: JsxElement | JsxFragment | JsxSelfClosingElement,
    renderExport: boolean,
  ): FunctionDeclaration {
    const componentPropType = getComponentPropName(componentName);
    const codeBlockContent = this.buildVariableStatements(this.component);
    const jsxStatement = factory.createParenthesizedExpression(
      this.renderConfig.script !== ScriptKind.TSX
        ? jsx
        : /* add ts-ignore comment above jsx statement. Generated props are incompatible with amplify-ui props */
          addSyntheticLeadingComment(
            factory.createParenthesizedExpression(jsx),
            SyntaxKind.MultiLineCommentTrivia,
            ' @ts-ignore: TS2322 ',
            true,
          ),
    );
    codeBlockContent.push(factory.createReturnStatement(jsxStatement));
    const modifiers: Modifier[] = renderExport
      ? [factory.createModifier(SyntaxKind.ExportKeyword), factory.createModifier(SyntaxKind.DefaultKeyword)]
      : [];
    const typeParameter = PrimitiveTypeParameter[Primitive[this.component.componentType as Primitive]];
    // only use type parameter reference if one was declared
    const typeParameterReference = typeParameter && typeParameter.declaration() ? typeParameter.reference() : undefined;
    return factory.createFunctionDeclaration(
      undefined,
      modifiers,
      undefined,
      factory.createIdentifier(componentName),
      typeParameter ? typeParameter.declaration() : undefined,
      [
        factory.createParameterDeclaration(
          undefined,
          undefined,
          undefined,
          'props',
          undefined,
          factory.createTypeReferenceNode(componentPropType, typeParameterReference),
          undefined,
        ),
      ],
      factory.createTypeReferenceNode(
        factory.createQualifiedName(factory.createIdentifier('React'), factory.createIdentifier('ReactElement')),
        undefined,
      ),
      factory.createBlock(codeBlockContent, true),
    );
  }

  renderAppWrapper(appName: string, jsx: JsxElement | JsxFragment | JsxSelfClosingElement): VariableStatement {
    const declarationList = factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          appName,
          undefined,
          undefined,
          factory.createArrowFunction(
            undefined,
            undefined,
            [],
            undefined,
            factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
            factory.createBlock([factory.createReturnStatement(factory.createParenthesizedExpression(jsx))], true),
          ),
        ),
      ],
      ts.NodeFlags.Const,
    );
    const wrapper = factory.createVariableStatement(
      [factory.createModifier(SyntaxKind.ExportKeyword)],
      declarationList,
    );

    return wrapper;
  }

  renderSampleCodeSnippetJsx(component: FrontendManagerComponent): JsxElement | JsxFragment | JsxSelfClosingElement {
    return new SampleCodeRenderer(component, this.importCollection).renderElement();
  }

  renderBindingPropsType(component: FrontendManagerComponent): TypeAliasDeclaration {
    const escapeHatchTypeNode = factory.createTypeLiteralNode([
      factory.createPropertySignature(
        undefined,
        factory.createIdentifier('overrides'),
        factory.createToken(ts.SyntaxKind.QuestionToken),
        factory.createUnionTypeNode([
          factory.createTypeReferenceNode(factory.createIdentifier('EscapeHatchProps'), undefined),
          factory.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword),
          factory.createLiteralTypeNode(factory.createNull()),
        ]),
      ),
    ]);
    const componentPropType = getComponentPropName(component.name);
    const propsTypeParameter = PrimitiveTypeParameter[Primitive[component.componentType as Primitive]];

    this.importCollection.addImport('@aws-amplify/ui-react', 'EscapeHatchProps');

    return factory.createTypeAliasDeclaration(
      undefined,
      [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      factory.createIdentifier(componentPropType),
      propsTypeParameter ? propsTypeParameter.declaration() : undefined,
      factory.createTypeReferenceNode(factory.createIdentifier('React.PropsWithChildren'), [
        factory.createIntersectionTypeNode(
          this.dropMissingListElements([
            this.buildBasePropNode(component),
            this.buildComponentPropNode(component),
            this.buildVariantPropNode(component),
            escapeHatchTypeNode,
          ]),
        ),
      ]),
    );
  }

  private buildBasePropNode(component: FrontendManagerComponent): TypeNode | undefined {
    const propsType = this.getPropsTypeName(component);

    const componentIsPrimitive = isPrimitive(component.componentType);
    if (componentIsPrimitive || isBuiltInIcon(component.componentType)) {
      this.importCollection.addImport('@aws-amplify/ui-react', propsType);
    } else {
      this.importCollection.addImport(`./${component.componentType}`, `${component.componentType}Props`);
    }

    const propsTypeParameter = componentIsPrimitive
      ? PrimitiveTypeParameter[Primitive[component.componentType as Primitive]]
      : undefined;

    const basePropType = factory.createTypeReferenceNode(
      factory.createIdentifier(propsType),
      propsTypeParameter ? propsTypeParameter.reference() : undefined,
    );

    return factory.createTypeReferenceNode(factory.createIdentifier('Partial'), [basePropType]);
  }

  /**
   * This builder is responsible primarily for identifying the variant options, partioning them into
   * required and optional parameters, then building the appropriate property signature based on that.
   * e.g.
     {
       variant?: "primary" | "secondary",
       size?: "large",
     }
   */
  private buildVariantPropNode(component: FrontendManagerComponent): TypeNode | undefined {
    if (!isFrontendManagerComponentWithVariants(component)) {
      return undefined;
    }
    const variantValues = component.variants.map((variant) => variant.variantValues);

    const allKeys = [...new Set(variantValues.flatMap((variantValue) => Object.keys(variantValue)))];
    const requiredKeys = allKeys
      .filter((key) => variantValues.every((variantValue) => Object.keys(variantValue).includes(key)))
      .sort();
    const optionalKeys = [...allKeys].filter((key) => !requiredKeys.includes(key)).sort();

    const requiredProperties = requiredKeys.map((key) => {
      const variantOptions = [
        ...new Set(
          variantValues
            .map((variantValue) => variantValue[key])
            .filter((variantOption) => variantOption !== undefined && variantOption !== null),
        ),
      ].sort();
      const valueTypeNodes = variantOptions.map((variantOption) =>
        factory.createLiteralTypeNode(factory.createStringLiteral(variantOption)),
      );
      return factory.createPropertySignature(
        undefined,
        factory.createIdentifier(key),
        factory.createToken(ts.SyntaxKind.QuestionToken),
        factory.createUnionTypeNode(valueTypeNodes),
      );
    });
    const optionalProperties = optionalKeys.map((key) => {
      const variantOptions = [
        ...new Set(
          variantValues
            .map((variantValue) => variantValue[key])
            .filter((variantOption) => variantOption !== undefined && variantOption !== null),
        ),
      ].sort();
      const valueTypeNodes = variantOptions.map((variantOption) =>
        factory.createLiteralTypeNode(factory.createStringLiteral(variantOption)),
      );
      return factory.createPropertySignature(
        undefined,
        factory.createIdentifier(key),
        factory.createToken(ts.SyntaxKind.QuestionToken),
        factory.createUnionTypeNode(valueTypeNodes),
      );
    });

    return factory.createTypeLiteralNode([...requiredProperties, ...optionalProperties]);
  }

  private buildComponentPropNode(component: FrontendManagerComponent): TypeNode | undefined {
    const propSignatures: PropertySignature[] = [];
    const bindingProps = component.bindingProperties;
    if (bindingProps === undefined || !isFrontendManagerComponentWithBinding(component)) {
      return undefined;
    }
    for (const bindingProp of Object.entries(component.bindingProperties)) {
      const [propName, binding] = bindingProp;
      if (isSimplePropertyBinding(binding)) {
        const propSignature = factory.createPropertySignature(
          undefined,
          propName,
          factory.createToken(SyntaxKind.QuestionToken),
          factory.createTypeReferenceNode(binding.type, undefined),
        );
        propSignatures.push(propSignature);
      } else if (isDataPropertyBinding(binding)) {
        const propSignature = factory.createPropertySignature(
          undefined,
          propName,
          factory.createToken(SyntaxKind.QuestionToken),
          factory.createTypeReferenceNode(binding.bindingProperties.model, undefined),
        );
        propSignatures.push(propSignature);
      }
    }
    if (component.componentType === 'Collection') {
      const propSignature = factory.createPropertySignature(
        undefined,
        'items',
        factory.createToken(SyntaxKind.QuestionToken),
        factory.createTypeReferenceNode('any[]', undefined),
      );
      propSignatures.push(propSignature);
    }
    if (propSignatures.length === 0) {
      return undefined;
    }
    return factory.createTypeLiteralNode(propSignatures);
  }

  private buildVariableStatements(component: FrontendManagerComponent): Statement[] {
    const statements: Statement[] = [];
    const elements: BindingElement[] = [];
    if (isFrontendManagerComponentWithBinding(component)) {
      Object.entries(component.bindingProperties).forEach((entry) => {
        const [propName, binding] = entry;
        if (isSimplePropertyBinding(binding) || isDataPropertyBinding(binding)) {
          const usesHook = bindingPropertyUsesHook(binding);
          const bindingElement = factory.createBindingElement(
            undefined,
            usesHook ? factory.createIdentifier(propName) : undefined,
            factory.createIdentifier(usesHook ? `${propName}Prop` : propName),
            isSimplePropertyBinding(binding) ? this.getDefaultValue(binding) : undefined,
          );
          elements.push(bindingElement);
        }
      });
    }

    if (component.componentType === 'Collection') {
      const bindingElement = this.hasCollectionPropertyNamedItems(component)
        ? factory.createBindingElement(
            undefined,
            factory.createIdentifier('items'),
            factory.createIdentifier('itemsProp'),
            undefined,
          )
        : factory.createBindingElement(undefined, undefined, factory.createIdentifier('items'), undefined);
      elements.push(bindingElement);
    }

    // remove overrides from rest of props
    elements.push(
      factory.createBindingElement(
        undefined,
        factory.createIdentifier('overrides'),
        factory.createIdentifier('overridesProp'),
        undefined,
      ),
    );

    // get rest of props to pass to top level component
    elements.push(
      factory.createBindingElement(
        factory.createToken(ts.SyntaxKind.DotDotDotToken),
        undefined,
        factory.createIdentifier('rest'),
        undefined,
      ),
    );

    const statement = factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createObjectBindingPattern(elements),
            undefined,
            undefined,
            factory.createIdentifier('props'),
          ),
        ],
        ts.NodeFlags.Const,
      ),
    );
    statements.push(statement);

    if (isFrontendManagerComponentWithVariants(component)) {
      statements.push(this.buildVariantDeclaration(component.variants));
      // TODO: In components, replace props.override with override (defined here).
    }

    if (isFrontendManagerComponentWithVariants(component)) {
      statements.push(this.buildMergeOverridesFunction());
    }

    statements.push(this.buildOverridesDeclaration(isFrontendManagerComponentWithVariants(component)));

    const authStatement = this.buildUseAuthenticatedUserStatement(component);
    if (authStatement !== undefined) {
      this.importCollection.addImport('@aws-amplify/ui-react/internal', 'useAuth');
      statements.push(authStatement);
    }

    const collectionBindingStatements = this.buildCollectionBindingStatements(component);
    collectionBindingStatements.forEach((entry) => {
      statements.push(entry);
    });

    const useStoreBindingStatements = this.buildUseDataStoreBindingStatements(component);
    useStoreBindingStatements.forEach((entry) => {
      statements.push(entry);
    });

    const actionStatement = this.buildUseActionsStatement(component);
    if (actionStatement !== undefined) {
      statements.push(actionStatement);
    }

    return statements;
  }

  private buildUseAuthenticatedUserStatement(component: FrontendManagerComponent): Statement | undefined {
    if (isFrontendManagerComponentWithBinding(component)) {
      const authPropertyBindings = Object.entries(component.bindingProperties).filter(([, binding]) =>
        isAuthPropertyBinding(binding),
      );
      if (authPropertyBindings.length) {
        // create destructuring statements
        // { propertyName: newName, ['custom:property']: customProperty }
        const bindings = factory.createObjectBindingPattern(
          authPropertyBindings.map(([propName, binding]) => {
            const {
              bindingProperties: { userAttribute },
            } = binding as FrontendManagerComponentAuthPropertyBinding;
            let propertyName: undefined | Identifier | ComputedPropertyName = factory.createIdentifier(userAttribute);
            if (userAttribute.startsWith('custom:')) {
              propertyName = factory.createComputedPropertyName(factory.createStringLiteral(userAttribute));
            } else if (propName === userAttribute) {
              propertyName = undefined;
            }
            return factory.createBindingElement(undefined, propertyName, factory.createIdentifier(propName), undefined);
          }),
        );

        // get values from useAuthenticatedUser
        // const { property } = useAuth().user?.attributes || {};
        return factory.createVariableStatement(
          undefined,
          factory.createVariableDeclarationList(
            [
              factory.createVariableDeclaration(
                bindings,
                undefined,
                undefined,
                factory.createBinaryExpression(
                  factory.createPropertyAccessChain(
                    factory.createPropertyAccessExpression(
                      factory.createCallExpression(factory.createIdentifier('useAuth'), undefined, []),
                      factory.createIdentifier('user'),
                    ),
                    factory.createToken(ts.SyntaxKind.QuestionDotToken),
                    factory.createIdentifier('attributes'),
                  ),
                  factory.createToken(ts.SyntaxKind.QuestionQuestionToken),
                  factory.createObjectLiteralExpression([], false),
                ),
              ),
            ],
            ts.NodeFlags.Const,
          ),
        );
      }
    }

    return undefined;
  }

  /**
   * const variants = [
     {
       variantValues: { variant: 'primary' },
       overrides: { Button: { fontSize: '12px' } },
     },
     {
       variantValues: { variant: 'secondary' },
       overrides: { Button: { fontSize: '40px' } }
     }
   ];
   */
  private buildVariantDeclaration(variants: FrontendManagerComponentVariant[]): VariableStatement {
    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier('variants'),
            undefined,
            factory.createArrayTypeNode(
              factory.createTypeReferenceNode(factory.createIdentifier('Variant'), undefined),
            ),
            jsonToLiteral(variants as json),
          ),
        ],
        ts.NodeFlags.Const,
      ),
    );
  }

  private buildMergeOverridesFunction(): VariableStatement {
    return factory.createVariableStatement(
      undefined,
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
    );
  }

  /**
   * case: hasVariants = true => const overrides = { ...getOverridesFromVariants(variants, props) };
   * case: hasVariants = false => const overrides = { ...overridesProp };
   */
  private buildOverridesDeclaration(hasVariants: boolean): VariableStatement {
    if (hasVariants) {
      this.importCollection.addImport('@aws-amplify/ui-react/internal', 'getOverridesFromVariants');
      this.importCollection.addImport('@aws-amplify/ui-react/internal', 'Variant');

      return factory.createVariableStatement(
        undefined,
        factory.createVariableDeclarationList(
          [
            factory.createVariableDeclaration(
              factory.createIdentifier('overrides'),
              undefined,
              undefined,
              factory.createCallExpression(factory.createIdentifier('mergeVariantsAndOverrides'), undefined, [
                factory.createCallExpression(factory.createIdentifier('getOverridesFromVariants'), undefined, [
                  factory.createIdentifier('variants'),
                  factory.createIdentifier('props'),
                ]),
                factory.createBinaryExpression(
                  factory.createIdentifier('overridesProp'),
                  factory.createToken(ts.SyntaxKind.BarBarToken),
                  factory.createObjectLiteralExpression([], false),
                ),
              ]),
            ),
          ],
          ts.NodeFlags.Const,
        ),
      );
    }

    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier('overrides'),
            undefined,
            undefined,
            factory.createObjectLiteralExpression([
              factory.createSpreadAssignment(factory.createIdentifier('overridesProp')),
            ]),
          ),
        ],
        ts.NodeFlags.Const,
      ),
    );
  }

  private buildCollectionBindingStatements(component: FrontendManagerComponent): Statement[] {
    const statements: Statement[] = [];

    if (isFrontendManagerComponentWithCollectionProperties(component)) {
      Object.entries(component.collectionProperties).forEach((collectionProp) => {
        const [propName, { model, sort, predicate }] = collectionProp;
        if (predicate) {
          statements.push(this.buildPredicateDeclaration(propName, predicate));
          statements.push(this.buildCreateDataStorePredicateCall(model, propName));
        }
        if (sort) {
          this.importCollection.addImport('@aws-amplify/datastore', 'SortDirection');
          this.importCollection.addImport('@aws-amplify/datastore', 'SortPredicate');
          statements.push(this.buildPaginationStatement(propName, model, sort));
        }
        this.importCollection.addImport('../models', model);
        statements.push(
          this.buildPropPrecedentStatement(
            propName,
            this.hasCollectionPropertyNamedItems(component) ? 'itemsProp' : 'items',
            factory.createPropertyAccessExpression(
              this.buildUseDataStoreBindingCall(
                'collection',
                model,
                predicate ? this.getFilterName(propName) : undefined,
                sort ? this.getPaginationName(propName) : undefined,
              ),
              'items',
            ),
          ),
        );
      });
    }

    return statements;
  }

  private buildCreateDataStorePredicateCall(type: string, name: string): Statement {
    this.importCollection.addImport('@aws-amplify/ui-react/internal', 'createDataStorePredicate');
    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(this.getFilterName(name)),
            undefined,
            undefined,
            factory.createCallExpression(
              factory.createIdentifier('createDataStorePredicate'),
              [factory.createTypeReferenceNode(factory.createIdentifier(type), undefined)],
              [factory.createIdentifier(this.getFilterObjName(name))],
            ),
          ),
        ],
        ts.NodeFlags.Const,
      ),
    );
  }

  private buildUseDataStoreBindingStatements(component: FrontendManagerComponent): Statement[] {
    const statements: Statement[] = [];

    // generate for single record binding
    if (component.bindingProperties !== undefined) {
      Object.entries(component.bindingProperties).forEach((compBindingProp) => {
        const [propName, binding] = compBindingProp;
        if (isDataPropertyBinding(binding)) {
          const { bindingProperties } = binding;
          if ('predicate' in bindingProperties && bindingProperties.predicate !== undefined) {
            this.importCollection.addImport('@aws-amplify/ui-react/internal', 'useDataStoreBinding');
            /* const buttonColorFilter = {
             *   field: "userID",
             *   operand: "user@email.com",
             *   operator: "eq",
             * }
             */
            statements.push(this.buildPredicateDeclaration(propName, bindingProperties.predicate));
            statements.push(this.buildCreateDataStorePredicateCall(bindingProperties.model, propName));
            const { model } = bindingProperties;
            this.importCollection.addImport('../models', model);

            /* const buttonColorDataStore = useDataStoreBinding({
             *   type: "collection"
             *   ...
             * }).items[0];
             */
            statements.push(
              factory.createVariableStatement(
                undefined,
                factory.createVariableDeclarationList(
                  [
                    factory.createVariableDeclaration(
                      factory.createIdentifier(this.getDataStoreName(propName)),
                      undefined,
                      undefined,
                      factory.createElementAccessExpression(
                        factory.createPropertyAccessExpression(
                          this.buildUseDataStoreBindingCall('collection', model, this.getFilterName(propName)),
                          factory.createIdentifier('items'),
                        ),
                        factory.createNumericLiteral('0'),
                      ),
                    ),
                  ],
                  ts.NodeFlags.Const,
                ),
              ),
            );

            statements.push(
              factory.createVariableStatement(
                undefined,
                factory.createVariableDeclarationList(
                  [
                    factory.createVariableDeclaration(
                      factory.createIdentifier(propName),
                      undefined,
                      undefined,
                      factory.createConditionalExpression(
                        factory.createBinaryExpression(
                          factory.createIdentifier(`${propName}Prop`),
                          factory.createToken(ts.SyntaxKind.ExclamationEqualsEqualsToken),
                          factory.createIdentifier('undefined'),
                        ),
                        factory.createToken(ts.SyntaxKind.QuestionToken),
                        factory.createIdentifier(`${propName}Prop`),
                        factory.createToken(ts.SyntaxKind.ColonToken),
                        factory.createIdentifier(this.getDataStoreName(propName)),
                      ),
                    ),
                  ],
                  ts.NodeFlags.Const,
                ),
              ),
            );
          }
        }
      });
    }
    return statements;
  }

  private buildPropPrecedentStatement(
    precedentName: string,
    propName: string,
    defaultExpression: any,
  ): VariableStatement {
    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(precedentName),
            undefined,
            undefined,
            factory.createConditionalExpression(
              factory.createBinaryExpression(
                factory.createIdentifier(propName),
                factory.createToken(ts.SyntaxKind.ExclamationEqualsEqualsToken),
                factory.createIdentifier('undefined'),
              ),
              factory.createToken(ts.SyntaxKind.QuestionToken),
              factory.createIdentifier(propName),
              factory.createToken(ts.SyntaxKind.ColonToken),
              defaultExpression,
            ),
          ),
        ],
        ts.NodeFlags.Const,
      ),
    );
  }

  /**
   * const buttonUserSort = {
   *   sort: (s: SortPredicate<User>) => s.firstName('DESCENDING').lastName('ASCENDING')
   * }
   */
  private buildPaginationStatement(
    propName: string,
    model: string,
    sort?: FrontendManagerComponentSort[],
  ): VariableStatement {
    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(this.getPaginationName(propName)),
            undefined,
            undefined,
            factory.createObjectLiteralExpression(
              ([] as ts.PropertyAssignment[]).concat(
                sort
                  ? [
                      factory.createPropertyAssignment(
                        factory.createIdentifier('sort'),
                        this.buildSortFunction(model, sort),
                      ),
                    ]
                  : [],
              ),
            ),
          ),
        ],
        ts.NodeFlags.Const,
      ),
    );
  }

  /**
   * (s: SortPredicate<User>) => s.firstName('ASCENDING').lastName('DESCENDING')
   */
  private buildSortFunction(model: string, sort: FrontendManagerComponentSort[]): ArrowFunction {
    const ascendingSortDirection = factory.createPropertyAccessExpression(
      factory.createIdentifier('SortDirection'),
      factory.createIdentifier('ASCENDING'),
    );
    const descendingSortDirection = factory.createPropertyAccessExpression(
      factory.createIdentifier('SortDirection'),
      factory.createIdentifier('DESCENDING'),
    );

    let expr: Identifier | CallExpression = factory.createIdentifier('s');
    sort.forEach((sortPredicate) => {
      expr = factory.createCallExpression(
        factory.createPropertyAccessExpression(expr, factory.createIdentifier(sortPredicate.field)),
        undefined,
        [sortPredicate.direction === 'ASC' ? ascendingSortDirection : descendingSortDirection],
      );
    });

    return factory.createArrowFunction(
      undefined,
      undefined,
      [
        factory.createParameterDeclaration(
          undefined,
          undefined,
          undefined,
          factory.createIdentifier('s'),
          undefined,
          factory.createTypeReferenceNode(factory.createIdentifier('SortPredicate'), [
            factory.createTypeReferenceNode(factory.createIdentifier(model), undefined),
          ]),
          undefined,
        ),
      ],
      undefined,
      factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
      expr,
    );
  }

  /* Build useActions hook with component.actions passed
   *
   * Example:
   * const { invokeAction } = useActions({
   *   signOutAction: {
   *     type: "Amplify.Auth.SignOut",
   *     parameters: { global: true },
   *   },
   * });
   */
  private buildUseActionsStatement(component: FrontendManagerComponent): Statement | undefined {
    if (isFrontendManagerComponentWithActions(component)) {
      return factory.createVariableStatement(
        undefined,
        factory.createVariableDeclarationList(
          [
            factory.createVariableDeclaration(
              factory.createObjectBindingPattern([
                factory.createBindingElement(undefined, undefined, factory.createIdentifier('invokeAction'), undefined),
              ]),
              undefined,
              undefined,
              factory.createCallExpression(factory.createIdentifier('useActions'), undefined, [
                this.actionsToObjectLiteralExpression(component.actions),
              ]),
            ),
          ],
          ts.NodeFlags.Const,
        ),
      );
    }

    return undefined;
  }

  private buildUseDataStoreBindingCall(
    callType: string,
    bindingModel: string,
    criteriaName?: string,
    paginationName?: string,
  ): CallExpression {
    this.importCollection.addImport('@aws-amplify/ui-react/internal', 'useDataStoreBinding');

    const objectProperties = [
      factory.createPropertyAssignment(factory.createIdentifier('type'), factory.createStringLiteral(callType)),
      factory.createPropertyAssignment(factory.createIdentifier('model'), factory.createIdentifier(bindingModel)),
    ]
      .concat(
        criteriaName
          ? [
              factory.createPropertyAssignment(
                factory.createIdentifier('criteria'),
                factory.createIdentifier(criteriaName),
              ),
            ]
          : [],
      )
      .concat(
        paginationName
          ? [
              factory.createPropertyAssignment(
                factory.createIdentifier('pagination'),
                factory.createIdentifier(paginationName),
              ),
            ]
          : [],
      );

    return factory.createCallExpression(factory.createIdentifier('useDataStoreBinding'), undefined, [
      factory.createObjectLiteralExpression(objectProperties, true),
    ]);
  }

  private predicateToObjectLiteralExpression(predicate: FrontendManagerComponentPredicate): ObjectLiteralExpression {
    return factory.createObjectLiteralExpression(
      Object.entries(predicate).map(([key, value]) => {
        return factory.createPropertyAssignment(
          factory.createIdentifier(key),
          key === 'and' || key === 'or'
            ? factory.createArrayLiteralExpression(
                (value as FrontendManagerComponentPredicate[]).map(
                  (pred: FrontendManagerComponentPredicate) => this.predicateToObjectLiteralExpression(pred),
                  false,
                ),
              )
            : factory.createStringLiteral(value as string),
        );
      }, false),
    );
  }

  private actionsToObjectLiteralExpression(actions: { [actionName: string]: FrontendManagerComponentAction }) {
    // TODO: support property bindings
    return jsonToLiteral(actions as json);
  }

  private buildPredicateDeclaration(name: string, predicate: FrontendManagerComponentPredicate): VariableStatement {
    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(this.getFilterObjName(name)),
            undefined,
            undefined,
            this.predicateToObjectLiteralExpression(predicate),
          ),
        ],
        ts.NodeFlags.Const,
      ),
    );
  }

  private hasCollectionPropertyNamedItems(component: FrontendManagerComponent): boolean {
    if (component.collectionProperties === undefined) {
      return false;
    }
    return Object.keys(component.collectionProperties).some((propName) => propName === 'items');
  }

  private getPaginationName(propName: string): string {
    return `${propName}Pagination`;
  }

  private getFilterObjName(propName: string): string {
    return `${propName}FilterObj`;
  }

  private getFilterName(propName: string): string {
    return `${propName}Filter`;
  }

  private getDataStoreName(propName: string): string {
    return `${propName}DataStore`;
  }

  private getPropsTypeName(component: FrontendManagerComponent): string {
    if (isBuiltInIcon(component.componentType)) {
      return 'IconProps';
    }
    return `${component.componentType}Props`;
  }

  private dropMissingListElements<T>(elements: (T | null | undefined)[]): T[] {
    return elements.filter((element) => element !== null && element !== undefined) as T[];
  }

  private getDefaultValue(
    binding: FrontendManagerComponentSimplePropertyBinding,
  ): LiteralExpression | BooleanLiteral | undefined {
    if (binding.defaultValue !== undefined) {
      switch (binding.type) {
        case 'String':
          return factory.createStringLiteral(binding.defaultValue);
        case 'Number':
          return factory.createNumericLiteral(binding.defaultValue);
        case 'Boolean':
          return JSON.parse(binding.defaultValue) ? factory.createTrue() : factory.createFalse();
        default:
          throw new Error(`Could not parse binding with type ${binding.type}`);
      }
    }
    return undefined;
  }

  abstract renderJsx(component: FrontendManagerComponent): JsxElement | JsxFragment | JsxSelfClosingElement;
}
