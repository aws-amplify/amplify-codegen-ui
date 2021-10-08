import {
  StudioComponent,
  StudioComponentPredicate,
  StudioComponentAuthPropertyBinding,
  StudioComponentSort,
} from '@amzn/amplify-ui-codegen-schema';
import {
  StudioTemplateRenderer,
  StudioRendererConstants,
  isStudioComponentWithBinding,
  isSimplePropertyBinding,
  isDataPropertyBinding,
  isAuthPropertyBinding,
  isStudioComponentWithCollectionProperties,
} from '@amzn/studio-ui-codegen';

import { EOL } from 'os';
import ts, {
  createPrinter,
  createSourceFile,
  EmitHint,
  factory,
  FunctionDeclaration,
  JsxElement,
  JsxFragment,
  NewLineKind,
  PropertySignature,
  SyntaxKind,
  transpileModule,
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
} from 'typescript';
import prettier from 'prettier';
import parserBabel from 'prettier/parser-babel';
import { ImportCollection } from './import-collection';
import { ReactOutputManager } from './react-output-manager';
import {
  ReactRenderConfig,
  ScriptKind,
  ScriptTarget,
  ModuleKind,
  scriptKindToFileExtension,
} from './react-render-config';
import SampleCodeRenderer from './amplify-ui-renderers/sampleCodeRenderer';
import { getComponentPropName } from './react-component-render-helper';

export abstract class ReactStudioTemplateRenderer extends StudioTemplateRenderer<
  string,
  ReactOutputManager,
  {
    componentText: string;
    renderComponentToFilesystem: (outputPath: string) => Promise<void>;
  }
> {
  protected importCollection = new ImportCollection();

  protected defaultRenderConfig = {
    script: ScriptKind.TSX,
    target: ScriptTarget.ES2015,
    module: ModuleKind.ESNext,
  };

  fileName = `${this.component.name}.tsx`;

  constructor(component: StudioComponent, protected renderConfig: ReactRenderConfig) {
    super(component, new ReactOutputManager(), renderConfig);
    const { script } = this.renderConfig;
    if (script !== ScriptKind.TSX) {
      this.fileName = `${this.component.name}.${scriptKindToFileExtension(renderConfig.script || ScriptKind.TSX)}`;
    }

    this.renderConfig = {
      script: ScriptKind.TSX,
      target: ScriptTarget.ES2015,
      module: ModuleKind.ESNext,
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

    const { printer, file } = this.createPrinter();
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

    const { printer, file } = this.createPrinter();

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

    const compText = this.transpile(result);

    return { compText, importsText };
  }

  renderComponent() {
    // This is a react component so we only need a single tsx

    const { printer, file } = this.createPrinter();

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

    const transpiledComponentText = this.transpile(componentText);

    return {
      componentText: transpiledComponentText,
      renderComponentToFilesystem: this.renderComponentToFilesystem(transpiledComponentText)(this.fileName),
    };
  }

  private transpile(code: string): string {
    const { target, module, script } = this.renderConfig;
    if (script === ScriptKind.JS || script === ScriptKind.JSX) {
      const transpiledCode = transpileModule(code, {
        compilerOptions: {
          target,
          module,
          jsx: script === ScriptKind.JS ? ts.JsxEmit.React : ts.JsxEmit.Preserve,
          esModuleInterop: true,
        },
      }).outputText;

      return prettier.format(transpiledCode, { parser: 'babel', plugins: [parserBabel] });
    }

    return prettier.format(code, { parser: 'babel', plugins: [parserBabel] });
  }

  private createPrinter() {
    const { target, script } = this.renderConfig;
    const file = createSourceFile(
      this.fileName,
      '',
      target || this.defaultRenderConfig.target,
      false,
      script || this.defaultRenderConfig.script,
    );

    const printer = createPrinter({
      newLine: NewLineKind.LineFeed,
    });
    return { printer, file };
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
    const componentPropType = getComponentPropName(component.name);
    this.importCollection.addImport('@aws-amplify/ui-react', 'EscapeHatchProps');
    return factory.createTypeAliasDeclaration(
      undefined,
      [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      factory.createIdentifier(componentPropType),
      undefined,
      factory.createIntersectionTypeNode([
        this.buildBindingPropNodes(component),
        factory.createTypeLiteralNode([
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
        ]),
      ]),
    );
  }

  private buildBindingPropNodes(component: StudioComponent): TypeNode {
    const propSignatures: PropertySignature[] = [];
    const bindingProps = component.bindingProperties;
    if (bindingProps === undefined || !isStudioComponentWithBinding(component)) {
      return factory.createTypeLiteralNode([]);
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

  private buildCollectionBindingStatements(component: StudioComponent): Statement[] {
    const statements: Statement[] = [];

    if (isStudioComponentWithCollectionProperties(component)) {
      Object.entries(component.collectionProperties).forEach((collectionProp) => {
        const [propName, { model, sort, predicate }] = collectionProp;
        if (predicate) {
          statements.push(this.buildPredicateDeclaration(propName, predicate));
        }
        if (sort) {
          this.importCollection.addImport('@aws-amplify/ui-react', 'convertSortPredicatesToDataStore');
          statements.push(
            this.buildSortStatement(propName, sort),
            this.buildPaginationStatement(propName, this.getSortName(propName)),
          );
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

  private buildSortStatement(propName: string, sort: StudioComponentSort[]): VariableStatement {
    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(this.getSortName(propName)),
            undefined,
            undefined,
            this.buildConvertSortPredicatesToDataStoreCall(sort),
          ),
        ],
        ts.NodeFlags.Const,
      ),
    );
  }

  private buildConvertSortPredicatesToDataStoreCall(sort: StudioComponentSort[]): CallExpression {
    const sortExpressions = sort.map(({ field, direction }) =>
      factory.createObjectLiteralExpression([
        factory.createPropertyAssignment(factory.createIdentifier('field'), factory.createStringLiteral(field)),
        factory.createPropertyAssignment(factory.createIdentifier('direction'), factory.createStringLiteral(direction)),
      ]),
    );

    return factory.createCallExpression(factory.createIdentifier('convertSortPredicatesToDataStore'), undefined, [
      factory.createArrayLiteralExpression(sortExpressions, true),
    ]);
  }

  private buildPaginationStatement(propName: string, sortName?: string): VariableStatement {
    const paginationProperties = ([] as ts.PropertyAssignment[]).concat(
      sortName
        ? [factory.createPropertyAssignment(factory.createIdentifier('sort'), factory.createIdentifier(sortName))]
        : [],
    );
    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(this.getPaginationName(propName)),
            undefined,
            undefined,
            factory.createObjectLiteralExpression(paginationProperties, true),
          ),
        ],
        ts.NodeFlags.Const,
      ),
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

  private getSortName(propName: string): string {
    return `${propName}Sort`;
  }

  private getPaginationName(propName: string): string {
    return `${propName}Pagination`;
  }

  private getFilterName(propName: string): string {
    return `${propName}Filter`;
  }

  abstract renderJsx(component: StudioComponent): JsxElement | JsxFragment;
}
