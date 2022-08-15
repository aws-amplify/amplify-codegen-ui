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
import { StringFormat, TableConfiguration, ViewValueFormatting } from '@aws-amplify/codegen-ui/lib/types';
import { CallExpression, factory, ObjectLiteralExpression, SyntaxKind } from 'typescript';

export const getFilterName = (model: string) => `${model.toLowerCase()}Filter`;
export const getPredicateName = (model: string) => `${model.toLowerCase()}Predicate`;
export const getPaginationName = (model: string) => `${model.toLowerCase()}Pagination`;

/*
checks table to see if there is a formatter for stringFormat
*/
export const needsFormatter = (config: TableConfiguration): boolean => {
  if (config.table.columns) {
    return Object.values(config.table.columns).some((column) => column.valueFormatting?.stringFormat !== undefined);
  }
  return false;
};

/*
  const dataStoreItems = useDataStoreBinding({
    type: 'collection',
    model: 'Post',
    criteria: predicateOverrides ?? predicateApiSettings,
    sort: sortApiSettings,
  })
 */
export const buildDataStoreCollectionCall = (
  model: string,
  criteriaName?: string,
  paginationName?: string,
): CallExpression => {
  const objectProperties = [
    factory.createPropertyAssignment(factory.createIdentifier('type'), factory.createStringLiteral('collection')),
    factory.createPropertyAssignment(factory.createIdentifier('model'), factory.createIdentifier(model)),
  ]
    .concat(
      criteriaName
        ? [
            // criteria: predicateOverride || {criteriaName}
            factory.createPropertyAssignment(
              factory.createIdentifier('criteria'),
              factory.createBinaryExpression(
                factory.createIdentifier('predicateOverride'),
                factory.createToken(SyntaxKind.BarBarToken),
                factory.createIdentifier(criteriaName),
              ),
            ),
          ]
        : [
            // criteria: predicateOverride
            factory.createPropertyAssignment(
              factory.createIdentifier('criteria'),
              factory.createIdentifier('predicateOverride'),
            ),
          ],
    )
    .concat(
      paginationName
        ? [
            factory.createPropertyAssignment(
              factory.createIdentifier('pagination'),
              factory.createIdentifier(paginationName),
            ),
          ]
        : [],
    );

  return factory.createCallExpression(factory.createIdentifier('useDataStoreBinding'), undefined, [
    factory.createObjectLiteralExpression(objectProperties, true),
  ]);
};

/*  Helper to codegen objects

    example output: 
    {
        stringFormat: {
            dateTimeFormat: {
                dateFormat: "locale",
                timeFormat: "hours24",
            },
        }
    }
*/
export const objectToExpression = (object: { [key: string]: string | any }): ObjectLiteralExpression => {
  return factory.createObjectLiteralExpression(
    Object.entries(object).map(([key, value]) =>
      factory.createPropertyAssignment(
        factory.createIdentifier(key),
        typeof value === 'string' ? factory.createStringLiteral(value) : objectToExpression(value),
      ),
    ),
  );
};

export const stringFormatToType = (viewFormat: ViewValueFormatting | undefined): StringFormat['type'] => {
  if (!viewFormat) {
    return undefined;
  }

  if (viewFormat.stringFormat.type) {
    return viewFormat.stringFormat.type;
  }

  const { type, ...format } = viewFormat.stringFormat;
  switch (Object.keys(format)[0]) {
    case 'nonLocaleDateTimeFormat':
      return 'NonLocaleDateTimeFormat';
    case 'localeDateTimeFormat':
      return 'LocaleDateTimeFormat';
    case 'timeFormat':
      return 'TimeFormat';
    case 'dateFormat':
      return 'DateFormat';
    default:
      // Unsupported formatting
      return undefined;
  }
};
