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
export enum ValidationTypes {
  REQUIRED = 'Required',
  START_WITH = 'StartWith',
  END_WITH = 'EndWith',
  CONTAINS = 'Contains',
  NOT_CONTAINS = 'NotContains',
  LESS_THAN_CHAR_LENGTH = 'LessThanChar',
  GREATER_THAN_CHAR_LENGTH = 'GreaterThanChar',
  LESS_THAN_NUM = 'LessThanNum',
  GREATER_THAN_NUM = 'GreaterThanNum',
  EQUAL_TO_NUM = 'EqualTo',
  BE_BEFORE = 'BeBefore',
  BE_AFTER = 'BeAfter',
  EMAIL = 'Email',
  JSON = 'JSON',
  IP_ADDRESS = 'IpAddress',
  URL = 'URL',
}

export const ValidationTypeMapping: Record<'StringType' | 'NumberType', ValidationTypes[]> = {
  StringType: [
    ValidationTypes.CONTAINS,
    ValidationTypes.NOT_CONTAINS,
    ValidationTypes.END_WITH,
    ValidationTypes.START_WITH,
    ValidationTypes.BE_BEFORE,
    ValidationTypes.BE_AFTER,
  ],
  NumberType: [
    ValidationTypes.LESS_THAN_CHAR_LENGTH,
    ValidationTypes.GREATER_THAN_CHAR_LENGTH,
    ValidationTypes.LESS_THAN_NUM,
    ValidationTypes.GREATER_THAN_NUM,
    ValidationTypes.EQUAL_TO_NUM,
  ],
};

export const IsStringTypeValidator = (validator: ValidationTypes): boolean => {
  return ValidationTypeMapping.StringType.includes(validator);
};

export const IsNumberTypeValidator = (validator: ValidationTypes): boolean => {
  return ValidationTypeMapping.NumberType.includes(validator);
};

export type BaseValidation = {
  validationMessage?: string;
};

export type StringValidationType = {
  type: ValidationTypes.CONTAINS | ValidationTypes.NOT_CONTAINS | ValidationTypes.END_WITH | ValidationTypes.START_WITH;
  strValues: string[];
} & BaseValidation;

export type DateValidationType = {
  type: ValidationTypes.BE_BEFORE | ValidationTypes.BE_AFTER;
  strValues: string[];
} & BaseValidation;

export type StringLengthValidationType = {
  type: ValidationTypes.LESS_THAN_CHAR_LENGTH | ValidationTypes.GREATER_THAN_CHAR_LENGTH;
  numValues: number[];
} & BaseValidation;

export type NumberValidationType = {
  type: ValidationTypes.LESS_THAN_NUM | ValidationTypes.GREATER_THAN_NUM | ValidationTypes.EQUAL_TO_NUM;
  numValues: number[];
} & BaseValidation;

export type GenericValidationType = {
  type:
    | ValidationTypes.REQUIRED
    | ValidationTypes.EMAIL
    | ValidationTypes.JSON
    | ValidationTypes.IP_ADDRESS
    | ValidationTypes.URL;
} & BaseValidation;

export type FieldValidationConfiguration =
  | StringValidationType
  | DateValidationType
  | StringLengthValidationType
  | NumberValidationType
  | GenericValidationType;

export type ValidationResponse = { hasError: boolean; errorMessage?: string };
