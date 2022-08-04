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
import {
  ColumnInfo,
  DataStoreModelField,
  StudioView,
  ViewDataTypeConfig,
  ViewStyle,
  TableConfiguration,
} from '../../types';
import { generateTableDefinition } from '../../generate-view-definition/generate-table-definition';

describe('generateTableDefinition', () => {
  test('can generate table definition', () => {
    const view: StudioView = {
      appId: 'appId',
      environmentName: 'staging',
      id: 'viewId',
      name: 'TableOne',
      schemaVersion: '1.0',
      sourceId: 'source',
      dataSource: {
        type: 'DataStore',
      },
      style: {
        alignment: {
          value: 'left',
        },
        outerPadding: {
          value: '10px',
        },
      },
      viewConfiguration: {
        columns: {
          header1: {
            position: {
              rightOf: 'header4',
            },
          },
          header4: {
            excluded: true,
          },
        },
        type: 'Table',
      },
    };

    const fields: DataStoreModelField[] = (() => {
      const f: DataStoreModelField[] = [];
      for (let i = 1; i <= 5; i += 1) {
        f.push({
          name: `header${i}`,
          isArray: false,
          isReadOnly: false,
          isRequired: false,
          type: 'String',
        });
      }
      return f;
    })();

    const definition = generateTableDefinition(view, fields);

    const expectedStyle: ViewStyle = {
      alignment: {
        value: 'left',
      },
      outerPadding: {
        value: '10px',
      },
      horizontalGap: {
        value: '0',
      },
      verticalGap: {
        value: '0',
      },
    };

    const expectedConfig: TableConfiguration = {
      type: 'Table',
      disableHeaders: false,
      highlightOnHover: false,
      enableOnRowClick: false,
    };

    const expectedSource: ViewDataTypeConfig = {
      type: 'DataStore',
    };

    const expectedColumns: ColumnInfo[] = [
      {
        header: 'header2',
      },
      {
        header: 'header3',
      },
      {
        header: 'header1',
        position: {
          rightOf: 'header4',
        },
      },
      {
        header: 'header5',
      },
    ];

    expect(definition.tableStyle).toStrictEqual(expectedStyle);
    expect(definition.tableConfig).toStrictEqual(expectedConfig);
    expect(definition.tableDataSource).toStrictEqual(expectedSource);
    expect(definition.columns).toStrictEqual(expectedColumns);
  });
});
