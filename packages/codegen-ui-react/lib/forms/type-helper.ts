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
import { FieldConfigMetadata, DataFieldDataType, StudioForm, isValidVariableName } from '@aws-amplify/codegen-ui';
import { factory, SyntaxKind, KeywordTypeSyntaxKind, TypeElement, PropertySignature, TypeNode } from 'typescript';
import { lowerCaseFirst } from '../helpers';
import { DATA_TYPE_TO_TYPESCRIPT_MAP, FIELD_TYPE_TO_TYPESCRIPT_MAP } from './typescript-type-map';

type Node<T> = {
  [n: string]: T | Node<T>;
};

type GetTypeNodeParam = {
  componentType: string;
  dataType?: DataFieldDataType;
  isArray: boolean;
  isValidation: boolean;
};
/**
 * based on the provided dataType (appsync scalar)
 * converst to the correct typescript type
 * default assumption is string type
 */
const getTypeNode = ({ componentType, dataType, isArray, isValidation }: GetTypeNodeParam) => {
  let typescriptType: KeywordTypeSyntaxKind = SyntaxKind.StringKeyword;
  if (componentType in FIELD_TYPE_TO_TYPESCRIPT_MAP) {
    typescriptType = FIELD_TYPE_TO_TYPESCRIPT_MAP[componentType];
  }

  if (dataType && typeof dataType === 'string' && dataType in DATA_TYPE_TO_TYPESCRIPT_MAP) {
    typescriptType = DATA_TYPE_TO_TYPESCRIPT_MAP[dataType];
  }

  // e.g. string
  const typeNode = factory.createKeywordTypeNode(typescriptType);

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
) => {
  const nestedPaths: [fieldName: string, getTypeNodeParam: GetTypeNodeParam][] = [];
  const typeNodes: TypeElement[] = [];
  const isValidation = type === 'validation';
  const typeName = isValidation ? getValidationTypeName(formName) : getInputValuesTypeName(formName);
  Object.entries(fieldConfigs).forEach(([fieldName, { dataType, componentType, isArray }]) => {
    const getTypeNodeParam = { dataType, componentType, isArray: !!isArray, isValidation };
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
 * export declare type ValidationResponse = {
 *  hasError: boolean;
 *  errorMessage?: string;
 * };
 */
export const formOverrideProp = factory.createTypeAliasDeclaration(
  undefined,
  [factory.createModifier(SyntaxKind.ExportKeyword), factory.createModifier(SyntaxKind.DeclareKeyword)],
  factory.createIdentifier('FormProps'),
  [factory.createTypeParameterDeclaration(factory.createIdentifier('T'), undefined, undefined)],
  factory.createIntersectionTypeNode([
    factory.createTypeReferenceNode(factory.createIdentifier('Partial'), [
      factory.createTypeReferenceNode(factory.createIdentifier('T'), undefined),
    ]),
    factory.createTypeReferenceNode(
      factory.createQualifiedName(factory.createIdentifier('React'), factory.createIdentifier('DOMAttributes')),
      [factory.createTypeReferenceNode(factory.createIdentifier('HTMLDivElement'), undefined)],
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
export const buildFormPropNode = (form: StudioForm) => {
  const {
    name: formName,
    dataType: { dataSourceType, dataTypeName },
    formActionType,
  } = form;
  const propSignatures: PropertySignature[] = [];
  if (dataSourceType === 'DataStore') {
    if (formActionType === 'update') {
      propSignatures.push(
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier('id'),
          factory.createToken(SyntaxKind.QuestionToken),
          factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
        ),
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier(lowerCaseFirst(dataTypeName)),
          factory.createToken(SyntaxKind.QuestionToken),
          factory.createTypeReferenceNode(factory.createIdentifier(dataTypeName), undefined),
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
  propSignatures.push(
    // onCancel?: () => void
    factory.createPropertySignature(
      undefined,
      'onCancel',
      factory.createToken(SyntaxKind.QuestionToken),
      factory.createFunctionTypeNode(undefined, [], factory.createKeywordTypeNode(SyntaxKind.VoidKeyword)),
    ),
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
