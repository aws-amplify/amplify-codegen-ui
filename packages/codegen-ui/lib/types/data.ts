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

// exporting types and scalar functions from aws-amplify
// as these will be used when loading in dataschema for form generation
export type { SchemaModel } from '@aws-amplify/datastore';

type FieldType = string | { model: string } | { nonModel: string } | { enum: string };

export type DataStoreModelField = {
  name: string;
  type: FieldType;
  isReadOnly: boolean;
  isRequired: boolean;
  isArray: boolean;
};

export type DataFieldDataType =
  | 'ID'
  | 'String'
  | 'Int'
  | 'Float'
  | 'AWSDate'
  | 'AWSTime'
  | 'AWSDateTime'
  | 'AWSTimestamp'
  | 'AWSEmail'
  | 'AWSURL'
  | 'AWSIPAddress'
  | 'Boolean'
  | 'AWSJSON'
  | 'AWSPhone'
  | { enum: string }
  | { model: string }
  | { nonModel: string };

export type GenericDataField = {
  dataType: DataFieldDataType;

  required: boolean;

  readOnly: boolean;

  isArray: boolean;

  relationship?: {
    type: 'HAS_ONE' | 'HAS_MANY' | 'BELONGS_TO';

    relatedModelName: string;
  };
};

export type GenericDataModel = {
  fields: { [fieldName: string]: GenericDataField };
};

export type GenericDataSchema = {
  dataSourceType: 'DataStore';

  models: { [modelName: string]: GenericDataModel };

  enums: { [enumName: string]: { values: string[] } };

  nonModels: { [nonModelName: string]: GenericDataModel };
};
