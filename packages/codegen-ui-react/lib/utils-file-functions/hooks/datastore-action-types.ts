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
  PersistentModel,
  PersistentModelConstructor,
  ModelInit,
  PersistentModelMetaData,
  Schema,
  IdentifierFieldOrIdentifierObject,
  ProducerPaginationInput,
  RecursiveModelPredicateExtender,
} from '@aws-amplify/datastore';

/**
 * Converts a Model's field values to types supported by
 * Amplify UI field components. This is required
 * because Datastore Int and Float scalar types are often
 * entered by users in a TextField which returns a string
 */
type ModelFields<Type> = {
  // Text Field, TextArea Field, Password Field, Phone Number Field,
  // Radio Group Field, Select Field return "string"
  // Checkbox Field, Switch Field, Toggle Button return "boolean"
  // Slider Field, Stepper Field return "number"
  [Property in keyof Type]: string | number | boolean;
};

export type DataStoreActionFields<Model extends PersistentModel> =
  | ModelInit<Model, PersistentModelMetaData<Model>>
  | ModelFields<ModelInit<Model, PersistentModelMetaData<Model>>>;

export interface UseDataStoreActionOptions<Model extends PersistentModel> {
  model: PersistentModelConstructor<Model>;
  /**
   * Pass either already converted field values based on DataStore schema,
   * or also pass the `schema` param have string field values
   * optimistically cast to the expected type based on the `schema`
   */
  fields: DataStoreActionFields<Model>;
  /**
   * Used to optimistically cast fields values to the
   * expected value types based on the `schema` provided
   */
  schema?: Schema;
}

export type DataStoreItemProps<Model extends PersistentModel> = {
  model: PersistentModelConstructor<Model>;
  id: IdentifierFieldOrIdentifierObject<Model, PersistentModelMetaData<Model>>;
};

export type DataStoreCollectionProps<Model extends PersistentModel> = {
  model: PersistentModelConstructor<Model>;
  criteria?: RecursiveModelPredicateExtender<Model>;
  pagination?: ProducerPaginationInput<Model>;
};

type DataStoreBaseResult = {
  error?: Error;
  isLoading: boolean;
};

export type DataStoreItemResult<Model extends PersistentModel> = DataStoreBaseResult & { item?: Model };

export type DataStoreCollectionResult<Model extends PersistentModel> = DataStoreBaseResult & { items: Model[] };

export type DataStoreBindingProps<Model extends PersistentModel, BindingType extends 'record' | 'collection'> = {
  type: BindingType;
} & (BindingType extends 'record'
  ? DataStoreItemProps<Model>
  : BindingType extends 'collection'
  ? DataStoreCollectionProps<Model>
  : never);

export type DataStorePredicateObject = {
  and?: DataStorePredicateObject[];
  or?: DataStorePredicateObject[];
  field?: string;
  operand?: string | boolean | number;
  operator?: string;
};
