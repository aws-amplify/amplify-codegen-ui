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
import ts, { Statement, factory, JsxAttribute, JsxExpression } from 'typescript';
import {
  StudioComponent,
  StudioComponentChild,
  StateStudioComponentProperty,
  ActionStudioComponentEvent,
  StateReference,
  StudioGenericEvent,
  buildComponentNameToTypeMap,
} from '@aws-amplify/codegen-ui';
import {
  isActionEvent,
  isStateProperty,
  isSetStateParameter,
  propertyToExpression,
  getStateName,
  getSetStateName,
} from '../react-component-render-helper';
import { ImportCollection, ImportValue } from '../imports';
import Primitive, { PrimitivesWithChangeEvent } from '../primitive';
import { mapGenericEventToReact } from './events';
import { getChildPropMappingForComponentName } from './utils';
import Primitive, { PrimitiveLevelPropConfiguration } from '../primitive';

type EventHandlerBuilder = (stateName: string) => JsxExpression;

const genericEventToReactEventImplementationOverrides: PrimitiveLevelPropConfiguration<EventHandlerBuilder> = {
  [Primitive.StepperField]: { [StudioGenericEvent.change]: numericValueCallbackGenerator },
  [Primitive.SliderField]: { [StudioGenericEvent.change]: numericValueCallbackGenerator },
};

export function getComponentStateReferences(component: StudioComponent) {
  const stateReferences = getComponentStateReferencesHelper(component);
  const componentNameToTypeMap = buildComponentNameToTypeMap(component);
  const mappedStateReferences = mapSyntheticReferences(stateReferences, componentNameToTypeMap);
  return mappedStateReferences;
}

function getComponentStateReferencesHelper(component: StudioComponent | StudioComponentChild) {
  const stateReferences: StateReference[] = [];

  if (component.properties) {
    Object.values(component.properties).forEach((property) => {
      if (isStateProperty(property)) {
        stateReferences.push(property);
      }
    });
  }

  if (component.events) {
    stateReferences.push(
      ...Object.values(component.events)
        .filter((action): action is ActionStudioComponentEvent => isActionEvent(action))
        .flatMap((action) => getActionStateParameters(action)),
    );
  }

  if (component.children) {
    component.children.forEach((child) => {
      stateReferences.push(...getComponentStateReferencesHelper(child));
    });
  }

  return stateReferences;
}

function mapSyntheticReferences(
  stateReferences: StateReference[],
  componentNameToTypeMap: Record<string, string>,
): StateReference[] {
  return stateReferences.map((stateReference) => {
    const { componentName, property } = stateReference;
    const childrenPropMapping = getChildPropMappingForComponentName(componentNameToTypeMap, componentName);
    if (childrenPropMapping !== undefined && property === childrenPropMapping) {
      return { ...stateReference, property: 'children' };
    }
    return stateReference;
  });
}

export function getActionStateParameters(action: ActionStudioComponentEvent): StateStudioComponentProperty[] {
  if (action.parameters) {
    return Object.entries(action.parameters)
      .filter(([key]) => key !== 'model')
      .flatMap(([key, parameter]) => {
        if (key === 'fields' || key === 'attributes') {
          return Object.values(parameter);
        }
        return parameter;
      })
      .filter((parameter) => isStateProperty(parameter) || isSetStateParameter(parameter));
  }
  return [];
}

function syntheticEventTargetValueCallbackGenerator(stateName: string): JsxExpression {
  return factory.createJsxExpression(
    undefined,
    factory.createArrowFunction(
      undefined,
      undefined,
      [
        factory.createParameterDeclaration(
          undefined,
          undefined,
          undefined,
          factory.createIdentifier('event'),
          undefined,
          factory.createTypeReferenceNode(factory.createIdentifier('SyntheticEvent'), undefined),
          undefined,
        ),
      ],
      undefined,
      factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
      factory.createBlock(
        [
          factory.createExpressionStatement(
            factory.createCallExpression(factory.createIdentifier(stateName), undefined, [
              factory.createPropertyAccessExpression(
                factory.createPropertyAccessExpression(
                  factory.createIdentifier('event'),
                  factory.createIdentifier('target'),
                ),
                factory.createIdentifier('value'),
              ),
            ]),
          ),
        ],
        false,
      ),
    ),
  );
}

