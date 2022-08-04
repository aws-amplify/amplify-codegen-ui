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

import { ViewStyle } from './style';
import { ColumnConfig } from './table';
import { TableDefinition, OverallTableConfig } from './table-definition';
import { ViewDataTypeConfig } from './view';

export const DEFAULT_COLUMN_CONFIG: ColumnConfig = {
  excluded: false,
  isSticky: false,
  label: '',
  maxDisplayItems: 20,
  position: {},
  sortable: false,
  valueFormatting: undefined,
};

export const DEFAULT_TABLE_CONFIG: OverallTableConfig = {
  type: 'Table',
  disableHeaders: false,
  highlightOnHover: false,
};

export const DEFAULT_TABLE_STYLE: ViewStyle = {
  alignment: {
    value: 'left',
  },
  horizontalGap: {
    value: '0',
  },
  verticalGap: {
    value: '0',
  },
  outerPadding: {
    value: '10px',
  },
};

export const DEFAULT_TABLE_SOURCE: ViewDataTypeConfig = {
  type: 'DataStore',
};

export const DEFAULT_TABLE_DEFINITION: TableDefinition = {
  tableStyle: DEFAULT_TABLE_STYLE,
  tableConfig: DEFAULT_TABLE_CONFIG,
  tableDataSource: DEFAULT_TABLE_SOURCE,
  columns: [],
};
