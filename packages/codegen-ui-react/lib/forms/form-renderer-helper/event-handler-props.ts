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
  shouldIncludeCancel,
  InvalidInputError,
} from '@aws-amplify/codegen-ui';
import {
  BindingElement,
  factory,
  NodeFlags,
  SyntaxKind,
  IfStatement,
  Identifier,
  ElementAccessExpression,
  Statement,
  JsxAttribute,
  Expression,
  ExpressionStatement,
} from 'typescript';
import { lowerCaseFirst, getSetNameIdentifier } from '../../helpers';
import { buildTargetVariable } from './event-targets';
import {
  buildAccessChain,
  buildNestedStateSet,
  getCurrentDisplayValueName,
  getCurrentValueIdentifier,
  getCurrentValueName,
  getDefaultValueExpression,
  getPropName,
  getRecordsName,
  setFieldState,
  setStateExpression,
} from './form-state';
import { getOnChangeValidationBlock } from './validation';
import { buildModelFieldObject } from './model-fields';
import { isModelDataType, shouldWrapInArrayField } from './render-checkers';
import { extractModelAndKeys, getMatchEveryModelFieldCallExpression } from './model-values';

export const buildMutationBindings = (form: StudioForm, primaryKey?: string) => {
  const {
    dataType: { dataSourceType, dataTypeName },
    formActionType,
  } = form;
  const elements: BindingElement[] = [];
  if (dataSourceType === 'DataStore' && primaryKey) {
    if (formActionType === 'update') {
      elements.push(
        // id: idProp
        factory.createBindingElement(
          undefined,
          factory.createIdentifier(primaryKey),
          factory.createIdentifier(getPropName(primaryKey)),
          undefined,
        ),
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
  if (shouldIncludeCancel(form)) {
    // onCancel prop
    elements.push(factory.createBindingElement(undefined, undefined, factory.createIdentifier('onCancel'), undefined));
  }
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

  let valueToValidate = fieldNameIdentifier;
  if (shouldWrapInArrayField(fieldConfig)) {
    valueToValidate = getCurrentValueIdentifier(renderedFieldName);
  }
  if (isModelDataType(fieldConfig)) {
    valueToValidate = factory.createIdentifier(getCurrentDisplayValueName(renderedFieldName));
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
          valueToValidate,
        ]),
      ),
    ),
  );
}

/**
 * e.g.
 * onClear={() => {
 *  setCurrentTeamDisplayValue('');
 * }}
 */
export function buildOnClearStatement(fieldName: string, fieldConfig: FieldConfigMetadata) {
  const { componentType, dataType } = fieldConfig;
  const renderedFieldName = fieldConfig.sanitizedFieldName || fieldName;

  return factory.createJsxAttribute(
    factory.createIdentifier('onClear'),
    factory.createJsxExpression(
      undefined,
      factory.createArrowFunction(
        undefined,
        undefined,
        [],
        undefined,
        factory.createToken(SyntaxKind.EqualsGreaterThanToken),
        factory.createBlock(
          [
            factory.createExpressionStatement(
              factory.createCallExpression(
                getSetNameIdentifier(getCurrentDisplayValueName(renderedFieldName)),
                undefined,
                [getDefaultValueExpression(fieldName, componentType, dataType, false, true)],
              ),
            ),
          ],
          true,
        ),
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
    isValidVariableName(keyName) ? factory.createIdentifier(keyName) : factory.createStringLiteral(keyName),
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
  const fieldConfig = fieldConfigs[fieldName];
  const { dataType, sanitizedFieldName } = fieldConfig;
  const renderedFieldName = sanitizedFieldName || fieldName;

  // build statements that handle new value
  const handleChangeStatements: Statement[] = [...buildTargetVariable(fieldType, renderedFieldName, dataType)];

  if (!shouldWrapInArrayField(fieldConfig)) {
    handleChangeStatements.push(buildOverrideOnChangeStatement(fieldName, fieldConfigs));
  }

  handleChangeStatements.push(getOnChangeValidationBlock(fieldName));

  const valueToSetOnChange = factory.createIdentifier('value');

  if (shouldWrapInArrayField(fieldConfig)) {
    if (isModelDataType(fieldConfig)) {
      handleChangeStatements.push(
        setStateExpression(getCurrentDisplayValueName(renderedFieldName), valueToSetOnChange),
        setStateExpression(getCurrentValueName(renderedFieldName), factory.createIdentifier('undefined')),
      );
    } else {
      handleChangeStatements.push(setStateExpression(getCurrentValueName(renderedFieldName), valueToSetOnChange));
    }
  } else {
    handleChangeStatements.push(
      factory.createExpressionStatement(setFieldState(renderedFieldName, valueToSetOnChange)),
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
        factory.createBlock(handleChangeStatements, true),
      ),
    ),
  );
};

/**
examples:

  scalar:
  onSelect={({ id }) => {
    setCurrentPrimaryAuthorValue(id);
    setCurrentPrimaryAuthorDisplayValue(id);
  }}

  model:
  onSelect={({ id, label }) => {
    setCurrentPrimaryAuthorValue(
      primaryAuthorRecords.find((r) => Object.entries(JSON.parse(id)).every(([key, value]) =>
      r[key] === value)));
    );
    setCurrentPrimaryAuthorDisplayValue(label);
  }}
 */
export function buildOnSelect({
  sanitizedFieldName,
  fieldName,
  fieldConfig,
}: {
  sanitizedFieldName: string;
  fieldName: string;
  fieldConfig: FieldConfigMetadata;
}): JsxAttribute {
  const labelString = 'label';
  const idString = 'id';

  const props: BindingElement[] = [
    factory.createBindingElement(undefined, undefined, factory.createIdentifier(idString), undefined),
  ];

  let nextCurrentValue: Expression = factory.createIdentifier(idString);
  let nextCurrentDisplayValue: Expression = factory.createIdentifier(idString);

  if (isModelDataType(fieldConfig)) {
    const { model, keys } = extractModelAndKeys(fieldConfig.valueMappings);
    if (!model || !keys || !keys.length) {
      throw new InvalidInputError(`Invalid value mappings`);
    }

    props.push(factory.createBindingElement(undefined, undefined, factory.createIdentifier(labelString), undefined));

    nextCurrentDisplayValue = factory.createIdentifier(labelString);

    nextCurrentValue = getMatchEveryModelFieldCallExpression({
      recordsArrayName: getRecordsName(model),
      JSONName: idString,
    });
  }

  const setStateExpressions: ExpressionStatement[] = [
    setStateExpression(getCurrentValueName(sanitizedFieldName), nextCurrentValue),
  ];

  if (isModelDataType(fieldConfig)) {
    setStateExpressions.push(
      setStateExpression(getCurrentDisplayValueName(sanitizedFieldName), nextCurrentDisplayValue),
    );
  }

  setStateExpressions.push(
    factory.createExpressionStatement(
      factory.createCallExpression(factory.createIdentifier('runValidationTasks'), undefined, [
        factory.createStringLiteral(fieldName),
        factory.createIdentifier(isModelDataType(fieldConfig) ? labelString : idString),
      ]),
    ),
  );

  return factory.createJsxAttribute(
    factory.createIdentifier('onSelect'),
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
            factory.createObjectBindingPattern(props),
            undefined,
            undefined,
            undefined,
          ),
        ],
        undefined,
        factory.createToken(SyntaxKind.EqualsGreaterThanToken),
        factory.createBlock(setStateExpressions, true),
      ),
    ),
  );
}
