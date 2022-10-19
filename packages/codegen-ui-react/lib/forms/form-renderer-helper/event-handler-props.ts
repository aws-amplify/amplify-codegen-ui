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
  StudioForm,
  FieldConfigMetadata,
  isValidVariableName,
} from '@aws-amplify/codegen-ui';
import {
  BindingElement,
  factory,
  NodeFlags,
  SyntaxKind,
  IfStatement,
  Identifier,
  ElementAccessExpression,
} from 'typescript';
import { lowerCaseFirst } from '../../helpers';
import { buildTargetVariable, getFormattedValueExpression } from './event-targets';
import {
  buildAccessChain,
  buildNestedStateSet,
  getCurrentValueIdentifier,
  getCurrentValueName,
  setFieldState,
  setStateExpression,
} from './form-state';
import { getOnChangeValidationBlock } from './validation';
import { buildModelFieldObject } from './model-fields';

export const buildMutationBindings = (form: StudioForm) => {
  const {
    dataType: { dataSourceType, dataTypeName },
    formActionType,
  } = form;
  const elements: BindingElement[] = [];
  if (dataSourceType === 'DataStore') {
    if (formActionType === 'update') {
      elements.push(
        // TODO: change once cpk is supported in datastore
        factory.createBindingElement(undefined, undefined, factory.createIdentifier('id'), undefined),
        factory.createBindingElement(
          undefined,
          undefined,
          factory.createIdentifier(lowerCaseFirst(dataTypeName)),
          undefined,
        ),
      );
    }
    if (formActionType === 'create') {
      elements.push(
        factory.createBindingElement(
          undefined,
          undefined,
          factory.createIdentifier('clearOnSuccess'),
          factory.createTrue(),
        ),
      );
    }
    elements.push(
      factory.createBindingElement(undefined, undefined, factory.createIdentifier('onSuccess'), undefined),
      factory.createBindingElement(undefined, undefined, factory.createIdentifier('onError'), undefined),
    );
  }
  if (dataSourceType === 'Custom' && formActionType === 'update') {
    elements.push(
      factory.createBindingElement(undefined, undefined, factory.createIdentifier('initialData'), undefined),
    );
  }
  elements.push(factory.createBindingElement(undefined, undefined, factory.createIdentifier('onSubmit'), undefined));
  return elements;
};

export function buildOnBlurStatement(fieldName: string, fieldConfig: FieldConfigMetadata) {
  const renderedFieldName = fieldConfig.sanitizedFieldName || fieldName;
  let fieldNameIdentifier: Identifier | ElementAccessExpression = factory.createIdentifier(renderedFieldName);
  if (fieldName.includes('.')) {
    const [parent, child] = fieldName.split('.');
    fieldNameIdentifier = factory.createElementAccessExpression(
      factory.createIdentifier(parent),
      factory.createStringLiteral(child),
    );
  }

  return factory.createJsxAttribute(
    factory.createIdentifier('onBlur'),
    factory.createJsxExpression(
      undefined,
      factory.createArrowFunction(
        undefined,
        undefined,
        [],
        undefined,
        factory.createToken(SyntaxKind.EqualsGreaterThanToken),
        factory.createCallExpression(factory.createIdentifier('runValidationTasks'), undefined, [
          factory.createStringLiteral(fieldName),
          fieldConfig.isArray ? getCurrentValueIdentifier(renderedFieldName) : fieldNameIdentifier,
        ]),
      ),
    ),
  );
}

/**
 * if the onChange variable is defined it will send the current state of the fields into the function
 * the function expects all fields in return
 * the value for that fields onChange will be used from the return object for validation and updating the new state
 *
 * if a valueName override is provided it will use the provided name
 * this the name of the variable to update if onChange override function is provided
 *
 *
 * ex. if the field is email
 * const returnObject = onChange({ email, ...otherFieldsForForm });
 * const value = returnObject.email;
 *
 * this value is now used in email validation and setting the state
 */
