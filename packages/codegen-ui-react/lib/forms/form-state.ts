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

import { FieldConfigMetadata, DataFieldDataType, isValidVariableName } from '@aws-amplify/codegen-ui';
import {
  factory,
  Statement,
  Expression,
  NodeFlags,
  Identifier,
  SyntaxKind,
  ObjectLiteralExpression,
  CallExpression,
  ElementAccessChain,
  PropertyAccessChain,
  PropertyAssignment,
  PropertyName,
} from 'typescript';

export const getCurrentValueName = (fieldName: string) => `current${capitalizeFirstLetter(fieldName)}Value`;

export const getCurrentValueIdentifier = (fieldName: string) =>
  factory.createIdentifier(getCurrentValueName(fieldName));

export const resetValuesName = factory.createIdentifier('resetStateValues');

export const setStateExpression = (fieldName: string, value: Expression) => {
  return factory.createExpressionStatement(
    factory.createCallExpression(getSetNameIdentifier(fieldName), undefined, [value]),
  );
};

export const capitalizeFirstLetter = (val: string) => {
  return val.charAt(0).toUpperCase() + val.slice(1);
};

export const getSetNameIdentifier = (value: string): Identifier => {
  return factory.createIdentifier(`set${capitalizeFirstLetter(value)}`);
};

/**
 * setErrors((errors) => ({ ...errors, [key]: value }));
 *
 * shorthand function to set error key/value
 * @param key ts expression to use as key ex. string literal or ts identifier
 * @param value ts expression to resolve to the value could be a prop access chain or identifier
 * @returns expression statement
 */
export const setErrorState = (key: string | PropertyName, value: Expression) => {
  return factory.createExpressionStatement(
    factory.createCallExpression(factory.createIdentifier('setErrors'), undefined, [
      factory.createArrowFunction(
        undefined,
        undefined,
        [
          factory.createParameterDeclaration(
            undefined,
            undefined,
            undefined,
            factory.createIdentifier('errors'),
            undefined,
            undefined,
            undefined,
          ),
        ],
        undefined,
        factory.createToken(SyntaxKind.EqualsGreaterThanToken),
        factory.createParenthesizedExpression(
          factory.createObjectLiteralExpression(
            [
              factory.createSpreadAssignment(factory.createIdentifier('errors')),
              factory.createPropertyAssignment(key, value),
            ],
            false,
          ),
        ),
      ),
    ]),
  );
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
/* ex. const initialValues = {
  name: undefined,
  isChecked: false
}
*/
export const getInitialValues = (fieldConfigs: Record<string, FieldConfigMetadata>): Statement => {
  const stateNames = new Set<string>();
  const propertyAssignments = Object.entries(fieldConfigs).reduce<PropertyAssignment[]>(
    (acc, [name, { dataType, componentType }]) => {
      const stateName = name.split('.')[0];
      if (!stateNames.has(stateName)) {
        acc.push(
          factory.createPropertyAssignment(
            isValidVariableName(stateName)
              ? factory.createIdentifier(stateName)
              : factory.createStringLiteral(stateName),
            getDefaultValueExpression(name, componentType, dataType),
          ),
        );
        stateNames.add(stateName);
      }
      return acc;
    },
    [],
  );

  return factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier('initialValues'),
          undefined,
          undefined,
          factory.createObjectLiteralExpression(propertyAssignments, true),
        ),
      ],
      NodeFlags.Const,
    ),
  );
};

/**
 * iterates field configs to create useState hooks for each field
 * @param fieldConfigs
 * @returns
 */
export const getUseStateHooks = (fieldConfigs: Record<string, FieldConfigMetadata>): Statement[] => {
  const stateNames = new Set();
  return Object.entries(fieldConfigs).reduce<Statement[]>((acc, [name, { sanitizedFieldName }]) => {
    const fieldName = name.split('.')[0];
    const renderedFieldName = sanitizedFieldName || fieldName;
    if (!stateNames.has(renderedFieldName)) {
      acc.push(
        buildUseStateExpression(
          renderedFieldName,
          isValidVariableName(fieldName)
            ? factory.createPropertyAccessExpression(
                factory.createIdentifier('initialValues'),
                factory.createIdentifier(fieldName),
              )
            : factory.createElementAccessExpression(
                factory.createIdentifier('initialValues'),
                factory.createStringLiteral(fieldName),
              ),
        ),
      );
      stateNames.add(renderedFieldName);
    }
    return acc;
  }, []);
};

