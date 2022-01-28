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
export type FigmaMetadata = {
  /**
   * The document URL for the figma document
   */
  documentUrl?: string;

  /**
   *  The nodeId generated by Figma
   */
  nodeId?: string;
};

/**
 * This is the base type for all Studio components
 */
export type StudioComponent = {
  /**
   * The name of the customized component
   */
  name?: string;

  /**
   *  This is the unique global identifier for each component
   */
  id?: string;

  /**
   * The id if the component in its source system (Figma, Sketch, etc.)
   */
  sourceId?: string;

  /**
   * This should map to the components available including Amplify
   * UI components and other custom components
   */
  componentType: string;

  /**
   * These are the customized properties
   */
  properties: StudioComponentProperties;

  /**
   * These are the nested components in a composite
   */
  children?: StudioComponentChild[];

  /**
   * The  metatdata gerated by Figma
   */
  figmaMetadata?: FigmaMetadata;

  /**
   * Variants in terms of styles
   */
  variants?: StudioComponentVariant[];

  /**
   * Overrides for primitives
   */
  overrides?: StudioComponentOverrides;

  bindingProperties: {
    [propertyName: string]: StudioComponentPropertyBinding;
  };

  /**
   * These are the collection properties
   */
  collectionProperties?: {
    [propertyName: string]: StudioComponentDataConfiguration;
  };

  events?: StudioComponentEvents;
};

/**
 * A new studio component where the componentId will automatically be generated
 */
export type NewStudioComponent = {
  /**
   * The name of the customized component
   */
  name?: string;

  /**
   * This should map to the components available including Amplify
   * UI components and other custom components
   */
  componentType: string;

  /**
   * These are the customized properties
   */
  properties: StudioComponentProperties;

  /**
   * These are the nested components in a composite
   */
  children?: StudioComponentChild[];

  /**
   * The  metatdata gerated by Figma
   */
  figmaMetadata?: FigmaMetadata;

  /**
   * Variants in terms of styles
   */
  variants?: StudioComponentVariant[];

  /**
   * Overrides for primitives
   */
  overrides?: StudioComponentOverrides;

  bindingProperties: {
    [propertyName: string]: StudioComponentPropertyBinding;
  };

  /**
   * These are the collection properties
   */
  collectionProperties?: {
    [propertyName: string]: StudioComponentDataPropertyBinding;
  };

  events?: StudioComponentEvents;
};

export type StudioComponentSimplePropertyBinding = {
  /**
   *  This is the data type for the value that is bound to this property. The default
   * inferred type is string so this will only need to be set if it is not a string
   */
  type: keyof typeof StudioComponentPropertyType;

  defaultValue?: string | undefined;
};

/**
 * This is the child type for Studio components
 */
export type StudioComponentChild = {
  /**
   * This should map to the components available including Amplify
   * UI components and other custom components
   */
  componentType: string;

  /**
   * The unique name of the child element.
   */
  name: string;

  /**
   * These are the customized properties
   */
  properties: StudioComponentProperties;

  /**
   * These are the nested components in a composite
   */
  children?: StudioComponentChild[];

  events?: StudioComponentEvents;
};

/**
 * This is used to track vairants for a single component
 */
export type StudioComponentVariant = {
  /**
   * The combination of vairants that comprise this variant
   */
  variantValues: { [key: string]: string };

  /**
   * The overridden properties for this variant
   */
  overrides: StudioComponentOverrides;
};

/**
 * This is a dictionary of overrides for a single parent component.
 * The hirearchy reference should
 */
export type StudioComponentOverrides = {
  /**
   * This is the reference to full component override hierarchy
   * @returns A set of key value pairs representing overrides for the given primitive hierarchy.
   */
  [hierarchyReference: string]: { [key: string]: string };
};

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
};

export type StudioComponentProperty = (
  | FixedStudioComponentProperty
  | BoundStudioComponentProperty
  | CollectionStudioComponentProperty
  | ConcatenatedStudioComponentProperty
  | ConditionalStudioComponentProperty
  | StudioComponentAuthProperty
  | StateStudioComponentProperty
) &
  CommonPropertyValues;

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
};

/**
 * This represents a component property that is configured with either
 * data bound values
 */
export type BoundStudioComponentProperty = {
  /**
   * This is the exposed property that will propagate down to this value
   */
  bindingProperties: {
    property: string;
    field?: string;
  };

  /**
   * The default value to pass in if no prop is provided
   */
  defaultValue?: string;
};

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
};

