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
  FrontendManagerComponent,
  FrontendManagerComponentChild,
  FrontendManagerComponentDataPropertyBinding,
  FrontendManagerComponentAuthPropertyBinding,
  FrontendManagerComponentStoragePropertyBinding,
  FrontendManagerComponentEventPropertyBinding,
  FrontendManagerComponentSimplePropertyBinding,
  FrontendManagerComponentPropertyType,
} from './types';

export const FrontendManagerRendererConstants = {
  unknownName: 'unknown_component_name',
};

export function isFrontendManagerComponentWithBinding(
  component: FrontendManagerComponent | FrontendManagerComponentChild,
): component is FrontendManagerComponent {
  return 'bindingProperties' in component;
}

/**
 * Verify if this is 1) a type that has the collectionProperties, and 2) that the collection
 * properties object is set. Then provide the typehint back to the compiler that this attribute exists.
 */
export function isFrontendManagerComponentWithCollectionProperties(
  component: FrontendManagerComponent | FrontendManagerComponentChild,
): component is FrontendManagerComponent & Required<Pick<FrontendManagerComponent, 'collectionProperties'>> {
  return 'collectionProperties' in component && component.collectionProperties !== undefined;
}

export function isFrontendManagerComponentWithVariants(
  component: FrontendManagerComponent | FrontendManagerComponentChild,
): component is FrontendManagerComponent & Required<Pick<FrontendManagerComponent, 'variants'>> {
  return 'variants' in component && component.variants !== undefined && component.variants.length > 0;
}

export function isFrontendManagerComponentWithActions(
  component: FrontendManagerComponent | FrontendManagerComponentChild,
): component is FrontendManagerComponent & Required<Pick<FrontendManagerComponent, 'actions'>> {
  return 'actions' in component && component.actions !== undefined;
}

export function isDataPropertyBinding(
  prop:
    | FrontendManagerComponentDataPropertyBinding
    | FrontendManagerComponentAuthPropertyBinding
    | FrontendManagerComponentStoragePropertyBinding
    | FrontendManagerComponentEventPropertyBinding
    | FrontendManagerComponentSimplePropertyBinding,
): prop is FrontendManagerComponentDataPropertyBinding {
  return 'type' in prop && prop.type === 'Data';
}

export function isAuthPropertyBinding(
  prop:
    | FrontendManagerComponentDataPropertyBinding
    | FrontendManagerComponentAuthPropertyBinding
    | FrontendManagerComponentStoragePropertyBinding
    | FrontendManagerComponentEventPropertyBinding
    | FrontendManagerComponentSimplePropertyBinding,
): prop is FrontendManagerComponentAuthPropertyBinding {
  return 'type' in prop && prop.type === 'Authentication';
}

export function isStoragePropertyBinding(
  prop:
    | FrontendManagerComponentDataPropertyBinding
    | FrontendManagerComponentAuthPropertyBinding
    | FrontendManagerComponentStoragePropertyBinding
    | FrontendManagerComponentEventPropertyBinding
    | FrontendManagerComponentSimplePropertyBinding,
): prop is FrontendManagerComponentStoragePropertyBinding {
  return 'type' in prop && prop.type === 'Storage';
}

export function isSimplePropertyBinding(
  prop:
    | FrontendManagerComponentDataPropertyBinding
    | FrontendManagerComponentAuthPropertyBinding
    | FrontendManagerComponentStoragePropertyBinding
    | FrontendManagerComponentEventPropertyBinding
    | FrontendManagerComponentSimplePropertyBinding,
): prop is FrontendManagerComponentSimplePropertyBinding {
  return (
    'type' in prop &&
    [
      FrontendManagerComponentPropertyType.Boolean.toString(),
      FrontendManagerComponentPropertyType.Number.toString(),
      FrontendManagerComponentPropertyType.String.toString(),
      FrontendManagerComponentPropertyType.Date.toString(),
    ].includes(prop.type)
  );
}