export const buildOverrideOnChangeStatement = (
  fieldName: string,
  fieldConfigs: Record<string, FieldConfigMetadata>,
  valueNameOverride?: Identifier,
): IfStatement => {
  const keyPath = fieldName.split('.');
  const keyName = keyPath[0];
  const valueName = valueNameOverride ?? factory.createIdentifier('value');
  let keyValueExpression = factory.createPropertyAssignment(
    isValidVariableName(keyName)
      ? factory.createIdentifier(keyName)
      : factory.createComputedPropertyName(factory.createStringLiteral(keyName)),
    valueName,
  );
  if (keyPath.length > 1) {
    keyValueExpression = factory.createPropertyAssignment(
      factory.createIdentifier(keyName),
      buildNestedStateSet(keyPath, [keyName], valueName),
    );
  }
  return factory.createIfStatement(
    factory.createIdentifier('onChange'),
    factory.createBlock(
      [
        buildModelFieldObject(true, fieldConfigs, {
          [keyName]: keyValueExpression,
        }),
        factory.createVariableStatement(
          undefined,
          factory.createVariableDeclarationList(
            [
              factory.createVariableDeclaration(
                factory.createIdentifier('result'),
                undefined,
                undefined,
                factory.createCallExpression(factory.createIdentifier('onChange'), undefined, [
                  factory.createIdentifier('modelFields'),
                ]),
              ),
            ],
            NodeFlags.Const,
          ),
        ),
        factory.createExpressionStatement(
          factory.createBinaryExpression(
            valueName,
            factory.createToken(SyntaxKind.EqualsToken),
            factory.createBinaryExpression(
              buildAccessChain(['result', ...fieldName.split('.')]),
              factory.createToken(SyntaxKind.QuestionQuestionToken),
              valueName,
            ),
          ),
        ),
      ],
      true,
    ),
    undefined,
  );
};

function getOnValueChangeProp(fieldType: string): string {
  const map: { [key: string]: string } = {
    StepperField: 'onStepChange',
  };

  return map[fieldType] ?? 'onChange';
}

export const buildOnChangeStatement = (
  component: StudioComponent | StudioComponentChild,
  fieldConfigs: Record<string, FieldConfigMetadata>,
) => {
  const { name: fieldName, componentType: fieldType } = component;
  const { dataType, isArray, sanitizedFieldName } = fieldConfigs[fieldName];
  const renderedFieldName = sanitizedFieldName || fieldName;
  if (isArray) {
    return factory.createJsxAttribute(
      factory.createIdentifier(getOnValueChangeProp(fieldType)),
      factory.createJsxExpression(
        undefined,
        factory.createArrowFunction(
          undefined,
          undefined,
          [
            factory.createParameterDeclaration(
              undefined,
              undefined,
              undefined,
              factory.createIdentifier('e'),
              undefined,
              undefined,
              undefined,
            ),
          ],
          undefined,
          factory.createToken(SyntaxKind.EqualsGreaterThanToken),
          factory.createBlock(
            [
              ...buildTargetVariable(fieldType, fieldName, dataType),
              getOnChangeValidationBlock(fieldName),
              setStateExpression(getCurrentValueName(renderedFieldName), getFormattedValueExpression(dataType)),
            ],
            true,
          ),
        ),
      ),
    );
  }
  return factory.createJsxAttribute(
    factory.createIdentifier(getOnValueChangeProp(fieldType)),
    factory.createJsxExpression(
      undefined,
      factory.createArrowFunction(
        undefined,
        undefined,
        [
          factory.createParameterDeclaration(
            undefined,
            undefined,
            undefined,
            factory.createIdentifier('e'),
            undefined,
            undefined,
            undefined,
          ),
        ],
        undefined,
        factory.createToken(SyntaxKind.EqualsGreaterThanToken),
        factory.createBlock(
          [
            ...buildTargetVariable(fieldType, fieldName, dataType),
            buildOverrideOnChangeStatement(fieldName, fieldConfigs),
            getOnChangeValidationBlock(fieldName),
            factory.createExpressionStatement(setFieldState(renderedFieldName, getFormattedValueExpression(dataType))),
          ],
          true,
        ),
      ),
    ),
  );
};