/**
 * Component property that contains concatenation of multiple properties
 */
export type ConcatenatedStudioComponentProperty = {
  concat: StudioComponentProperty[];
};

/**
 * These are the string values accepted by operator
 */
export type RelationalOperator = 'eq' | 'ne' | 'le' | 'lt' | 'ge' | 'gt';

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
};

export type StateStudioComponentProperty = {
  componentName: string;
  property: string;
};

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

export type StudioComponentPropertyBinding =
  | StudioComponentDataPropertyBinding
  | StudioComponentStoragePropertyBinding
  | StudioComponentSimplePropertyBinding
  | StudioComponentEventPropertyBinding;

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
export type StudioComponentAuthProperty = {
  /**
   * This is the value of the user attribute
   */
  userAttribute: string;
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
 * These are the primitive value types
 */
export enum StudioComponentPropertyType {
  String = 'String',
  Number = 'Number',
  Boolean = 'Boolean',
  Date = 'Date',
}

/**
 * These are the types of data binding
 */
export enum StudioComponentPropertyBindingType {
  Data = 'Data',
  Authentication = 'Authentication',
  Storage = 'Storage',
  Event = 'Event',
}

export enum StudioGenericEvent {
  click = 'click',
  doubleclick = 'doubleclick',
  mousedown = 'mousedown',
  mouseenter = 'mouseenter',
  mouseleave = 'mouseleave',
  mousemove = 'mousemove',
  mouseout = 'mouseout',
  mouseover = 'mouseover',
  mouseup = 'mouseup',
  change = 'change',
  input = 'input',
  focus = 'focus',
  blur = 'blur',
  keydown = 'keydown',
  keypress = 'keypress',
  keyup = 'keyup',
}

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
  field?: string;
  operand?: string;
  operator?: string;
};

/**
 * This represents the user attribute you want to bind a
 * Studio component property to
 */
export type StudioComponentAuthBindingProperty = {
  userAttribute: string;
};

/**
 * This represents the bucket and key you want to bind a component
 * property to
 */
export type StudioComponentStorageBindingProperty = {
  bucket: string;
  key?: string;
};

export type StudioComponentEvent = BoundStudioComponentEvent | ActionStudioComponentEvent;

export type BoundStudioComponentEvent = {
  bindingEvent: string;
};

export type ActionStudioComponentEvent =
  | NavigationAction
  | AuthSignOutAction
  | DataStoreCreateItemAction
  | DataStoreUpdateItemAction
  | DataStoreDeleteItemAction
  | MutationAction;

export type NavigationAction = {
  action: 'Amplify.Navigation';
  parameters: {
    type: StudioComponentProperty;
    url?: StudioComponentProperty;
    anchor?: StudioComponentProperty;
    target?: StudioComponentProperty;
  };
};

export type AuthSignOutAction = {
  action: 'Amplify.AuthSignOut';
  parameters: {
    global: StudioComponentProperty;
  };
};

export type DataStoreCreateItemAction = {
  action: 'Amplify.DataStoreCreateItemAction';
  parameters: {
    model: string;
    fields: {
      [propertyName: string]: StudioComponentProperty;
    };
  };
};

export type DataStoreUpdateItemAction = {
  action: 'Amplify.DataStoreUpdateItemAction';
  parameters: {
    model: string;
    id: StudioComponentProperty;
    fields: {
      [propertyName: string]: StudioComponentProperty;
    };
  };
};

export type DataStoreDeleteItemAction = {
  action: 'Amplify.DataStoreDeleteItemAction';
  parameters: {
    model: string;
    id: StudioComponentProperty;
  };
};

export type MutationAction = {
  action: 'Amplify.Mutation';
  parameters: {
    state: MutationActionSetStateParameter;
  };
};

export type MutationActionSetStateParameter = {
  componentName: string;
  property: string;
  set: StudioComponentProperty;
} & CommonPropertyValues;

export type StateReference = StateStudioComponentProperty | MutationActionSetStateParameter;

export type StudioComponentEvents = {
  [eventName: string]: StudioComponentEvent;
};

export type StudioTheme = {
  name: string;
  id?: string;
  values: StudioThemeValues[];
  // overrides is a special case because it is an array of values
  overrides?: StudioThemeValues[];
};

export type StudioThemeValues = {
  key: string;
  value: StudioThemeValue;
};

export type StudioThemeValue = {
  value?: string;
  children?: StudioThemeValues[];
};
