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
  FieldConfigMetadata,
  DataFieldDataType,
  StudioForm,
  StudioComponent,
  FormDefinition,
  isValidVariableName,
  shouldIncludeCancel,
  InternalError,
} from '@aws-amplify/codegen-ui';
import {
  factory,
  SyntaxKind,
  KeywordTypeSyntaxKind,
  TypeElement,
  PropertySignature,
  TypeNode,
  Identifier,
  StringLiteral,
  TypeReferenceNode,
  KeywordTypeNode,
} from 'typescript';
import { lowerCaseFirst } from '../../helpers';
import { DATA_TYPE_TO_TYPESCRIPT_MAP, FIELD_TYPE_TO_TYPESCRIPT_MAP } from './typescript-type-map';
import { ImportCollection, ImportSource } from '../../imports';
import { PRIMITIVE_OVERRIDE_PROPS } from '../../primitive';
import { COMPOSITE_PRIMARY_KEY_PROP_NAME } from '../../utils/constants';
import { ReactRenderConfig } from '../../react-render-config';
import { isGraphqlConfig } from '../../utils/graphql';

type Node<T> = {
  [n: string]: T | Node<T>;
};

type GetTypeNodeParam = {
  componentType: string;
  dataType?: DataFieldDataType;
  isArray: boolean;
  isValidation: boolean;
  importCollection?: ImportCollection;
  renderConfig?: ReactRenderConfig;
};
/**
 * based on the provided dataType (appsync scalar)
 * converts to the correct typescript type
 * default assumption is string type
 */
const getTypeNode = ({
  componentType,
  dataType,
  isArray,
  isValidation,
  importCollection,
  renderConfig,
}: GetTypeNodeParam) => {
  let typeNode: KeywordTypeNode | TypeReferenceNode = factory.createKeywordTypeNode(SyntaxKind.StringKeyword);

  if (componentType in FIELD_TYPE_TO_TYPESCRIPT_MAP) {
    typeNode = factory.createKeywordTypeNode(FIELD_TYPE_TO_TYPESCRIPT_MAP[componentType]);
  }

  if (dataType && typeof dataType === 'string' && dataType in DATA_TYPE_TO_TYPESCRIPT_MAP) {
    typeNode = factory.createKeywordTypeNode(DATA_TYPE_TO_TYPESCRIPT_MAP[dataType]);
  }

  if (dataType && typeof dataType === 'object' && 'model' in dataType) {
    const modelName = dataType.model;
    const aliasedModel = importCollection?.addModelImport(modelName);
    let identifier = aliasedModel || modelName;
    if (isGraphqlConfig(renderConfig?.apiConfiguration) && !renderConfig?.apiConfiguration.typesFilePath) {
      identifier = 'any';
    }
    typeNode = factory.createTypeReferenceNode(factory.createIdentifier(identifier));
  }

  if (isValidation) {
    return factory.createTypeReferenceNode(factory.createIdentifier('ValidationFunction'), [typeNode]);
  }

  if (isArray) {
    return factory.createArrayTypeNode(typeNode);
  }
  return typeNode;
};

export const getInputValuesTypeName = (formName: string): string => {
  return `${formName}InputValues`;
};

export const getValidationTypeName = (formName: string): string => {
  return `${formName}ValidationValues`;
};

/**
 * given the nested json paths rejoin them into one object
 * where the leafs are the types ex. string | number | boolean
 * src: https://stackoverflow.com/questions/70218560/creating-a-nested-object-from-entries
 *
 * @param object
 * @param [key, value] entry/tuple object shape created from key and value is set at the leaf
 */
export const generateObjectFromPaths = (
  object: Node<KeywordTypeSyntaxKind>,
  [key, value]: [fieldName: string, getTypeNodeParam: GetTypeNodeParam],
) => {
  const keys = key.split('.');
  const last = keys.pop() ?? '';
  // eslint-disable-next-line no-return-assign, no-param-reassign
  keys.reduce((o: any, k: string) => (o[k] ??= {}), object)[last] = getTypeNode(value);
  return object;
};

