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
import { FieldConfigMetadata, isValidVariableName } from '@aws-amplify/codegen-ui';
import { Expression, factory, Identifier, JsxAttribute, JsxChild, NodeFlags, SyntaxKind } from 'typescript';
import {
  capitalizeFirstLetter,
  getCurrentDisplayValueName,
  getCurrentValueIdentifier,
  getCurrentValueName,
  getDefaultValueExpression,
  getSetNameIdentifier,
} from './form-state';
import { buildOverrideOnChangeStatement } from './event-handler-props';
import { isModelDataType } from './render-checkers';
import { getDisplayValueObjectName } from './display-value';
import { getElementAccessExpression } from './invalid-variable-helpers';

function getOnChangeAttribute({
  setStateName,
  fieldName,
  renderedFieldName,
  fieldConfigs,
  isLimitedToOneValue,
}: {
  setStateName: Identifier;
  fieldName: string;
  renderedFieldName: string;
  fieldConfigs: Record<string, FieldConfigMetadata>;
  isLimitedToOneValue?: boolean;
}): JsxAttribute {
  const fieldConfig = fieldConfigs[fieldName];
  const { dataType, componentType } = fieldConfig;

  let valueName = factory.createIdentifier('values');
  const onChangeArgName = factory.createIdentifier('items');
  let argToValue: Expression = onChangeArgName;

  if (isLimitedToOneValue) {
    argToValue = factory.createElementAccessExpression(onChangeArgName, factory.createNumericLiteral('0'));
    valueName = factory.createIdentifier('value');
  }

  const setStateStatements = [
    factory.createExpressionStatement(
      factory.createCallExpression(
        factory.createIdentifier(`set${capitalizeFirstLetter(renderedFieldName)}`),
        undefined,
        [valueName],
      ),
    ),
    factory.createExpressionStatement(
      factory.createCallExpression(setStateName, undefined, [
        getDefaultValueExpression(fieldName, componentType, dataType),
      ]),
    ),
  ];

  if (isModelDataType(fieldConfig)) {
    setStateStatements.push(
      factory.createExpressionStatement(
        factory.createCallExpression(
          factory.createIdentifier(`set${capitalizeFirstLetter(getCurrentDisplayValueName(renderedFieldName))}`),
          undefined,
          [getDefaultValueExpression(fieldName, componentType, dataType)],
        ),
      ),
    );
  }

  return factory.createJsxAttribute(
    factory.createIdentifier('onChange'),
    factory.createJsxExpression(
      undefined,
      factory.createArrowFunction(
        [factory.createModifier(SyntaxKind.AsyncKeyword)],
        undefined,
        [factory.createParameterDeclaration(undefined, undefined, undefined, onChangeArgName, undefined, undefined)],
        undefined,
        factory.createToken(SyntaxKind.EqualsGreaterThanToken),
        factory.createBlock(
          [
            factory.createVariableStatement(
              undefined,
              factory.createVariableDeclarationList(
                [factory.createVariableDeclaration(valueName, undefined, undefined, argToValue)],
                NodeFlags.Let,
              ),
            ),
            buildOverrideOnChangeStatement(fieldName, fieldConfigs, valueName),
            ...setStateStatements,
          ],
          true,
        ),
      ),
    ),
  );
}

/*
  <ArrayField
    onChange = { async(items) => {
      setBreeds(items);
      setCurrentBreedsValue('');
    }}
    currentBreedsValue = { currentBreedsValue }
    hasError = { errors.breeds?.hasError }
    setFieldValue = { setCurrentBreedsValue }
    inputFieldRef={ breedsRef }
    >
    <ExampleInputField />
  </ArrayField>

  wraps input field component with array field component
 */

