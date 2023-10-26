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
  FormFeatureFlags,
  NoApiError,
  formRequiresDataApi,
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
import {
  buildInitConstVariableExpression,
  buildUseStateExpression,
  getModelNameProp,
  lowerCaseFirst,
} from '../helpers';
import { ImportCollection, ImportSource, ImportValue } from '../imports';
import { PrimitiveTypeParameter, Primitive, primitiveOverrideProp } from '../primitive';
import { getComponentPropName } from '../react-component-render-helper';
import { ReactOutputManager } from '../react-output-manager';
import { ReactRenderConfig, scriptKindToFileExtension } from '../react-render-config';
import {
  buildPrinter,
  defaultRenderConfig,
  getAmplifyJSClientGenerator,
  getDeclarationFilename,
  transpile,
} from '../react-studio-template-renderer-helper';
import { generateArrayFieldComponent } from '../utils/forms/array-field-component';
import { hasTokenReference } from '../utils/forms/layout-helpers';
import { convertTimeStampToDateAST, convertToLocalAST } from '../utils/forms/value-mappers';
import { addUseEffectWrapper } from '../utils/generate-react-hooks';
import {
  buildMutationBindings,
  buildOverrideTypesBindings,
  buildResetValuesOnRecordUpdate,
  buildSetStateFunction,
  buildUpdateDatastoreQuery,
  runValidationTasksFunction,
  mapFromFieldConfigs,
  getLinkedDataName,
  buildRelationshipQuery,
  buildGetRelationshipModels,
  getPropName,
} from './form-renderer-helper';
import {
  getCurrentDisplayValueName,
  getArrayChildRefName,
  getCurrentValueName,
  getDefaultValueExpression,
  getInitialValues,
  getUseStateHooks,
  resetStateFunction,
  getCanUnlinkModelName,
  getAutocompleteOptions,
} from './form-renderer-helper/form-state';
import { shouldWrapInArrayField } from './form-renderer-helper/render-checkers';
import {
  buildFormPropNode,
  generateFieldTypes,
  validationFunctionType,
  validationResponseType,
} from './form-renderer-helper/type-helper';
import { buildSelectedRecordsIdSet } from './form-renderer-helper/model-values';
import { AMPLIFY_JS_V6, COMPOSITE_PRIMARY_KEY_PROP_NAME } from '../utils/constants';
import { getFetchRelatedRecordsCallbacks, isGraphqlConfig } from '../utils/graphql';
import { getAmplifyJSVersionToRender } from '../helpers/amplify-js-versioning';
import { overrideTypesString } from '../utils-file-functions';

type RenderComponentOnlyResponse = {
  compText: string;
  /**
   * @deprecated Use {@link RenderComponentOnlyResponse.importCollection} instead.
   */
  importsText: string;
  requiredDataModels: string[];
  importCollection: ImportCollection;
};
export abstract class ReactFormTemplateRenderer extends StudioTemplateRenderer<
  string,
  StudioForm,
  ReactOutputManager,
  {
    componentText: string;
    renderComponentToFilesystem: (outputPath: string) => Promise<void>;
  }
