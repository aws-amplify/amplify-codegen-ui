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

import { fetchByPath } from '../../utils/json-path-fetch';

describe('fetch by path util', () => {
  const nestedObj = {
    levelOne: {
      levelTwo: {
        levelThree: {
          bingo: (value: string) => `Winner Winner ${value}!`,
        },
      },
    },
  };
  it('should fetch value from nested object', () => {
    const fn: Function = fetchByPath(nestedObj, 'levelOne.levelTwo.levelThree.bingo');
    const result = fn('helloWorld');
    expect(result).toEqual('Winner Winner helloWorld!');
  });

  it('should return undefined if value does not exist in nested object', () => {
    const result = fetchByPath(nestedObj, 'levelOne.levelTwo.nonExistentLevel');
    expect(result).toBeUndefined();
  });
});
