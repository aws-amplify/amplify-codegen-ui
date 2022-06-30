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
import { RelationalOperator } from './relational-operator';
import { StringFormat } from './string-format';

/**
 * This is a dictionary of properties. Each key represents
 * a uniquely named property of a component
 */
export type StudioComponentProperties = {
  /**
   * Each key maps to an available component property. Static values
   * can be passed in as a string.
   */
  [key: string]: StudioComponentProperty;
};

export type CommonPropertyValues = {
  /**
   * If this flag is set, then the property will be shown in Studio UI. If not, it will be hidden.
   * All properties imported from an external provider will omit this property by default.
   */
  configured?: boolean;
  /**
   * The original imported value of the property. If the value
   * has not been overridden from import, this field will remain undefined.
   */
  importedValue?: string;
  /**
   * The format in which to display the component property in
   */
  stringFormat?: StringFormat;
};

export type StudioComponentProperty =
  | FixedStudioComponentProperty
  | SlotStudioComponentProperty
  | BoundStudioComponentProperty
  | CollectionStudioComponentProperty
  | ConcatenatedStudioComponentProperty
  | ConditionalStudioComponentProperty
  | WorkflowStudioComponentProperty
  | StudioComponentAuthProperty
  | StateStudioComponentProperty;

/**
 * This represents a component property that is configured with either
 * static  values
 */
export type FixedStudioComponentProperty = {
  /**
   * These are the values pass when code generating. Static values can be passed in
   * as a string
   */
  value: string | number | boolean | Date;
  type?: string;
} & CommonPropertyValues;

/**
 * This represents a component property that is configured with either
 * data bound values
 */
export type BoundStudioComponentProperty = {
  /**
   * This is the exposed property that will propogate down to this value
   */
  bindingProperties: {
    property: string;
    field?: string;
  };

  /**
   * The default value to pass in if no prop is provided
   */
  defaultValue?: string;
} & CommonPropertyValues;

/**
 * This represents a component property that is configured with collection item
 */
export type CollectionStudioComponentProperty = {
  /**
   * record collection item bindings
   */
  collectionBindingProperties: {
    property: string;
    field?: string;
  };

  /**
   * The default value to pass in if no prop is provided
   */
  defaultValue?: string;
} & CommonPropertyValues;

/**
 * Component property that contains concatenation of multiple properties
 */
export type ConcatenatedStudioComponentProperty = {
  concat: StudioComponentProperty[];
} & CommonPropertyValues;

/**
 * Component property that represents a conditional expression
 */
export type ConditionalStudioComponentProperty = {
  condition: {
    property: string;
    field?: string;
    operator: RelationalOperator;
    operand: string | number | boolean;
    operandType?: string;
    then: StudioComponentProperty;
    else: StudioComponentProperty;
  };
} & CommonPropertyValues;

/**
 * This represents a component property that is configured with either
 * data bound values
 */
export type WorkflowStudioComponentProperty = {
  event: string;
} & CommonPropertyValues;

/**
 * Component property that represents an authentication property
 */
export type StudioComponentAuthProperty = {
  userAttribute: string;
} & CommonPropertyValues;

export type StateStudioComponentProperty = {
  componentName: string;
  property: string;
} & CommonPropertyValues;

export type SlotStudioComponentProperty = {
  slotName: string;
} & CommonPropertyValues;