> {
  protected importCollection: ImportCollection;

  protected renderConfig: ReactRenderConfig & typeof defaultRenderConfig;

  protected formDefinition: FormDefinition;

  protected formComponent: StudioComponent;

  protected componentMetadata: ComponentMetadata;

  public fileName: string;

  protected requiredDataModels: string[] = [];

  protected shouldRenderArrayField = false;

  protected primaryKeys: string[] | undefined;

  constructor(
    component: StudioForm,
    dataSchema: GenericDataSchema | undefined,
    renderConfig: ReactRenderConfig,
    featureFlags?: FormFeatureFlags,
  ) {
    super(component, new ReactOutputManager(), renderConfig);
    this.renderConfig = {
      ...defaultRenderConfig,
      ...renderConfig,
    };
    // the super class creates a component aka form which is what we pass in this extended implmentation
    this.fileName = `${this.component.name}.${scriptKindToFileExtension(this.renderConfig.script)}`;

    this.formDefinition = generateFormDefinition({ form: component, dataSchema, featureFlags });

    // create a studio component which will represent the structure of the form
    this.formComponent = mapFormDefinitionToComponent(this.component.name, this.formDefinition);

    this.componentMetadata = computeComponentMetadata(this.formComponent);
    this.componentMetadata.formMetadata = mapFormMetadata(this.component, this.formDefinition);
    this.importCollection = new ImportCollection({ rendererConfig: renderConfig });
    this.importCollection.ingestComponentMetadata(this.componentMetadata);
    if (dataSchema) {
      const dataSchemaMetadata = dataSchema;
      this.componentMetadata.dataSchemaMetadata = dataSchemaMetadata;
      const { dataSourceType, dataTypeName } = this.component.dataType;
      if (dataSourceType === 'DataStore') {
        this.primaryKeys = dataSchemaMetadata.models[dataTypeName].primaryKeys;
      }
    }

    // validate inputs for renderer
    if (formRequiresDataApi(component) && renderConfig.apiConfiguration?.dataApi === 'NoApi') {
      throw new NoApiError('Form cannot be rendered without a data API');
    }
  }

  @handleCodegenErrors
  renderComponentOnly(): RenderComponentOnlyResponse {
    const variableStatements = this.buildVariableStatements();
    const jsx = this.renderJsx(this.formComponent);

    const { printer, file } = buildPrinter(this.fileName, this.renderConfig);

    const imports = this.importCollection.buildImportStatements();

    let importsText = '';

    imports.forEach((importStatement) => {
      const result = printer.printNode(EmitHint.Unspecified, importStatement, file);
      importsText += result + EOL;
    });

    const wrappedFunction = this.renderFunctionWrapper(this.component.name, variableStatements, jsx, false);
    let result = printer.printNode(EmitHint.Unspecified, wrappedFunction, file);

    if (this.shouldRenderArrayField) {
      const arrayFieldText = printer.printNode(EmitHint.Unspecified, generateArrayFieldComponent(), file);
      result = arrayFieldText + EOL + result;
    }
    // do not produce declaration becuase it is not used
    const { componentText: compText } = transpile(result, { ...this.renderConfig, renderTypeDeclarations: false });

    return {
      compText,
      importsText,
      requiredDataModels: this.requiredDataModels,
      importCollection: this.importCollection,
    };
  }

  renderComponentInternal() {
    const { printer, file } = buildPrinter(this.fileName, this.renderConfig);

    const propsDeclaration = this.renderBindingPropsType();

    // build form related variable statments
    const variableStatements = this.buildVariableStatements();
    const jsx = this.renderJsx(this.formComponent);

    const wrappedFunction = this.renderFunctionWrapper(this.component.name, variableStatements, jsx, true);
    const imports = this.importCollection.buildImportStatements();

    let componentText = `/* eslint-disable */${EOL}`;

    if (this.renderConfig.includeUseClientDirective) {
      componentText += `'use client';${EOL}`;
    }

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

    if (this.shouldRenderArrayField) {
      const arrayFieldComponent = printer.printNode(EmitHint.Unspecified, generateArrayFieldComponent(), file);
      componentText += arrayFieldComponent;
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

    let modelName = dataTypeName;

    // add model import for datastore type
    if (dataSourceType === 'DataStore') {
      this.requiredDataModels.push(dataTypeName);
      modelName = this.importCollection.addModelImport(dataTypeName);
    }

    if (isGraphqlConfig(this.renderConfig.apiConfiguration) && !this.renderConfig.apiConfiguration.typesFilePath) {
      modelName = 'any';
    }

    return [
      validationResponseType,
      validationFunctionType,
      // pass in importCollection once to collect models to import
      generateFieldTypes(formName, 'input', fieldConfigs, this.importCollection, this.renderConfig),
      generateFieldTypes(formName, 'validation', fieldConfigs, this.importCollection, this.renderConfig),
      primitiveOverrideProp,
      overrideTypeAliasDeclaration,
      factory.createTypeAliasDeclaration(
        undefined,
        [factory.createModifier(SyntaxKind.ExportKeyword)],
        factory.createIdentifier(formPropType),
        undefined,
        factory.createTypeReferenceNode(factory.createIdentifier('React.PropsWithChildren'), [
          factory.createIntersectionTypeNode([
            escapeHatchTypeNode,
            buildFormPropNode(this.component, fieldConfigs, modelName, this.primaryKeys),
            factory.createTypeReferenceNode(
              factory.createQualifiedName(factory.createIdentifier('React'), factory.createIdentifier('CSSProperties')),
              undefined,
            ),
          ]),
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
   *  - datastore operation (conditional if form is backed by datastore)
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
    const lowerCaseDataTypeNameRecord = `${lowerCaseDataTypeName}Record`;
    const isDataStoreUpdateForm = dataSourceType === 'DataStore' && formActionType === 'update';
    const dataApi = 'apiConfiguration' in this.renderConfig ? this.renderConfig.apiConfiguration?.dataApi : undefined;

    let modelName = dataTypeName;
    if (!formMetadata) {
      throw new Error(`Form Metadata is missing from form: ${this.component.name}`);
    }
    this.importCollection.addMappedImport(ImportValue.VALIDATE_FIELD, ImportValue.FETCH_BY_PATH);

    const hasAutoComplete = Object.values(formMetadata.fieldConfigs).some(
      ({ componentType }) => componentType === Primitive.Autocomplete,
    );

    // add model import for datastore type
    if (dataSourceType === 'DataStore') {
      this.requiredDataModels.push(dataTypeName);
      modelName = this.importCollection.addModelImport(dataTypeName);
    }

    const elements: BindingElement[] = [
      // add in hooks for before/complete with ds and basic onSubmit with props
      ...buildMutationBindings(this.component, this.primaryKeys),
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

    // add binding elements to statements
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

    if (hasTokenReference(this.componentMetadata)) {
      statements.push(
        factory.createVariableStatement(
          undefined,
          factory.createVariableDeclarationList(
            [
              factory.createVariableDeclaration(
                factory.createObjectBindingPattern([
                  factory.createBindingElement(undefined, undefined, factory.createIdentifier('tokens'), undefined),
                ]),
                undefined,
                undefined,
                factory.createCallExpression(factory.createIdentifier('useTheme'), undefined, []),
              ),
            ],
            NodeFlags.Const,
          ),
        ),
      );
    }

    statements.push(getInitialValues(formMetadata.fieldConfigs, this.component));

    statements.push(...getUseStateHooks(formMetadata.fieldConfigs, formActionType, dataApi, hasAutoComplete));

    statements.push(...getAutocompleteOptions(formMetadata.fieldConfigs, hasAutoComplete, dataApi));

    statements.push(buildUseStateExpression('errors', factory.createObjectLiteralExpression()));

    let defaultValueVariableName: undefined | string;
    if (formActionType === 'update') {
      if (isDataStoreUpdateForm) {
        defaultValueVariableName = lowerCaseDataTypeNameRecord;
      } else {
        defaultValueVariableName = 'initialData';
      }
    }

    statements.push(resetStateFunction(formMetadata.fieldConfigs, defaultValueVariableName));

    const linkedDataNames: string[] = [];
    if (isDataStoreUpdateForm) {
      statements.push(
        buildUseStateExpression(
          lowerCaseDataTypeNameRecord,
          factory.createIdentifier(getModelNameProp(lowerCaseDataTypeName)),
        ),
      );

      const relatedModelStatements: Statement[] = [];
      // Build effects to grab nested models off target record for relationships
      Object.entries(formMetadata.fieldConfigs).forEach(([key, value]) => {
        if (value.relationship) {
          const fieldName = value.sanitizedFieldName || key;
          if (value.relationship.type === 'HAS_MANY') {
            const linkedDataName = getLinkedDataName(fieldName);
            linkedDataNames.push(linkedDataName);
            statements.push(buildUseStateExpression(linkedDataName, factory.createIdentifier('[]')));
            statements.push(
              buildInitConstVariableExpression(
                getCanUnlinkModelName(fieldName),
                value.relationship.canUnlinkAssociatedModel ? factory.createTrue() : factory.createFalse(),
              ),
            );
          }
          if (value.relationship.type === 'BELONGS_TO' || value.relationship?.type === 'HAS_ONE') {
            linkedDataNames.push(fieldName);
          }
          // Flatten statments into 1d array
          relatedModelStatements.push(
            ...buildGetRelationshipModels(
              fieldName,
              value,
              this.componentMetadata.dataSchemaMetadata,
              this.primaryKeys!,
              this.importCollection,
              dataApi,
              this.renderConfig.dependencies,
            ),
          );
        }
      });

      // primaryKey should exist if DataStore update form. This condition is just for ts
      if (this.primaryKeys) {
        // if there are multiple primaryKeys, it's a composite key and we're using 'id' for a composite key prop
        const primaryKeyPropName =
          this.primaryKeys.length > 1 ? getPropName(COMPOSITE_PRIMARY_KEY_PROP_NAME) : getPropName(this.primaryKeys[0]);
        statements.push(
          addUseEffectWrapper(
            buildUpdateDatastoreQuery(
              modelName,
              lowerCaseDataTypeName,
              relatedModelStatements,
              primaryKeyPropName,
              this.importCollection,
              this.primaryKeys,
              dataApi,
              this.renderConfig.dependencies,
            ),
            [primaryKeyPropName, getModelNameProp(lowerCaseDataTypeName)],
          ),
        );
      }
    }

    if (defaultValueVariableName) {
      statements.push(buildResetValuesOnRecordUpdate(defaultValueVariableName, linkedDataNames));
    }

    this.importCollection.addMappedImport(ImportValue.VALIDATE_FIELD, ImportValue.FETCH_BY_PATH);

    if (dataSourceType === 'Custom' && formActionType === 'update') {
      statements.push(addUseEffectWrapper([buildSetStateFunction(formMetadata.fieldConfigs)], []));
    }

    // Add value state and ref array type fields in ArrayField wrapper

    const relatedModelNames: Map<string, { relatedModelName: string; fieldName: string }> = new Map();

    Object.entries(formMetadata.fieldConfigs).forEach(([field, fieldConfig]) => {
      const { sanitizedFieldName, componentType, dataType, relationship } = fieldConfig;
      const renderedName = sanitizedFieldName || field;
      if (shouldWrapInArrayField(fieldConfig)) {
        if (fieldConfig.relationship) {
          statements.push(
            buildUseStateExpression(
              getCurrentDisplayValueName(renderedName),
              getDefaultValueExpression(formMetadata.name, componentType, dataType, false, true),
            ),
          );
        }

        statements.push(
          buildUseStateExpression(
            getCurrentValueName(renderedName),
            getDefaultValueExpression(formMetadata.name, componentType, dataType),
          ),
          factory.createVariableStatement(
            undefined,
            factory.createVariableDeclarationList(
              [
                factory.createVariableDeclaration(
                  factory.createIdentifier(getArrayChildRefName(renderedName)),
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

      if (relationship && !relatedModelNames.has(relationship.relatedModelName)) {
        relatedModelNames.set(relationship.relatedModelName, {
          relatedModelName: relationship.relatedModelName,
          fieldName: renderedName,
        });
      }
    });

    const { validationsObject, dataTypesMap, displayValueObject, idValueObject, modelsToImport, usesArrayField } =
      mapFromFieldConfigs(formMetadata.fieldConfigs);

    if (idValueObject) {
      statements.push(idValueObject);
    }

    statements.push(...buildSelectedRecordsIdSet(formMetadata.fieldConfigs));

    this.shouldRenderArrayField = usesArrayField;

    modelsToImport.forEach((model) => {
      this.requiredDataModels.push(model);
      this.importCollection.addModelImport(model);
    });

    // relationship query
    /** GraphQL:
     *    const authorRecords = await API.graphql(
     *      { query: listAuthors }
     *    ).data.listAuthors.items;
     */
    /** Datastore:
          const authorRecords = useDataStoreBinding({
            type: 'collection',
            model: Author,
          }).items;
    */
    if (relatedModelNames.size) {
      if (!(this.renderConfig.apiConfiguration?.dataApi === 'GraphQL')) {
        this.importCollection.addMappedImport(ImportValue.USE_DATA_STORE_BINDING);

        statements.push(
          ...[...relatedModelNames].map(([, { relatedModelName, fieldName }]) =>
            buildRelationshipQuery(
              relatedModelName,
              this.importCollection,
              fieldName,
              dataApi,
              this.renderConfig.dependencies,
            ),
          ),
        );
      }
    }

    if (displayValueObject) {
      statements.push(displayValueObject);
    }

    statements.push(validationsObject);
    statements.push(runValidationTasksFunction);

    // timestamp type takes precedence over datetime as it includes formatter for datetime
    // we include both the timestamp conversion and local date formatter
    if (
      dataTypesMap.AWSTimestamp &&
      dataTypesMap.AWSTimestamp.some((fieldName) => {
        const field = formMetadata.fieldConfigs[fieldName];
        if (field && field.studioFormComponentType === 'DateTimeField') {
          return true;
        }
        return false;
      })
    ) {
      statements.push(convertTimeStampToDateAST, convertToLocalAST);
    }
    // if we only have date time then we only need the local conversion
    else if (dataTypesMap.AWSDateTime) {
      statements.push(convertToLocalAST);
    }

    if (hasAutoComplete && dataApi === 'GraphQL') {
      statements.push(
        ...getFetchRelatedRecordsCallbacks(
          formMetadata.fieldConfigs,
          this.importCollection,
          this.renderConfig.apiConfiguration?.dataApi,
          this.renderConfig.dependencies,
        ),
      );
    }

    return statements;
  }

  protected validateSchema(component: StudioForm): void {
    validateFormSchema(component);
  }
}
