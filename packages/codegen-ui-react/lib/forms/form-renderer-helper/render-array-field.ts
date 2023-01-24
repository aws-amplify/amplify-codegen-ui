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
import { Expression, factory, Identifier, JsxAttribute, JsxChild, NodeFlags, SyntaxKind } from 'typescript';
import {
  buildAccessChain,
  getArrayChildRefName,
  getCurrentDisplayValueName,
  getCurrentValueIdentifier,
  getCurrentValueName,
  getDefaultValueExpression,
  setFieldState,
} from './form-state';
import { buildOverrideOnChangeStatement } from './event-handler-props';
import { isModelDataType, shouldImplementDisplayValueFunction } from './render-checkers';
import { getDisplayValueObjectName } from './model-values';
import { getElementAccessExpression } from './invalid-variable-helpers';
import { getSetNameIdentifier, capitalizeFirstLetter } from '../../helpers';

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
    factory.createExpressionStatement(setFieldState(renderedFieldName, valueName)),
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
          [getDefaultValueExpression(fieldName, componentType, dataType, false, true)],
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

  // render `?? []` if nested.
  let itemsExpression: Expression = renderedFieldName.includes('.')
    ? factory.createBinaryExpression(
        factory.createIdentifier(renderedFieldName),
        factory.createToken(SyntaxKind.QuestionQuestionToken),
        factory.createArrayLiteralExpression([], false),
      )
    : factory.createIdentifier(renderedFieldName);

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
      factory.createJsxExpression(undefined, buildAccessChain(['errors', fieldName, 'hasError'])),
    ),
  );

  props.push(
    factory.createJsxAttribute(
      factory.createIdentifier('errorMessage'),
      factory.createJsxExpression(undefined, buildAccessChain(['errors', fieldName, 'errorMessage'])),
    ),
  );

  let setFieldValueIdentifier = setStateName;

  if (shouldImplementDisplayValueFunction(fieldConfig)) {
    setFieldValueIdentifier = getSetNameIdentifier(getCurrentDisplayValueName(renderedFieldName));
    props.push(
      factory.createJsxAttribute(
        factory.createIdentifier('getBadgeText'),
        factory.createJsxExpression(undefined, getElementAccessExpression(getDisplayValueObjectName, fieldName)),
      ),
    );
  }

  /**
  setFieldValue={(model) => {
    setCurrentHasOneUserDisplayValue(getDisplayValue.HasOneUser(model))
    setCurrentHasOneUserValue(model)
  }
   */
  if (isModelDataType(fieldConfig)) {
    const valueArgument = 'model';
    props.push(
      factory.createJsxAttribute(
        factory.createIdentifier('setFieldValue'),
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
                factory.createIdentifier(valueArgument),
                undefined,
                undefined,
                undefined,
              ),
            ],
            undefined,
            factory.createToken(SyntaxKind.EqualsGreaterThanToken),
            factory.createBlock(
              [
                factory.createExpressionStatement(
                  factory.createCallExpression(setFieldValueIdentifier, undefined, [
                    factory.createCallExpression(
                      getElementAccessExpression(getDisplayValueObjectName, fieldName),
                      undefined,
                      [factory.createIdentifier(valueArgument)],
                    ),
                  ]),
                ),
                factory.createExpressionStatement(
                  factory.createCallExpression(setStateName, undefined, [factory.createIdentifier(valueArgument)]),
                ),
              ],
              true,
            ),
          ),
        ),
      ),
    );
  } else {
    props.push(
      factory.createJsxAttribute(
        factory.createIdentifier('setFieldValue'),
        factory.createJsxExpression(undefined, setStateName),
      ),
    );
  }

  props.push(
    factory.createJsxAttribute(
      factory.createIdentifier('inputFieldRef'),
      factory.createJsxExpression(undefined, factory.createIdentifier(getArrayChildRefName(renderedFieldName))),
    ),
    factory.createJsxAttribute(
      factory.createIdentifier('defaultFieldValue'),
      factory.createJsxExpression(
        undefined,
        getDefaultValueExpression(fieldName, componentType, dataType, false, true),
      ),
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
