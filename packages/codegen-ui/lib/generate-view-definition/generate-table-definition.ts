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
  StudioView,
  DataStoreModelField,
  TableDefinition,
  DEFAULT_TABLE_CONFIG,
  DEFAULT_TABLE_DEFINITION,
  DEFAULT_TABLE_STYLE,
  DEFAULT_TABLE_SOURCE,
} from '../types';
import { orderAndFilterVisibleColumns } from './helpers';

/**
 * Helper that turns the View model into definition that can be used to render
 * Tables in the customer project and in Studio preview.
 * @param table View, converted from the API shape.
 * @param fields (Optional) holds type information about the DataStore model fields being represented.
 * @returns a definition that translates to rendered JSX elements.
 */
export function generateTableDefinition(table: StudioView, fields: DataStoreModelField[]): TableDefinition {
  const definition = DEFAULT_TABLE_DEFINITION;

  definition.tableStyle = {
    ...DEFAULT_TABLE_STYLE,
    ...table.style,
  };

  const { columns, ...otherThanColumns } = table.viewConfiguration;

  definition.tableConfig = {
    ...DEFAULT_TABLE_CONFIG,
    ...otherThanColumns,
  };

  definition.tableDataSource = {
    ...DEFAULT_TABLE_SOURCE,
    ...table.dataSource,
  };

  definition.columns = orderAndFilterVisibleColumns(table.viewConfiguration.columns ?? {}, fields);

  return definition;
}
