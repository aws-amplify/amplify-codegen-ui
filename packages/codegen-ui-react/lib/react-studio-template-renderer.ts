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
  StudioTemplateRenderer,
  isStudioComponentWithBinding,
  isSimplePropertyBinding,
  isDataPropertyBinding,
  isEventPropertyBinding,
  isStudioComponentWithCollectionProperties,
  isStudioComponentWithVariants,
  isStudioComponentWithBreakpoints,
  StudioComponent,
  StudioComponentChild,
  StudioComponentPredicate,
  StudioComponentSort,
  StudioComponentVariant,
  StudioComponentSimplePropertyBinding,
  handleCodegenErrors,
  ComponentMetadata,
  computeComponentMetadata,
  validateComponentSchema,
  isSlotBinding,
  GenericDataSchema,
  getBreakpoints,
  isValidVariableName,
  InternalError,
  resolveBetweenPredicateToMultiplePredicates,
  NoApiError,
  componentRequiresDataApi,
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
  LiteralExpression,
  BooleanLiteral,
  addSyntheticLeadingComment,
  JsxSelfClosingElement,
  PropertyAssignment,
  ObjectLiteralElementLike,
  Identifier,
  Expression,
  ParameterDeclaration,
  ShorthandPropertyAssignment,
} from 'typescript';
import pluralize from 'pluralize';
import { ImportCollection, ImportSource, ImportValue } from './imports';
import { ReactOutputManager } from './react-output-manager';
import { ReactRenderConfig, ScriptKind, scriptKindToFileExtension } from './react-render-config';
import SampleCodeRenderer from './amplify-ui-renderers/sampleCodeRenderer';
import {
  addBindingPropertiesImports,
  getComponentPropName,
  getConditionalOperandExpression,
  isFixedPropertyWithValue,
  parseNumberOperand,
} from './react-component-render-helper';
import {
  transpile,
  buildPrinter,
  defaultRenderConfig,
  getDeclarationFilename,
  jsonToLiteral,
  bindingPropertyUsesHook,
  json,
  buildBaseCollectionVariableStatement,
  createHookStatement,
  buildSortFunction,
  getAmplifyJSClientGenerator,
} from './react-studio-template-renderer-helper';
import {
  Primitive,
  PrimitiveTypeParameter,
  PrimitiveChildrenPropMapping,
  primitiveOverrideProp,
  PRIMITIVE_OVERRIDE_PROPS,
  isPrimitive,
} from './primitive';
import {
  getComponentActions,
  buildUseActionStatement,
  mapSyntheticStateReferences,
  buildStateStatements,
  buildUseEffectStatements,
} from './workflow';
import keywords from './keywords';
import {
  getSetNameIdentifier,
  capitalizeFirstLetter,
  buildUseStateExpression,
  modelNeedsRelationshipsLoadedForCollection,
  fieldNeedsRelationshipLoadedForCollection,
  isAliased,
  removeAlias,
  buildInitConstVariableExpression,
  buildArrowFunctionStatement,
} from './helpers';
import { addUseEffectWrapper } from './utils/generate-react-hooks';
import { ActionType, getGraphqlCallExpression, getGraphqlQueryForModel, isGraphqlConfig } from './utils/graphql';
import { AMPLIFY_JS_V5, AMPLIFY_JS_V6 } from './utils/constants';
import { getAmplifyJSVersionToRender } from './helpers/amplify-js-versioning';
import { overrideTypesString } from './utils-file-functions';

export abstract class ReactStudioTemplateRenderer extends StudioTemplateRenderer<
  string,
  StudioComponent,
  ReactOutputManager,
  {
    componentText: string;
    renderComponentToFilesystem: (outputPath: string) => Promise<void>;
  }
