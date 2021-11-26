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
import * as yup from 'yup';
import { InvalidInputError } from './errors';

const alphaNumString = () => {
  return yup.string().matches(/^[a-zA-Z0-9]*$/, { message: 'Expected an alphanumeric string' });
};

const alphaNumNoLeadingNumberString = () => {
  return yup
    .string()
    .matches(/^[a-zA-Z][a-zA-Z0-9]*$/, { message: 'Expected an alphanumeric string, starting with a character' });
};

/**
 * Component Schema Definitions
 */
const frontendManagerComponentChildSchema: any = yup.object({
  componentType: alphaNumNoLeadingNumberString().required(),
  // TODO: Name is required in the types file, but doesn't seem to need to be. Relaxing the restriction here.
  name: yup.string().nullable(),
  properties: yup.object().required(),
  // Doing lazy eval here since we reference our own type otherwise
  children: yup.lazy(() => yup.array(frontendManagerComponentChildSchema.default(undefined))),
  figmaMetadata: yup.object().nullable(),
  variants: yup.array().nullable(),
  overrides: yup.object().nullable(),
  bindingProperties: yup.object().nullable(),
  collectionProperties: yup.object().nullable(),
  actions: yup.object().nullable(),
});

const frontendManagerComponentSchema = yup.object({
  name: alphaNumString().nullable(),
  id: yup.string().nullable(),
  sourceId: yup.string().nullable(),
  componentType: alphaNumNoLeadingNumberString().required(),
  properties: yup.object().required(),
  children: yup.array(frontendManagerComponentChildSchema).nullable(),
  figmaMetadata: yup.object().nullable(),
  variants: yup.array().nullable(),
  overrides: yup.object().nullable(),
  bindingProperties: yup.object().nullable(),
  collectionProperties: yup.object().nullable(),
  actions: yup.object().nullable(),
});

/**
 * Theme Schema Definitions
 */
const frontendManagerThemeValuesSchema: any = yup.object({
  key: yup.string().required(),
  value: yup
    .object({
      value: yup.string(),
      children: yup.lazy(() => yup.array(frontendManagerThemeValuesSchema.default(undefined))),
    })
    .required(),
});

const frontendManagerThemeSchema = yup.object({
  name: alphaNumString().required(),
  id: yup.string().nullable(),
  values: yup.array(frontendManagerThemeValuesSchema).required(),
  overrides: yup.array(frontendManagerThemeValuesSchema).nullable(),
});

/**
 * FrontendManager Schema Validation Functions and Helpers.
 */
const validateSchema = (validator: yup.AnySchema, frontendManagerSchema: any) => {
  try {
    validator.validateSync(frontendManagerSchema, { strict: true, abortEarly: false });
  } catch (e) {
    if (e instanceof yup.ValidationError) {
      throw new InvalidInputError(e.errors.join(', '));
    }
    throw e;
  }
};

export const validateComponentSchema = (schema: any) => validateSchema(frontendManagerComponentSchema, schema);
export const validateThemeSchema = (schema: any) => validateSchema(frontendManagerThemeSchema, schema);
