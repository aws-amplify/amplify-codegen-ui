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
}

export type BaseValidation = {
  validationMessage: string;
};

export type StringValidationType = {
  type: ValidationTypes.CONTAINS | ValidationTypes.NOT_CONTAINS | ValidationTypes.END_WITH | ValidationTypes.START_WITH;
  values: string[];
} & BaseValidation;

export type StringLengthValidationType = {
  type: ValidationTypes.LESS_THAN_CHAR_LENGTH | ValidationTypes.GREATER_THAN_CHAR_LENGTH;
  values: number;
} & BaseValidation;

export type NumberValidationType = {
  type: ValidationTypes.LESS_THAN_NUM | ValidationTypes.GREATER_THAN_NUM | ValidationTypes.EQUAL_TO_NUM;
  values: number[] | number;
} & BaseValidation;

export type DateValidationType = {
  type: ValidationTypes.BE_BEFORE | ValidationTypes.BE_AFTER;
  values: string;
} & BaseValidation;

export type RequiredValidtionType = {
  type: ValidationTypes.REQUIRED;
} & BaseValidation;

export type FieldValidationConfiguration =
  | StringValidationType
  | StringLengthValidationType
  | NumberValidationType
  | DateValidationType
  | RequiredValidtionType;

export type ValidationResponse = { hasError: boolean; errorMessage: string };
