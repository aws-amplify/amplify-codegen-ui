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
  GenericDataSchema,
  StudioView,
  ViewConfiguration,
  ViewDataTypeConfig,
  ViewStyle,
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
        model: 'TestModel',
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
        type: 'Table',
        table: {
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
        },
      },
    };

    const dataSchema: GenericDataSchema = {
      dataSourceType: 'DataStore',
      enums: {},
      nonModels: {},
      models: {
        TestModel: {
          primaryKeys: [],
          fields: {},
        },
      },
    };

    for (let i = 1; i <= 5; i += 1) {
      dataSchema.models.TestModel.fields[`header${i}`] = {
        dataType: 'String',
        isArray: false,
        readOnly: false,
        required: false,
      };
    }

    const definition = generateTableDefinition(view, dataSchema);

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

    const expectedConfig: ViewConfiguration = {
      type: 'Table',
      table: {
        disableHeaders: false,
        highlightOnHover: false,
        enableOnRowClick: false,
      },
    };

    const expectedSource: ViewDataTypeConfig = {
      type: 'DataStore',
      model: 'TestModel',
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

  test('can generate table definition with custom data model', () => {
    const view: StudioView = {
      appId: 'appId',
      environmentName: 'staging',
      id: 'viewId',
      name: 'CusomTable',
      schemaVersion: '1.0',
      sourceId: 'source',
      dataSource: {
        type: 'Custom',
        model: '{"name":"bob","age":25,"address":"123 street","birthday":"5/5/99"}',
      },
      style: {},
      viewConfiguration: {
        type: 'Table',
        table: {},
      },
    };

    const definition = generateTableDefinition(view);

    const expectedColumns: ColumnInfo[] = [
      {
        header: 'name',
      },
      {
        header: 'age',
      },
      {
        header: 'address',
      },
      {
        header: 'birthday',
      },
    ];

    expect(definition.columns).toStrictEqual(expectedColumns);
  });
});
