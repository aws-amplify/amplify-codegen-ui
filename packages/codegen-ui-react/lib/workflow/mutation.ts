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
  StudioGenericEvent,
  StudioComponentProperty,
  ComponentMetadata,
  getComponentFromComponentTree,
  StateReferenceMetadata,
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
import {
  Primitive,
  PrimitivesWithChangeEvent,
  PrimitiveLevelPropConfiguration,
  PrimitiveDefaultPropertyValue,
} from '../primitive';
import { DataApiKind } from '../react-render-config';

type EventHandlerBuilder = (setStateName: string, stateName: string) => JsxExpression;

const genericEventToReactEventImplementationOverrides: PrimitiveLevelPropConfiguration<EventHandlerBuilder> = {
  [Primitive.StepperField]: { [StudioGenericEvent.onChange]: numericValueCallback },
  [Primitive.SliderField]: { [StudioGenericEvent.onChange]: numericValueCallback },
  [Primitive.CheckboxField]: { [StudioGenericEvent.onChange]: buildSyntheticEventTargetCallback('checked') },
  [Primitive.SwitchField]: { [StudioGenericEvent.onChange]: toggleBooleanStateCallback },
};

const PrimitiveDefaultValuePropMapping: PrimitiveLevelPropConfiguration<string> = new Proxy(
  {
    [Primitive.SwitchField]: { isChecked: 'defaultChecked' },
  },
  {
    get(target, name, ...args) {
      return name in target ? Reflect.get(target, name, ...args) : { value: 'defaultValue' };
    },
  },
);

export function buildUseEffectStatements(
  component: StudioComponent,
  componentMetadata: ComponentMetadata,
): Statement[] {
  return componentMetadata.stateReferences
    .filter(({ dataDependencies }) => dataDependencies.length > 0)
    .map((stateReference) => {
      const { reference, dataDependencies } = stateReference;
      const dependencyConditions = dataDependencies.flatMap((dataDependency) => [
        // prevents components from changing to an uncontrolled state
        factory.createBinaryExpression(
          getStateInitialValue(component, componentMetadata, { reference, dataDependencies: [] }),
          factory.createToken(ts.SyntaxKind.ExclamationEqualsEqualsToken),
          factory.createIdentifier('undefined'),
        ),
        factory.createBinaryExpression(
          factory.createIdentifier(dataDependency),
          factory.createToken(ts.SyntaxKind.ExclamationEqualsEqualsToken),
          factory.createIdentifier('undefined'),
        ),
      ]);
      const conditions = [
        ...dependencyConditions,
        factory.createBinaryExpression(
          factory.createIdentifier(getStateName(reference)),
          factory.createToken(ts.SyntaxKind.EqualsEqualsEqualsToken),
          getStateInitialValue(component, componentMetadata, stateReference),
        ),
      ];
      const binaryExpression = conditions.reduce((expression, currentCondition) => {
        return factory.createBinaryExpression(
          factory.createParenthesizedExpression(currentCondition),
          factory.createToken(ts.SyntaxKind.AmpersandAmpersandToken),
          expression,
        );
      });
      return factory.createExpressionStatement(
        factory.createCallExpression(factory.createIdentifier('useEffect'), undefined, [
          factory.createArrowFunction(
            undefined,
            undefined,
            [],
            undefined,
            factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
            factory.createBlock([
              factory.createIfStatement(
                binaryExpression,
                factory.createExpressionStatement(
                  factory.createCallExpression(factory.createIdentifier(getSetStateName(reference)), undefined, [
                    getStateInitialValue(component, componentMetadata, { reference, dataDependencies: [] }),
                  ]),
                ),
              ),
            ]),
          ),
          factory.createArrayLiteralExpression(dataDependencies.map(factory.createIdentifier), false),
        ]),
      );
    });
}

