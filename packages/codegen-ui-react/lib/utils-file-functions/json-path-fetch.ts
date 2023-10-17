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

/**
 * does not support array types within objects as it's currently not supported
 *
 * ref: https://stackoverflow.com/questions/45942118/lodash-return-array-of-values-if-the-path-is-valid
 *
 * @param input object input
 * @param path dot notation path for the provided input
 * @param accumlator array
 * @returns returns value at the end of object
 */
/* istanbul ignore next */
export const fetchByPath = <T extends Record<string, any>>(input: T, path: string, accumlator: any[] = []) => {
  const currentPath = path.split('.');
  const head = currentPath.shift();
  if (input && head && input[head] !== undefined) {
    if (!currentPath.length) {
      accumlator.push(input[head]);
    } else {
      fetchByPath(input[head], currentPath.join('.'), accumlator);
    }
  }
  return accumlator[0];
};

export const fetchByPathString = `export const fetchByPath = 
<T extends Record<string, any>>(input: T, path: string, accumlator: any[] = []) => {
  const currentPath = path.split('.');
  const head = currentPath.shift();
  if (input && head && input[head] !== undefined) {
    if (!currentPath.length) {
      accumlator.push(input[head]);
    } else {
      fetchByPath(input[head], currentPath.join('.'), accumlator);
    }
  }
  return accumlator[0];
};`;
