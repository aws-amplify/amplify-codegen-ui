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
  ComponentMetadata,
  computeComponentMetadata,
  FormDefinition,
  generateFormDefinition,
  GenericDataSchema,
  handleCodegenErrors,
  mapFormDefinitionToComponent,
  mapFormMetadata,
  StudioComponent,
  StudioForm,
  StudioNode,
  StudioTemplateRenderer,
  validateFormSchema,
} from '@aws-amplify/codegen-ui';
import { EOL } from 'os';
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
  ScriptKind,
  Statement,
  SyntaxKind,
  TypeAliasDeclaration,
} from 'typescript';
import { lowerCaseFirst } from '../helpers';
import { ImportCollection, ImportSource, ImportValue } from '../imports';
import { PrimitiveTypeParameter, Primitive } from '../primitive';
import { getComponentPropName } from '../react-component-render-helper';
import { ReactOutputManager } from '../react-output-manager';
import { ReactRenderConfig, scriptKindToFileExtension } from '../react-render-config';
import {
  buildPrinter,
  defaultRenderConfig,
  getDeclarationFilename,
  transpile,
} from '../react-studio-template-renderer-helper';
import { generateArrayFieldComponent } from '../utils/forms/array-field-component';
import { addUseEffectWrapper } from '../utils/generate-react-hooks';
import { RequiredKeys } from '../utils/type-utils';
import {
  buildFormPropNode,
  buildMutationBindings,
  buildOverrideTypesBindings,
  buildUpdateDatastoreQuery,
  buildValidations,
  runValidationTasksFunction,
} from './form-renderer-helper';
import { buildUseStateExpression, capitalizeFirstLetter, getUseStateHooks } from './form-state';
import {
  formOverrideProp,
  generateOnValidationType,
  validationFunctionType,
  validationResponseType,
} from './type-helper';

export abstract class ReactFormTemplateRenderer extends StudioTemplateRenderer<
  string,
  StudioForm,
  ReactOutputManager,
  {
    componentText: string;
    renderComponentToFilesystem: (outputPath: string) => Promise<void>;
  }
