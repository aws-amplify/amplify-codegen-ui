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

import { findIndices, removeAndReturnItemOnward, removeFromMatrix } from '../../../generate-form-definition/helpers';

describe('findIndices', () => {
  it('should find the indices of a string in a two-dimensional array', () => {
    const matrix = [['one', 'two', 'three', 'four'], ['five'], ['six', 'seven', 'eight']];

    expect(findIndices('seven', matrix)).toStrictEqual([2, 1]);
  });

  it('should return undefined if string not found', () => {
    const matrix = [['one', 'two', 'three', 'four'], ['five'], ['six', 'seven', 'eight']];
    expect(findIndices('nine', matrix)).toBe(undefined);
  });
});

describe('removeFromMatrix', () => {
  it('should remove given indices from matrix', () => {
    const matrix = [['one', 'two', 'three', 'four'], ['five'], ['six', 'seven', 'eight']];

    const formDefinition = {
      form: { props: { layoutStyle: {} } },
      elements: {},
      buttons: {},
      elementMatrix: matrix,
    };

    removeFromMatrix([2, 1], formDefinition);

    expect(formDefinition.elementMatrix).toStrictEqual([['one', 'two', 'three', 'four'], ['five'], ['six', 'eight']]);
  });
});

describe('removeAndReturnItemOnward', () => {
  it('should remove and return an item and all items to the right of it', () => {
    const matrix = [['one', 'two', 'three', 'four'], ['five'], ['six', 'seven', 'eight']];

    const formDefinition = {
      form: { props: { layoutStyle: {} } },
      elements: {},
      buttons: {},
      elementMatrix: matrix,
    };

    expect(removeAndReturnItemOnward([0, 1], formDefinition)).toStrictEqual(['two', 'three', 'four']);

    expect(formDefinition.elementMatrix).toStrictEqual([['one'], ['five'], ['six', 'seven', 'eight']]);
  });
});
