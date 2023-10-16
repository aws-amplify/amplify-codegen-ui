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
  GenericDataSchema,
  StudioNode,
  StudioView,
  StudioTemplateRenderer,
  TableDefinition,
  generateTableDefinition,
  ViewMetadata,
  handleCodegenErrors,
  validateViewSchema,
  StudioComponentPredicate,
  DEFAULT_TABLE_DEFINITION,
} from '@aws-amplify/codegen-ui';
import {
  addSyntheticLeadingComment,
  BindingElement,
  EmitHint,
  factory,
  FunctionDeclaration,
  JsxElement,
  JsxFragment,
  JsxSelfClosingElement,
  Modifier,
  NodeFlags,
  ObjectLiteralExpression,
  ScriptKind,
  Statement,
  SyntaxKind,
  TypeAliasDeclaration,
} from 'typescript';
import { EOL } from 'os';
import {
  buildBaseCollectionVariableStatement,
  buildPrinter,
  buildSortFunction,
  defaultRenderConfig,
  getDeclarationFilename,
  transpile,
} from '../react-studio-template-renderer-helper';
import { ImportCollection, ImportValue } from '../imports';
import { Primitive, PrimitiveTypeParameter } from '../primitive';
import { getComponentPropName } from '../react-component-render-helper';
import { ReactOutputManager } from '../react-output-manager';
import { ReactRenderConfig, scriptKindToFileExtension } from '../react-render-config';
import {
  buildDataStoreCollectionCall,
  getDataStoreName,
  getFilterName,
  getPaginationName,
  getPredicateName,
  needsFormatter,
} from '../react-table-renderer-helper';
import { overrideTypesString } from '../utils-file-functions';

export abstract class ReactViewTemplateRenderer extends StudioTemplateRenderer<
  string,
  StudioView,
  ReactOutputManager,
  {
    componentText: string;
    renderComponentToFilesystem: (outputPath: string) => Promise<void>;
  }
