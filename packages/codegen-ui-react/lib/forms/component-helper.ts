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

import { FieldConfigMetadata, StudioDataSourceType, StudioFormActionType } from '@aws-amplify/codegen-ui';
import { BinaryExpression, factory, Identifier, JsxAttribute, SyntaxKind } from 'typescript';
import { resetValuesName } from './form-state';
import { FIELD_TYPE_TO_TYPESCRIPT_MAP } from './typescript-type-map';

export const ControlledComponents = ['StepperField', 'SliderField', 'SelectField', 'ToggleButton', 'SwitchField'];

/**
 * given the component returns true if the component is a controlled component
 *
 * @param componentType
 * @returns
 */
export const isControlledComponent = (componentType: string): boolean => ControlledComponents.includes(componentType);

export const convertedValueAttributeMap: Record<string, (valueIdentifier: Identifier) => BinaryExpression> = {
  AWSTimestamp: (valueIdentifier: Identifier) =>
    factory.createBinaryExpression(
      valueIdentifier,
      factory.createToken(SyntaxKind.AmpersandAmpersandToken),
      factory.createCallExpression(factory.createIdentifier('convertToLocal'), undefined, [
        factory.createCallExpression(factory.createIdentifier('convertTimeStampToDate'), undefined, [valueIdentifier]),
      ]),
    ),
  AWSDateTime: (valueIdentifier: Identifier) =>
    factory.createBinaryExpression(
      valueIdentifier,
      factory.createToken(SyntaxKind.AmpersandAmpersandToken),
      factory.createCallExpression(factory.createIdentifier('convertToLocal'), undefined, [
        factory.createNewExpression(factory.createIdentifier('Date'), undefined, [valueIdentifier]),
      ]),
    ),
};

/**
 *
 * @param stateName name of the state name to render for the default value
 * @param { dataType } the dataType
 * @returns
 */
export const renderDefaultValueAttribute = (stateName: string, { dataType }: FieldConfigMetadata) => {
  const identifier = factory.createIdentifier(stateName);
  let expression = factory.createJsxExpression(undefined, identifier);

  if (dataType && typeof dataType !== 'object' && convertedValueAttributeMap[dataType]) {
    expression = factory.createJsxExpression(undefined, convertedValueAttributeMap[dataType](identifier));
  }

  return factory.createJsxAttribute(factory.createIdentifier('defaultValue'), expression);
};

export const renderValueAttribute = ({
  fieldConfig,
  componentName,
  currentValueIdentifier,
}: {
  fieldConfig: FieldConfigMetadata;
  componentName: string;
  currentValueIdentifier?: Identifier;
}): JsxAttribute | undefined => {
  const componentType = fieldConfig.studioFormComponentType ?? fieldConfig.componentType;
  const shouldGetForUncontrolled = fieldConfig.isArray;

  const valueIdentifier = currentValueIdentifier || getValueIdentifier(componentName, componentType);

  const controlledComponentToAttributesMap: { [key: string]: JsxAttribute } = {
    ToggleButton: factory.createJsxAttribute(
      factory.createIdentifier('isPressed'),
      factory.createJsxExpression(undefined, valueIdentifier),
    ),
    SliderField: factory.createJsxAttribute(
      factory.createIdentifier('value'),
      factory.createJsxExpression(undefined, valueIdentifier),
    ),
    SelectField: factory.createJsxAttribute(
      factory.createIdentifier('value'),
      factory.createJsxExpression(undefined, valueIdentifier),
    ),
    StepperField: factory.createJsxAttribute(
      factory.createIdentifier('value'),
      factory.createJsxExpression(undefined, valueIdentifier),
    ),
    SwitchField: factory.createJsxAttribute(
      factory.createIdentifier('isChecked'),
      factory.createJsxExpression(undefined, valueIdentifier),
    ),
    CheckboxField: factory.createJsxAttribute(
      factory.createIdentifier('checked'),
      factory.createJsxExpression(undefined, valueIdentifier),
    ),
  };

  if (controlledComponentToAttributesMap[componentType]) {
    return controlledComponentToAttributesMap[componentType];
  }

  // TODO: all components should be controlled once conversions are solid
  if (shouldGetForUncontrolled) {
    const { dataType } = fieldConfig;

    let expression = factory.createJsxExpression(undefined, valueIdentifier);

    if (dataType && typeof dataType !== 'object' && convertedValueAttributeMap[dataType]) {
      expression = factory.createJsxExpression(undefined, convertedValueAttributeMap[dataType](valueIdentifier));
    }

    return factory.createJsxAttribute(factory.createIdentifier('value'), expression);
  }

  return undefined;
};

/**
 * returns resetFunctionCheck Expression if a create form is datastore enabled
 *
 * @param studioForm {StudioForm}
 * @returns
 */
export const resetFunctionCheck = ({
  dataSourceType,
  formActionType,
}: {
  dataSourceType: StudioDataSourceType;
  formActionType: StudioFormActionType;
}) => {
  if (dataSourceType === 'DataStore' && formActionType === 'create') {
    return [
      factory.createIfStatement(
        factory.createIdentifier('clearOnSuccess'),
        factory.createBlock(
          [factory.createExpressionStatement(factory.createCallExpression(resetValuesName, undefined, []))],
          true,
        ),
        undefined,
      ),
    ];
  }
  return [];
};

const getValueIdentifier = (componentName: string, componentType: string) => {
  // For Boolean components like SwitchField, they need the full dot notation name
  // e.g. isChecked={options.enabled}
  if (FIELD_TYPE_TO_TYPESCRIPT_MAP[componentType] === SyntaxKind.BooleanKeyword) {
    return factory.createIdentifier(componentName);
  }
  return factory.createIdentifier(componentName.split('.')[0]);
};
