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
export function getFirstDefinedValue<T>(values: (T | undefined)[]): T | undefined {
  return values.find((value) => value !== undefined);
}

export function getFirstString(values: (string | number | undefined)[]): string | undefined {
  return values.find((value) => typeof value === 'string') as string | undefined;
}

export function getFirstNumber(values: (string | number | undefined)[]): number | undefined {
  return values.find((value) => typeof value === 'number') as number | undefined;
}

export function convertToTitleCase(value: string): string {
  const ReplaceMap: Record<string, string> = { '-': ' ', _: ' ' };

  return value
    .split('')
    .map((char, i) => {
      if (ReplaceMap[char]) {
        return ReplaceMap[char];
      }
      if (i === 0) {
        return char.toUpperCase();
      }
      return char.toLowerCase();
    })
    .join('');
}

/* eslint-disable no-param-reassign */
export function deleteUndefined(obj: { [key: string]: unknown }) {
  Object.entries(obj).forEach(([key, value]) => {
    if (value === undefined) {
      delete obj[key];
    }
  });
}
/* eslint-enable no-param-reassign */
