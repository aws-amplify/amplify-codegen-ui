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
const studioComponentChildSchema: any = yup.object({
  componentType: alphaNumNoLeadingNumberString().required(),
  // TODO: Name is required in the studio-types file, but doesn't seem to need to be. Relaxing the restriction here.
  name: yup.string(),
  properties: yup.object().required(),
  // Doing lazy eval here since we reference our own type otherwise
  children: yup.lazy(() => yup.array(studioComponentChildSchema.default(undefined))),
  figmaMetadata: yup.object(),
  variants: yup.array(),
  overrides: yup.object(),
  bindingProperties: yup.object(),
  collectionProperties: yup.object(),
  actions: yup.object(),
});

const studioComponentSchema = yup.object({
  name: alphaNumString(),
  id: yup.string(),
  sourceId: yup.string(),
  componentType: alphaNumNoLeadingNumberString().required(),
  properties: yup.object().required(),
  children: yup.array(studioComponentChildSchema),
  figmaMetadata: yup.object(),
  variants: yup.array(),
  overrides: yup.object(),
  bindingProperties: yup.object(),
  collectionProperties: yup.object(),
  actions: yup.object(),
});

/**
 * Theme Schema Definitions
 */
const studioThemeValuesSchema: any = yup.object({
  key: yup.string().required(),
  value: yup
    .object({
      value: yup.string(),
      children: yup.lazy(() => yup.array(studioThemeValuesSchema.default(undefined))),
    })
    .required(),
});

const studioThemeSchema = yup.object({
  name: alphaNumString().required(),
  id: yup.string(),
  values: yup.array(studioThemeValuesSchema).required(),
  overrides: yup.array(studioThemeValuesSchema),
});

/**
 * Studio Schema Validation Functions and Helpers.
 */
const validateSchema = (validator: yup.AnySchema, studioSchema: any) => {
  try {
    validator.validateSync(studioSchema, { strict: true, abortEarly: false });
  } catch (e) {
    if (e instanceof yup.ValidationError) {
      throw new InvalidInputError(e.errors.join(', '));
    }
    throw e;
  }
};

export const validateComponentSchema = (schema: any) => validateSchema(studioComponentSchema, schema);
export const validateThemeSchema = (schema: any) => validateSchema(studioThemeSchema, schema);