export const generateTypeNodeFromObject = (obj: Node<KeywordTypeSyntaxKind>): PropertySignature[] => {
  return Object.keys(obj).map<PropertySignature>((key) => {
    const child = obj[key];
    const value: TypeNode =
      typeof child === 'object' && Object.getPrototypeOf(child) === Object.prototype
        ? factory.createTypeLiteralNode(generateTypeNodeFromObject(child))
        : (child as unknown as TypeNode);
    const propertyName = !isValidVariableName(key) ? factory.createStringLiteral(key) : factory.createIdentifier(key);
    return factory.createPropertySignature(
      undefined,
      propertyName,
      factory.createToken(SyntaxKind.QuestionToken),
      value,
    );
  });
};

/**
 * this generates the input types for onSubmit, onSuccess, onChange, and onValidate
 * onValidate is the one case where it passes true to get the ValidationType
 * instead of the base type
 * 
 * validation type is selected 
 * export declare type NestedJsonValidationValues = {
    "first-Name"?: ValidationFunction<string>;
    lastName?: ValidationFunction<string>;
    Nicknames1?: ValidationFunction<string>;
    "nick-names2"?: ValidationFunction<string>;
    "first Name"?: ValidationFunction<string>;
    bio?: {
        "favorite Quote"?: ValidationFunction<string>;
        "favorite-Animal"?: ValidationFunction<string>;
    };
 * };
 * if its regular validation then it will be using the main types of the object array types are allowed in this case
 *
 * @param formName
 * @param {('input' | 'validation')}
 * @param fieldConfigs
 * @returns
 */
export const generateFieldTypes = (
  formName: string,
  type: 'input' | 'validation',
  fieldConfigs: Record<string, FieldConfigMetadata>,
  importCollection?: ImportCollection,
  renderConfig?: ReactRenderConfig,
) => {
  const nestedPaths: [fieldName: string, getTypeNodeParam: GetTypeNodeParam][] = [];
  const typeNodes: TypeElement[] = [];
  const isValidation = type === 'validation';
  const typeName = isValidation ? getValidationTypeName(formName) : getInputValuesTypeName(formName);
  Object.entries(fieldConfigs).forEach(([fieldName, { dataType, componentType, isArray }]) => {
    const getTypeNodeParam = {
      dataType,
      componentType,
      isArray: !!isArray,
      isValidation,
      importCollection,
      renderConfig,
    };
    const hasNestedFieldPath = fieldName.split('.').length > 1;
    if (hasNestedFieldPath) {
      nestedPaths.push([fieldName, getTypeNodeParam]);
    } else {
      const propertyName = !isValidVariableName(fieldName)
        ? factory.createStringLiteral(fieldName)
        : factory.createIdentifier(fieldName);
      typeNodes.push(
        factory.createPropertySignature(
          undefined,
          propertyName,
          factory.createToken(SyntaxKind.QuestionToken),
          getTypeNode(getTypeNodeParam),
        ),
      );
    }
  });

  if (nestedPaths.length) {
    const nestedObj = nestedPaths.reduce(generateObjectFromPaths, {});
    const nestedTypeNodes = generateTypeNodeFromObject(nestedObj);
    typeNodes.push(...nestedTypeNodes);
  }
  return factory.createTypeAliasDeclaration(
    undefined,
    [factory.createModifier(SyntaxKind.ExportKeyword), factory.createModifier(SyntaxKind.DeclareKeyword)],
    factory.createIdentifier(typeName),
    undefined,
    factory.createTypeLiteralNode(typeNodes),
  );
};

/**
 * export declare type ValidationResponse = {
 *  hasError: boolean;
 *  errorMessage?: string;
 * };
 */