> {
  protected importCollection = new ImportCollection();

  protected renderConfig: RequiredKeys<ReactRenderConfig, keyof typeof defaultRenderConfig>;

  protected formDefinition: FormDefinition;

  protected formComponent: StudioComponent;

  protected componentMetadata: ComponentMetadata;

  public fileName: string;

  constructor(component: StudioForm, dataSchema: GenericDataSchema | undefined, renderConfig: ReactRenderConfig) {
    super(component, new ReactOutputManager(), renderConfig);
    this.renderConfig = {
      ...defaultRenderConfig,
      ...renderConfig,
    };
    // the super class creates a component aka form which is what we pass in this extended implmentation
    this.fileName = `${this.component.name}.${scriptKindToFileExtension(this.renderConfig.script)}`;

    this.formDefinition = generateFormDefinition({ form: component, dataSchema });

    // create a studio component which will represent the structure of the form
    this.formComponent = mapFormDefinitionToComponent(this.component.name, this.formDefinition);

    this.componentMetadata = computeComponentMetadata(this.formComponent);
    this.componentMetadata.formMetadata = mapFormMetadata(this.component, this.formDefinition, dataSchema);
  }

  @handleCodegenErrors
  renderComponentOnly() {
    const variableStatements = this.buildVariableStatements();
    const jsx = this.renderJsx(this.formComponent);
    const requiredDataModels = [];

    const { printer, file } = buildPrinter(this.fileName, this.renderConfig);

    const imports = this.importCollection.buildImportStatements();

    let importsText = '';

    imports.forEach((importStatement) => {
      const result = printer.printNode(EmitHint.Unspecified, importStatement, file);
      importsText += result + EOL;
    });

    if (this.componentMetadata.formMetadata) {
      if (Object.values(this.componentMetadata.formMetadata?.fieldConfigs).some(({ isArray }) => isArray)) {
        printer.printNode(EmitHint.Unspecified, generateArrayFieldComponent(), file);
      }
    }

    const wrappedFunction = this.renderFunctionWrapper(this.component.name, variableStatements, jsx, false);

    const result = printer.printNode(EmitHint.Unspecified, wrappedFunction, file);

    // do not produce declaration becuase it is not used
    const { componentText: compText } = transpile(result, { ...this.renderConfig, renderTypeDeclarations: false });

    if (this.component.dataType.dataSourceType === 'DataStore') {
      requiredDataModels.push(this.component.dataType.dataTypeName);
      // TODO: require other models if form is handling querying relational models
    }

    return { compText, importsText, requiredDataModels };
  }

  renderComponentInternal() {
    const { printer, file } = buildPrinter(this.fileName, this.renderConfig);

    // build form related variable statments
    const variableStatements = this.buildVariableStatements();
    const jsx = this.renderJsx(this.formComponent);

    const wrappedFunction = this.renderFunctionWrapper(this.component.name, variableStatements, jsx, true);
    const propsDeclaration = this.renderBindingPropsType();

    const imports = this.importCollection.buildImportStatements();

    let componentText = `/* eslint-disable */${EOL}`;

    imports.forEach((importStatement) => {
      const result = printer.printNode(EmitHint.Unspecified, importStatement, file);
      componentText += result + EOL;
    });

    componentText += EOL;

    propsDeclaration.forEach((typeNode) => {
      const propsPrinted = printer.printNode(EmitHint.Unspecified, typeNode, file);
      componentText += propsPrinted;
    });

    if (this.componentMetadata.formMetadata) {
      if (Object.values(this.componentMetadata.formMetadata?.fieldConfigs).some(({ isArray }) => isArray)) {
        const arrayFieldComponent = printer.printNode(EmitHint.Unspecified, generateArrayFieldComponent(), file);
        componentText += arrayFieldComponent;
      }
    }

    const result = printer.printNode(EmitHint.Unspecified, wrappedFunction, file);
    componentText += result;

    const { componentText: transpiledComponentText, declaration } = transpile(componentText, this.renderConfig);

    return {
      componentText: transpiledComponentText,
      declaration,
      formMetadata: this.componentMetadata.formMetadata,
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
    const typeParameter = PrimitiveTypeParameter[Primitive[this.formComponent?.componentType as Primitive]];
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

  abstract renderJsx(component: StudioComponent, parent?: StudioNode): JsxElement | JsxFragment | JsxSelfClosingElement;

  private renderBindingPropsType(): TypeAliasDeclaration[] {
    const {
      name: formName,
      formActionType,
      dataType: { dataSourceType, dataTypeName },
    } = this.component;
    const fieldConfigs = this.componentMetadata.formMetadata?.fieldConfigs ?? {};
    const overrideTypeAliasDeclaration = buildOverrideTypesBindings(
      this.formComponent,
      this.formDefinition,
      this.importCollection,
    );
    const escapeHatchTypeNode = factory.createTypeLiteralNode([
      factory.createPropertySignature(
        undefined,
        factory.createIdentifier('overrides'),
        factory.createToken(SyntaxKind.QuestionToken),
        factory.createUnionTypeNode([
          factory.createTypeReferenceNode(`${formName}OverridesProps`, undefined),
          factory.createKeywordTypeNode(SyntaxKind.UndefinedKeyword),
          factory.createLiteralTypeNode(factory.createNull()),
        ]),
      ),
    ]);
    const formPropType = getComponentPropName(formName);

    this.importCollection.addMappedImport(ImportValue.ESCAPE_HATCH_PROPS);
    if (dataSourceType === 'DataStore' && formActionType === 'update') {
      this.importCollection.addImport(ImportSource.LOCAL_MODELS, dataTypeName);
    }

    return [
      validationResponseType,
      validationFunctionType,
      generateOnValidationType(formName, fieldConfigs),
      formOverrideProp,
      overrideTypeAliasDeclaration,
      factory.createTypeAliasDeclaration(
        undefined,
        [factory.createModifier(SyntaxKind.ExportKeyword)],
        factory.createIdentifier(formPropType),
        undefined,
        factory.createTypeReferenceNode(factory.createIdentifier('React.PropsWithChildren'), [
          factory.createIntersectionTypeNode([escapeHatchTypeNode, buildFormPropNode(this.component)]),
        ]),
      ),
    ];
  }

  /**
   * Variable Statements need for forms
   * -  props passed into form component
   * -  useState
   *  - form fields
   *  - valid state for form
   *  - error object { hasError: boolean, errorMessage: string }
   * - datastore operation (conditional if form is backed by datastore)
   *  - this is the datastore mutation function which will be used by the helpers
   */
  private buildVariableStatements() {
    const statements: Statement[] = [];
    const { formMetadata } = this.componentMetadata;
    const {
      dataType: { dataTypeName, dataSourceType },
      formActionType,
    } = this.component;
    const lowerCaseDataTypeName = lowerCaseFirst(dataTypeName);

    if (!formMetadata) {
      throw new Error(`Form Metadata is missing from form: ${this.component.name}`);
    }

    const elements: BindingElement[] = [
      // add in hooks for before/complete with ds and basic onSubmit with props
      ...buildMutationBindings(this.component),
      // onCancel prop
      factory.createBindingElement(undefined, undefined, factory.createIdentifier('onCancel'), undefined),
      // onValidate prop
      factory.createBindingElement(undefined, undefined, factory.createIdentifier('onValidate'), undefined),
      // onChange prop
      factory.createBindingElement(undefined, undefined, factory.createIdentifier('onChange'), undefined),
      // overrides
      factory.createBindingElement(undefined, undefined, factory.createIdentifier('overrides'), undefined),
      // get rest of props to pass to top level component
      factory.createBindingElement(
        factory.createToken(SyntaxKind.DotDotDotToken),
        undefined,
        factory.createIdentifier('rest'),
        undefined,
      ),
    ];

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

    statements.push(...getUseStateHooks(formMetadata.fieldConfigs));

    statements.push(buildUseStateExpression('errors', factory.createObjectLiteralExpression()));

    this.importCollection.addMappedImport(ImportValue.VALIDATE_FIELD);
    this.importCollection.addMappedImport(ImportValue.FETCH_BY_PATH);

    // add model import for datastore type
    if (dataSourceType === 'DataStore') {
      this.importCollection.addImport(ImportSource.LOCAL_MODELS, dataTypeName);
      if (formActionType === 'update') {
        statements.push(
          buildUseStateExpression(`${lowerCaseDataTypeName}Record`, factory.createIdentifier(lowerCaseDataTypeName)),
        );
        statements.push(
          addUseEffectWrapper(
            buildUpdateDatastoreQuery(dataTypeName, this.componentMetadata.formMetadata?.fieldConfigs),
            ['id', lowerCaseDataTypeName],
          ),
        );
      }
    }

    this.importCollection.addMappedImport(ImportValue.VALIDATE_FIELD);
    // Add value state and ref array type fields in ArrayField wrapper
    Object.entries(formMetadata.fieldConfigs).forEach(([field, config]) => {
      if (config.isArray) {
        statements.push(
          buildUseStateExpression(`current${capitalizeFirstLetter(field)}Value`, factory.createStringLiteral('')),
          factory.createVariableStatement(
            undefined,
            factory.createVariableDeclarationList(
              [
                factory.createVariableDeclaration(
                  factory.createIdentifier(`${field}Ref`),
                  undefined,
                  undefined,
                  factory.createCallExpression(
                    factory.createPropertyAccessExpression(
                      factory.createIdentifier('React'),
                      factory.createIdentifier('createRef'),
                    ),
                    undefined,
                    [],
                  ),
                ),
              ],
              NodeFlags.Const,
            ),
          ),
        );
      }
    });
    statements.push(buildValidations(formMetadata.fieldConfigs));
    statements.push(runValidationTasksFunction);

    return statements;
  }

  protected validateSchema(component: StudioForm): void {
    validateFormSchema(component);
  }
}
