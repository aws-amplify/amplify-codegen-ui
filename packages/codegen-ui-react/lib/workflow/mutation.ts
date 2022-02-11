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
  StudioComponentProperty,
  ComponentMetadata,
} from '@aws-amplify/codegen-ui';
import {
  isStateProperty,
  isSetStateParameter,
  propertyToExpression,
  getStateName,
  getSetStateName,
} from '../react-component-render-helper';
import { ImportCollection, ImportValue } from '../imports';
import { mapGenericEventToReact } from './events';
import { getChildPropMappingForComponentName } from './utils';
import Primitive, {
  PrimitivesWithChangeEvent,
  PrimitiveLevelPropConfiguration,
  PrimitiveDefaultPropertyValue,
} from '../primitive';

type EventHandlerBuilder = (setStateName: string, stateName: string) => JsxExpression;

const genericEventToReactEventImplementationOverrides: PrimitiveLevelPropConfiguration<EventHandlerBuilder> = {
  [Primitive.StepperField]: { [StudioGenericEvent.change]: numericValueCallback },
  [Primitive.SliderField]: { [StudioGenericEvent.change]: numericValueCallback },
  [Primitive.CheckboxField]: { [StudioGenericEvent.change]: buildSyntheticEventTargetCallback('checked') },
  [Primitive.SwitchField]: { [StudioGenericEvent.change]: toggleBooleanStateCallback },
};

export function getComponentStateReferences(componentMetadata: ComponentMetadata) {
  const { stateReferences, componentNameToTypeMap } = componentMetadata;
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
        if (isSetStateParameter(parameter)) {
          return [parameter, parameter.set];
        }
        return parameter;
      })
      .filter((parameter) => isStateProperty(parameter) || isSetStateParameter(parameter));
  }
  return [];
}

function buildSyntheticEventTargetCallback(targetFieldName: string): (setStateName: string) => JsxExpression {
  return (setStateName: string) => {
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
              factory.createCallExpression(factory.createIdentifier(setStateName), undefined, [
                factory.createPropertyAccessExpression(
                  factory.createPropertyAccessExpression(
                    factory.createIdentifier('event'),
                    factory.createIdentifier('target'),
                  ),
                  factory.createIdentifier(targetFieldName),
                ),
              ]),
            ),
          ],
          false,
        ),
      ),
    );
  };
}

function numericValueCallback(setStateName: string): JsxExpression {
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
      factory.createCallExpression(factory.createIdentifier(setStateName), undefined, [
        factory.createIdentifier('value'),
      ]),
    ),
  );
}

function toggleBooleanStateCallback(setStateName: string, stateName: string): JsxExpression {
  return factory.createJsxExpression(
    undefined,
    factory.createArrowFunction(
      undefined,
      undefined,
      [],
      undefined,
      factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
      factory.createCallExpression(factory.createIdentifier(setStateName), undefined, [
        factory.createPrefixUnaryExpression(ts.SyntaxKind.ExclamationToken, factory.createIdentifier(stateName)),
      ]),
    ),
  );
}

// TODO: Update in here so we can support customer `change` events for form elements.
export function buildOpeningElementControlEvents(
  componentType: string,
  setStateName: string,
  stateName: string,
  event: string,
): JsxAttribute {
  const implementationOverrides = genericEventToReactEventImplementationOverrides[componentType];
  const controlEventBuilder =
    implementationOverrides && implementationOverrides[event]
      ? implementationOverrides[event]
      : buildSyntheticEventTargetCallback('value');
  return factory.createJsxAttribute(
    factory.createIdentifier(mapGenericEventToReact(componentType as Primitive, event as StudioGenericEvent)),
    controlEventBuilder(setStateName, stateName),
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

  // does not work for custom components wrapping form components
  if (
    componentProperty === undefined &&
    PrimitiveDefaultPropertyValue[referencedComponent.componentType as Primitive]
  ) {
    return propertyToExpression(getDefaultForComponentAndProperty(referencedComponent, property));
  }
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
      return currentComponent.children.map(getComponentFromComponentTreeHelper).find((child) => child !== undefined);
    }

    return undefined;
  };

  const res = getComponentFromComponentTreeHelper(component);

  if (res === undefined) {
    throw new Error(`Component ${componentName} not found in component tree ${component.name}`);
  }

  return res;
}

export function getDefaultForComponentAndProperty(
  component: StudioComponent | StudioComponentChild,
  property: string,
): StudioComponentProperty {
  const { componentType } = component;
  const componentDefault = PrimitiveDefaultPropertyValue[componentType as Primitive];
  if (componentDefault && property in componentDefault) {
    // if component has defaultValue use defaultValue as initial state value
    if (property === 'value' && component.properties.defaultValue) {
      // TODO: remove defaultValue becuase coponents canot have value and defaultValue
      return component.properties.defaultValue;
    }
    return componentDefault[property];
  }

  // use empty string a fallback default
  return { value: '', type: 'string' };
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
        { addControlEvent: PrimitivesWithChangeEvent.has(componentType as Primitive) },
      ]),
    };
  };
}