> {
  protected importCollection: ImportCollection;

  protected renderConfig: ReactRenderConfig & typeof defaultRenderConfig;

  protected componentMetadata: ComponentMetadata;

  fileName = `${this.component.name}.tsx`;

  constructor(component: StudioComponent, renderConfig: ReactRenderConfig, dataSchema?: GenericDataSchema) {
    super(component, new ReactOutputManager(), renderConfig);
    this.renderConfig = {
      ...defaultRenderConfig,
      ...renderConfig,
    };
    this.fileName = `${this.component.name}.${scriptKindToFileExtension(this.renderConfig.script)}`;
    this.componentMetadata = computeComponentMetadata(this.component);

    this.componentMetadata.stateReferences = mapSyntheticStateReferences(this.componentMetadata);
    this.componentMetadata.dataSchemaMetadata = dataSchema;
    this.mapSyntheticPropsForVariants();
    this.mapSyntheticProps();
    this.importCollection = new ImportCollection({ rendererConfig: renderConfig });
    this.importCollection.ingestComponentMetadata(this.componentMetadata);
    addBindingPropertiesImports(this.component, this.importCollection);

    // TODO: throw warnings on invalid config combinations. i.e. CommonJS + JSX
    if (componentRequiresDataApi(component) && renderConfig.apiConfiguration?.dataApi === 'NoApi') {
      throw new NoApiError('Component cannot be rendered without a data API');
    }
  }

  @handleCodegenErrors
  renderSampleCodeSnippet() {
    const jsx = this.renderSampleCodeSnippetJsx(this.component);
    const imports = this.importCollection.buildSampleSnippetImports(this.component.name);

    const { printer, file } = buildPrinter(this.fileName, this.renderConfig);
    let importsText = '';
    imports.forEach((importStatement) => {
      const result = printer.printNode(EmitHint.Unspecified, importStatement, file);
      importsText += result + EOL;
    });

    const compText = printer.printNode(EmitHint.Unspecified, jsx, file);

    return { compText, importsText };
  }

  @handleCodegenErrors
  renderComponentOnly() {
    // buildVariableStatements must be called before renderJsx
    // so that some properties can be removed from opening element
    const variableStatements = this.buildVariableStatements(this.component);
    const jsx = this.renderJsx(this.component);

    const { printer, file } = buildPrinter(this.fileName, this.renderConfig);

    const imports = this.importCollection.buildImportStatements();

    let importsText = '';

    imports.forEach((importStatement) => {
      const result = printer.printNode(EmitHint.Unspecified, importStatement, file);
      importsText += result + EOL;
    });

    const wrappedFunction = this.renderFunctionWrapper(this.component.name, variableStatements, jsx, false);

    const result = printer.printNode(EmitHint.Unspecified, wrappedFunction, file);

    // do not produce declaration becuase it is not used
    // also do not format because we don't care what the component looks like in Studio UI
    const { componentText: compText } = transpile(
      result,
      { ...this.renderConfig, renderTypeDeclarations: false },
      false,
    );

    return {
      compText,
      importsText,
      requiredDataModels: this.componentMetadata.requiredDataModels,
      importCollection: this.importCollection,
    };
  }

  renderComponentInternal() {
    // This is a react component so we only need a single tsx

    const { printer, file } = buildPrinter(this.fileName, this.renderConfig);

    // buildVariableStatements must be called before renderJsx
    // so that some properties can be removed from opening element
    const variableStatements = this.buildVariableStatements(this.component);
    const jsx = this.renderJsx(this.component);

    const wrappedFunction = this.renderFunctionWrapper(this.component.name, variableStatements, jsx, true);
    const propsDeclarations = this.renderBindingPropsType(this.component);

    const imports = this.importCollection.buildImportStatements();

    let componentText = `/* eslint-disable */${EOL}`;

    imports.forEach((importStatement) => {
      const result = printer.printNode(EmitHint.Unspecified, importStatement, file);
      componentText += result + EOL;
    });

    componentText += EOL;

    componentText += overrideTypesString + EOL;

    propsDeclarations.forEach((propsDeclaration) => {
      const propsPrinted = printer.printNode(EmitHint.Unspecified, propsDeclaration, file);
      componentText += propsPrinted;
    });

    componentText += EOL;

    if (this.component.componentType === 'Collection' && this.renderConfig.apiConfiguration?.dataApi === 'GraphQL') {
      componentText += EOL;

      const graphqlVariableDeclarations = [
        factory.createVariableStatement(
          undefined,
          factory.createVariableDeclarationList(
            [
              factory.createVariableDeclaration(
                factory.createIdentifier('nextToken'),
                undefined,
                undefined,
                factory.createObjectLiteralExpression([], false),
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
                factory.createIdentifier('apiCache'),
                undefined,
                undefined,
                factory.createObjectLiteralExpression([], false),
              ),
            ],
            ts.NodeFlags.Const,
          ),
        ),
      ];

      graphqlVariableDeclarations.forEach((variableDeclaration) => {
        const result = printer.printNode(EmitHint.Unspecified, variableDeclaration, file);
        componentText += result + EOL;
      });
    }

    // Amplify JS V6 api
    // const client = generateClient();
    if (
      isGraphqlConfig(this.renderConfig.apiConfiguration) &&
      this.importCollection.hasPackage(ImportSource.AMPLIFY_API) &&
      getAmplifyJSVersionToRender(this.renderConfig.dependencies) === AMPLIFY_JS_V6
    ) {
      const result = printer.printNode(EmitHint.Unspecified, getAmplifyJSClientGenerator(), file);
      componentText += result + EOL;
    }

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

  renderSampleCodeSnippetJsx(component: StudioComponent): JsxElement | JsxFragment | JsxSelfClosingElement {
    return new SampleCodeRenderer(component, this.componentMetadata, this.importCollection).renderElement();
  }

  renderBindingPropsType(component: StudioComponent): TypeAliasDeclaration[] {
    const componentOverridesPropName = `${component.name}OverridesProps`;
    const escapeHatchTypeNode = factory.createTypeLiteralNode([
      factory.createPropertySignature(
        undefined,
        factory.createIdentifier('overrides'),
        factory.createToken(ts.SyntaxKind.QuestionToken),
        factory.createUnionTypeNode([
          factory.createTypeReferenceNode(factory.createIdentifier(componentOverridesPropName), undefined),
          factory.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword),
          factory.createLiteralTypeNode(factory.createNull()),
        ]),
      ),
    ]);
    const componentPropType = getComponentPropName(component.name);
    const propsTypeParameter = PrimitiveTypeParameter[Primitive[component.componentType as Primitive]];

    const overridesProps = factory.createTypeAliasDeclaration(
      undefined,
      [factory.createModifier(ts.SyntaxKind.ExportKeyword), factory.createModifier(ts.SyntaxKind.DeclareKeyword)],
      factory.createIdentifier(componentOverridesPropName),
      undefined,
      factory.createIntersectionTypeNode([
        factory.createTypeLiteralNode(
          Object.entries(this.componentMetadata.componentNameToTypeMap).map(([name, componentType]) => {
            const isComponentTypePrimitive = isPrimitive(componentType);
            const componentName = isAliased(componentType) ? removeAlias(componentType) : componentType;
            const componentTypePropName = `${componentName}Props`;
            this.importCollection.addImport(
              isComponentTypePrimitive ? ImportSource.UI_REACT : `./${componentName}`,
              componentTypePropName,
            );
            return factory.createPropertySignature(
              undefined,
              isValidVariableName(name) ? factory.createIdentifier(name) : factory.createStringLiteral(name),
              factory.createToken(ts.SyntaxKind.QuestionToken),
              isComponentTypePrimitive
                ? factory.createTypeReferenceNode(factory.createIdentifier(PRIMITIVE_OVERRIDE_PROPS), [
                    factory.createTypeReferenceNode(factory.createIdentifier(componentTypePropName), undefined),
                  ])
                : factory.createTypeReferenceNode(factory.createIdentifier(componentTypePropName)),
            );
          }),
        ),
        factory.createTypeReferenceNode(factory.createIdentifier('EscapeHatchProps'), undefined),
      ]),
    );

    return [
      primitiveOverrideProp,
      overridesProps,
      factory.createTypeAliasDeclaration(
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
      ),
    ];
  }

  private buildBasePropNode(component: StudioComponent): TypeNode | undefined {
    const propsType = this.getPropsTypeName(component);

    const componentIsPrimitive = isPrimitive(component.componentType);
    if (componentIsPrimitive) {
      this.importCollection.addImport(ImportSource.UI_REACT, propsType);
    } else {
      this.importCollection.addImport(
        `./${component.componentType}`,
        `${getComponentPropName(component.componentType)}`,
      );
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
  private buildVariantPropNode(component: StudioComponent): TypeNode | undefined {
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

  private buildComponentPropNode(component: StudioComponent): TypeNode | undefined {
    const propSignatures: PropertySignature[] = [];
    if (component.bindingProperties !== undefined && isStudioComponentWithBinding(component)) {
      Object.entries(component.bindingProperties).forEach(([propName, binding]) => {
        if (isSimplePropertyBinding(binding)) {
          const propSignature = factory.createPropertySignature(
            undefined,
            propName,
            factory.createToken(SyntaxKind.QuestionToken),
            factory.createTypeReferenceNode(binding.type, undefined),
          );
          propSignatures.push(propSignature);
        } else if (isDataPropertyBinding(binding)) {
          let modelName = this.importCollection.getMappedModelAlias(binding.bindingProperties.model);
          const apiConfig = this.renderConfig.apiConfiguration;
          if (isGraphqlConfig(apiConfig) && !apiConfig.typesFilePath) {
            modelName = 'any';
          }
          const propSignature = factory.createPropertySignature(
            undefined,
            propName,
            factory.createToken(SyntaxKind.QuestionToken),
            factory.createTypeReferenceNode(modelName, undefined),
          );
          propSignatures.push(propSignature);
        } else if (isEventPropertyBinding(binding)) {
          this.importCollection.addImport('react', 'SyntheticEvent');
          const propSignature = factory.createPropertySignature(
            undefined,
            propName,
            factory.createToken(SyntaxKind.QuestionToken),
            factory.createFunctionTypeNode(
              undefined,
              [
                factory.createParameterDeclaration(
                  undefined,
                  undefined,
                  undefined,
                  factory.createIdentifier('event'),
                  undefined,
                  factory.createTypeReferenceNode(factory.createIdentifier('SyntheticEvent'), undefined),
                  undefined,
                ),
              ],
              factory.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword),
            ),
          );
          propSignatures.push(propSignature);
        } else if (isSlotBinding(binding)) {
          const propSignature = factory.createPropertySignature(
            undefined,
            propName,
            factory.createToken(SyntaxKind.QuestionToken),
            factory.createTypeReferenceNode(
              factory.createQualifiedName(factory.createIdentifier('React'), factory.createIdentifier('ReactNode')),
              undefined,
            ),
          );
          propSignatures.push(propSignature);
        }
      });
    }
    if (component.componentType === 'Collection') {
      const child = component.children?.[0];
      if (!child) {
        throw new Error(`Collection component must have a child`);
      }

      const childComponentName = child.name;
      const childComponentProps = getComponentPropName(childComponentName);

      this.importCollection.addImport(`./${childComponentName}`, `${childComponentProps}`);

      propSignatures.push(
        factory.createPropertySignature(
          undefined,
          'items',
          factory.createToken(SyntaxKind.QuestionToken),
          factory.createTypeReferenceNode('any[]', undefined),
        ),
      );
      propSignatures.push(
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('overrideItems'),
          factory.createToken(ts.SyntaxKind.QuestionToken),
          factory.createFunctionTypeNode(
            undefined,
            [
              factory.createParameterDeclaration(
                undefined,
                undefined,
                undefined,
                factory.createIdentifier('collectionItem'),
                undefined,
                factory.createTypeLiteralNode([
                  factory.createPropertySignature(
                    undefined,
                    factory.createIdentifier('item'),
                    undefined,
                    factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
                  ),
                  factory.createPropertySignature(
                    undefined,
                    factory.createIdentifier('index'),
                    undefined,
                    factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
                  ),
                ]),
                undefined,
              ),
            ],
            factory.createTypeReferenceNode(factory.createIdentifier(childComponentProps), undefined),
          ),
        ),
      );
    }
    if (propSignatures.length === 0) {
      return undefined;
    }
    return factory.createTypeLiteralNode(propSignatures);
  }

  protected buildVariableStatements(component: StudioComponent): Statement[] {
    const statements: Statement[] = [];
    const elements: BindingElement[] = [];
    if (isStudioComponentWithBinding(component)) {
      Object.entries(component.bindingProperties).forEach((entry) => {
        const [propName, binding] = entry;
        if (
          isSimplePropertyBinding(binding) ||
          isDataPropertyBinding(binding) ||
          isEventPropertyBinding(binding) ||
          isSlotBinding(binding)
        ) {
          const usesHook = bindingPropertyUsesHook(binding);
          const shouldAssignToDifferentName = usesHook || keywords.has(propName);
          const propVariableName = shouldAssignToDifferentName ? `${propName}Prop` : propName;
          const bindingElement = factory.createBindingElement(
            undefined,
            shouldAssignToDifferentName ? factory.createIdentifier(propName) : undefined,
            factory.createIdentifier(propVariableName),
            isSimplePropertyBinding(binding) ? this.getDefaultValue(binding) : undefined,
          );
          elements.push(bindingElement);
        }
      });
    }

    if (component.componentType === 'Collection') {
      const bindingElement =
        this.hasCollectionPropertyNamedItems(component) || this.renderConfig.apiConfiguration?.dataApi === 'GraphQL'
          ? factory.createBindingElement(
              undefined,
              factory.createIdentifier('items'),
              factory.createIdentifier('itemsProp'),
              undefined,
            )
          : factory.createBindingElement(undefined, undefined, factory.createIdentifier('items'), undefined);
      elements.push(bindingElement);
      elements.push(
        factory.createBindingElement(undefined, undefined, factory.createIdentifier('overrideItems'), undefined),
      );
    }

    // remove overrides from rest of props
    const hasVariant = isStudioComponentWithVariants(component);
    const hasBreakpoint = isStudioComponentWithBreakpoints(component);
    elements.push(
      factory.createBindingElement(
        undefined,
        hasVariant ? factory.createIdentifier('overrides') : undefined,
        factory.createIdentifier(hasVariant ? 'overridesProp' : 'overrides'),
        undefined,
      ),
    );

    // get rest of props to pass to top level component
    elements.push(
      factory.createBindingElement(
        factory.createToken(ts.SyntaxKind.DotDotDotToken),
        undefined,
        factory.createIdentifier(hasBreakpoint ? 'restProp' : 'rest'),
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

    if (isStudioComponentWithVariants(component)) {
      this.importCollection.addMappedImport(ImportValue.MERGE_VARIANTS_OVERRIDES);
      statements.push(this.buildVariantDeclaration(component.variants));
      if (hasBreakpoint) {
        statements.push(this.buildDefaultBreakpointMap(component));
        statements.push(this.buildRestWithStyle());
      }
      statements.push(this.buildOverridesFromVariantsAndProp(hasBreakpoint));
    }

    const authStatement = this.buildUseAuthenticatedUserStatement();
    if (authStatement !== undefined) {
      if (getAmplifyJSVersionToRender(this.renderConfig.dependencies) === AMPLIFY_JS_V5) {
        this.importCollection.addMappedImport(ImportValue.USE_AUTH);
      } else {
        // V6 useAuth is in the utils file
        this.importCollection.addImport(ImportSource.UTILS, ImportValue.USE_AUTH);
      }
      statements.push(authStatement);
    }

    if (component.componentType === 'Collection' && this.renderConfig.apiConfiguration?.dataApi === 'GraphQL') {
      const paginationStatements = this.buildGraphqlPaginationStatements(component);
      paginationStatements.forEach((entry) => {
        statements.push(entry);
      });
    } else {
      const collectionBindingStatements = this.buildCollectionBindingStatements(component);
      collectionBindingStatements.forEach((entry) => {
        statements.push(entry);
      });
    }

    const useStoreBindingStatements = this.buildUseBindingStatements(component);
    useStoreBindingStatements.forEach((entry) => {
      statements.push(entry);
    });

    const stateStatements = buildStateStatements(
      component,
      this.componentMetadata,
      this.importCollection,
      this.renderConfig.apiConfiguration?.dataApi,
    );
    stateStatements.forEach((entry) => {
      statements.push(entry);
    });

    const useActionStatements = this.buildUseActionStatements();
    useActionStatements.forEach((entry) => {
      statements.push(entry);
    });

    const useEffectStatements = buildUseEffectStatements(component, this.componentMetadata);
    useEffectStatements.forEach((entry) => {
      this.importCollection.addMappedImport(ImportValue.USE_EFFECT);
      statements.push(entry);
    });

    return statements;
  }

  private buildUseAuthenticatedUserStatement(): Statement | undefined {
    if (this.componentMetadata.hasAuthBindings) {
      return factory.createVariableStatement(
        undefined,
        factory.createVariableDeclarationList(
          [
            factory.createVariableDeclaration(
              factory.createIdentifier('authAttributes'),
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
  private buildVariantDeclaration(variants: StudioComponentVariant[]): VariableStatement {
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
            jsonToLiteral(variants as json, true),
          ),
        ],
        ts.NodeFlags.Const,
      ),
    );
  }

  /**
   *     const breakpointHook = useBreakpointValue({
   *        base: 'base',
   *        large: 'large',
   *        medium: 'medium',
   *        small: 'small',
   *        xl: 'xl',
   *        xxl: 'xxl',
   *     });
   */
  private buildDefaultBreakpointMap(component: StudioComponent & Required<Pick<StudioComponent, 'variants'>>) {
    const breakpoints = getBreakpoints(component);
    const element: ObjectLiteralElementLike[] = [];
    // if the first element is not base then we sent it anyway as the smallest size should default to base
    if (breakpoints[0] !== 'base') {
      element.push(
        factory.createPropertyAssignment(factory.createIdentifier('base'), factory.createStringLiteral(breakpoints[0])),
      );
    }
    breakpoints.forEach((bp) => {
      element.push(factory.createPropertyAssignment(factory.createIdentifier(bp), factory.createStringLiteral(bp)));
    });
    this.importCollection.addMappedImport(ImportValue.USE_BREAKPOINT_VALUE);

    return createHookStatement(
      'breakpointHook',
      'useBreakpointValue',
      factory.createObjectLiteralExpression(element, true),
    );
  }

  /**
   *   const rest = {style: {transition:"all 1s"}, ...restProp}
   */
  private buildRestWithStyle() {
    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier('rest'),
            undefined,
            undefined,
            factory.createObjectLiteralExpression(
              [
                factory.createPropertyAssignment(
                  factory.createIdentifier('style'),
                  factory.createObjectLiteralExpression(
                    [
                      factory.createPropertyAssignment(
                        factory.createIdentifier('transition'),
                        factory.createStringLiteral('all 0.25s'),
                      ),
                    ],
                    false,
                  ),
                ),
                factory.createSpreadAssignment(factory.createIdentifier('restProp')),
              ],
              false,
            ),
          ),
        ],
        ts.NodeFlags.Const,
      ),
    );
  }

  /**
   * If component hasBreakpoint:
   *
   * const overrides = mergeVariantsAndOverrides(
   *  getOverridesFromVariants(variants, {
   *   breakpoint: breakpointHook,
   *   ...props,
   *  }),
   *  overridesProp || {}
   * );
   *
   * Else:
   *
   * const overrides = mergeVariantsAndOverrides(
   *  getOverridesFromVariants(variants, props),
   *  overridesProp || {}
   * );
   */
  private buildOverridesFromVariantsAndProp(hasBreakpoint: boolean) {
    this.importCollection.addMappedImport(ImportValue.GET_OVERRIDES_FROM_VARIANTS, ImportValue.VARIANT);

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
                hasBreakpoint
                  ? factory.createObjectLiteralExpression(
                      [
                        factory.createPropertyAssignment(
                          factory.createIdentifier('breakpoint'),
                          factory.createIdentifier('breakpointHook'),
                        ),
                        factory.createSpreadAssignment(factory.createIdentifier('props')),
                      ],
                      false,
                    )
                  : factory.createIdentifier('props'),
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

  private buildCollectionBindingStatements(component: StudioComponent): Statement[] {
    const statements: Statement[] = [];
    if (isStudioComponentWithCollectionProperties(component)) {
      Object.entries(component.collectionProperties).forEach((collectionProp) => {
        const [propName, { model, sort, predicate }] = collectionProp;
        const modelName = this.importCollection.addModelImport(model);

        if (predicate) {
          statements.push(this.buildPredicateDeclaration(propName, predicate, model));
          statements.push(this.buildCreateDataStorePredicateCall(modelName, propName));
        }
        if (sort) {
          this.importCollection.addMappedImport(ImportValue.SORT_DIRECTION, ImportValue.SORT_PREDICATE);
          statements.push(this.buildPaginationStatement(propName, modelName, sort));
        }

        statements.push(buildUseStateExpression(propName, factory.createIdentifier('undefined')));
        /**
         * const userDataStore = useDataStoreBinding({
         *  type: "collection",
         *  model: User,
         *  ...
         * }).items;
         */
        statements.push(
          ...this.buildCollectionBindingCall(
            modelName,
            this.getDataStoreName(propName),
            predicate ? this.getFilterName(propName) : undefined,
            sort ? this.getPaginationName(propName) : undefined,
          ),
        );

        statements.push(
          this.buildSetCollectionItemsUseEffectStatement({
            itemsDataStoreName: this.getDataStoreName(propName),
            itemsPropName: this.hasCollectionPropertyNamedItems(component) ? 'itemsProp' : 'items',
            needsRelationshipsLoaded: modelNeedsRelationshipsLoadedForCollection(
              model,
              this.componentMetadata.dataSchemaMetadata,
            ),
            modelName: model,
            propName,
          }),
        );
      });
    }

    return statements;
  }

  /**
  React.useEffect(() => {
    if (itemsProp !== undefined) {
      setItems(itemsProp)
      return;
    }

    <setItemsFromDataStoreFunctionDeclaration>
    
    setItemsFromDataStore() 

  }, [itemsProp, itemsDataStore])
   */
  private buildSetCollectionItemsUseEffectStatement({
    itemsDataStoreName,
    itemsPropName,
    needsRelationshipsLoaded,
    modelName,
    propName,
  }: {
    itemsDataStoreName: string;
    itemsPropName: string;
    needsRelationshipsLoaded: boolean;
    modelName: string;
    propName: string;
  }) {
    const setItemsIdentifier = getSetNameIdentifier(propName);
    const setItemsFromDataStoreFunctionName = `set${capitalizeFirstLetter(propName)}FromDataStore`;

    const setItemsExpressionStatements: Statement[] = needsRelationshipsLoaded
      ? [
          this.buildSetItemsFromDataStoreFunction({
            functionName: setItemsFromDataStoreFunctionName,
            itemsDataStoreName,
            setItemsIdentifier,
            modelName,
          }),
          factory.createExpressionStatement(
            factory.createCallExpression(factory.createIdentifier(setItemsFromDataStoreFunctionName), undefined, []),
          ),
        ]
      : [
          factory.createExpressionStatement(
            factory.createCallExpression(setItemsIdentifier, undefined, [factory.createIdentifier(itemsDataStoreName)]),
          ),
        ];

    return factory.createExpressionStatement(
      factory.createCallExpression(
        factory.createPropertyAccessExpression(
          factory.createIdentifier('React'),
          factory.createIdentifier('useEffect'),
        ),
        undefined,
        [
          factory.createArrowFunction(
            undefined,
            undefined,
            [],
            undefined,
            factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
            factory.createBlock(
              [
                factory.createIfStatement(
                  factory.createBinaryExpression(
                    factory.createIdentifier(itemsPropName),
                    factory.createToken(ts.SyntaxKind.ExclamationEqualsEqualsToken),
                    factory.createIdentifier('undefined'),
                  ),
                  factory.createBlock(
                    [
                      factory.createExpressionStatement(
                        factory.createCallExpression(setItemsIdentifier, undefined, [
                          factory.createIdentifier(itemsPropName),
                        ]),
                      ),
                      factory.createReturnStatement(undefined),
                    ],
                    true,
                  ),
                  undefined,
                ),
                ...setItemsExpressionStatements,
              ],
              true,
            ),
          ),
          factory.createArrayLiteralExpression(
            [factory.createIdentifier(itemsPropName), factory.createIdentifier(itemsDataStoreName)],
            false,
          ),
        ],
      ),
    );
  }

  /**
  async function setItemsFromDataStore() {
    const loaded = await Promise.all(itemsDataStore.map(async (item) => ({
        ...item,
        CompositeOwner: await item.CompositeOwner,
        CompositeToys: await item.CompositeToys.toArray()
      })))

    setItems(loaded)
  }
   */

  private buildSetItemsFromDataStoreFunction({
    functionName,
    itemsDataStoreName,
    setItemsIdentifier,
    modelName,
  }: {
    functionName: string;
    itemsDataStoreName: string;
    setItemsIdentifier: Identifier;
    modelName: string;
  }) {
    const { dataSchemaMetadata: dataSchema } = this.componentMetadata;
    const model = dataSchema?.models[modelName];
    if (!model) {
      throw new InternalError(`Could not find schema for ${modelName}`);
    }

    const loadedFields: PropertyAssignment[] = [];
    Object.entries(model.fields).forEach(([fieldName, fieldSchema]) => {
      if (fieldNeedsRelationshipLoadedForCollection(fieldSchema, dataSchema as GenericDataSchema)) {
        const { relationship } = fieldSchema;
        if (relationship?.type === 'HAS_MANY') {
          loadedFields.push(
            factory.createPropertyAssignment(
              factory.createIdentifier(fieldName),
              factory.createAwaitExpression(
                factory.createCallExpression(
                  factory.createPropertyAccessExpression(
                    factory.createPropertyAccessExpression(
                      factory.createIdentifier('item'),
                      factory.createIdentifier(fieldName),
                    ),
                    factory.createIdentifier('toArray'),
                  ),
                  undefined,
                  [],
                ),
              ),
            ),
          );
        } else {
          loadedFields.push(
            factory.createPropertyAssignment(
              factory.createIdentifier(fieldName),
              factory.createAwaitExpression(
                factory.createPropertyAccessExpression(
                  factory.createIdentifier('item'),
                  factory.createIdentifier(fieldName),
                ),
              ),
            ),
          );
        }
      }
    });

    return factory.createFunctionDeclaration(
      undefined,
      [factory.createModifier(ts.SyntaxKind.AsyncKeyword)],
      undefined,
      factory.createIdentifier(functionName),
      undefined,
      [],
      undefined,
      factory.createBlock(
        [
          factory.createVariableStatement(
            undefined,
            factory.createVariableDeclarationList([
              factory.createVariableDeclaration(
                factory.createIdentifier('loaded'),
                undefined,
                undefined,
                factory.createAwaitExpression(
                  factory.createCallExpression(
                    factory.createPropertyAccessExpression(
                      factory.createIdentifier('Promise'),
                      factory.createIdentifier('all'),
                    ),
                    undefined,
                    [
                      factory.createCallExpression(
                        factory.createPropertyAccessExpression(
                          factory.createIdentifier(itemsDataStoreName),
                          factory.createIdentifier('map'),
                        ),
                        undefined,
                        [
                          factory.createArrowFunction(
                            [factory.createModifier(ts.SyntaxKind.AsyncKeyword)],
                            undefined,
                            [
                              factory.createParameterDeclaration(
                                undefined,
                                undefined,
                                undefined,
                                factory.createIdentifier('item'),
                                undefined,
                                undefined,
                                undefined,
                              ),
                            ],
                            undefined,
                            factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                            factory.createParenthesizedExpression(
                              factory.createObjectLiteralExpression(
                                [factory.createSpreadAssignment(factory.createIdentifier('item')), ...loadedFields],
                                true,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ]),
          ),
          factory.createExpressionStatement(
            factory.createCallExpression(setItemsIdentifier, undefined, [factory.createIdentifier('loaded')]),
          ),
        ],
        true,
      ),
    );
  }

  private buildCreateDataStorePredicateCall(type: string, name: string): Statement {
    this.importCollection.addMappedImport(ImportValue.CREATE_DATA_STORE_PREDICATE);
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

  private buildUseBindingStatements(component: StudioComponent): Statement[] {
    const statements: Statement[] = [];

    // generate for single record binding
    if (component.bindingProperties !== undefined) {
      Object.entries(component.bindingProperties).forEach((compBindingProp) => {
        const [propName, binding] = compBindingProp;
        if (isDataPropertyBinding(binding)) {
          const { bindingProperties } = binding;
          if ('predicate' in bindingProperties && bindingProperties.predicate !== undefined) {
            this.importCollection.addMappedImport(ImportValue.USE_DATA_STORE_BINDING);
            const modelName = this.importCollection.addModelImport(bindingProperties.model);

            /* const buttonColorFilter = {
             *   field: "userID",
             *   operand: "user@email.com",
             *   operator: "eq",
             * }
             */
            statements.push(
              this.buildPredicateDeclaration(propName, bindingProperties.predicate, bindingProperties.model),
            );

            if (this.renderConfig.apiConfiguration?.dataApi !== 'GraphQL') {
              statements.push(this.buildCreateDataStorePredicateCall(modelName, propName));
            }

            /**
             * const buttonColorDataStore = useDataStoreBinding({
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
                          this.renderConfig.apiConfiguration?.dataApi === 'GraphQL'
                            ? getGraphqlCallExpression(
                                ActionType.LIST,
                                modelName,
                                this.importCollection,
                                {
                                  inputs: [
                                    factory.createSpreadAssignment(
                                      factory.createIdentifier(this.getFilterObjName(propName)),
                                    ),
                                  ],
                                },
                                undefined,
                                this.renderConfig.dependencies,
                              )
                            : this.buildUseDataStoreBindingCall('collection', modelName, this.getFilterName(propName)),
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
            /**
             * const buttonColor =
             *  buttonColorProp !== undefined ? buttonColorProp : buttonColorDataStore;
             */
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
  private buildPaginationStatement(propName: string, model: string, sort?: StudioComponentSort[]): VariableStatement {
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
                  ? [factory.createPropertyAssignment(factory.createIdentifier('sort'), buildSortFunction(model, sort))]
                  : [],
              ),
            ),
          ),
        ],
        ts.NodeFlags.Const,
      ),
    );
  }

  private buildCollectionBindingCall(
    model: string,
    modelVariableName: string,
    criteriaName?: string,
    paginationName?: string,
  ) {
    const statements: Statement[] = [];
    statements.push(
      buildBaseCollectionVariableStatement(
        factory.createIdentifier(modelVariableName),
        this.buildUseDataStoreBindingCall('collection', model, criteriaName, paginationName),
      ),
    );

    return statements;
  }

  private buildUseDataStoreBindingCall(
    callType: string,
    bindingModel: string,
    criteriaName?: string,
    paginationName?: string,
  ): CallExpression {
    this.importCollection.addMappedImport(ImportValue.USE_DATA_STORE_BINDING);

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

  private predicateToObjectLiteralExpression(
    predicate: StudioComponentPredicate,
    model: string,
  ): ObjectLiteralExpression {
    const { operandType, ...filteredPredicate } = predicate;

    if (filteredPredicate.operator === 'between') {
      return this.predicateToObjectLiteralExpression(resolveBetweenPredicateToMultiplePredicates(predicate), model);
    }

    let objectAssignments: PropertyAssignment[];

    if (
      this.renderConfig.apiConfiguration?.dataApi === 'GraphQL' &&
      filteredPredicate.field &&
      filteredPredicate.operand &&
      filteredPredicate.operator
    ) {
      objectAssignments = [
        factory.createPropertyAssignment(
          factory.createIdentifier(filteredPredicate.field),
          factory.createObjectLiteralExpression(
            [
              factory.createPropertyAssignment(
                factory.createIdentifier(filteredPredicate.operator),
                getConditionalOperandExpression(
                  parseNumberOperand(
                    filteredPredicate.operand,
                    this.componentMetadata.dataSchemaMetadata?.models[model]?.fields[predicate.field || ''],
                  ),
                  operandType,
                ),
              ),
            ],
            false,
          ),
        ),
      ];
    } else {
      objectAssignments = Object.entries(filteredPredicate).map(([key, value]) => {
        if (key === 'and' || key === 'or' || key === 'not') {
          return factory.createPropertyAssignment(
            factory.createIdentifier(key),
            factory.createArrayLiteralExpression(
              (predicate[key] as StudioComponentPredicate[]).map(
                (pred: StudioComponentPredicate) => this.predicateToObjectLiteralExpression(pred, model),
                false,
              ),
            ),
          );
        }
        if (key === 'operand' && typeof value === 'string') {
          return factory.createPropertyAssignment(
            factory.createIdentifier(key),
            getConditionalOperandExpression(
              parseNumberOperand(
                value,
                this.componentMetadata.dataSchemaMetadata?.models[model]?.fields[predicate.field || ''],
              ),
              operandType,
            ),
          );
        }
        return factory.createPropertyAssignment(
          factory.createIdentifier(key),
          typeof value === 'string' ? factory.createStringLiteral(value) : factory.createIdentifier('undefined'),
        );
      });
    }

    return factory.createObjectLiteralExpression(objectAssignments);
  }

  private buildUseActionStatements(): Statement[] {
    const actions = getComponentActions(this.component);
    if (actions) {
      return actions.map(({ action, identifier }) =>
        buildUseActionStatement(
          this.componentMetadata,
          action,
          identifier,
          this.importCollection,
          this.renderConfig.apiConfiguration?.dataApi,
          this.renderConfig.dependencies,
        ),
      );
    }
    return [];
  }

  private buildPredicateDeclaration(
    name: string,
    predicate: StudioComponentPredicate,
    model: string,
  ): VariableStatement {
    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(this.getFilterObjName(name)),
            undefined,
            undefined,
            this.predicateToObjectLiteralExpression(predicate, model),
          ),
        ],
        ts.NodeFlags.Const,
      ),
    );
  }

  private buildGraphqlPaginationStatements(component: StudioComponent): Statement[] {
    const statements: Statement[] = [];

    const stateVariables: { name: string; default: Expression }[] = [
      { name: 'pageIndex', default: factory.createNumericLiteral('1') },
      { name: 'hasMorePages', default: factory.createTrue() },
      { name: 'items', default: factory.createArrayLiteralExpression([]) },
      { name: 'isApiPagination', default: factory.createFalse() },
      { name: 'instanceKey', default: factory.createStringLiteral('newGuid') },
      { name: 'loading', default: factory.createTrue() },
      { name: 'maxViewed', default: factory.createNumericLiteral(1) },
    ];

    /*
        const [pageIndex, setPageIndex] = React.useState(1);
        const [hasMorePages, setHasMorePages] = React.useState(true);
        const [items, setItems] = React.useState([]);
        const [isApiPagination, setIsApiPagination] = React.useState(false);
        const [instanceKey] = React.useState('newGuid');
        const [loading, setLoading] = React.useState(true);
        const [maxViewed, setMaxViewed] = React.useState(1);
     */
    stateVariables.forEach((state) => {
      statements.push(buildUseStateExpression(state.name, state.default));
    });

    // const pageSize = 6;
    let pageSize = 6;
    if (isFixedPropertyWithValue(component.properties.itemsPerPage)) {
      const num = Number(component.properties.itemsPerPage.value);
      pageSize = Number.isNaN(num) ? pageSize : num;
    }
    statements.push(buildInitConstVariableExpression('pageSize', factory.createNumericLiteral(pageSize)));

    // const isPaginated = false;
    let factoryMethodIsPaginatedValue: () => ts.TrueLiteral | ts.FalseLiteral = factory.createFalse;
    if (isFixedPropertyWithValue(component.properties.isPaginated)) {
      const isPaginated = Boolean(component.properties.isPaginated.value);
      factoryMethodIsPaginatedValue = isPaginated ? factory.createTrue : factory.createFalse;
    }
    statements.push(buildInitConstVariableExpression('isPaginated', factoryMethodIsPaginatedValue()));

    /*
      React.useEffect(() => {
        nextToken[instanceKey] = '';
        apiCache[instanceKey] = [];
      },[instanceKey]);

      React.useEffect(() => {
        setIsApiPagination(!!!itemsProp);
      }, [itemsProp]);
    */
    const instanceKeyStatements = [
      factory.createExpressionStatement(
        factory.createBinaryExpression(
          factory.createElementAccessExpression(
            factory.createIdentifier('nextToken'),
            factory.createIdentifier('instanceKey'),
          ),
          factory.createToken(ts.SyntaxKind.EqualsToken),
          factory.createStringLiteral(''),
        ),
      ),
      factory.createExpressionStatement(
        factory.createBinaryExpression(
          factory.createElementAccessExpression(
            factory.createIdentifier('apiCache'),
            factory.createIdentifier('instanceKey'),
          ),
          factory.createToken(ts.SyntaxKind.EqualsToken),
          factory.createArrayLiteralExpression([], false),
        ),
      ),
    ];
    statements.push(addUseEffectWrapper(instanceKeyStatements, ['instanceKey']));
    statements.push(
      addUseEffectWrapper(
        [
          factory.createExpressionStatement(
            factory.createCallExpression(factory.createIdentifier('setIsApiPagination'), undefined, [
              factory.createPrefixUnaryExpression(
                ts.SyntaxKind.ExclamationToken,
                factory.createPrefixUnaryExpression(
                  ts.SyntaxKind.ExclamationToken,
                  factory.createPrefixUnaryExpression(
                    ts.SyntaxKind.ExclamationToken,
                    factory.createIdentifier('itemsProp'),
                  ),
                ),
              ),
            ]),
          ),
        ],
        ['itemsProp'],
      ),
    );

    /*
      const handlePreviousPage = () => {
        setPageIndex(pageIndex-1);
      };

      const handleNextPage = () => {
          setPageIndex(pageIndex+1);
      };

      const jumpToPage = (pageNum?: number) => {
          setPageIndex(pageNum!);
      };
    */
    const arrowFunctionVariables: {
      variableName: string;
      functionName: string;
      expression: Expression;
      parameterDeclarations?: ParameterDeclaration[];
    }[] = [
      {
        variableName: 'handlePreviousPage',
        functionName: 'setPageIndex',
        expression: factory.createBinaryExpression(
          factory.createIdentifier('pageIndex'),
          factory.createToken(ts.SyntaxKind.MinusToken),
          factory.createNumericLiteral('1'),
        ),
      },
      {
        variableName: 'handleNextPage',
        functionName: 'setPageIndex',
        expression: factory.createBinaryExpression(
          factory.createIdentifier('pageIndex'),
          factory.createToken(ts.SyntaxKind.PlusToken),
          factory.createNumericLiteral('1'),
        ),
      },
      {
        variableName: 'jumpToPage',
        functionName: 'setPageIndex',
        expression: factory.createNonNullExpression(factory.createIdentifier('pageNum')),
        parameterDeclarations: [
          factory.createParameterDeclaration(
            undefined,
            undefined,
            undefined,
            factory.createIdentifier('pageNum'),
            factory.createToken(ts.SyntaxKind.QuestionToken),
            factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
            undefined,
          ),
        ],
      },
    ];
    arrowFunctionVariables.forEach((entry) => {
      statements.push(
        buildArrowFunctionStatement(
          entry.variableName,
          entry.functionName,
          entry.expression,
          entry.parameterDeclarations,
        ),
      );
    });

    statements.push(this.buildLoadPageStatement(component));

    /*
      React.useEffect(() => {
        loadPage(pageIndex);
      }, [pageIndex]);

      React.useEffect(() => {
        setMaxViewed(Math.max(maxViewed, pageIndex));
      }, [pageIndex, maxViewed, setMaxViewed]);
    */
    statements.push(
      addUseEffectWrapper(
        [
          factory.createExpressionStatement(
            factory.createCallExpression(factory.createIdentifier('loadPage'), undefined, [
              factory.createIdentifier('pageIndex'),
            ]),
          ),
        ],
        ['pageIndex'],
      ),
    );
    statements.push(
      addUseEffectWrapper(
        [
          factory.createExpressionStatement(
            factory.createCallExpression(factory.createIdentifier('setMaxViewed'), undefined, [
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createIdentifier('Math'),
                  factory.createIdentifier('max'),
                ),
                undefined,
                [factory.createIdentifier('maxViewed'), factory.createIdentifier('pageIndex')],
              ),
            ]),
          ),
        ],
        ['pageIndex', 'maxViewed', 'setMaxViewed'],
      ),
    );

    return statements;
  }

  private buildLoadPageStatement(component: StudioComponent): Statement {
    const statements: Statement[] = [];

    /*
      const cacheUntil = (page*pageSize)+1; 
      const newCache = apiCache[instanceKey].slice();
      let newNext = nextToken[instanceKey];
    */
    statements.push(
      buildInitConstVariableExpression(
        'cacheUntil',
        factory.createBinaryExpression(
          factory.createParenthesizedExpression(
            factory.createBinaryExpression(
              factory.createIdentifier('page'),
              factory.createToken(ts.SyntaxKind.AsteriskToken),
              factory.createIdentifier('pageSize'),
            ),
          ),
          factory.createToken(ts.SyntaxKind.PlusToken),
          factory.createNumericLiteral('1'),
        ),
      ),
    );
    statements.push(
      buildInitConstVariableExpression(
        'newCache',
        factory.createCallExpression(
          factory.createPropertyAccessExpression(
            factory.createElementAccessExpression(
              factory.createIdentifier('apiCache'),
              factory.createIdentifier('instanceKey'),
            ),
            factory.createIdentifier('slice'),
          ),
          undefined,
          [],
        ),
      ),
    );
    statements.push(
      factory.createVariableStatement(
        undefined,
        factory.createVariableDeclarationList(
          [
            factory.createVariableDeclaration(
              factory.createIdentifier('newNext'),
              undefined,
              undefined,
              factory.createElementAccessExpression(
                factory.createIdentifier('nextToken'),
                factory.createIdentifier('instanceKey'),
              ),
            ),
          ],
          ts.NodeFlags.Let,
        ),
      ),
    );

    if (isStudioComponentWithCollectionProperties(component)) {
      let filter: ObjectLiteralExpression | undefined;
      let modelQuery = '';
      const { dataSchemaMetadata: dataSchema } = this.componentMetadata;
      const loadedFields: ShorthandPropertyAssignment[] = [];
      const loadedFieldNames: string[] = [];
      const loadedFieldStatements: Statement[] = [];
      const amplifyJSVersion = getAmplifyJSVersionToRender(this.renderConfig.dependencies);

      Object.entries(component.collectionProperties).forEach((collectionProp) => {
        const [, { model: modelName, predicate }] = collectionProp;
        modelQuery = getGraphqlQueryForModel(ActionType.LIST, modelName);
        this.importCollection.addGraphqlQueryImport(modelQuery);
        if (predicate) {
          filter = this.predicateToObjectLiteralExpression(predicate, modelName);
        }

        const model = dataSchema?.models[modelName];

        if (model !== undefined) {
          Object.entries(model.fields).forEach(([fieldName, fieldSchema]) => {
            if (fieldNeedsRelationshipLoadedForCollection(fieldSchema, dataSchema as GenericDataSchema)) {
              const { relationship } = fieldSchema;
              loadedFieldNames.push(fieldName);
              const relatedFieldQueryName = this.getQueryRelationshipName(
                modelName,
                relationship?.relatedModelName ?? '',
              );

              /*
                const Comments = (await API.graphql({query: commentsByPostID, variables: { post: item.id }}))
                  .data.commentsByPostID.items;
              */
              loadedFieldStatements.push(
                factory.createVariableStatement(
                  undefined,
                  factory.createVariableDeclarationList(
                    [
                      factory.createVariableDeclaration(
                        factory.createIdentifier(pluralize(fieldName)),
                        undefined,
                        undefined,
                        factory.createPropertyAccessExpression(
                          factory.createPropertyAccessExpression(
                            factory.createPropertyAccessExpression(
                              factory.createParenthesizedExpression(
                                factory.createAwaitExpression(
                                  factory.createCallExpression(
                                    factory.createPropertyAccessExpression(
                                      factory.createIdentifier(amplifyJSVersion === AMPLIFY_JS_V5 ? 'API' : 'client'),
                                      factory.createIdentifier('graphql'),
                                    ),
                                    undefined,
                                    [
                                      factory.createObjectLiteralExpression(
                                        [
                                          factory.createPropertyAssignment(
                                            factory.createIdentifier('query'),
                                            factory.createCallExpression(
                                              factory.createPropertyAccessExpression(
                                                factory.createIdentifier(relatedFieldQueryName),
                                                factory.createIdentifier('replaceAll'),
                                              ),
                                              undefined,
                                              [
                                                factory.createStringLiteral('__typename'),
                                                factory.createStringLiteral(''),
                                              ],
                                            ),
                                          ),
                                          factory.createPropertyAssignment(
                                            factory.createIdentifier('variables'),
                                            factory.createObjectLiteralExpression(
                                              [
                                                factory.createPropertyAssignment(
                                                  factory.createIdentifier(`${modelName.toLowerCase()}ID`),
                                                  factory.createPropertyAccessExpression(
                                                    factory.createIdentifier('item'),
                                                    factory.createIdentifier('id'),
                                                  ),
                                                ),
                                              ],
                                              false,
                                            ),
                                          ),
                                        ],
                                        false,
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                              factory.createIdentifier('data'),
                            ),
                            factory.createIdentifier(relatedFieldQueryName),
                          ),
                          factory.createIdentifier('items'),
                        ),
                      ),
                    ],
                    ts.NodeFlags.Const,
                  ),
                ),
              );

              loadedFields.push(
                factory.createShorthandPropertyAssignment(factory.createIdentifier(fieldName), undefined),
              );
            }
          });
        }
      });

      statements.push(
        factory.createWhileStatement(
          factory.createBinaryExpression(
            factory.createParenthesizedExpression(
              factory.createBinaryExpression(
                factory.createBinaryExpression(
                  factory.createPropertyAccessExpression(
                    factory.createIdentifier('newCache'),
                    factory.createIdentifier('length'),
                  ),
                  factory.createToken(ts.SyntaxKind.LessThanToken),
                  factory.createIdentifier('cacheUntil'),
                ),
                factory.createToken(ts.SyntaxKind.BarBarToken),
                factory.createPrefixUnaryExpression(
                  ts.SyntaxKind.ExclamationToken,
                  factory.createIdentifier('isPaginated'),
                ),
              ),
            ),
            factory.createToken(ts.SyntaxKind.AmpersandAmpersandToken),
            factory.createParenthesizedExpression(
              factory.createBinaryExpression(
                factory.createIdentifier('newNext'),
                factory.createToken(ts.SyntaxKind.ExclamationEqualsToken),
                factory.createNull(),
              ),
            ),
          ),
          factory.createBlock(
            [
              factory.createExpressionStatement(
                factory.createCallExpression(factory.createIdentifier('setLoading'), undefined, [factory.createTrue()]),
              ),
              factory.createVariableStatement(
                undefined,
                factory.createVariableDeclarationList(
                  [
                    factory.createVariableDeclaration(
                      factory.createIdentifier('variables'),
                      undefined,
                      factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
                      factory.createObjectLiteralExpression(
                        filter !== undefined
                          ? [
                              factory.createPropertyAssignment(
                                factory.createIdentifier('limit'),
                                factory.createIdentifier('pageSize'),
                              ),
                              factory.createPropertyAssignment(factory.createIdentifier('filter'), filter),
                            ]
                          : [
                              factory.createPropertyAssignment(
                                factory.createIdentifier('limit'),
                                factory.createIdentifier('pageSize'),
                              ),
                            ],
                        true,
                      ),
                    ),
                  ],
                  ts.NodeFlags.Const,
                ),
              ),
              factory.createIfStatement(
                factory.createIdentifier('newNext'),
                factory.createBlock(
                  [
                    factory.createExpressionStatement(
                      factory.createBinaryExpression(
                        factory.createElementAccessExpression(
                          factory.createIdentifier('variables'),
                          factory.createStringLiteral('nextToken'),
                        ),
                        factory.createToken(ts.SyntaxKind.EqualsToken),
                        factory.createIdentifier('newNext'),
                      ),
                    ),
                  ],
                  true,
                ),
                undefined,
              ),
              factory.createVariableStatement(
                undefined,
                factory.createVariableDeclarationList(
                  [
                    factory.createVariableDeclaration(
                      factory.createIdentifier('result'),
                      undefined,
                      undefined,
                      factory.createPropertyAccessExpression(
                        factory.createPropertyAccessExpression(
                          factory.createParenthesizedExpression(
                            factory.createAwaitExpression(
                              factory.createCallExpression(
                                factory.createPropertyAccessExpression(
                                  factory.createIdentifier(amplifyJSVersion === AMPLIFY_JS_V5 ? 'API' : 'client'),
                                  factory.createIdentifier('graphql'),
                                ),
                                undefined,
                                [
                                  factory.createObjectLiteralExpression(
                                    [
                                      factory.createPropertyAssignment(
                                        factory.createIdentifier('query'),
                                        factory.createCallExpression(
                                          factory.createPropertyAccessExpression(
                                            factory.createIdentifier(modelQuery),
                                            factory.createIdentifier('replaceAll'),
                                          ),
                                          undefined,
                                          [factory.createStringLiteral('__typename'), factory.createStringLiteral('')],
                                        ),
                                      ),
                                      factory.createShorthandPropertyAssignment(
                                        factory.createIdentifier('variables'),
                                        undefined,
                                      ),
                                    ],
                                    true,
                                  ),
                                ],
                              ),
                            ),
                          ),
                          factory.createIdentifier('data'),
                        ),
                        factory.createIdentifier(modelQuery),
                      ),
                    ),
                  ],
                  ts.NodeFlags.Const,
                ),
              ),
              factory.createExpressionStatement(
                factory.createCallExpression(
                  factory.createPropertyAccessExpression(
                    factory.createIdentifier('newCache'),
                    factory.createIdentifier('push'),
                  ),
                  undefined,
                  [
                    factory.createSpreadElement(
                      factory.createPropertyAccessExpression(
                        factory.createIdentifier('result'),
                        factory.createIdentifier('items'),
                      ),
                    ),
                  ],
                ),
              ),
              factory.createExpressionStatement(
                factory.createBinaryExpression(
                  factory.createIdentifier('newNext'),
                  factory.createToken(ts.SyntaxKind.EqualsToken),
                  factory.createPropertyAccessExpression(
                    factory.createIdentifier('result'),
                    factory.createIdentifier('nextToken'),
                  ),
                ),
              ),
            ],
            true,
          ),
        ),
      );
    }

    /*
      const cacheSlice = newCache.slice((page-1)*pageSize, page*pageSize);
      setItems(cacheSlice);
      setHasMorePages(!!newNext);
      setLoading(false);
      apiCache[instanceKey] = newCache;
      nextToken[instanceKey] = newNext;
    */
    statements.push(
      buildInitConstVariableExpression(
        'cacheSlice',
        factory.createConditionalExpression(
          factory.createIdentifier('isPaginated'),
          factory.createToken(ts.SyntaxKind.QuestionToken),
          factory.createCallExpression(
            factory.createPropertyAccessExpression(
              factory.createIdentifier('newCache'),
              factory.createIdentifier('slice'),
            ),
            undefined,
            [
              factory.createBinaryExpression(
                factory.createParenthesizedExpression(
                  factory.createBinaryExpression(
                    factory.createIdentifier('page'),
                    factory.createToken(ts.SyntaxKind.MinusToken),
                    factory.createNumericLiteral('1'),
                  ),
                ),
                factory.createToken(ts.SyntaxKind.AsteriskToken),
                factory.createIdentifier('pageSize'),
              ),
              factory.createBinaryExpression(
                factory.createIdentifier('page'),
                factory.createToken(ts.SyntaxKind.AsteriskToken),
                factory.createIdentifier('pageSize'),
              ),
            ],
          ),
          factory.createToken(ts.SyntaxKind.ColonToken),
          factory.createIdentifier('newCache'),
        ),
      ),
    );
    statements.push(
      factory.createExpressionStatement(
        factory.createCallExpression(factory.createIdentifier('setItems'), undefined, [
          factory.createIdentifier('cacheSlice'),
        ]),
      ),
    );
    statements.push(
      factory.createExpressionStatement(
        factory.createCallExpression(factory.createIdentifier('setHasMorePages'), undefined, [
          factory.createPrefixUnaryExpression(
            ts.SyntaxKind.ExclamationToken,
            factory.createPrefixUnaryExpression(ts.SyntaxKind.ExclamationToken, factory.createIdentifier('newNext')),
          ),
        ]),
      ),
    );
    statements.push(
      factory.createExpressionStatement(
        factory.createCallExpression(factory.createIdentifier('setLoading'), undefined, [factory.createFalse()]),
      ),
    );
    statements.push(
      factory.createExpressionStatement(
        factory.createBinaryExpression(
          factory.createElementAccessExpression(
            factory.createIdentifier('apiCache'),
            factory.createIdentifier('instanceKey'),
          ),
          factory.createToken(ts.SyntaxKind.EqualsToken),
          factory.createIdentifier('newCache'),
        ),
      ),
    );
    statements.push(
      factory.createExpressionStatement(
        factory.createBinaryExpression(
          factory.createElementAccessExpression(
            factory.createIdentifier('nextToken'),
            factory.createIdentifier('instanceKey'),
          ),
          factory.createToken(ts.SyntaxKind.EqualsToken),
          factory.createIdentifier('newNext'),
        ),
      ),
    );

    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier('loadPage'),
            undefined,
            undefined,
            factory.createArrowFunction(
              [factory.createToken(ts.SyntaxKind.AsyncKeyword)],
              undefined,
              [
                factory.createParameterDeclaration(
                  undefined,
                  undefined,
                  undefined,
                  factory.createIdentifier('page'),
                  undefined,
                  factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
                  undefined,
                ),
              ],
              undefined,
              factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
              factory.createBlock(statements, true),
            ),
          ),
        ],
        ts.NodeFlags.Const,
      ),
    );
  }

  private hasCollectionPropertyNamedItems(component: StudioComponent): boolean {
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

  private getPropsTypeName(component: StudioComponent): string {
    // MenuButton primitive uses ButtonProps
    if (component.componentType === Primitive.MenuButton) {
      return 'ButtonProps';
    }
    return `${component.componentType}Props`;
  }

  private getQueryRelationshipName(modelName: string, relatedModelName: string): string {
    const relatedModel = pluralize(relatedModelName.toLowerCase());
    return `${relatedModel}By${modelName}ID`;
  }

  private dropMissingListElements<T>(elements: (T | null | undefined)[]): T[] {
    return elements.filter((element) => element !== null && element !== undefined) as T[];
  }

  private getDefaultValue(
    binding: StudioComponentSimplePropertyBinding,
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

  /* To map predefined props to children props for variants
   *
   * Example: Text prop label is mapped to to Text prop Children
   *
   */
  private mapSyntheticPropsForVariants() {
    if (!isStudioComponentWithVariants(this.component)) {
      return;
    }

    this.component.variants.forEach((variant) => {
      Object.entries(variant.overrides).forEach(([name, value]) => {
        const propsInOverrides = value;
        const componentType = this.componentMetadata.componentNameToTypeMap[name];
        if (componentType && isPrimitive(componentType)) {
          const childrenPropMapping = PrimitiveChildrenPropMapping[Primitive[componentType as Primitive]];
          if (childrenPropMapping !== undefined) {
            // only remap if children prop is not defined in this particular overrides section
            if (propsInOverrides.children === undefined && propsInOverrides[childrenPropMapping] !== undefined) {
              propsInOverrides.children = propsInOverrides[childrenPropMapping];
              delete propsInOverrides[childrenPropMapping];
            }
          }
        }
      });
    });
  }

  /* Some additional props are added to Amplify primitives in Studio. These "sythetic" props are mapped to real props
   * on the primitives.
   *
   * Example: Text prop label is mapped to to Text prop Children
   *
   * This is done so that nonadvanced users of Studio do not need to interact with props that might confuse them.
   */
  private mapSyntheticProps() {
    function mapSyntheticPropsForComponent(component: StudioComponent | StudioComponentChild) {
      // properties.children will take precedent over mapped children prop
      if (component.properties.children === undefined) {
        const childrenPropMapping = PrimitiveChildrenPropMapping[Primitive[component.componentType as Primitive]];

        if (childrenPropMapping !== undefined) {
          const mappedChildrenProp = component.properties[childrenPropMapping];
          if (mappedChildrenProp !== undefined) {
            component.properties.children = mappedChildrenProp; // eslint-disable-line no-param-reassign
            delete component.properties[childrenPropMapping]; // eslint-disable-line no-param-reassign
          }
        }
      }

      if (component.children !== undefined) {
        component.children.forEach(mapSyntheticPropsForComponent);
      }
    }

    mapSyntheticPropsForComponent(this.component);
  }

  validateSchema(component: StudioComponent) {
    validateComponentSchema(component);
  }

  abstract renderJsx(component: StudioComponent): JsxElement | JsxFragment | JsxSelfClosingElement;
}
