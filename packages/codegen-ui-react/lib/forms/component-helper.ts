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

import { FieldConfigMetadata } from '@aws-amplify/codegen-ui';
import { BinaryExpression, factory, SyntaxKind } from 'typescript';

export const ControlledComponents = ['StepperField', 'SliderField', 'SelectField', 'ToggleButton', 'SwitchField'];

/**
 * given the component returns true if the component is a controlled component
 *
 * @param componentType
 * @returns
 */
export const isControlledComponent = (componentType: string): boolean => ControlledComponents.includes(componentType);

export const defaultValueAttributeMap: Record<string, (stateName: string) => BinaryExpression> = {
  AWSTimestamp: (stateName: string) =>
    factory.createBinaryExpression(
      factory.createIdentifier(stateName),
      factory.createToken(SyntaxKind.AmpersandAmpersandToken),
      factory.createCallExpression(factory.createIdentifier('convertToLocal'), undefined, [
        factory.createCallExpression(factory.createIdentifier('convertTimeStampToDate'), undefined, [
          factory.createIdentifier(stateName),
        ]),
      ]),
    ),
  AWSDateTime: (stateName: string) =>
    factory.createBinaryExpression(
      factory.createIdentifier(stateName),
      factory.createToken(SyntaxKind.AmpersandAmpersandToken),
      factory.createCallExpression(factory.createIdentifier('convertToLocal'), undefined, [
        factory.createNewExpression(factory.createIdentifier('Date'), undefined, [factory.createIdentifier(stateName)]),
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
  let expression = factory.createJsxExpression(undefined, factory.createIdentifier(stateName));

  if (dataType && typeof dataType !== 'object' && defaultValueAttributeMap[dataType]) {
    expression = factory.createJsxExpression(undefined, defaultValueAttributeMap[dataType](stateName));
  }

  return factory.createJsxAttribute(factory.createIdentifier('defaultValue'), expression);
};