> {
  protected importCollection = new ImportCollection();

  protected renderConfig: ReactRenderConfig & typeof defaultRenderConfig;

  protected viewDefinition: TableDefinition = DEFAULT_TABLE_DEFINITION;

  protected viewComponent: StudioView;

  protected viewMetadata: ViewMetadata;

  public fileName: string;

  abstract renderJsx(view: StudioView, parent?: StudioNode): JsxElement | JsxFragment | JsxSelfClosingElement;

  constructor(component: StudioView, dataSchema: GenericDataSchema | undefined, renderConfig: ReactRenderConfig) {
    super(component, new ReactOutputManager(), renderConfig);
    this.renderConfig = {
      ...defaultRenderConfig,
      ...renderConfig,
    };
    // the super class creates a component aka form which is what we pass in this extended implmentation
    this.fileName = `${this.component.name}.${scriptKindToFileExtension(this.renderConfig.script)}`;

    switch (component.viewConfiguration.type) {
      case 'Table':
        this.viewDefinition = generateTableDefinition(component, dataSchema);
        // find if formatter is required
        if (needsFormatter(component.viewConfiguration)) {
          this.importCollection.addMappedImport(ImportValue.FORMATTER);
        }
        break;
      case 'Collection':
        // 'Collection' type doesn't need a viewDefinition
        break;
      default:
        throw new Error(`Encountered a viewConfiguration type that is not supported.`);
    }

    this.viewComponent = component;

    this.viewMetadata = {
      id: component.id,
      name: component.name,
      fieldFormatting: {},
    };
  }

  @handleCodegenErrors
  renderComponentOnly() {
    const { printer, file } = buildPrinter(this.fileName, this.renderConfig);

    const variableStatements = this.buildVariableStatements();
    const jsx = this.renderJsx(this.viewComponent);
    const requiredDataModels = [];

    const imports = this.importCollection.buildImportStatements();

    let importsText = '';

    imports.forEach((importStatement) => {
      const result = printer.printNode(EmitHint.Unspecified, importStatement, file);
      importsText += result + EOL;
    });

    const wrappedFunction = this.renderFunctionWrapper(this.component.name, variableStatements, jsx, false);

    const result = printer.printNode(EmitHint.Unspecified, wrappedFunction, file);

    // do not produce declaration becuase it is not used
    const { componentText: compText } = transpile(result, { ...this.renderConfig, renderTypeDeclarations: false });

    const { type, model } = this.viewComponent.dataSource;
    if (type === 'DataStore' && model) {
      requiredDataModels.push(model);
      // TODO: require other models if form is handling querying relational models
    }

    return { compText, importsText, requiredDataModels };
  }

  @handleCodegenErrors
  renderComponentInternal() {
    const { printer, file } = buildPrinter(this.fileName, this.renderConfig);

    const variableStatements = this.buildVariableStatements();
    const jsx = this.renderJsx(this.viewComponent);

    const wrappedFunction = this.renderFunctionWrapper(this.component.name, variableStatements, jsx, true);
    const propsDeclaration = this.renderBindingPropsType();

    const imports = this.importCollection.buildImportStatements();

    let componentText = `/* eslint-disable */${EOL}`;

    imports.forEach((importStatement) => {
      const result = printer.printNode(EmitHint.Unspecified, importStatement, file);
      componentText += result + EOL;
    });

    componentText += EOL;

    componentText += overrideTypesString + EOL;

    propsDeclaration.forEach((typeNode) => {
      const propsPrinted = printer.printNode(EmitHint.Unspecified, typeNode, file);
      componentText += propsPrinted;
    });

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
    variableStatements: Statement[],
    jsx: JsxElement | JsxFragment | JsxSelfClosingElement,
    renderExport: boolean,
  ): FunctionDeclaration {
    const componentPropType = getComponentPropName(componentName);
    const jsxStatement = factory.createReturnStatement(
      factory.createParenthesizedExpression(
        this.renderConfig.script !== ScriptKind.TSX
          ? jsx
          : /* add ts-ignore comment above jsx statement. Generated props are incompatible with amplify-ui props */
            addSyntheticLeadingComment(
              factory.createParenthesizedExpression(jsx),
              SyntaxKind.MultiLineCommentTrivia,
              ' @ts-ignore: TS2322 ',
              true,
            ),
      ),
    );
    const codeBlockContent = variableStatements.concat([jsxStatement]);
    const modifiers: Modifier[] = renderExport
      ? [factory.createModifier(SyntaxKind.ExportKeyword), factory.createModifier(SyntaxKind.DefaultKeyword)]
      : [];
    const typeParameter = PrimitiveTypeParameter[Primitive[this.viewComponent?.viewConfiguration.type as Primitive]];
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

  buildVariableStatements() {
    const statements: Statement[] = [];
    const elements: BindingElement[] = [];
    const { type, model, predicate, sort } = this.viewComponent.dataSource;
    const itemsProp = 'itemsProp';
    const isDataStoreEnabled = type === 'DataStore' && model;
    if (isDataStoreEnabled) {
      this.importCollection.addModelImport(model);
      this.importCollection.addMappedImport(ImportValue.USE_DATA_STORE_BINDING);
      elements.push(
        factory.createBindingElement(
          undefined,
          factory.createIdentifier('items'),
          factory.createIdentifier(itemsProp),
          undefined,
        ),
        factory.createBindingElement(undefined, undefined, factory.createIdentifier('predicateOverride'), undefined),
      );
    } else {
      elements.push(factory.createBindingElement(undefined, undefined, factory.createIdentifier('items'), undefined));
    }

    // add base Props

    // props
    if (this.viewComponent.viewConfiguration.type === 'Table') {
      const props = [
        factory.createBindingElement(undefined, undefined, factory.createIdentifier('formatOverride'), undefined),
        factory.createBindingElement(undefined, undefined, factory.createIdentifier('highlightOnHover'), undefined),
        factory.createBindingElement(undefined, undefined, factory.createIdentifier('onRowClick'), undefined),
        factory.createBindingElement(undefined, undefined, factory.createIdentifier('disableHeaders'), undefined),
      ];
      elements.push(...props);
    }

    // get rest of props to pass to top level component
    elements.push(
      factory.createBindingElement(
        factory.createToken(SyntaxKind.DotDotDotToken),
        undefined,
        factory.createIdentifier('rest'),
        undefined,
      ),
    );

    // add binding elments to statements
    statements.push(
      factory.createVariableStatement(
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
          NodeFlags.Const,
        ),
      ),
    );

    if (isDataStoreEnabled) {
      /**
       * builds predicate variable
       */
      if (predicate) {
        this.importCollection.addMappedImport(ImportValue.CREATE_DATA_STORE_PREDICATE);
        statements.push(
          factory.createVariableStatement(
            undefined,
            factory.createVariableDeclarationList(
              [
                factory.createVariableDeclaration(
                  getFilterName(model),
                  undefined,
                  undefined,
                  this.predicateToObjectLiteralExpression(predicate),
                ),
              ],
              NodeFlags.Const,
            ),
          ),
          factory.createVariableStatement(
            undefined,
            factory.createVariableDeclarationList(
              [
                factory.createVariableDeclaration(
                  getPredicateName(model),
                  undefined,
                  undefined,
                  factory.createCallExpression(
                    factory.createIdentifier('createDataStorePredicate'),
                    [factory.createTypeReferenceNode(factory.createIdentifier(model), undefined)],
                    [factory.createIdentifier(getFilterName(model))],
                  ),
                ),
              ],
              NodeFlags.Const,
            ),
          ),
        );
      }
      /**
       * builds sort function
       */
      if (sort) {
        this.importCollection.addMappedImport(ImportValue.SORT_DIRECTION, ImportValue.SORT_PREDICATE);
        statements.push(
          factory.createVariableStatement(
            undefined,
            factory.createVariableDeclarationList(
              [
                factory.createVariableDeclaration(
                  getPaginationName(model),
                  undefined,
                  undefined,
                  factory.createObjectLiteralExpression([
                    factory.createPropertyAssignment(factory.createIdentifier('sort'), buildSortFunction(model, sort)),
                  ]),
                ),
              ],
              NodeFlags.Const,
            ),
          ),
        );
      }
      /*
      if datastore enabled
      const myViewDataStore = useDataStoreBinding({
        model: Model,
        type: 'Collection'
      }).items;
      const items = itemsProp !== undefined ? itemsProp : myViewDataStore;

      if custom enabled
      uses regular items array for formatting
      */
      const dsItemsName = factory.createIdentifier(getDataStoreName(model));
      statements.push(
        buildBaseCollectionVariableStatement(
          dsItemsName,
          buildDataStoreCollectionCall(
            model,
            predicate ? getPredicateName(model) : undefined,
            sort ? getPaginationName(model) : undefined,
          ),
        ),
        // checks to see if an override was passed
        factory.createVariableStatement(
          undefined,
          factory.createVariableDeclarationList(
            [
              factory.createVariableDeclaration(
                factory.createIdentifier('items'),
                undefined,
                undefined,
                factory.createConditionalExpression(
                  factory.createBinaryExpression(
                    factory.createIdentifier(itemsProp),
                    factory.createToken(SyntaxKind.ExclamationEqualsEqualsToken),
                    factory.createIdentifier('undefined'),
                  ),
                  factory.createToken(SyntaxKind.QuestionToken),
                  factory.createIdentifier(itemsProp),
                  factory.createToken(SyntaxKind.ColonToken),
                  dsItemsName,
                ),
              ),
            ],
            NodeFlags.Const,
          ),
        ),
      );
    }
    return statements;
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

  private renderBindingPropsType(): TypeAliasDeclaration[] {
    const escapeHatchTypeNode = factory.createTypeLiteralNode([
      factory.createPropertySignature(
        undefined,
        factory.createIdentifier('overrides'),
        factory.createToken(SyntaxKind.QuestionToken),
        factory.createUnionTypeNode([
          factory.createTypeReferenceNode(factory.createIdentifier('EscapeHatchProps'), undefined),
          factory.createKeywordTypeNode(SyntaxKind.UndefinedKeyword),
          factory.createLiteralTypeNode(factory.createNull()),
        ]),
      ),
      factory.createPropertySignature(
        undefined,
        factory.createIdentifier('predicateOverride'),
        factory.createToken(SyntaxKind.QuestionToken),
        factory.createUnionTypeNode([
          factory.createTypeReferenceNode(factory.createIdentifier('ReturnType'), [
            factory.createTypeQueryNode(factory.createIdentifier('createDataStorePredicate')),
          ]),
          factory.createKeywordTypeNode(SyntaxKind.UndefinedKeyword),
          factory.createLiteralTypeNode(factory.createNull()),
        ]),
      ),
    ]);
    const formPropType = getComponentPropName(this.component.name);

    this.importCollection.addMappedImport(ImportValue.CREATE_DATA_STORE_PREDICATE);

    return [
      factory.createTypeAliasDeclaration(
        undefined,
        [factory.createModifier(SyntaxKind.ExportKeyword)],
        factory.createIdentifier(formPropType),
        undefined,
        factory.createTypeReferenceNode(factory.createIdentifier('React.PropsWithChildren'), [
          factory.createIntersectionTypeNode([escapeHatchTypeNode]),
        ]),
      ),
    ];
  }

  validateSchema(component: StudioView): void {
    validateViewSchema(component);
  }
}
