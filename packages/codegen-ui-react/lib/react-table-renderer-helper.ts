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
import { StringFormat, ViewValueFormatting } from '@aws-amplify/codegen-ui/lib/types';
import { factory, ObjectLiteralExpression } from 'typescript';

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

  const format = viewFormat.stringFormat;
  if ('dateTimeFormat' in format) {
    return 'DateTimeFormat';
  }
  if ('timeFormat' in format) {
    return 'TimeFormat';
  }
  if ('dateFormat' in format) {
    return 'DateFormat';
  }

  // Unsupported formatting
  return undefined;
};
