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
import { GenericDataField, GenericDataSchema, StudioFormFields } from '@aws-amplify/codegen-ui/lib/types';
import { factory, Statement, Expression, NodeFlags, Identifier, ParameterDeclaration, SyntaxKind } from 'typescript';
import { isPrimitive } from '../primitive';

export const lowerCaseFirst = (input: string) => input.charAt(0).toLowerCase() + input.slice(1);

export const createUniqueName = (name: string, isNameUsed: (input: string) => boolean) => {
  if (!isNameUsed(name)) {
    return name;
  }
  let count = 0;
  const prospectiveNewName = name;
  while (isNameUsed(prospectiveNewName + count)) {
    count += 1;
  }
  return prospectiveNewName + count;
};

export const capitalizeFirstLetter = (val: string) => {
  return val.charAt(0).toUpperCase() + val.slice(1);
};

export const getSetNameIdentifier = (value: string): Identifier => {
  return factory.createIdentifier(`set${capitalizeFirstLetter(value)}`);
};

export const getModelNameProp = (value: string): string => {
  return `${lowerCaseFirst(value)}ModelProp`;
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

export const buildUseRefExpression = (name: string, defaultValue?: Expression): Statement => {
  return factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(name),
          undefined,
          undefined,
          factory.createCallExpression(
            factory.createPropertyAccessExpression(
              factory.createIdentifier('React'),
              factory.createIdentifier('useRef'),
            ),
            undefined,
            defaultValue ? [defaultValue] : undefined,
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  );
};

/**
 * Create statement to declare and initialized a const.
 *
 * const name = value;
 * @param name
 * @param value
 * @returns
 */
export const buildInitConstVariableExpression = (name: string, value: Expression): Statement => {
  return factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [factory.createVariableDeclaration(factory.createIdentifier(name), undefined, undefined, value)],
      NodeFlags.Const,
    ),
  );
};

/**
 * Create statement to declare an arrow function to a const.
 *
 * @example
 * ```
 * const variableName = (parameterDeclaration) => {
 *  functionName(expression);
 * };
 * ```
 */
export const buildArrowFunctionStatement = (
  variableName: string,
  functionName: string,
  expression: Expression,
  parameterDeclarations?: ParameterDeclaration[],
): Statement => {
  return factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(variableName),
          undefined,
          undefined,
          factory.createArrowFunction(
            undefined,
            undefined,
            parameterDeclarations ?? [],
            undefined,
            factory.createToken(SyntaxKind.EqualsGreaterThanToken),
            factory.createBlock(
              [
                factory.createExpressionStatement(
                  factory.createCallExpression(factory.createIdentifier(functionName), undefined, [expression]),
                ),
              ],
              true,
            ),
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  );
};

export function fieldNeedsRelationshipLoadedForCollection(field: GenericDataField, dataSchema: GenericDataSchema) {
  const { relationship, dataType } = field;
  if (!relationship || !dataType) {
    return false;
  }
  if (typeof dataType !== 'object' || !('model' in dataType)) {
    return false;
  }
  const joinTableNames = Object.entries(dataSchema.models).reduce((acc, [modelName, { isJoinTable }]) => {
    if (isJoinTable) {
      acc.add(modelName);
    }
    return acc;
  }, new Set());
  // return false if manyToMany
  if (joinTableNames.has(dataType.model)) {
    return false;
  }
  return true;
}

export function modelNeedsRelationshipsLoadedForCollection(modelName: string, dataSchema?: GenericDataSchema): boolean {
  return !!(
    dataSchema &&
    dataSchema.models[modelName] &&
    Object.values(dataSchema.models[modelName].fields).some((field) =>
      fieldNeedsRelationshipLoadedForCollection(field, dataSchema),
    )
  );
}

export function isAliased(componentType: string): boolean {
  return !!(isPrimitive(removeAlias(componentType)) && componentType.match(/(Custom$)/g));
}

export function removeAlias(aliasString: string): string {
  return aliasString.replace(/(Custom$)/g, '');
}

export function getControlledComponentDefaultValue(
  fields: StudioFormFields,
  componentType: string,
  name: string,
): string | null {
  let defaultValue = null;
  Object.entries(fields).forEach(([key, value]) => {
    if (key === name && 'inputType' in value && value.inputType?.defaultValue && componentType === 'TextField') {
      defaultValue = value.inputType.defaultValue;
    }
  });
  return defaultValue;
}
