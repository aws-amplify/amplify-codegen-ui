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
import { StudioComponentDataConfiguration, StudioComponentPropertyBinding } from './bindings';
import { StudioComponentEvents } from './events';
import { FigmaMetadata } from './figma';
import { StudioComponentProperties } from './properties';

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
 */
export type StudioComponentOverrides = {
  /**
   * This is the reference to a full set of overrides applied to a component and its children
   * @returns A set of key value pairs representing overrides for the given child or top-level component.
   */
  [overridenComponentName: string]: { [key: string]: string };
};
