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
import { StudioComponentPredicate, StudioComponentSort } from '../bindings';
import { ViewStyle } from './style';
import { ColumnsMap } from './table';

export interface StudioView {
  id?: string;

  schemaVersion?: string;

  name: ViewName;

  dataSource: ViewDataTypeConfig;

  style: ViewStyle;

  viewConfiguration: ViewConfiguration;
}

export interface BaseViewConfiguration {
  type: ViewType;
}

export interface TableConfiguration extends BaseViewConfiguration {
  type: 'Table';
  table: {
    columns?: ColumnsMap;
    disableHeaders?: boolean;
    highlightOnHover?: boolean;
    enableOnRowClick?: boolean;
  };
}

// Append other configuration types here
export type ViewConfiguration = TableConfiguration;

export interface ViewDataTypeConfig {
  identifiers?: string[];
  model?: string;
  predicate?: StudioComponentPredicate;
  sort?: StudioComponentSort[];
  type: 'DataStore' | 'Custom';
}

export declare type ViewList = StudioView[];

export declare type ViewName = string;

export interface ViewSummary {
  appId: string;
  environmentName: string;
  id: string;
  name: ViewName;
}

export declare type ViewSummaryList = ViewSummary[];

export declare type ViewType = 'Table';
