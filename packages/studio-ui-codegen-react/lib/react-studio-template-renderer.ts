import {
  StudioComponent,
  StudioComponentPredicate,
  StudioComponentAuthPropertyBinding,
  StudioComponentSort,
  StudioComponentVariant,
} from '@amzn/amplify-ui-codegen-schema';
import {
  StudioTemplateRenderer,
  StudioRendererConstants,
  isStudioComponentWithBinding,
  isSimplePropertyBinding,
  isDataPropertyBinding,
  isAuthPropertyBinding,
  isStudioComponentWithCollectionProperties,
  isStudioComponentWithVariants,
} from '@amzn/studio-ui-codegen';

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
} from 'typescript';
import { ImportCollection } from './import-collection';
import { ReactOutputManager } from './react-output-manager';
import { ReactRenderConfig, ScriptKind, scriptKindToFileExtension } from './react-render-config';
import SampleCodeRenderer from './amplify-ui-renderers/sampleCodeRenderer';
import { getComponentPropName } from './react-component-render-helper';
import { transpile, buildPrinter, defaultRenderConfig } from './react-studio-template-renderer-helper';

export abstract class ReactStudioTemplateRenderer extends StudioTemplateRenderer<
  string,
  StudioComponent,
  ReactOutputManager,
  {
    componentText: string;
    renderComponentToFilesystem: (outputPath: string) => Promise<void>;
  }