export const validationResponseType = factory.createTypeAliasDeclaration(
  undefined,
  [factory.createModifier(SyntaxKind.ExportKeyword), factory.createModifier(SyntaxKind.DeclareKeyword)],
  factory.createIdentifier('ValidationResponse'),
  undefined,
  factory.createTypeLiteralNode([
    factory.createPropertySignature(
      undefined,
      factory.createIdentifier('hasError'),
      undefined,
      factory.createKeywordTypeNode(SyntaxKind.BooleanKeyword),
    ),
    factory.createPropertySignature(
      undefined,
      factory.createIdentifier('errorMessage'),
      factory.createToken(SyntaxKind.QuestionToken),
      factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
    ),
  ]),
);

/**
 * export declare type ValidationFunction<T> =
 *  (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
 */
export const validationFunctionType = factory.createTypeAliasDeclaration(
  undefined,
  [factory.createModifier(SyntaxKind.ExportKeyword), factory.createModifier(SyntaxKind.DeclareKeyword)],
  factory.createIdentifier('ValidationFunction'),
  [factory.createTypeParameterDeclaration(factory.createIdentifier('T'), undefined, undefined)],
  factory.createFunctionTypeNode(
    undefined,
    [
      factory.createParameterDeclaration(
        undefined,
        undefined,
        undefined,
        factory.createIdentifier('value'),
        undefined,
        factory.createTypeReferenceNode(factory.createIdentifier('T'), undefined),
        undefined,
      ),
      factory.createParameterDeclaration(
        undefined,
        undefined,
        undefined,
        factory.createIdentifier('validationResponse'),
        undefined,
        factory.createTypeReferenceNode(factory.createIdentifier('ValidationResponse'), undefined),
        undefined,
      ),
    ],
    factory.createUnionTypeNode([
      factory.createTypeReferenceNode(factory.createIdentifier('ValidationResponse'), undefined),
      factory.createTypeReferenceNode(factory.createIdentifier('Promise'), [
        factory.createTypeReferenceNode(factory.createIdentifier('ValidationResponse'), undefined),
      ]),
    ]),
  ),
);

/*
    both datastore & custom datasource has onSubmit with the fields
    - onSubmit(fields)
    datastore includes additional hooks
    - onSuccess(fields)
    - onError(fields, errorMessage)
   */
