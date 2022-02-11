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
  StudioComponentDataConfiguration,
  StudioComponentEvent,
  StudioComponentProperty,
  StudioComponentPropertyBinding,
  StateStudioComponentProperty,
} from '../types';

type StateReference = StateStudioComponentProperty;

export type ComponentMetadata = {
  hasAuthBindings: boolean;
  requiredDataModels: string[];
  stateReferences: StateReference[];
  componentNameToTypeMap: Record<string, string>;
};

/**
 * Component Structure Functions
 */

// Check top-level binding properties, then call helper on the chilren.
export function computeComponentMetadata(component: StudioComponent): ComponentMetadata {
  const { bindingProperties, collectionProperties } = component;
  return dedupeComponentMetadata(
    reduceComponentMetadata([
      ...(bindingProperties ? Object.values(bindingProperties).map(computeBindingPropertyMetadata) : []),
      ...(collectionProperties ? Object.values(collectionProperties).map(computeCollectionPropertyMetadata) : []),
      computeComponentMetadataHelper(component),
    ]),
  );
}

// Check names, properties, events, and recurse through children.
function computeComponentMetadataHelper(component: StudioComponent | StudioComponentChild): ComponentMetadata {
  return reduceComponentMetadata([
    generateNameMappingMetadata(component.name, component.componentType),
    ...(component.properties ? Object.values(component.properties).map(computePropertyMetadata) : []),
    ...(component.events ? Object.values(component.events).map(computeEventMetadata) : []),
    ...(component.children ? component.children.map(computeComponentMetadataHelper) : []),
  ]);
}

/**
 * Utility Functions
 */

// Because object equality won't catch dupes here, we'll map by component Name, dedupe
// properties, then unroll to a list.
function dedupeStateReferences(stateReferences: StateReference[]): StateReference[] {
  const stateReferenceMap: Record<string, Set<string>> = {};
  stateReferences.forEach(({ componentName, property }) => {
    if (!(componentName in stateReferenceMap)) {
      stateReferenceMap[componentName] = new Set([]);
    }
    stateReferenceMap[componentName].add(property);
  });
  return Object.entries(stateReferenceMap).flatMap(([componentName, properties]) =>
    [...properties].map((property) => {
      return { componentName, property };
    }),
  );
}

function dedupeComponentMetadata(componentMetadata: ComponentMetadata): ComponentMetadata {
  const { hasAuthBindings, requiredDataModels, stateReferences, componentNameToTypeMap } = componentMetadata;
  return {
    hasAuthBindings,
    requiredDataModels: [...new Set(requiredDataModels)],
    stateReferences: dedupeStateReferences(stateReferences),
    componentNameToTypeMap,
  };
}

function reduceComponentMetadata(componentMetadata: ComponentMetadata[]): ComponentMetadata {
  const mergeMetadata = (lhs: ComponentMetadata, rhs: ComponentMetadata) => {
    return {
      hasAuthBindings: lhs.hasAuthBindings || rhs.hasAuthBindings,
      requiredDataModels: [...lhs.requiredDataModels, ...rhs.requiredDataModels],
      stateReferences: [...lhs.stateReferences, ...rhs.stateReferences],
      componentNameToTypeMap: { ...lhs.componentNameToTypeMap, ...rhs.componentNameToTypeMap },
    };
  };
  return componentMetadata.reduce(mergeMetadata, generateEmptyMetadata());
}

function generateEmptyMetadata(): ComponentMetadata {
  return {
    hasAuthBindings: false,
    requiredDataModels: [],
    stateReferences: [],
    componentNameToTypeMap: {},
  };
}

function generateAuthBindingMetadata(): ComponentMetadata {
  return {
    hasAuthBindings: true,
    requiredDataModels: [],
    stateReferences: [],
    componentNameToTypeMap: {},
  };
}