> {
  protected importCollection = new ImportCollection();

  fileName = `${this.component.name}.tsx`;

  constructor(component: StudioComponent, protected renderConfig: ReactRenderConfig) {
    super(component, new ReactOutputManager(), renderConfig);
    const { script } = this.renderConfig;
    if (script !== ScriptKind.TSX) {
      this.fileName = `${this.component.name}.${scriptKindToFileExtension(renderConfig.script || ScriptKind.TSX)}`;
    }

    this.renderConfig = {
      ...defaultRenderConfig,
      ...this.renderConfig,
    };

    // TODO: throw warnings on invalid config combinations. i.e. CommonJS + JSX
  }

  renderSampleCodeSnippet() {
    const jsx = this.renderSampleCodeSnippetJsx(this.component);
    const imports = this.importCollection.buildSampleSnippetImports(
      this.component.name ?? StudioRendererConstants.unknownName,
    );
    const sampleAppName = 'App';

    const { printer, file } = buildPrinter(this.fileName, this.renderConfig);
    let importsText = '';
    for (const importStatement of imports) {
      const result = printer.printNode(EmitHint.Unspecified, importStatement, file);
      importsText += result + EOL;
    }

    const wrapper = this.renderAppWrapper(sampleAppName, jsx);
    const compText = printer.printNode(EmitHint.Unspecified, wrapper, file);

    return { compText, importsText };
  }

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
      this.component.name ?? StudioRendererConstants.unknownName,
      jsx,
      false,
    );

    const result = printer.printNode(EmitHint.Unspecified, wrappedFunction, file);

    const compText = transpile(result, this.renderConfig);

    return { compText, importsText };
  }

  renderComponent() {
    // This is a react component so we only need a single tsx

    const { printer, file } = buildPrinter(this.fileName, this.renderConfig);

    const jsx = this.renderJsx(this.component);

    const wrappedFunction = this.renderFunctionWrapper(
      this.component.name ?? StudioRendererConstants.unknownName,
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

    const transpiledComponentText = transpile(componentText, this.renderConfig);

    return {
      componentText: transpiledComponentText,
      renderComponentToFilesystem: this.renderComponentToFilesystem(transpiledComponentText)(this.fileName),
    };
  }

  renderFunctionWrapper(
    componentName: string,
    jsx: JsxElement | JsxFragment,
    renderExport: boolean,
  ): FunctionDeclaration {
    const componentPropType = getComponentPropName(componentName);
    const codeBlockContent = this.buildVariableStatements(this.component);
    codeBlockContent.push(factory.createReturnStatement(factory.createParenthesizedExpression(jsx)));
    const modifiers: Modifier[] = renderExport
      ? [factory.createModifier(SyntaxKind.ExportKeyword), factory.createModifier(SyntaxKind.DefaultKeyword)]
      : [];
    return factory.createFunctionDeclaration(
      undefined,
      modifiers,
      undefined,
      factory.createIdentifier(componentName),
      undefined,
      [
        factory.createParameterDeclaration(
          undefined,
          undefined,
          undefined,
          'props',
          undefined,
          factory.createTypeReferenceNode(componentPropType, undefined),
          undefined,
        ),
      ],
      factory.createTypeReferenceNode(
        factory.createQualifiedName(factory.createIdentifier('JSX'), factory.createIdentifier('Element')),
        undefined,
      ),
      factory.createBlock(codeBlockContent, true),
    );
  }

  renderAppWrapper(appName: string, jsx: JsxElement | JsxFragment): VariableStatement {
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

  renderSampleCodeSnippetJsx(component: StudioComponent): JsxElement | JsxFragment {
    return new SampleCodeRenderer(component, this.importCollection).renderElement();
  }

  renderBindingPropsType(component: StudioComponent): TypeAliasDeclaration {
    const escapeHatchType = factory.createTypeLiteralNode([
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
    this.importCollection.addImport('@aws-amplify/ui-react', 'EscapeHatchProps');
    return factory.createTypeAliasDeclaration(
      undefined,
      [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      factory.createIdentifier(componentPropType),
      undefined,
      factory.createIntersectionTypeNode(
        this.dropMissingListElements([
          this.buildComponentPropNodes(component),
          this.buildVariantPropNodes(component),
          escapeHatchType,
        ]),
      ),
    );
  }

  /**
   * This builder is responsible primarily for identifying the variant options, partioning them into
   * required and optional parameters, then building the appropriate property signature based on that.
   * e.g.
     {
       variant: "primary" | "secondary",
       size?: "large",
     }
   */
  private buildVariantPropNodes(component: StudioComponent): TypeNode | undefined {
    if (!isStudioComponentWithVariants(component)) {
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
        undefined,
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

  private buildComponentPropNodes(component: StudioComponent): TypeNode | undefined {
    const propSignatures: PropertySignature[] = [];
    const bindingProps = component.bindingProperties;
    if (bindingProps === undefined || !isStudioComponentWithBinding(component)) {
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

  private buildVariableStatements(component: StudioComponent): Statement[] {
    const statements: Statement[] = [];

    if (isStudioComponentWithBinding(component)) {
      const elements: BindingElement[] = [];
      Object.entries(component.bindingProperties).forEach((entry) => {
        const [propName, binding] = entry;
        if (isSimplePropertyBinding(binding) || isDataPropertyBinding(binding)) {
          const bindingElement = factory.createBindingElement(
            undefined,
            undefined,
            factory.createIdentifier(propName),
            undefined,
          );
          elements.push(bindingElement);
        }
      });

      if (component.componentType === 'Collection') {
        const bindingElement = factory.createBindingElement(
          undefined,
          undefined,
          factory.createIdentifier('items'),
          undefined,
        );
        elements.push(bindingElement);
      }

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
    }

    if (isStudioComponentWithVariants(component)) {
      statements.push(this.buildVariantDeclaration(component.variants));
      // TODO: In components, replace props.override with override (defined here).
    }

    statements.push(this.buildOverridesDeclaration(isStudioComponentWithVariants(component)));

    const authStatement = this.buildUseAuthenticatedUserStatement(component);
    if (authStatement !== undefined) {
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

    return statements;
  }

  private buildUseAuthenticatedUserStatement(component: StudioComponent): Statement | undefined {
    if (isStudioComponentWithBinding(component)) {
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
            } = binding as StudioComponentAuthPropertyBinding;
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
        // const { attributes: { property } } = useAuthenticatedUser()
        return factory.createVariableStatement(
          undefined,
          factory.createVariableDeclarationList(
            [
              factory.createVariableDeclaration(
                factory.createObjectBindingPattern([
                  factory.createBindingElement(undefined, factory.createIdentifier('attributes'), bindings, undefined),
                ]),
                undefined,
                undefined,
                factory.createCallExpression(factory.createIdentifier('useAuthenticatedUser'), undefined, []),
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
   * This is perhaps slightly odd, because the input shape very directly lines up with what we emit as the assignment
   * expression, but I wanted to leave this so we're not implicitly opting out of processing, and relying on matching
   * shapes in the input and output layers for things to work.
   * const variants = [
   {
    variantValues: {
      'variant': 'primary'
    },
    overrides: {
      'Button': {
        'fontSize': '12px',
      },
    },
  },
   {
    variantValues: {
      'variant': 'secondary'
    },
    overrides: {
      'Button': {
        'fontSize': '40px',
      },
    },
  },
   {
    variantValues: {
      'variant': 'primary',
      'size': 'large'
    },
    overrides: {
      'Button': {
        'width': '500',
      },
    },
  }
   ];
   */
  private buildVariantDeclaration(variants: StudioComponentVariant[]): VariableStatement {
    const variantObjectLiteralExpressions = variants.map((variant) => {
      const variantValueProperties = Object.entries(variant.variantValues).map(([variantPropName, variantPropField]) =>
        factory.createPropertyAssignment(
          factory.createStringLiteral(variantPropName),
          factory.createStringLiteral(variantPropField),
        ),
      );

      const variantOverrides = Object.entries(variant.overrides).map(([hierarchyReference, overrideExpression]) => {
        const variantValueProperties = Object.entries(overrideExpression).map(([overrideName, overrideValue]) =>
          factory.createPropertyAssignment(
            factory.createStringLiteral(overrideName),
            factory.createStringLiteral(overrideValue),
          ),
        );

        return factory.createPropertyAssignment(
          factory.createStringLiteral(hierarchyReference),
          factory.createObjectLiteralExpression(variantValueProperties, true),
        );
      });

      return factory.createObjectLiteralExpression(
        [
          factory.createPropertyAssignment(
            factory.createIdentifier('variantValues'),
            factory.createObjectLiteralExpression(variantValueProperties, true),
          ),
          factory.createPropertyAssignment(
            factory.createIdentifier('overrides'),
            factory.createObjectLiteralExpression(variantOverrides, true),
          ),
        ],
        true,
      );
    });

    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier('variants'),
            undefined,
            undefined,
            factory.createArrayLiteralExpression(variantObjectLiteralExpressions),
          ),
        ],
        ts.NodeFlags.Const,
      ),
    );
  }

  /**
   * case: hasVariants = true => const overrides = { ...getOverridesFromVariants(variants), ...props.overrides };
   * case: hasVariants = false => const overrides = { ...props.overrides };
   */
  private buildOverridesDeclaration(hasVariants: boolean): VariableStatement {
    if (hasVariants) {
      this.importCollection.addImport('@aws-amplify/ui-react', 'getOverridesFromVariants');
    }

    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier('overrides'),
            undefined,
            undefined,
            factory.createObjectLiteralExpression(
              ([] as ts.ObjectLiteralElementLike[])
                .concat(
                  hasVariants
                    ? [
                        factory.createSpreadAssignment(
                          factory.createCallExpression(
                            factory.createIdentifier('getOverridesFromVariants'),
                            undefined,
                            [factory.createIdentifier('variants'), factory.createIdentifier('props')],
                          ),
                        ),
                      ]
                    : [],
                )
                .concat([
                  factory.createSpreadAssignment(
                    factory.createPropertyAccessExpression(
                      factory.createIdentifier('props'),
                      factory.createIdentifier('overrides'),
                    ),
                  ),
                ]),
            ),
          ),
        ],
        ts.NodeFlags.Const,
      ),
    );
  }

  private buildCollectionBindingStatements(component: StudioComponent): Statement[] {
    const statements: Statement[] = [];

    if (isStudioComponentWithCollectionProperties(component)) {
      Object.entries(component.collectionProperties).forEach((collectionProp) => {
        const [propName, { model, sort, predicate }] = collectionProp;
        if (predicate) {
          statements.push(this.buildPredicateDeclaration(propName, predicate));
        }
        if (sort) {
          this.importCollection.addImport('@aws-amplify/ui-react', 'SortDirection');
          statements.push(this.buildPaginationStatement(propName, sort));
        }
        this.importCollection.addImport('../models', model);
        statements.push(
          this.buildPropPrecedentStatement(
            propName,
            'items',
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

  private buildUseDataStoreBindingStatements(component: StudioComponent): Statement[] {
    const statements: Statement[] = [];

    // generate for single record binding
    if (component.bindingProperties !== undefined) {
      Object.entries(component.bindingProperties).forEach((compBindingProp) => {
        const [propName, binding] = compBindingProp;
        if (isDataPropertyBinding(binding)) {
          const { bindingProperties } = binding;
          if ('predicate' in bindingProperties && bindingProperties.predicate !== undefined) {
            statements.push(this.buildPredicateDeclaration(propName, bindingProperties.predicate));
            const { model } = bindingProperties;
            this.importCollection.addImport('../models', model);
            statements.push(
              factory.createVariableStatement(
                undefined,
                factory.createVariableDeclarationList(
                  [
                    factory.createVariableDeclaration(
                      factory.createObjectBindingPattern([
                        factory.createBindingElement(
                          undefined,
                          factory.createIdentifier('item'),
                          factory.createIdentifier(propName),
                          undefined,
                        ),
                      ]),
                      undefined,
                      undefined,
                      this.buildUseDataStoreBindingCall('record', model, this.getFilterName(propName)),
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
   *   sort: s => s.firstName('DESCENDING').lastName('ASCENDING')
   * }
   */
  private buildPaginationStatement(propName: string, sort?: StudioComponentSort[]): VariableStatement {
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
                  ? [factory.createPropertyAssignment(factory.createIdentifier('sort'), this.buildSortFunction(sort))]
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
   * s => s.firstName('ASCENDING').lastName('DESCENDING')
   */
  private buildSortFunction(sort: StudioComponentSort[]): ArrowFunction {
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
          undefined,
          undefined,
        ),
      ],
      undefined,
      factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
      expr,
    );
  }

  private buildUseDataStoreBindingCall(
    callType: string,
    bindingModel: string,
    criteriaName?: string,
    paginationName?: string,
  ): CallExpression {
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

  private predicateToObjectLiteralExpression(predicate: StudioComponentPredicate): ObjectLiteralExpression {
    return factory.createObjectLiteralExpression(
      Object.entries(predicate).map(([key, value]) => {
        return factory.createPropertyAssignment(
          factory.createIdentifier(key),
          key === 'and' || key === 'or'
            ? factory.createArrayLiteralExpression(
                (value as StudioComponentPredicate[]).map(
                  (pred: StudioComponentPredicate) => this.predicateToObjectLiteralExpression(pred),
                  false,
                ),
              )
            : factory.createStringLiteral(value as string),
        );
      }, false),
    );
  }

  private buildPredicateDeclaration(name: string, predicate: StudioComponentPredicate): VariableStatement {
    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(this.getFilterName(name)),
            undefined,
            undefined,
            this.predicateToObjectLiteralExpression(predicate),
          ),
        ],
        ts.NodeFlags.Const,
      ),
    );
  }

  private getPaginationName(propName: string): string {
    return `${propName}Pagination`;
  }

  private getFilterName(propName: string): string {
    return `${propName}Filter`;
  }

  private dropMissingListElements<T>(elements: (T | null | undefined)[]): T[] {
    return elements.filter((element) => element !== null && element !== undefined) as T[];
  }

  abstract renderJsx(component: StudioComponent): JsxElement | JsxFragment;
}
