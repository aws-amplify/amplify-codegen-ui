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
import ts, { Statement, factory } from 'typescript';
import {
  StudioComponent,
  StudioComponentChild,
  StateStudioComponentProperty,
  ActionStudioComponentEvent,
  StateReference,
} from '@aws-amplify/codegen-ui';
import {
  isActionEvent,
  isStateProperty,
  isSetStateParameter,
  propertyToExpression,
  getStateName,
  getSetStateName,
} from '../react-component-render-helper';

export function getComponentStateReferences(component: StudioComponent | StudioComponentChild) {
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
        .map((action) => getActionStateParameters(action))
        .flat(),
    );
  }

  if (component.children) {
    component.children.forEach((child) => {
      stateReferences.push(...getComponentStateReferences(child));
    });
  }

  // TODO: dedupe state references

  return stateReferences;
}

export function getActionStateParameters(action: ActionStudioComponentEvent): StateStudioComponentProperty[] {
  if (action.parameters) {
    return Object.entries(action.parameters)
      .filter(([key]) => key !== 'model')
      .map(([key, parameter]) => {
        if (key === 'fields' || key === 'attributes') {
          return Object.values(parameter);
        }
        return parameter;
      })
      .flat()
      .filter((parameter) => isStateProperty(parameter) || isSetStateParameter(parameter));
  }
  return [];
}

export function buildStateStatements(component: StudioComponent, stateReferences: StateReference[]): Statement[] {
  return stateReferences.map((stateReference) => {
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
  if (componentProperty === undefined) {
    throw new Error(`Invalid state reference. Property ${property} does not exist on component ${componentName}`);
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

export function filterStateReferencesForComponent(
  component: StudioComponent | StudioComponentChild,
  stateReferences: StateReference[],
): { [property: string]: { addControlEvent: boolean } } {
  return stateReferences
    .filter(({ componentName }) => componentName === component.name)
    .reduce((prev, reference) => ({ ...prev, [reference.property]: { addControlEvent: !('set' in reference) } }), {});
}