function generateModelMetadata(model: string): ComponentMetadata {
  return {
    hasAuthBindings: false,
    requiredDataModels: [model],
    stateReferences: [],
    componentNameToTypeMap: {},
  };
}

function generateReferenceMetadata(reference: StateReference): ComponentMetadata {
  // Unpacking the reference, so we don't bring additional values in.
  const { componentName, property } = reference;
  return {
    hasAuthBindings: false,
    requiredDataModels: [],
    stateReferences: [{ componentName, property }],
    componentNameToTypeMap: {},
  };
}

function generateNameMappingMetadata(componentName: string | undefined, componentType: string): ComponentMetadata {
  if (componentName) {
    return {
      hasAuthBindings: false,
      requiredDataModels: [],
      stateReferences: [],
      componentNameToTypeMap: { [componentName]: componentType },
    };
  }
  return generateEmptyMetadata();
}

/**
 * Binding Property Functions
 */

function computeCollectionPropertyMetadata(dataConfiguration: StudioComponentDataConfiguration): ComponentMetadata {
  return generateModelMetadata(dataConfiguration.model);
}

function computeBindingPropertyMetadata(bindingProperty: StudioComponentPropertyBinding): ComponentMetadata {
  switch (bindingProperty.type) {
    case 'Event':
      return generateEmptyMetadata();
    case 'Data':
      return generateModelMetadata(bindingProperty.bindingProperties.model);
    case 'Storage':
      return generateEmptyMetadata();
    default:
      if ('type' in bindingProperty) {
        return generateEmptyMetadata();
      }
      throw new Error(`Binding Property ${JSON.stringify(bindingProperty)} could not be parsed for Metadata.`);
  }
}

/**
 * Property Functions
 */

function computePropertyMetadata(property: StudioComponentProperty): ComponentMetadata {
  return reduceComponentMetadata(
    ([] as ComponentMetadata[])
      .concat('concat' in property ? property.concat.map(computePropertyMetadata) : [])
      .concat('userAttribute' in property ? [generateAuthBindingMetadata()] : [])
      .concat(
        'condition' in property && 'then' in property.condition
          ? [computePropertyMetadata(property.condition.then)]
          : [],
      )
      .concat(
        'condition' in property && 'else' in property.condition
          ? [computePropertyMetadata(property.condition.else)]
          : [],
      )
      .concat(
        'componentName' in property && 'property' in property
          ? [generateReferenceMetadata(property as StateReference)]
          : [],
      ),
  );
}

/**
 * Event Functions
 */

function computeEventMetadata(event: StudioComponentEvent): ComponentMetadata {
  if (!('action' in event)) {
    return generateEmptyMetadata();
  }

  switch (event.action) {
    case 'Amplify.Navigation':
      return reduceComponentMetadata(Object.values(event.parameters).map(computePropertyMetadata));
    case 'Amplify.AuthSignOut':
      return reduceComponentMetadata(Object.values(event.parameters).map(computePropertyMetadata));
    case 'Amplify.DataStoreCreateItemAction':
      return reduceComponentMetadata([
        generateModelMetadata(event.parameters.model),
        ...Object.values(event.parameters.fields).map(computePropertyMetadata),
      ]);
    case 'Amplify.DataStoreUpdateItemAction':
      return reduceComponentMetadata([
        generateModelMetadata(event.parameters.model),
        computePropertyMetadata(event.parameters.id),
        ...Object.values(event.parameters.fields).map(computePropertyMetadata),
      ]);
    case 'Amplify.DataStoreDeleteItemAction':
      return reduceComponentMetadata([
        generateModelMetadata(event.parameters.model),
        computePropertyMetadata(event.parameters.id),
      ]);
    case 'Amplify.Mutation':
      return reduceComponentMetadata([
        generateReferenceMetadata(event.parameters.state),
        computePropertyMetadata(event.parameters.state.set),
      ]);
    default:
      throw new Error(`Event ${JSON.stringify(event)} could not be parsed for Metadata.`);
  }
}
