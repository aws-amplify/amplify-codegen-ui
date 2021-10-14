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
  StudioComponent,
  StudioComponentChild,
  StudioComponentDataPropertyBinding,
  StudioComponentAuthPropertyBinding,
  StudioComponentStoragePropertyBinding,
  StudioComponentEventPropertyBinding,
  StudioComponentSimplePropertyBinding,
  StudioComponentActionPropertyBinding,
  StudioComponentPropertyType,
  StudioComponentPropertyBinding,
} from './types';

export const StudioRendererConstants = {
  unknownName: 'unknown_component_name',
};

export function isStudioComponentWithBinding(
  component: StudioComponent | StudioComponentChild,
): component is StudioComponent {
  return 'bindingProperties' in component;
}

/**
 * Verify if this is 1) a type that has the collectionProperties, and 2) that the collection
 * properties object is set. Then provide the typehint back to the compiler that this attribute exists.
 */
export function isStudioComponentWithCollectionProperties(
  component: StudioComponent | StudioComponentChild,
): component is StudioComponent & Required<Pick<StudioComponent, 'collectionProperties'>> {
  return 'collectionProperties' in component && component.collectionProperties !== undefined;
}

export function isStudioComponentWithVariants(
  component: StudioComponent | StudioComponentChild,
): component is StudioComponent & Required<Pick<StudioComponent, 'variants'>> {
  return 'variants' in component && component.variants !== undefined && component.variants.length > 0;
}

export function isDataPropertyBinding(
  prop: StudioComponentPropertyBinding,
): prop is StudioComponentDataPropertyBinding {
  return 'type' in prop && prop.type === 'Data';
}

export function isAuthPropertyBinding(
  prop: StudioComponentPropertyBinding,
): prop is StudioComponentAuthPropertyBinding {
  return 'type' in prop && prop.type === 'Authentication';
}

export function isStoragePropertyBinding(
  prop: StudioComponentPropertyBinding,
): prop is StudioComponentStoragePropertyBinding {
  return 'type' in prop && prop.type === 'Storage';
}

export function isSimplePropertyBinding(
  prop: StudioComponentPropertyBinding,
): prop is StudioComponentSimplePropertyBinding {
  return (
    'type' in prop &&
    [
      StudioComponentPropertyType.Boolean.toString(),
      StudioComponentPropertyType.Number.toString(),
      StudioComponentPropertyType.String.toString(),
      StudioComponentPropertyType.Date.toString(),
    ].includes(prop.type)
  );
}

export function isEventPropertyBinding(
  prop: StudioComponentPropertyBinding,
): prop is StudioComponentEventPropertyBinding {
  return 'type' in prop && prop.type === 'Event';
}

export function isActionPropertyBinding(
  prop: StudioComponentPropertyBinding,
): prop is StudioComponentActionPropertyBinding {
  return 'type' in prop && prop.type === 'Action';
}
