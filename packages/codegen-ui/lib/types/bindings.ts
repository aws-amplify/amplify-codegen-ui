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
export type StudioComponentPropertyBinding =
  | StudioComponentDataPropertyBinding
  | StudioComponentStoragePropertyBinding
  | StudioComponentSimplePropertyBinding
  | StudioComponentEventPropertyBinding
  | StudioComponentSlotBinding;

/**
 * These are the primitive value types
 */
export enum StudioComponentPropertyType {
  String = 'String',
  Number = 'Number',
  Boolean = 'Boolean',
  Date = 'Date',
}

export type StudioComponentSimplePropertyBinding = {
  /**
   *  This is the data type for the value that is bound to this property. The default
   * inferred type is string so this will only need to be set if it is not a string
   */
  type: keyof typeof StudioComponentPropertyType;

  defaultValue?: string | undefined;
};

/**
 * This represent the configuration for binding a component property
 * to Amplify specific information
 */
export type StudioComponentDataPropertyBinding = {
  /**
   * This declares where the data is coming from to bind to
   */
  type: 'Data';

  /**
   * This is the value of the data binding
   */
  bindingProperties: StudioComponentDataBindingProperty;
};

/**
 * This represent the configuration for binding a component property
 * to Amplify specific information
 */
export type StudioComponentEventPropertyBinding = {
  /**
   * This declares that the type is of a workflow binding
   */
  type: 'Event';
};

/**
 * This represent the configuration for binding a component property
 * to Amplify specific information
 */
export type StudioComponentStoragePropertyBinding = {
  /**
   * This declares where the data is coming from to bind to
   */
  type: 'Storage';

  /**
   * This is the value of the data binding
   */
  bindingProperties: StudioComponentStorageBindingProperty;
};

/**
 * This represent the configuration for a binding to be a user-defined JSX Element
 */
export type StudioComponentSlotBinding = {
  /**
   * This declares that the binding is a Slot type
   */
  type: 'Amplify.Slot';
};

/**
 * This represents the model and field you want to bind
 * a component property to
 */
export type StudioComponentDataBindingProperty = {
  model: string;
  field?: string;
  predicate?: StudioComponentPredicate;
};

export type StudioComponentPredicate = {
  and?: StudioComponentPredicate[];
  or?: StudioComponentPredicate[];
  not?: StudioComponentPredicate[];
  field?: string;
  operand?: string;
  operator?: string;
  operandType?: string;
};

/**
 * This represents the bucket and key you want to bind a component
 * property to
 */
export type StudioComponentStorageBindingProperty = {
  key: string;
  level?: string;
};

/**
 * These are the types of data binding
 */
export enum StudioComponentPropertyBindingType {
  Data = 'Data',
  Storage = 'Storage',
  Event = 'Event',
}

/**
 * This represent the configuration for binding a component property
 * to Amplify specific information
 */
export type StudioComponentDataConfiguration = {
  model: string;

  sort?: StudioComponentSort[];

  predicate?: StudioComponentPredicate;

  /**
   * This is a collection of Id's that will be always queried from DataStore.
   * This would be used in liu of a predicate.
   */
  identifiers?: string[];
};

export type StudioComponentSort = {
  field: string;
  direction: 'ASC' | 'DESC';
};
