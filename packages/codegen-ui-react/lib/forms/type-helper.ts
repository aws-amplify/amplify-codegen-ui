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
import { FieldConfigMetadata, DataFieldDataType } from '@aws-amplify/codegen-ui';
import { factory, SyntaxKind, KeywordTypeSyntaxKind, TypeElement, PropertySignature, TypeNode } from 'typescript';
import { DATA_TYPE_TO_TYPESCRIPT_MAP } from './typescript-type-map';

type Node<T> = {
  [n: string]: T | Node<T>;
};
/**
 * based on the provided dataType (appsync scalar)
 * converst to the correct typescript type
 * default assumption is string type
 *
 * @param dataType
 * @returns
 */
const getSyntaxKindType = (dataType?: DataFieldDataType) => {
  let typescriptType = SyntaxKind.StringKeyword;
  if (dataType && typeof dataType === 'string' && dataType in DATA_TYPE_TO_TYPESCRIPT_MAP) {
    typescriptType = DATA_TYPE_TO_TYPESCRIPT_MAP[dataType];
  }
  return typescriptType;
};

export const getInputValuesTypeName = (formName: string): string => {
  return `${formName}InputValues`;
};

/**
 * given the nested json paths rejoin them into one object
 * where the leafs are the types ex. string | number | boolean
 * src: https://stackoverflow.com/questions/70218560/creating-a-nested-object-from-entries
 *
 * @param nestedPaths
 */
export const generateObjectFromPaths = (
  object: Node<KeywordTypeSyntaxKind>,
  [key, value]: [fieldName: string, dataType?: DataFieldDataType],
) => {
  const keys = key.split('.');
  const last = keys.pop() ?? '';
  // eslint-disable-next-line no-return-assign, no-param-reassign
  keys.reduce((o: any, k: string) => (o[k] ??= {}), object)[last] = getSyntaxKindType(value);
  return object;
};

export const generateTypeNodeFromObject = (obj: Node<KeywordTypeSyntaxKind>): PropertySignature[] => {
  return Object.keys(obj).map<PropertySignature>((key) => {
    const child = obj[key];
    const value: TypeNode =
      typeof child === 'object' && Object.keys(obj[key]).length
        ? factory.createTypeLiteralNode(generateTypeNodeFromObject(child))
        : factory.createTypeReferenceNode(factory.createIdentifier('UseBaseOrValidationType'), [
            factory.createTypeReferenceNode(factory.createIdentifier('useBase'), undefined),
            factory.createKeywordTypeNode(child as KeywordTypeSyntaxKind),
          ]);
    return factory.createPropertySignature(
      undefined,
      factory.createIdentifier(key),
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
 * export declare type MyPostCreateFormInputValues<useBase extends boolean = true> = {
    caption: UseBaseOrValidationType<useBase, string>;
    phoneNumber: UseBaseOrValidationType<useBase, number>;
    username: UseBaseOrValidationType<useBase, string>;
    post_url: UseBaseOrValidationType<useBase, string>;
    profile_url: UseBaseOrValidationType<useBase, string>;
    status: UseBaseOrValidationType<useBase, string>;
    bio: {
        favoriteQuote: UseBaseOrValidationType<useBase, string>;
        favoiteAnimal: {
            genus: UseBaseOrValidationType<useBase, string>;
          }
      };
 *  };
 *
 *
 * @param formName
 * @param fieldConfigs
 * @returns
 */
export const generateInputTypes = (formName: string, fieldConfigs: Record<string, FieldConfigMetadata>) => {
  const nestedPaths: [fieldName: string, dataType?: DataFieldDataType][] = [];
  const typeNodes: TypeElement[] = [];
  Object.entries(fieldConfigs).forEach(([fieldName, { dataType }]) => {
    const hasNestedFieldPath = fieldName.split('.').length > 1;
    if (hasNestedFieldPath) {
      nestedPaths.push([fieldName, dataType]);
    } else {
      typeNodes.push(
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier(fieldName),
          factory.createToken(SyntaxKind.QuestionToken),
          factory.createTypeReferenceNode(factory.createIdentifier('UseBaseOrValidationType'), [
            factory.createTypeReferenceNode(factory.createIdentifier('useBase'), undefined),
            factory.createKeywordTypeNode(getSyntaxKindType(dataType)),
          ]),
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
    factory.createIdentifier(getInputValuesTypeName(formName)),
    [
      factory.createTypeParameterDeclaration(
        factory.createIdentifier('useBase'),
        factory.createKeywordTypeNode(SyntaxKind.BooleanKeyword),
        factory.createLiteralTypeNode(factory.createTrue()),
      ),
    ],
    factory.createTypeLiteralNode(typeNodes),
  );
};

/**
 * used to validate if value should be using the base type or ValdiationFunction using base type
 *
 * export declare type UseBaseOrValidationType<Flag, T> = Flag extends true ? T : ValidationFunction<T>;
 */
export const baseValidationConditionalType = factory.createTypeAliasDeclaration(
  undefined,
  [factory.createModifier(SyntaxKind.ExportKeyword), factory.createModifier(SyntaxKind.DeclareKeyword)],
  factory.createIdentifier('UseBaseOrValidationType'),
  [
    factory.createTypeParameterDeclaration(factory.createIdentifier('Flag'), undefined, undefined),
    factory.createTypeParameterDeclaration(factory.createIdentifier('T'), undefined, undefined),
  ],
  factory.createConditionalTypeNode(
    factory.createTypeReferenceNode(factory.createIdentifier('Flag'), undefined),
    factory.createLiteralTypeNode(factory.createTrue()),
    factory.createTypeReferenceNode(factory.createIdentifier('T'), undefined),
    factory.createTypeReferenceNode(factory.createIdentifier('ValidationFunction'), [
      factory.createTypeReferenceNode(factory.createIdentifier('T'), undefined),
    ]),
  ),
);

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
 * onValidate?: {formTypeName}
 *
 * @param formName
 * @returns
 */
export const buildOnValidateType = (formName: string) => {
  return factory.createPropertySignature(
    undefined,
    factory.createIdentifier('onValidate'),
    factory.createToken(SyntaxKind.QuestionToken),
    factory.createTypeReferenceNode(factory.createIdentifier(getInputValuesTypeName(formName)), [
      factory.createLiteralTypeNode(factory.createFalse()),
    ]),
  );
};

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
