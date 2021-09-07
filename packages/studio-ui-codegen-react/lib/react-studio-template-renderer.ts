import { StudioComponent } from '@amzn/amplify-ui-codegen-schema';
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
  ScriptKind,
  ScriptTarget,
  SyntaxKind,
  transpileModule,
  TypeAliasDeclaration,
  TypeNode,
  VariableStatement,
} from 'typescript';
import { ImportCollection } from './import-collection';
import ReactOutputManager from './react-output-manager';
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

  componentPath = `${this.component.name}.tsx`;

  constructor(component: StudioComponent) {
    super(component, new ReactOutputManager());
  }

  renderSampleCodeSnippet() {
    const jsx = this.renderSampleCodeSnippetJsx(this.component);
    const imports = this.importCollection.buildSampleSnippetImports(
      this.component.name ?? StudioRendererConstants.unknownName,
    );
    const sampleAppName = 'App';

    const { printer, file } = this.createPrinter();
    let importsText = '';
    for (let importStatement of imports) {
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

    for (let importStatement of imports) {
      const result = printer.printNode(EmitHint.Unspecified, importStatement, file);
      importsText += result + EOL;
    }

    const wrappedFunction = this.renderFunctionWrapper(this.component.name ?? StudioRendererConstants.unknownName, jsx);

    const result = printer.printNode(EmitHint.Unspecified, wrappedFunction, file);

    let compiled = transpileModule(result, {
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2015,
        jsx: ts.JsxEmit.React,
      },
    });

    const compText = compiled.outputText.replace('export default ', '');

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

    let componentText = '/* eslint-disable */' + EOL;

    for (let importStatement of imports) {
      const result = printer.printNode(EmitHint.Unspecified, importStatement, file);
      componentText += result + EOL;
    }

    componentText += EOL;

    const propsPrinted = printer.printNode(EmitHint.Unspecified, propsDeclaration, file);
    componentText += propsPrinted;

    componentText += EOL;

    const result = printer.printNode(EmitHint.Unspecified, wrappedFunction, file);
    componentText += result;

    console.log(componentText);

    return {
      componentText,
      renderComponentToFilesystem: this.renderComponentToFilesystem(componentText),
    };
  }

  private createPrinter() {
    const file = createSourceFile(this.componentPath, '', ScriptTarget.ESNext, false, ScriptKind.TSX);

    const printer = createPrinter({
      newLine: NewLineKind.LineFeed,
    });
    return { printer, file };
  }

  renderFunctionWrapper(componentName: string, jsx: JsxElement | JsxFragment): FunctionDeclaration {
    const componentPropType = getComponentPropName(componentName);

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
      factory.createBlock([factory.createReturnStatement(factory.createParenthesizedExpression(jsx))], true),
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
    var propSignatures: PropertySignature[] = [];
    const bindingProps = component.bindingProperties;
    if (bindingProps === undefined || !isStudioComponentWithBinding(component)) {
      return factory.createTypeLiteralNode([]);
    }
    for (let bindingProp of Object.entries(component.bindingProperties)) {
      const propName = bindingProp[0];
      const typeName = bindingProp[1].type.toString();
      if (isSimplePropertyBinding(bindingProp[1])) {
        const propSignature = factory.createPropertySignature(
          undefined,
          propName,
          undefined,
          factory.createTypeReferenceNode(typeName, undefined),
        );
        propSignatures.push(propSignature);
      } else if (isDataPropertyBinding(bindingProp[1])) {
        const propSignature = factory.createPropertySignature(
          undefined,
          propName,
          factory.createToken(SyntaxKind.QuestionToken),
          factory.createTypeReferenceNode(typeName, undefined),
        );
        propSignatures.push(propSignature);
      }
    }
    return factory.createTypeLiteralNode(propSignatures);
  }

  abstract renderJsx(component: StudioComponent): JsxElement | JsxFragment;
}