export const buildFormPropNode = (
  form: StudioForm,
  fieldConfigs: Record<string, FieldConfigMetadata>,
  modelName?: string,
  primaryKeys: string[] = [],
) => {
  const {
    name: formName,
    dataType: { dataSourceType, dataTypeName },
    formActionType,
  } = form;
  const propSignatures: PropertySignature[] = [];
  if (dataSourceType === 'DataStore') {
    if (formActionType === 'update') {
      if (primaryKeys.length >= 1) {
        propSignatures.push(createPrimaryKeysTypeProp(primaryKeys, fieldConfigs));
      }
      propSignatures.push(
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier(lowerCaseFirst(dataTypeName)),
          factory.createToken(SyntaxKind.QuestionToken),
          factory.createTypeReferenceNode(factory.createIdentifier(modelName ?? dataTypeName), undefined),
        ),
      );
    }
    if (formActionType === 'create') {
      propSignatures.push(
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('clearOnSuccess'),
          factory.createToken(SyntaxKind.QuestionToken),
          factory.createKeywordTypeNode(SyntaxKind.BooleanKeyword),
        ),
      );
    }

    propSignatures.push(
      factory.createPropertySignature(
        undefined,
        'onSubmit',
        factory.createToken(SyntaxKind.QuestionToken),
        factory.createFunctionTypeNode(
          undefined,
          [
            factory.createParameterDeclaration(
              undefined,
              undefined,
              undefined,
              'fields',
              undefined,
              factory.createTypeReferenceNode(factory.createIdentifier(getInputValuesTypeName(formName)), undefined),
              undefined,
            ),
          ],
          factory.createTypeReferenceNode(factory.createIdentifier(getInputValuesTypeName(formName)), undefined),
        ),
      ),
      factory.createPropertySignature(
        undefined,
        'onSuccess',
        factory.createToken(SyntaxKind.QuestionToken),
        factory.createFunctionTypeNode(
          undefined,
          [
            factory.createParameterDeclaration(
              undefined,
              undefined,
              undefined,
              factory.createIdentifier('fields'),
              undefined,
              factory.createTypeReferenceNode(factory.createIdentifier(getInputValuesTypeName(formName)), undefined),
              undefined,
            ),
          ],
          factory.createKeywordTypeNode(SyntaxKind.VoidKeyword),
        ),
      ),
      factory.createPropertySignature(
        undefined,
        factory.createIdentifier('onError'),
        factory.createToken(SyntaxKind.QuestionToken),
        factory.createFunctionTypeNode(
          undefined,
          [
            factory.createParameterDeclaration(
              undefined,
              undefined,
              undefined,
              factory.createIdentifier('fields'),
              undefined,
              factory.createTypeReferenceNode(factory.createIdentifier(getInputValuesTypeName(formName)), undefined),
              undefined,
            ),
            factory.createParameterDeclaration(
              undefined,
              undefined,
              undefined,
              factory.createIdentifier('errorMessage'),
              undefined,
              factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
              undefined,
            ),
          ],
          factory.createKeywordTypeNode(SyntaxKind.VoidKeyword),
        ),
      ),
    );
  }
  if (dataSourceType === 'Custom') {
    if (formActionType === 'update') {
      propSignatures.push(
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('initialData'),
          factory.createToken(SyntaxKind.QuestionToken),
          factory.createTypeReferenceNode(getInputValuesTypeName(formName), undefined),
        ),
      );
    }
    propSignatures.push(
      factory.createPropertySignature(
        undefined,
        'onSubmit',
        undefined,
        factory.createFunctionTypeNode(
          undefined,
          [
            factory.createParameterDeclaration(
              undefined,
              undefined,
              undefined,
              'fields',
              undefined,
              factory.createTypeReferenceNode(factory.createIdentifier(getInputValuesTypeName(formName)), undefined),
              undefined,
            ),
          ],
          factory.createKeywordTypeNode(SyntaxKind.VoidKeyword),
        ),
      ),
    );
  }
  if (shouldIncludeCancel(form)) {
    propSignatures.push(
      // onCancel?: () => void
      factory.createPropertySignature(
        undefined,
        'onCancel',
        factory.createToken(SyntaxKind.QuestionToken),
        factory.createFunctionTypeNode(undefined, [], factory.createKeywordTypeNode(SyntaxKind.VoidKeyword)),
      ),
    );
  }
  propSignatures.push(
    // onChange?: (fields: Record<string, unknown>) => Record<string, unknown>
    factory.createPropertySignature(
      undefined,
      'onChange',
      factory.createToken(SyntaxKind.QuestionToken),
      factory.createFunctionTypeNode(
        undefined,
        [
          factory.createParameterDeclaration(
            undefined,
            undefined,
            undefined,
            factory.createIdentifier('fields'),
            undefined,
            factory.createTypeReferenceNode(factory.createIdentifier(getInputValuesTypeName(formName)), undefined),
            undefined,
          ),
        ],
        factory.createTypeReferenceNode(factory.createIdentifier(getInputValuesTypeName(formName)), undefined),
      ),
    ),
    // onValidate?: {formName}ValidationValues
    factory.createPropertySignature(
      undefined,
      factory.createIdentifier('onValidate'),
      factory.createToken(SyntaxKind.QuestionToken),
      factory.createTypeReferenceNode(factory.createIdentifier(getValidationTypeName(formName)), undefined),
    ),
  );
  return factory.createTypeLiteralNode(propSignatures);
};