export const renderArrayFieldComponent = (
  fieldName: string,
  fieldLabel: string,
  fieldConfigs: Record<string, FieldConfigMetadata>,
  inputField: JsxChild,
) => {
  const fieldConfig = fieldConfigs[fieldName];
  const { sanitizedFieldName, dataType, componentType } = fieldConfig;

  const isLimitedToOneValue =
    fieldConfig.relationship &&
    (fieldConfig.relationship.type === 'HAS_ONE' || fieldConfig.relationship.type === 'BELONGS_TO');
  const renderedFieldName = sanitizedFieldName || fieldName;
  const stateName = getCurrentValueIdentifier(renderedFieldName);
  const setStateName = getSetNameIdentifier(getCurrentValueName(renderedFieldName));

  const props: JsxAttribute[] = [];

  let itemsExpression: Expression = factory.createIdentifier(renderedFieldName);

  if (isLimitedToOneValue) {
    // "book ? [book] : []"
    itemsExpression = factory.createConditionalExpression(
      factory.createIdentifier(renderedFieldName),
      factory.createToken(SyntaxKind.QuestionToken),
      factory.createArrayLiteralExpression([factory.createIdentifier(renderedFieldName)], false),
      factory.createToken(SyntaxKind.ColonToken),
      factory.createArrayLiteralExpression([], false),
    );

    props.push(
      factory.createJsxAttribute(
        factory.createIdentifier('lengthLimit'),
        factory.createJsxExpression(undefined, factory.createNumericLiteral('1')),
      ),
    );
  }

  props.push(getOnChangeAttribute({ fieldName, isLimitedToOneValue, fieldConfigs, renderedFieldName, setStateName }));

  props.push(
    factory.createJsxAttribute(
      factory.createIdentifier(`currentFieldValue`),
      factory.createJsxExpression(undefined, stateName),
    ),
    factory.createJsxAttribute(
      factory.createIdentifier(`label`),
      factory.createJsxExpression(undefined, factory.createStringLiteral(fieldLabel)),
    ),
  );

  props.push(
    factory.createJsxAttribute(
      factory.createIdentifier('items'),
      factory.createJsxExpression(undefined, itemsExpression),
    ),
  );

  props.push(
    factory.createJsxAttribute(
      factory.createIdentifier('hasError'),
      factory.createJsxExpression(
        undefined,
        factory.createPropertyAccessChain(
          isValidVariableName(fieldName)
            ? factory.createPropertyAccessExpression(
                factory.createIdentifier('errors'),
                factory.createIdentifier(fieldName),
              )
            : factory.createElementAccessChain(
                factory.createIdentifier('errors'),
                factory.createToken(SyntaxKind.QuestionDotToken),
                factory.createStringLiteral(fieldName),
              ),
          factory.createToken(SyntaxKind.QuestionDotToken),
          factory.createIdentifier('hasError'),
        ),
      ),
    ),
  );

  let setFieldValueIdentifier = setStateName;

  if (isModelDataType(fieldConfig)) {
    setFieldValueIdentifier = factory.createIdentifier(getCurrentDisplayValueName(renderedFieldName));
    props.push(
      factory.createJsxAttribute(
        factory.createIdentifier('getBadgeText'),
        factory.createJsxExpression(undefined, getElementAccessExpression(getDisplayValueObjectName, fieldName)),
      ),
    );
  }

  props.push(
    factory.createJsxAttribute(
      factory.createIdentifier('setFieldValue'),
      factory.createJsxExpression(undefined, setFieldValueIdentifier),
    ),
  );

  props.push(
    factory.createJsxAttribute(
      factory.createIdentifier('inputFieldRef'),
      factory.createJsxExpression(undefined, factory.createIdentifier(`${renderedFieldName}Ref`)),
    ),
    factory.createJsxAttribute(
      factory.createIdentifier('defaultFieldValue'),
      factory.createJsxExpression(undefined, getDefaultValueExpression(fieldName, componentType, dataType)),
    ),
  );

  return factory.createJsxElement(
    factory.createJsxOpeningElement(
      factory.createIdentifier('ArrayField'),
      undefined,
      factory.createJsxAttributes(props),
    ),
    [inputField],
    factory.createJsxClosingElement(factory.createIdentifier('ArrayField')),
  );
};