/**
 * function used by the Clear/ Reset button
 * it's a reset type but we also need to clear the state of the input fields as well
 *
 * ex.
 * const resetStateValues = () => {
 *  setName(initialValues.name)
 *  setLastName(initialValues.lastName)
 *   ....
 * };
 */
export const resetStateFunction = (fieldConfigs: Record<string, FieldConfigMetadata>, recordName?: string) => {
  const cleanValues = recordName ? 'cleanValues' : 'initialValues';

  const stateNames = new Set<string>();
  const expressions = Object.entries(fieldConfigs).reduce<Statement[]>(
    (acc, [name, { isArray, sanitizedFieldName }]) => {
      const stateName = name.split('.')[0];
      const renderedName = sanitizedFieldName || stateName;
      if (!stateNames.has(stateName)) {
        acc.push(
          setStateExpression(
            renderedName,
            isValidVariableName(stateName)
              ? factory.createPropertyAccessExpression(
                  factory.createIdentifier(cleanValues),
                  factory.createIdentifier(stateName),
                )
              : factory.createElementAccessExpression(
                  factory.createIdentifier(cleanValues),
                  factory.createStringLiteral(stateName),
                ),
          ),
        );
        if (isArray) {
          acc.push(setStateExpression(getCurrentValueName(renderedName), factory.createStringLiteral('')));
        }
        stateNames.add(stateName);
      }
      return acc;
    },
    [],
  );

  // ex. const cleanValues = {...initialValues, ...bookRecord}
  if (recordName) {
    expressions.unshift(
      factory.createVariableStatement(
        undefined,
        factory.createVariableDeclarationList(
          [
            factory.createVariableDeclaration(
              factory.createIdentifier('cleanValues'),
              undefined,
              undefined,
              factory.createObjectLiteralExpression(
                [
                  factory.createSpreadAssignment(factory.createIdentifier('initialValues')),
                  factory.createSpreadAssignment(factory.createIdentifier(recordName)),
                ],
                false,
              ),
            ),
          ],
          NodeFlags.Const,
        ),
      ),
    );
  }

  // also reset the state of the errors
  expressions.push(setStateExpression('errors', factory.createObjectLiteralExpression()));
  return factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          resetValuesName,
          undefined,
          undefined,
          factory.createArrowFunction(
            undefined,
            undefined,
            [],
            undefined,
            factory.createToken(SyntaxKind.EqualsGreaterThanToken),
            factory.createBlock(expressions, true),
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  );
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
export const buildAccessChain = (values: string[], isOptional = true): Expression => {
  if (values.length <= 0) {
    throw new Error('Need at least one value in the values array');
  }
  const optional = isOptional ? factory.createToken(SyntaxKind.QuestionDotToken) : undefined;
  if (values.length > 1) {
    const [parent, child, ...rest] = values;
    let propChain: PropertyAccessChain | ElementAccessChain = factory.createPropertyAccessChain(
      factory.createIdentifier(parent),
      optional,
      factory.createIdentifier(child),
    );
    if (!isValidVariableName(child)) {
      propChain = factory.createElementAccessChain(
        factory.createIdentifier(parent),
        optional,
        factory.createStringLiteral(child),
      );
    }
    if (rest.length) {
      rest.forEach((value) => {
        if (isValidVariableName(value)) {
          propChain = factory.createPropertyAccessChain(propChain, optional, factory.createIdentifier(value));
        } else {
          propChain = factory.createElementAccessChain(propChain, optional, factory.createStringLiteral(value));
        }
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
      factory.createPropertyAssignment(
        isValidVariableName(currentKey)
          ? factory.createIdentifier(currentKey)
          : factory.createComputedPropertyName(factory.createStringLiteral(currentKey)),
        value,
      ),
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