export function mapSyntheticStateReferences(componentMetadata: ComponentMetadata) {
  return componentMetadata.stateReferences.map((stateReference) => {
    const {
      reference: { componentName, property },
    } = stateReference;
    const childrenPropMapping = getChildPropMappingForComponentName(componentMetadata, componentName);
    if (childrenPropMapping !== undefined && property === childrenPropMapping) {
      return { ...stateReference, reference: { ...stateReference.reference, property: 'children' } };
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
 * Dedupes state references by componentName, property, and dataDependencies, returning a consolidate
 * list, stripping the `set` property from them. We do this by serializing to json,
 * collecting in a set, then deserializing.
 */
function dedupeStateReferences(stateReferences: StateReferenceMetadata[]): StateReferenceMetadata[] {
  const dedupedSerializedRefs = [
    ...new Set(
      stateReferences.map((stateReference) => {
        const {
          reference: { componentName, property },
          dataDependencies,
        } = stateReference;
        return JSON.stringify({ reference: { componentName, property }, dataDependencies: dataDependencies.sort() });
      }),
    ),
  ];
  return dedupedSerializedRefs.map((ref) => JSON.parse(ref));
}

export function buildStateStatements(
  component: StudioComponent,
  componentMetadata: ComponentMetadata,
  importCollection: ImportCollection,
  apiKind: DataApiKind = 'DataStore',
): Statement[] {
  const stateHook = apiKind === 'DataStore' ? ImportValue.USE_STATE_MUTATION_ACTION : ImportValue.USE_STATE;
  if (componentMetadata.stateReferences.length > 0) {
    importCollection.addMappedImport(stateHook);
  }
  const dedupedStateReferences = dedupeStateReferences(componentMetadata.stateReferences);
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
                factory.createIdentifier(getStateName(stateReference.reference)),
                undefined,
              ),
              factory.createBindingElement(
                undefined,
                undefined,
                factory.createIdentifier(getSetStateName(stateReference.reference)),
                undefined,
              ),
            ]),
            undefined,
            undefined,
            factory.createCallExpression(factory.createIdentifier(stateHook), undefined, [
              getStateInitialValue(component, componentMetadata, stateReference),
            ]),
          ),
        ],
        ts.NodeFlags.Const,
      ),
    );
  });
}

export function getStateInitialValue(
  component: StudioComponent,
  componentMetadata: ComponentMetadata,
  stateReference: StateReferenceMetadata,
) {
  const {
    reference: { componentName, property },
    dataDependencies,
  } = stateReference;
  const referencedComponent = getComponentFromComponentTree(component, componentName);
  const componentProperty = referencedComponent.properties[property];

  if (componentProperty === undefined || dataDependencies.length > 0) {
    const defaultPropMapping = PrimitiveDefaultValuePropMapping[referencedComponent.componentType as Primitive];
    if (property in defaultPropMapping && referencedComponent.properties[defaultPropMapping[property]]) {
      const defaultProp = referencedComponent.properties[defaultPropMapping[property]];
      // eslint-disable-next-line no-param-reassign
      delete referencedComponent.properties[defaultPropMapping[property]];
      return propertyToExpression(componentMetadata, defaultProp);
    }

    return propertyToExpression(componentMetadata, getDefaultForComponentAndProperty(referencedComponent, property));
  }

  return propertyToExpression(componentMetadata, componentProperty);
}

export function getDefaultForComponentAndProperty(
  component: StudioComponent | StudioComponentChild,
  property: string,
): StudioComponentProperty | undefined {
  const { componentType } = component;
  const componentDefault = PrimitiveDefaultPropertyValue[componentType as Primitive];
  if (componentDefault && property in componentDefault) {
    // if component has defaultValue use defaultValue as initial state value
    return componentDefault[property];
  }

  // use empty string as fallback default
  return undefined;
}

export type MutationReferences = {
  [property: string]: { addControlEvent: boolean }[];
};

export function filterStateReferencesForComponent(
  component: StudioComponent | StudioComponentChild,
  stateReferences: StateReferenceMetadata[],
): MutationReferences {
  return stateReferences
    .filter(({ reference: { componentName } }) => componentName === component.name)
    .reduce(mutationReferenceReducerWithComponentType(component.componentType), {});
}

function mutationReferenceReducerWithComponentType(componentType: string) {
  return function mutationReferenceReducer(
    mutationReferences: MutationReferences,
    stateReference: StateReferenceMetadata,
  ): MutationReferences {
    const { reference } = stateReference;
    const propertyReferences = reference.property in mutationReferences ? mutationReferences[reference.property] : [];
    return {
      ...mutationReferences,
      [reference.property]: propertyReferences.concat([
        { addControlEvent: PrimitivesWithChangeEvent.has(componentType as Primitive) },
      ]),
    };
  };
}
