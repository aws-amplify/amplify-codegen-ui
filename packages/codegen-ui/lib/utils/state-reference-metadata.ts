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
import { StudioComponent, StudioComponentProperty, StateReference } from '../types';
import { getComponentFromComponentTree } from './component-tree';

/**
 * TODO: UNIT TESTS ON ME
 */

export type StateReferenceMetadata = {
  reference: StateReference;
  dataDependencies: string[];
};

/**
 * Component Structure Functions
 */

export function computeStateReferenceMetadata(
  component: StudioComponent,
  stateReferences: StateReference[],
): StateReferenceMetadata[] {
  return stateReferences.map((reference) => {
    const dataDependencies = computeDataDependenciesForStateReference(component, reference);
    return { reference, dataDependencies };
  });
}

function reduceDataDependencies(dataDependencies: string[]): string[] {
  return [...new Set(dataDependencies)];
}

/**
 * Property Functions
 */

function computeDataDependenciesForStudioComponentProperty(property: StudioComponentProperty): string[] {
  return reduceDataDependencies(
    ([] as string[])
      .concat(
        'concat' in property && property.concat
          ? property.concat.flatMap(computeDataDependenciesForStudioComponentProperty)
          : [],
      )
      .concat('userAttribute' in property && property.userAttribute ? ['authAttributes'] : [])
      .concat(
        'bindingProperties' in property && property.bindingProperties ? [property.bindingProperties.property] : [],
      )
      .concat('collectionBindingProperties' in property && property.collectionBindingProperties ? ['items'] : [])
      .concat(
        'condition' in property && property.condition && 'property' in property.condition && property.condition.property
          ? [property.condition.property]
          : [],
      )
      .concat(
        'condition' in property && property.condition && 'then' in property.condition && property.condition.then
          ? computeDataDependenciesForStudioComponentProperty(property.condition.then)
          : [],
      )
      .concat(
        'condition' in property && property.condition && 'else' in property.condition && property.condition.else
          ? computeDataDependenciesForStudioComponentProperty(property.condition.else)
          : [],
      ),
  );
}

/**
 * State Functions
 */

function computeDataDependenciesForStateReference(
  component: StudioComponent,
  stateReference: StateReference,
): string[] {
  const { componentName, property } = stateReference;
  const namedComponent = getComponentFromComponentTree(component, componentName);
  const propertyDefinition = namedComponent.properties[property];
  if (propertyDefinition) {
    return computeDataDependenciesForStudioComponentProperty(propertyDefinition);
  }
  return [];
}
