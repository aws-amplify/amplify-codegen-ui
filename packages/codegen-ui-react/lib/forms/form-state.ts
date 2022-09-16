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

import { FieldConfigMetadata, DataFieldDataType } from '@aws-amplify/codegen-ui';
import {
  factory,
  Statement,
  Expression,
  NodeFlags,
  Identifier,
  SyntaxKind,
  ObjectLiteralExpression,
  CallExpression,
} from 'typescript';

export const capitalizeFirstLetter = (val: string) => {
  return val.charAt(0).toUpperCase() + val.slice(1);
};

export const getSetNameIdentifier = (value: string): Identifier => {
  return factory.createIdentifier(`set${capitalizeFirstLetter(value)}`);
};

export const getDefaultValueExpression = (
  name: string,
  componentType: string,
  dataType?: DataFieldDataType,
): Expression => {
  const componentTypeToDefaultValueMap: { [key: string]: Expression } = {
    ToggleButton: factory.createFalse(),
    StepperField: factory.createNumericLiteral(0),
    SliderField: factory.createNumericLiteral(0),
  };

  // it's a nonModel or relationship object
  if (dataType && typeof dataType === 'object' && !('enum' in dataType)) {
    return factory.createObjectLiteralExpression();
  }
  // the name itself is a nested json object
  if (name.split('.').length > 1) {
    return factory.createObjectLiteralExpression();
  }

  if (componentType in componentTypeToDefaultValueMap) {
    return componentTypeToDefaultValueMap[componentType];
  }
  return factory.createIdentifier('undefined');
};

/**
 * iterates field configs to create useState hooks for each field
 * populates the default values as undefined if it as a nested object, relationship model or nonModel
 * the default is an empty object
 * @param fieldConfigs
 * @returns
 */
export const getUseStateHooks = (fieldConfigs: Record<string, FieldConfigMetadata>): Statement[] => {
  const stateNames = new Set<string>();
  return Object.entries(fieldConfigs).reduce<Statement[]>((acc, [name, { dataType, componentType }]) => {
    const stateName = name.split('.')[0];
    if (!stateNames.has(stateName)) {
      acc.push(buildUseStateExpression(stateName, getDefaultValueExpression(name, componentType, dataType)));
      stateNames.add(stateName);
    }
    return acc;
  }, []);
};

/**
 * const [name, setName] = React.useState({default_expression});
 *
 * name is the value we are looking to set
 * defaultValue is is the value to set for the useState
 * @param name
 * @param defaultValue
 * @returns
 */
export const buildUseStateExpression = (name: string, defaultValue: Expression): Statement => {
  return factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createArrayBindingPattern([
            factory.createBindingElement(undefined, undefined, factory.createIdentifier(name), undefined),
            factory.createBindingElement(undefined, undefined, getSetNameIdentifier(name), undefined),
          ]),
          undefined,
          undefined,
          factory.createCallExpression(
            factory.createPropertyAccessExpression(
              factory.createIdentifier('React'),
              factory.createIdentifier('useState'),
            ),
            undefined,
            [defaultValue],
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  );
};

/**
 * turns ['myNestedObject', 'value', 'nestedValue', 'leaf']
 *
 * into myNestedObject?.value?.nestedValue?.leaf
 *
 * @param values
 * @returns
 */
export const buildAccessChain = (values: string[]): Expression => {
  if (values.length < 0) {
    throw new Error('Need at least one value in the values array');
  }
  if (values.length > 1) {
    const [parent, child, ...rest] = values;
    let propChain = factory.createPropertyAccessChain(
      factory.createIdentifier(parent),
      factory.createToken(SyntaxKind.QuestionDotToken),
      factory.createIdentifier(child),
    );
    if (rest.length) {
      rest.forEach((value) => {
        propChain = factory.createPropertyAccessChain(
          propChain,
          factory.createToken(SyntaxKind.QuestionDotToken),
          factory.createIdentifier(value),
        );
      });
    }
    return propChain;
  }
  return factory.createIdentifier(values[0]);
};

export const buildNestedStateSet = (
  keyPath: string[],
  currentKeyPath: string[],
  value: Expression,
  index = 1,
): ObjectLiteralExpression => {
  if (keyPath.length <= 1) {
    throw new Error('keyPath needs a length larger than 1 to build nested state object');
  }
  const currentKey = keyPath[index];
  // the value of the index is what decides if we have reached the leaf property of the nested object
  if (keyPath.length - 1 === index) {
    return factory.createObjectLiteralExpression([
      factory.createSpreadAssignment(buildAccessChain(currentKeyPath)),
      factory.createPropertyAssignment(factory.createIdentifier(currentKey), value),
    ]);
  }
  const currentSpreadAssignment = buildAccessChain(currentKeyPath);
  currentKeyPath.push(currentKey);
  return factory.createObjectLiteralExpression([
    factory.createSpreadAssignment(currentSpreadAssignment),
    factory.createPropertyAssignment(
      factory.createIdentifier(currentKey),
      buildNestedStateSet(keyPath, currentKeyPath, value, index + 1),
    ),
  ]);
};

// updating state
export const setFieldState = (name: string, value: Expression): CallExpression => {
  if (name.split('.').length > 1) {
    const keyPath = name.split('.');
    return factory.createCallExpression(getSetNameIdentifier(keyPath[0]), undefined, [
      buildNestedStateSet(keyPath, [keyPath[0]], value),
    ]);
  }
  return factory.createCallExpression(getSetNameIdentifier(name), undefined, [value]);
};