export const buildOverrideTypesBindings = (
  formComponent: StudioComponent,
  formDefinition: FormDefinition,
  importCollection: ImportCollection,
) => {
  importCollection.addImport(ImportSource.UI_REACT, 'GridProps');

  const typeNodes = [
    factory.createPropertySignature(
      undefined,
      factory.createIdentifier(`${formComponent.name}Grid`),
      factory.createToken(SyntaxKind.QuestionToken),
      factory.createTypeReferenceNode(factory.createIdentifier(PRIMITIVE_OVERRIDE_PROPS), [
        factory.createTypeReferenceNode(factory.createIdentifier('GridProps'), undefined),
      ]),
    ),
  ];

  formDefinition.elementMatrix.forEach((row, index) => {
    if (row.length > 1) {
      typeNodes.push(
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier(`RowGrid${index}`),
          factory.createToken(SyntaxKind.QuestionToken),
          factory.createTypeReferenceNode(factory.createIdentifier(PRIMITIVE_OVERRIDE_PROPS), [
            factory.createTypeReferenceNode(factory.createIdentifier('GridProps'), undefined),
          ]),
        ),
      );
    }
    row.forEach((field) => {
      let propKey: Identifier | StringLiteral = factory.createIdentifier(field);
      if (field.split('.').length > 1 || !isValidVariableName(field)) {
        propKey = factory.createStringLiteral(field);
      }
      let componentTypePropName = `${formDefinition.elements[field].componentType}Props`;
      if (formDefinition.elements[field].componentType === 'StorageField') {
        componentTypePropName = 'StorageManagerProps';
        importCollection.addImport(ImportSource.REACT_STORAGE, componentTypePropName);
      } else {
        importCollection.addImport(ImportSource.UI_REACT, componentTypePropName);
      }
      typeNodes.push(
        factory.createPropertySignature(
          undefined,
          propKey,
          factory.createToken(SyntaxKind.QuestionToken),
          factory.createTypeReferenceNode(factory.createIdentifier(PRIMITIVE_OVERRIDE_PROPS), [
            factory.createTypeReferenceNode(factory.createIdentifier(componentTypePropName), undefined),
          ]),
        ),
      );
    });
  });

  return factory.createTypeAliasDeclaration(
    undefined,
    [factory.createModifier(SyntaxKind.ExportKeyword), factory.createModifier(SyntaxKind.DeclareKeyword)],
    factory.createIdentifier(`${formComponent.name}OverridesProps`),
    undefined,
    factory.createIntersectionTypeNode([
      factory.createTypeLiteralNode(typeNodes),
      factory.createTypeReferenceNode(factory.createIdentifier('EscapeHatchProps'), undefined),
    ]),
  );
};

const createPrimaryKeysTypeProp = (
  primaryKeys: string[],
  fieldConfigs: Record<string, FieldConfigMetadata>,
): PropertySignature => {
  // first element is the property name
  if (primaryKeys.length === 1) {
    return factory.createPropertySignature(
      undefined,
      factory.createIdentifier(primaryKeys[0]),
      factory.createToken(SyntaxKind.QuestionToken),
      factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
    );
  }

  if (primaryKeys.length <= 0) {
    throw new InternalError('primaryKeys must not be empty');
  }
  // creates the type literal for a composite key
  const compositeKeyTypeLiteral = primaryKeys.map((primaryKey: string) => {
    let keywordType = SyntaxKind.StringKeyword;
    const element = fieldConfigs[primaryKey];
    if (element) {
      const { dataType } = element;
      // non-scalar & boolean are not supported for primary keys that leaves number and string
      const stringDataType = typeof dataType === 'string' ? dataType : 'String';
      keywordType = DATA_TYPE_TO_TYPESCRIPT_MAP[stringDataType] ?? SyntaxKind.StringKeyword;
    }

    return factory.createPropertySignature(
      undefined,
      factory.createIdentifier(primaryKey),
      undefined,
      factory.createKeywordTypeNode(keywordType),
    );
  });
  return factory.createPropertySignature(
    undefined,
    factory.createIdentifier(COMPOSITE_PRIMARY_KEY_PROP_NAME),
    factory.createToken(SyntaxKind.QuestionToken),
    factory.createTypeLiteralNode(compositeKeyTypeLiteral),
  );
};
