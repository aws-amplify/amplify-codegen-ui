import { StudioComponent, StudioComponentChild } from '@amzn/amplify-ui-codegen-schema';
import {
  StudioTemplateRenderer,
  StudioRendererConstants,
  isStudioComponentWithBinding,
  isSimplePropertyBinding,
  isDataPropertyBinding,
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
  ModifierFlags,
  NewLineKind,
  PropertySignature,
  SyntaxKind,
  transpileModule,
  TypeAliasDeclaration,
  TypeNode,
  VariableStatement,
  Statement,
  BindingElement,
} from 'typescript';
import prettier from 'prettier';
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

    console.log('JSX rendered');

    const imports = this.importCollection.buildImportStatements();

    let importsText = '';

    for (const importStatement of imports) {
      const result = printer.printNode(EmitHint.Unspecified, importStatement, file);
      importsText += result + EOL;
    }

    const wrappedFunction = this.renderFunctionWrapper(this.component.name ?? StudioRendererConstants.unknownName, jsx);

    const result = printer.printNode(EmitHint.Unspecified, wrappedFunction, file);

    const compText = this.transpile(result);

    return { compText, importsText };
  }

  renderComponent() {
    // This is a react component so we only need a single tsx

    const { printer, file } = this.createPrinter();

    const jsx = this.renderJsx(this.component);

    console.log('JSX rendered');

    const wrappedFunction = this.renderFunctionWrapper(this.component.name ?? StudioRendererConstants.unknownName, jsx);
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

    console.log(transpiledComponentText);

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
        },
      }).outputText;

      return prettier.format(transpiledCode, { parser: 'babel' });
    }

    return prettier.format(code, { parser: 'babel' });
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

  renderFunctionWrapper(componentName: string, jsx: JsxElement | JsxFragment): FunctionDeclaration {
    const componentPropType = getComponentPropName(componentName);
    const codeBlockContent = this.buildVariableStatements(this.component);
    codeBlockContent.push(factory.createReturnStatement(factory.createParenthesizedExpression(jsx)));
    return factory.createFunctionDeclaration(
      undefined,
      [factory.createModifier(SyntaxKind.ExportKeyword), factory.createModifier(SyntaxKind.DefaultKeyword)],
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

    const useStoreBindingStatements = this.buildUseDataStoreBindingStatements(component);
    useStoreBindingStatements.forEach((entry) => {
      statements.push(entry);
    });

    return statements;
  }

  private buildUseDataStoreBindingStatements(component: StudioComponent): Statement[] {
    const collections: StudioComponentChild[] = [];
    if (component.collectionProperties !== undefined) {
      collections.push(component);
    }
    component.children?.map((value) => {
      this.findCollections(value, collections);
    });

    const statements: Statement[] = [];

    collections.map((value) => {
      if (value.collectionProperties === undefined) return;
      Object.entries(value.collectionProperties).map((collectionProp) => {
        const propName = collectionProp[0];
        const propType = collectionProp[1].type;
        const propBindingProp = collectionProp[1].bindingProperties;
        const bindingModel = propBindingProp.model;
        if (propType === 'Data') {
          const propStatements = this.buildUseDataStoreBindingCall('collection', propName, bindingModel);
          propStatements.forEach((value) => {
            statements.push(value);
          });
        }
      });
    });

    // generate for single record binding
    if (component.bindingProperties !== undefined) {
      Object.entries(component.bindingProperties).map((compBindingProp) => {
        const [compPropName, compBinding] = compBindingProp;
        if (isDataPropertyBinding(compBinding) && 'bindingProperties' in compBinding) {
          if ('model' in compBinding.bindingProperties && 'predicates' in compBinding.bindingProperties) {
            const { model, predicate } = compBinding.bindingProperties;
            const moreStatements = this.buildUseDataStoreBindingCall('record', compPropName, model);
            moreStatements.forEach((value) => {
              statements.push(value);
            });
          }
        }
      });
    }
    return statements;
  }

  private buildUseDataStoreBindingCall(callType: string, propName: string, bindingModel: string): VariableStatement[] {
    const statements: VariableStatement[] = [];
    statements.push(
      factory.createVariableStatement(
        undefined,
        factory.createVariableDeclarationList(
          [
            factory.createVariableDeclaration(
              factory.createIdentifier(`filterCriteria${propName}`),
              undefined,
              undefined,
              factory.createArrayLiteralExpression([], false),
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
              factory.createObjectBindingPattern([
                factory.createBindingElement(undefined, undefined, factory.createIdentifier(propName), undefined),
              ]),
              undefined,
              undefined,
              factory.createCallExpression(factory.createIdentifier('useDataStoreBinding'), undefined, [
                factory.createObjectLiteralExpression(
                  [
                    factory.createPropertyAssignment(
                      factory.createIdentifier('type'),
                      factory.createStringLiteral(callType),
                    ),
                    factory.createPropertyAssignment(
                      factory.createIdentifier('model'),
                      factory.createIdentifier(bindingModel),
                    ),
                    factory.createPropertyAssignment(
                      factory.createIdentifier('criteria'),
                      factory.createIdentifier(`filterCriteria${propName}`),
                    ),
                  ],
                  true,
                ),
              ]),
            ),
          ],
          ts.NodeFlags.Const,
        ),
      ),
    );
    return statements;
  }

  private findCollections(component: StudioComponentChild, found: StudioComponentChild[]) {
    if (component.collectionProperties !== undefined) {
      found.push(component);
    }
    if (component.children !== undefined) {
      component.children.map((value) => {
        this.findCollections(value, found);
      });
    }
  }

  abstract renderJsx(component: StudioComponent): JsxElement | JsxFragment;
}
