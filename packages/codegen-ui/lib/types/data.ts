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

export type SchemaEnums = Record<string, SchemaEnum>;
export type SchemaEnum = {
  name: string;
  values: string[];
};

type FieldType = string | { model: string } | { nonModel: string } | { enum: string };

export type DataStoreModelField = {
  name: string;
  type: FieldType;
  isReadOnly: boolean;
  isRequired: boolean;
  isArray: boolean;
};

export type CommonRelationshipType = {
  relatedModelName: string;
};

export type HasManyRelationshipType = {
  type: 'HAS_MANY';
  relatedModelFields: string[];
  canUnlinkAssociatedModel: boolean;
  relatedJoinFieldName?: string;
  relatedJoinTableName?: string;
  belongsToFieldOnRelatedModel?: string;
} & CommonRelationshipType;

export type HasOneRelationshipType = {
  type: 'HAS_ONE';
  associatedFields?: string[];
  isHasManyIndex?: boolean;
} & CommonRelationshipType;

export type BelongsToRelationshipType = {
  type: 'BELONGS_TO';
  associatedFields?: string[];
  isHasManyIndex?: boolean;
} & CommonRelationshipType;

export type GenericDataRelationshipType = HasManyRelationshipType | HasOneRelationshipType | BelongsToRelationshipType;

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

  relationship?: GenericDataRelationshipType;
};

export type GenericDataModel = {
  fields: { [fieldName: string]: GenericDataField };
  isJoinTable?: boolean;
  primaryKeys: string[];
};

export type GenericDataNonModel = {
  fields: { [fieldName: string]: GenericDataField };
};

export type GenericDataSchema = {
  dataSourceType: 'DataStore';

  models: { [modelName: string]: GenericDataModel };

  enums: { [enumName: string]: { values: string[] } };

  nonModels: { [nonModelName: string]: GenericDataNonModel };
};
