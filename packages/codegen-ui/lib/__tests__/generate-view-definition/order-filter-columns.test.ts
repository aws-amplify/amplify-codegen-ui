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
import { ColumnsMap, DataStoreModelField } from '../../types';
import { orderAndFilterVisibleColumns } from '../../generate-view-definition/helpers';

describe('orderAndFilterVisibleColumns', () => {
  const generateHeaders = (num: number) => {
    const fields: DataStoreModelField[] = [];
    for (let i = 1; i <= num; i += 1) {
      fields.push({
        name: `header${i}`,
        type: 'String',
        isReadOnly: false,
        isArray: false,
        isRequired: false,
      });
    }
    return fields;
  };

  test('default order applied', () => {
    const fields = generateHeaders(10);

    const columns = orderAndFilterVisibleColumns({}, fields);

    const headers = columns.map((col) => col.header);

    expect(headers).toStrictEqual([
      'header1',
      'header2',
      'header3',
      'header4',
      'header5',
      'header6',
      'header7',
      'header8',
      'header9',
      'header10',
    ]);
  });

  test('empty data store fields should not throw error', () => {
    const fields: DataStoreModelField[] = [];

    expect(() => orderAndFilterVisibleColumns({}, fields)).not.toThrowError();
  });

  test('should order and filter', () => {
    const map: ColumnsMap = {
      header1: {
        position: {
          rightOf: 'header3',
        },
      },
      header2: {
        position: {
          rightOf: 'header4',
        },
      },
      header6: {
        position: {
          fixed: 'first',
        },
      },
      header3: {
        position: {
          rightOf: 'header6',
        },
      },
    };

    const fields = generateHeaders(10);

    const columns = orderAndFilterVisibleColumns(map, fields);

    const headers = columns.map((col) => col.header);

    const expectedOrder = [
      'header6',
      'header3',
      'header1',
      'header4',
      'header2',
      'header5',
      'header7',
      'header8',
      'header9',
      'header10',
    ];

    expect(headers).toStrictEqual(expectedOrder);

    map.header6.excluded = true;
    map.header1.excluded = true;
    map.header5 = {
      excluded: true,
    };

    const filtered = orderAndFilterVisibleColumns(map, fields);

    const headersFiltered = filtered.map((col) => col.header);

    const expectedOrderFiltered = ['header3', 'header4', 'header2', 'header7', 'header8', 'header9', 'header10'];

    expect(headersFiltered).toStrictEqual(expectedOrderFiltered);
  });
});
