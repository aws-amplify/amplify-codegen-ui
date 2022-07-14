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

export interface View {
  appId: String;
  dataSource: ViewDataTypeConfig;
  environmentName: String;
  id: string;
  name: ViewName;
  schemaVersion: String;
  sourceId?: String;
  style: ViewStyle;
  viewConfiguration: ViewConfiguration;
}

export interface ViewConfiguration {
  columns?: ColumnsMap;
  disableHeaders?: Boolean;
  highlightOnHover?: Boolean;
  type: ViewType;
}

export interface ViewDataTypeConfig {
  identifiers?: string[];
  model?: String;
  predicate?: StudioComponentPredicate;
  sort?: StudioComponentSort[];
  type: 'DataStore' | 'Custom';
}

export declare type ViewList = View[];

export declare type ViewName = string;

export interface ViewSummary {
  appId: String;
  environmentName: String;
  id: string;
  name: ViewName;
}

export declare type ViewSummaryList = ViewSummary[];

export declare type ViewType = 'Table';