function numericValueCallbackGenerator(stateName: string): JsxExpression {
  return factory.createJsxExpression(
    undefined,
    factory.createArrowFunction(
      undefined,
      undefined,
      [
        factory.createParameterDeclaration(
          undefined,
          undefined,
          undefined,
          factory.createIdentifier('value'),
          undefined,
          factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
          undefined,
        ),
      ],
      undefined,
      factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
      factory.createCallExpression(factory.createIdentifier(stateName), undefined, [factory.createIdentifier('value')]),
    ),
  );
}

// TODO: Update in here so we can support customer `change` events for form elements.
export function buildOpeningElementControlEvents(
  componentType: string,
  stateName: string,
  event: string,
): JsxAttribute {
  const implementationOverrides = genericEventToReactEventImplementationOverrides[componentType];
  const controlEventBuilder =
    implementationOverrides && implementationOverrides[event]
      ? implementationOverrides[event]
      : syntheticEventTargetValueCallbackGenerator;
  return factory.createJsxAttribute(
    factory.createIdentifier(mapGenericEventToReact(componentType as Primitive, event as StudioGenericEvent)),
    controlEventBuilder(stateName),
  );
}

/**
 * Dedupes state references by componentName + property, returning a consolidate
 * list, stripping the `set` property from them. We do this by serializing to json,
 * collecting in a set, then deserializing.
 */
function dedupeStateReferences(stateReferences: StateReference[]): StateReference[] {
  const dedupedSerializedRefs = [
    ...new Set(
      stateReferences.map((stateReference) => {
        const { componentName, property } = stateReference;
        return JSON.stringify({ componentName, property });
      }),
    ),
  ];
  return dedupedSerializedRefs.map((ref) => JSON.parse(ref));
}

export function buildStateStatements(
  component: StudioComponent,
  stateReferences: StateReference[],
  importCollection: ImportCollection,
): Statement[] {
  if (stateReferences.length > 0) {
    importCollection.addMappedImport(ImportValue.USE_STATE_MUTATION_ACTION);
  }
  const dedupedStateReferences = dedupeStateReferences(stateReferences);
  return dedupedStateReferences.map((stateReference) => {
    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createArrayBindingPattern([
              factory.createBindingElement(
                undefined,
                undefined,
                factory.createIdentifier(getStateName(stateReference)),
                undefined,
              ),
              factory.createBindingElement(
                undefined,
                undefined,
                factory.createIdentifier(getSetStateName(stateReference)),
                undefined,
              ),
            ]),
            undefined,
            undefined,
            factory.createCallExpression(factory.createIdentifier('useStateMutationAction'), undefined, [
              getStateDefaultValue(component, stateReference),
            ]),
          ),
        ],
        ts.NodeFlags.Const,
      ),
    );
  });
}

export function getStateDefaultValue(component: StudioComponent, stateReference: StateStudioComponentProperty) {
  const { componentName, property } = stateReference;
  const referencedComponent = getComponentFromComponentTree(component, componentName);
  const componentProperty = referencedComponent.properties[property];
  return propertyToExpression(componentProperty);
}

export function getComponentFromComponentTree(
  component: StudioComponent,
  componentName: string,
): StudioComponent | StudioComponentChild {
  const getComponentFromComponentTreeHelper = (
    currentComponent: StudioComponent | StudioComponentChild,
  ): StudioComponent | StudioComponentChild | undefined => {
    if (currentComponent.name === componentName) {
      return currentComponent;
    }

    if (currentComponent.children) {
      return currentComponent.children.find(
        (child: StudioComponentChild) => getComponentFromComponentTreeHelper(child) !== undefined,
      );
    }

    return undefined;
  };

  const res = getComponentFromComponentTreeHelper(component);

  if (res === undefined) {
    throw new Error(`Component ${componentName} not found in component tree ${component.name}`);
  }

  return res;
}

export type MutationReferences = {
  [property: string]: { addControlEvent: boolean }[];
};

export function filterStateReferencesForComponent(
  component: StudioComponent | StudioComponentChild,
  stateReferences: StateReference[],
): MutationReferences {
  return stateReferences
    .filter(({ componentName }) => componentName === component.name)
    .reduce(mutationReferenceReducerWithComponentType(component.componentType), {});
}

function mutationReferenceReducerWithComponentType(componentType: string) {
  return function mutationReferenceReducer(
    mutationReferences: MutationReferences,
    stateReference: StateReference,
  ): MutationReferences {
    const propertyReferences =
      stateReference.property in mutationReferences ? mutationReferences[stateReference.property] : [];
    return {
      ...mutationReferences,
      [stateReference.property]: propertyReferences.concat([
        { addControlEvent: PrimitivesWithChangeEvent.has(componentType as Primitive) || !('set' in stateReference) },
      ]),
    };
  };
}
