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
import { StudioGenericEvent, StudioSchema } from './types';

const alphaNumString = () => {
  return yup.string().matches(/^[a-zA-Z0-9]*$/, { message: 'Expected an alphanumeric string' });
};

const pascalCaseAlphaNumString = () => {
  return yup
    .string()
    .matches(/^[A-Z][a-zA-Z0-9]*$/, { message: 'Expected an alphanumeric string with capital first letter' });
};

const alphaNumNoLeadingNumberString = () => {
  return yup
    .string()
    .matches(/^[a-zA-Z][a-zA-Z0-9]*$/, { message: 'Expected an alphanumeric string, starting with a character' });
};

const propertiesSchema = (value: Object) => {
  return yup.object().shape(
    Object.fromEntries(
      Object.keys(value || {}).map((key) => [
        key,
        yup
          .object()
          .test('property', 'property cannot be empty.', (property: Object) => Object.keys(property).length > 0)
          .required(),
      ]),
    ),
  );
};

const eventsSchema = yup
  .object(
    Object.fromEntries(
      Object.keys(StudioGenericEvent)
        .filter((eventType) => Number.isNaN(Number(eventType)))
        .map((eventType) => [eventType, yup.object().nullable()]),
    ),
  )
  .noUnknown();

const schemaVersionSchema = () => {
  const versionNumberRegex = /^(\d+)\.(\d+)$/;
  const supportedMajorVersion = '1';
  const supportedMinorVersion = '0';
  return (
    yup
      .string()
      // eslint-disable-next-line no-template-curly-in-string
      .test('schemaVersion', 'unsupported schemaVersion ${originalValue}', (value: string | undefined) => {
        if (value === undefined) {
          return true;
        }
        const match = value.match(versionNumberRegex);
        if (match === null) {
          return false;
        }
        const [, majorVersion, minorVersion] = match;
        if (majorVersion !== supportedMajorVersion || minorVersion > supportedMinorVersion) {
          return false;
        }
        return true;
      })
  );
};

/**
 * Component Schema Definitions
 */
const studioComponentChildSchema: any = yup.object({
  componentType: alphaNumNoLeadingNumberString().required(),
  name: yup.string().required(),
  properties: yup.lazy((value) => propertiesSchema(value).required()),
  // Doing lazy eval here since we reference our own type otherwise
  children: yup.lazy(() => yup.array(studioComponentChildSchema.default(undefined))),
  figmaMetadata: yup.object().nullable(),
  variants: yup.array().nullable(),
  overrides: yup.object().nullable(),
  bindingProperties: yup.object().nullable(),
  collectionProperties: yup.object().nullable(),
  actions: yup.object().nullable(),
  events: eventsSchema.nullable(),
});

const studioComponentSchema = yup
  .object({
    name: pascalCaseAlphaNumString().required(),
    id: yup.string().nullable(),
    sourceId: yup.string().nullable(),
    schemaVersion: yup.lazy(() => schemaVersionSchema().nullable()),
    componentType: alphaNumNoLeadingNumberString().required(),
    properties: yup.lazy((value) => propertiesSchema(value).required()),
    children: yup.array(studioComponentChildSchema).nullable(),
    figmaMetadata: yup.object().nullable(),
    variants: yup.array().nullable(),
    overrides: yup.object().nullable(),
    bindingProperties: yup.object().nullable(),
    collectionProperties: yup.object().nullable(),
    actions: yup.object().nullable(),
    events: eventsSchema.nullable(),
  })
  // eslint-disable-next-line func-names
  .test('unique-component-names', 'All component names must be unique', function (value) {
    const { path, createError } = this;
    const { duplicateNames } = findCollidingNames(value);
    if (duplicateNames.size > 0) {
      return createError({
        path,
        message: `Duplicate names are not allowed within a component, found duplicates of ${JSON.stringify([
          ...duplicateNames,
        ])}`,
      });
    }
    return true;
  });

type ComponentNameMetadata = {
  names: Set<string>;
  duplicateNames: Set<string>;
};

const findCollidingNames = (value: any): ComponentNameMetadata => {
  const names = value.name ? new Set([value.name]) : new Set();
  const componentNameMetadata: ComponentNameMetadata = { names, duplicateNames: new Set() };
  if (!value.children) {
    return componentNameMetadata;
  }
  const childComponentNameMetadata = value.children
    .map((child: any) => findCollidingNames(child))
    .reduce(
      (previous: ComponentNameMetadata, next: ComponentNameMetadata) => mergeComponentNameMetadata(previous, next),
      { names: new Set(), duplicateNames: new Set() },
    );
  return mergeComponentNameMetadata(componentNameMetadata, childComponentNameMetadata);
};

const mergeComponentNameMetadata = (lhs: ComponentNameMetadata, rhs: ComponentNameMetadata): ComponentNameMetadata => {
  const names = new Set([...lhs.names, ...rhs.names]);
  const duplicateNames = new Set([...lhs.duplicateNames, ...rhs.duplicateNames]);
  lhs.names.forEach((lhsName) => {
    if (rhs.names.has(lhsName)) {
      duplicateNames.add(lhsName);
    }
  });
  return { names, duplicateNames };
};

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
  id: yup.string().nullable(),
  values: yup.array(studioThemeValuesSchema).required(),
  overrides: yup.array(studioThemeValuesSchema).nullable(),
});

/**
 * Form Schema Definitions
 */
const studioFormSchema = yup.object({
  name: pascalCaseAlphaNumString().required(),
  id: yup.string().nullable(),
  formActionType: yup.string().matches(new RegExp('(create|update)')),
  dataType: yup.object({
    dataSourceType: yup.string().matches(new RegExp('(DataStore|Custom)')),
    dataTypeName: yup.string().required(),
  }),
  fields: yup.object().nullable(),
  sectionalElements: yup.object().nullable(),
  style: yup.object().nullable(),
  cta: yup.object().nullable(),
});

/**
 * View Schema Definition
 */
const studioViewSchema = yup.object({
  name: pascalCaseAlphaNumString().required(),
  id: yup.string().nullable(),
  dataSource: yup.object({
    identifiers: yup.array().nullable(),
    model: yup.string().nullable(),
    predicate: yup.object().nullable(),
    sort: yup.array().nullable(),
    type: yup.string().matches(new RegExp('(DataStore|Custom)')),
  }),
  style: yup.object().nullable(),
  viewConfiguration: yup.object().nullable(),
});

/**
 * Studio Schema Validation Functions and Helpers.
 */
const validateSchema = (validator: yup.AnySchema, studioSchema: StudioSchema) => {
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
export const validateFormSchema = (schema: any) => validateSchema(studioFormSchema, schema);
export const validateViewSchema = (schema: any) => validateSchema(studioViewSchema, schema);
